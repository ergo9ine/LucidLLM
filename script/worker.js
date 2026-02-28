/**
 * Web Worker - Transformers.js Inference
 * 브라우저 내 AI 추론을 위한 Web Worker 입니다.
 */

import {
    OPFS_MODELS_DIR,
    TRANSFORMERS_JS_IMPORT_CANDIDATES,
    WORKER_MSG,
    normalizeOpfsModelRelativePath,
    normalizeOnnxFileName,
    buildOpfsCandidatePaths,
    isHfHostName,
    isExplicitHfDownloadRequest,
    parseHfResolveUrl,
} from "./shared-utils.js";

// ── WebGPU Adapter Probe (deferred) ────────────────────────────────────────
let _gpuProbePromise = null;

/**
 * [Lucid] Local-Only Mode for fetch interceptor.
 * When enabled, OPFS misses result in 404 instead of network fallback.
 */
let _localOnlyMode = false;

/**
 * [Lucid] The currently active or being-initialized ONNX file name.
 * Used by candidate path resolution in fetch interceptor.
 */
let _activeOnnxFileName = "";
let _activeExternalDataChunkCount = 0;

/**
 * [Lucid] Track current worker phase for better diagnostics.
 */
let _currentWorkerPhase = "idle";

function configureOrtRuntime(env) {
    if (!env) return;

    env.allowLocalModels = false;
    env.allowRemoteModels = true;
    env.useBrowserCache = false;
    if (typeof env.useCache !== "undefined") env.useCache = false;

    // ORT env는 env.backends.onnx에 위치 (env.wasm은 transformers env에 없음)
    const backends = env.backends ?? (env.backends = {});
    const onnx = backends.onnx ?? (backends.onnx = {});
    const wasm = onnx.wasm ?? (onnx.wasm = {});

    wasm.proxy = false;

    // transformers.js 모듈 초기화 시 CDN wasmPaths = { mjs, wasm }을 설정하는데,
    // mjs 키가 있으면 cross-origin Worker 생성을 시도함 (COEP 환경에서 SecurityError).
    // mjs 키를 제거하면 번들에 내장된 asyncify 팩토리(li)를 사용하여
    // same-origin Worker 생성을 보장하고, .wasm 바이너리만 CDN에서 fetch.
    if (wasm.wasmPaths && typeof wasm.wasmPaths === "object") {
        delete wasm.wasmPaths.mjs;
    }
}

async function ensureGpuProbeComplete() {
    if (_gpuProbePromise) return _gpuProbePromise;

    _gpuProbePromise = (async () => {
        if (typeof navigator !== 'undefined' && navigator.gpu && typeof navigator.gpu.requestAdapter === 'function') {
            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (!adapter) {
                    console.info("[Worker] WebGPU adapter not available, disabling navigator.gpu for WASM fallback");
                    Object.defineProperty(navigator, 'gpu', { value: undefined, configurable: true });
                } else {
                    const originalRequestAdapter = navigator.gpu.requestAdapter;
                    navigator.gpu.requestAdapter = function (options) {
                        const newOptions = { ...options };
                        if (newOptions && Object.hasOwn(newOptions, 'powerPreference')) {
                            delete newOptions.powerPreference;
                        }
                        return originalRequestAdapter.call(this, newOptions);
                    };
                }
            } catch (e) {
                console.info("[Worker] WebGPU probe failed, disabling:", e.message);
                Object.defineProperty(navigator, 'gpu', { value: undefined, configurable: true });
            }
        }
    })();

    return _gpuProbePromise;
}

// ============================================================================
// OPFS Fetch Interceptor (Worker)
// ============================================================================

const originalWorkerFetch = self.fetch.bind(self);

async function readOpfsFileInWorker(relativePath) {
    try {
        const root = await navigator.storage.getDirectory();
        const modelsDir = await root.getDirectoryHandle(OPFS_MODELS_DIR, { create: false });

        const segments = relativePath.split("/").filter(Boolean);
        if (segments.length === 0) return null;

        let current = modelsDir;
        for (let i = 0; i < segments.length - 1; i++) {
            current = await current.getDirectoryHandle(segments[i], { create: false });
        }
        const fileName = segments.at(-1);
        const fileHandle = await current.getFileHandle(fileName, { create: false });
        return await fileHandle.getFile();
    } catch {
        return null;
    }
}

function inferWorkerContentType(path) {
    const lower = String(path ?? "").toLowerCase();
    if (lower.endsWith(".json")) return "application/json";
    if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".jinja")) {
        return "text/plain; charset=utf-8";
    }
    return "application/octet-stream";
}

function extractRangeHeader(input, init) {
    try {
        if (init?.headers) {
            if (init.headers instanceof Headers) {
                const value = init.headers.get("range");
                if (value) return value;
            } else if (typeof init.headers === "object") {
                for (const [key, value] of Object.entries(init.headers)) {
                    if (key.toLowerCase() === "range") return String(value);
                }
            }
        }
        if (input instanceof Request) {
            const value = input.headers.get("range");
            if (value) return value;
        }
    } catch {
        // ignore
    }
    return "";
}

self.fetch = async (input, init) => {
    const method = String(init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
        return originalWorkerFetch(input, init);
    }

    const url = (input?.url ?? input)?.toString() ?? "";
    const isHfRequest = (() => {
        try {
            const parsed = new URL(url);
            return isHfHostName(parsed.hostname);
        } catch {
            return false;
        }
    })();
    if (isExplicitHfDownloadRequest(url)) {
        return originalWorkerFetch(input, init);
    }

    const request = parseHfResolveUrl(url);
    if (!request) {
        if (isHfRequest && _localOnlyMode) {
            return new Response("Remote Hugging Face fetch is disabled for local model execution.", {
                status: 404,
                statusText: "Not Found (Remote Fallback Disabled)",
                headers: { "x-lucid-opfs-worker": "blocked" }
            });
        }
        return originalWorkerFetch(input, init);
    }

    const candidates = buildOpfsCandidatePaths(request, _activeOnnxFileName, _activeExternalDataChunkCount);

    // Log external data file lookups for diagnostics
    const isExternalDataRequest = request.filePath && (
        request.filePath.toLowerCase().includes('.onnx_data') ||
        request.filePath.toLowerCase().includes('.onnx.data')
    );

    for (const candidatePath of candidates) {
        const file = await readOpfsFileInWorker(candidatePath);
        if (!file || file.size <= 0) continue;

        if (isExternalDataRequest) {
            console.info(`[Worker] External data HIT: ${request.filePath} → ${candidatePath} (${file.size} bytes)`);
        }

        const headers = new Headers();
        headers.set("content-type", inferWorkerContentType(candidatePath));
        headers.set("content-length", String(file.size));
        headers.set("x-lucid-opfs-worker", "hit");

        const rangeHeader = extractRangeHeader(input, init);
        if (rangeHeader) {
            const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
            if (match) {
                const startText = match[1] ?? "";
                const endText = match[2] ?? "";
                let start = 0;
                let end = file.size - 1;

                const parseVal = (txt, def) => {
                    const n = parseInt(txt, 10);
                    return Number.isNaN(n) ? def : n;
                };

                if (startText && endText) {
                    start = parseVal(startText, 0);
                    end = parseVal(endText, file.size - 1);
                } else if (startText) {
                    start = parseVal(startText, 0);
                } else if (endText) {
                    const suffix = parseVal(endText, 0);
                    start = Math.max(0, file.size - suffix);
                }

                start = Math.max(0, Math.min(start, file.size - 1));
                end = Math.max(start, Math.min(end, file.size - 1));

                headers.set("accept-ranges", "bytes");
                headers.set("content-range", `bytes ${start}-${end}/${file.size}`);
                headers.set("content-length", String(end - start + 1));
                if (method === "HEAD") {
                    return new Response(null, { status: 206, headers });
                }
                return new Response(file.slice(start, end + 1), { status: 206, headers });
            }
        }

        if (method === "HEAD") {
            return new Response(null, { status: 200, headers });
        }
        return new Response(file, { status: 200, headers });
    }

    if (isExternalDataRequest) {
        console.warn(`[Worker] External data MISS: ${request.filePath}`, {
            activeFileName: _activeOnnxFileName,
            externalDataChunkCount: _activeExternalDataChunkCount,
            candidates,
        });
    } else {
        console.warn(`[Worker] OPFS Fetch MISS: ${request.modelId} -> ${request.filePath}`, {
            activeFileName: _activeOnnxFileName,
            phase: _currentWorkerPhase,
            candidates,
            url,
            localOnly: _localOnlyMode,
        });
    }
    return new Response(`OPFS Cache Miss: ${request.filePath}`, {
        status: 404,
        statusText: "Not Found (OPFS Cache Miss)",
        headers: { "x-lucid-opfs-worker": "miss" }
    });
};

// ============================================================================
// State
// ============================================================================

/**
 * @type {Object|null}
 */
let transformersModule = null;

/**
 * @type {Map<string, Object>}
 */
const pipelines = new Map();

const initializingKeys = new Map(); // key → Promise<void>
const generationAbortControllers = new Map(); // id → abortController

// ============================================================================
// Module Loading
// ============================================================================

let _transformersLoadingPromise = null;

async function loadTransformersModule() {
    if (transformersModule) return transformersModule;
    if (_transformersLoadingPromise) return _transformersLoadingPromise;

    _transformersLoadingPromise = (async () => {
        await ensureGpuProbeComplete();

        let lastError = null;
        for (const url of TRANSFORMERS_JS_IMPORT_CANDIDATES) {
            try {
                const mod = await import(url);
                transformersModule = mod;

                const env = mod.env || mod.default?.env;
                configureOrtRuntime(env);

                return mod;
            } catch (e) {
                lastError = e;
                console.warn(`[Worker] Failed to load transformers from ${url}`, e);
            }
        }
        throw lastError || new Error("Failed to load transformers.js");
    })();

    return _transformersLoadingPromise;
}

function getPipelineFactory(mod) {
    return mod.pipeline || mod.default?.pipeline;
}

// ============================================================================
// Message Handler
// ============================================================================

self.addEventListener("error", (e) => {
    console.error("[Worker] uncaught error:", e?.message ?? "", e?.filename ?? "", e?.lineno ?? "", e?.colno ?? "");
    self.postMessage({
        type: WORKER_MSG.WORKER_ERROR,
        message: e?.message ?? "Unknown error",
        filename: e?.filename ?? "",
        lineno: e?.lineno ?? 0,
        colno: e?.colno ?? 0
    });
});

self.addEventListener("unhandledrejection", (e) => {
    console.error("[Worker] unhandled rejection:", e?.reason ?? "");
    self.postMessage({
        type: WORKER_MSG.WORKER_ERROR,
        message: e?.reason?.message ?? String(e?.reason ?? "Unhandled rejection"),
        source: "unhandledrejection"
    });
});

self.onmessage = async (e) => {
    const { type, id, data } = e.data;

    try {
        if (type === WORKER_MSG.INIT) {
            await handleInit(id, data);
        } else if (type === WORKER_MSG.GENERATE) {
            await handleGenerate(id, data);
        } else if (type === WORKER_MSG.WARMUP) {
            await handleWarmup(id, data);
        } else if (type === WORKER_MSG.ABORT) {
            await handleAbort(id);
        } else if (type === WORKER_MSG.DISPOSE) {
            await handleDispose(id, data);
        } else {
            self.postMessage({
                type: 'error',
                id,
                error: { message: `[Worker] Unknown message type: ${type}`, stack: "" }
            });
        }
    } catch (error) {
        self.postMessage({
            type: 'error',
            id,
            error: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? (error.stack ?? "") : ""
            }
        });
    }
};

// ============================================================================
// Pipeline Management
// ============================================================================

async function getOrCreatePipeline(task, modelId, options, key) {
    if (pipelines.has(key)) {
        return pipelines.get(key);
    }

    if (initializingKeys.has(key)) {
        await initializingKeys.get(key);
        const pipe = pipelines.get(key);
        if (!pipe) {
            throw new Error(`Pipeline initialization failed for key: ${key}`);
        }
        return pipe;
    }

    const { promise: initPromise, resolve: resolveInit, reject: rejectInit } = Promise.withResolvers();
    initializingKeys.set(key, initPromise);

    try {
        const mod = await loadTransformersModule();
        const pipelineFactory = getPipelineFactory(mod);

        if (typeof pipelineFactory !== 'function') {
            throw new Error('[Worker] Transformers.js pipeline factory not found.');
        }

        const dtypeMode = options?.dtypeMode;
        const previousWarn = console.warn;
        if (dtypeMode === 'exact_file') {
            console.warn = (...args) => {
                const firstArg = String(args[0] ?? "");
                if (firstArg.includes('dtype not specified') && firstArg.includes('default dtype')) {
                    return;
                }
                previousWarn.apply(console, args);
            };
        }

        try {
            console.info(`[Worker Pipeline] Creating pipeline: task=${task}, model=${modelId}, use_external_data_format=${options?.use_external_data_format ?? 'NOT SET'}, model_file_name=${options?.model_file_name}, dtype=${options?.dtype}, activeFileName=${options?.activeFileName}, externalDataChunkCount=${options?.externalDataChunkCount}`);
            const pipe = await pipelineFactory(task, modelId, options);
            pipelines.set(key, pipe);
            resolveInit();
            return pipe;
        } finally {
            if (dtypeMode === 'exact_file') {
                console.warn = previousWarn;
            }
        }
    } catch (error) {
        rejectInit(error);
        throw error;
    } finally {
        initializingKeys.delete(key);
    }
}

async function handleInit(id, data) {
    const { task, modelId, options, key } = data ?? {};
    const oldLocalOnly = _localOnlyMode;
    const oldPhase = _currentWorkerPhase;
    _currentWorkerPhase = "init";

    try {
        if (!key || !task || !modelId) {
            throw new Error(`[Worker] handleInit: missing required params (key=${!!key}, task=${!!task}, modelId=${!!modelId})`);
        }

        if (options?.activeFileName) {
            _activeOnnxFileName = normalizeOnnxFileName(options.activeFileName);
            _localOnlyMode = true;
        }
        _activeExternalDataChunkCount = Math.max(0, Math.trunc(Number(options?.externalDataChunkCount ?? 0)));

        await getOrCreatePipeline(task, modelId, options, key);
        self.postMessage({ type: 'init_done', id, key });
    } finally {
        _localOnlyMode = oldLocalOnly;
        _currentWorkerPhase = oldPhase;
        // Keep _activeOnnxFileName until disposed, as it might be used by generate requests downloading late items?
        // Actually, it's safer to keep it for the fetch interceptor.
    }
}

async function handleWarmup(id, data) {
    const { task, modelId, options, key, prompt } = data ?? {};
    const oldLocalOnly = _localOnlyMode;
    const oldPhase = _currentWorkerPhase;
    _currentWorkerPhase = "warmup";

    try {
        if (!key || !task || !modelId) {
            throw new Error(`[Worker] handleWarmup: missing required params (key=${!!key}, task=${!!task}, modelId=${!!modelId})`);
        }

        _localOnlyMode = true;

        if (options?.activeFileName) {
            _activeOnnxFileName = normalizeOnnxFileName(options.activeFileName);
        }
        _activeExternalDataChunkCount = Math.max(0, Math.trunc(Number(options?.externalDataChunkCount ?? 0)));

        const pipe = await getOrCreatePipeline(task, modelId, options, key);
        await pipe(prompt ?? "Hi", {
            max_new_tokens: 1,
            do_sample: false,
        });

        self.postMessage({ type: WORKER_MSG.WARMUP_DONE, id, key, success: true });
    } catch (error) {
        self.postMessage({
            type: WORKER_MSG.WARMUP_DONE, id, key, success: false,
            error: error?.message ?? String(error),
        });
    } finally {
        _localOnlyMode = oldLocalOnly;
        _currentWorkerPhase = oldPhase;
    }
}

async function handleGenerate(id, data) {
    if (!data || typeof data !== 'object') {
        throw new Error('[Worker] handleGenerate: data is required');
    }
    const { key, prompt, options } = data;

    if (!key) {
        throw new Error('[Worker] handleGenerate: key is required');
    }

    const pipe = pipelines.get(key);
    if (!pipe) {
        throw new Error(`Pipeline not found for key: ${key}`);
    }

    let totalTokenCount = 0;
    let pendingTokenIncrement = 0;
    let aborted = false;

    const localAbortController = { aborted: false };
    generationAbortControllers.set(id, localAbortController);

    const TextStreamer = transformersModule?.TextStreamer;
    let streamer = null;

    if (TextStreamer && pipe.tokenizer) {
        streamer = new TextStreamer(pipe.tokenizer, {
            skip_prompt: true,
            skip_special_tokens: true,
            token_callback_function: (_tokenIds) => {
                if (localAbortController.aborted) {
                    aborted = true;
                    throw new Error('Generation aborted by user');
                }
                totalTokenCount++;
                pendingTokenIncrement++;
            },
            callback_function: (textChunk) => {
                if (!textChunk) return;
                self.postMessage({
                    type: "token",
                    id,
                    token: textChunk,
                    tokenIncrement: pendingTokenIncrement,
                    totalTokens: totalTokenCount,
                });
                pendingTokenIncrement = 0;
            },
        });
    } else {
        console.warn(`[Worker] Streamer disabled for task on key ${key}: tokenizer missing or TextStreamer not found.`);
    }

    const generateOptions = {
        ...options,
        ...(streamer ? { streamer } : {}),
    };

    try {
        const output = await pipe(prompt, generateOptions);
        if (!aborted) {
            const serializedOutput = structuredClone(output);
            self.postMessage({
                type: "generate_done",
                id,
                output: serializedOutput,
            });
        }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (aborted || errorMessage.includes('aborted')) {
            self.postMessage({
                type: "generation_aborted",
                id,
                reason: "user_cancelled"
            });
            return;
        }
        throw e;
    } finally {
        generationAbortControllers.delete(id);
    }
}

function handleAbort(id) {
    console.log("[Worker] Abort requested for generation", id);
    const controller = generationAbortControllers.get(id);
    if (controller) {
        controller.aborted = true;
        self.postMessage({
            type: "abort_ack",
            id,
            message: "Generation abort signal sent"
        });
    } else {
        self.postMessage({
            type: "abort_ack",
            id,
            message: "No active generation to abort"
        });
    }
}

async function handleDispose(id, data) {
    if (!data || typeof data !== 'object') {
        throw new Error('[Worker] handleDispose: data is required');
    }
    const { key } = data;
    if (!key) {
        throw new Error('[Worker] handleDispose: key is required');
    }

    const pipe = pipelines.get(key);
    if (pipe) {
        if (typeof pipe.dispose === 'function') {
            await pipe.dispose();
        }
        pipelines.delete(key);
    }
    self.postMessage({ type: 'dispose_done', id });
}
