/**
 * Web Worker - Transformers.js Inference
 * 브라우저 내 AI 추론을 위한 Web Worker 입니다.
 */

import {
    extractTokenIdsFromBeamPayload,
    computeStreamTokenDelta,
    OPFS_MODELS_DIR,
    TRANSFORMERS_JS_IMPORT_CANDIDATES,
} from "./shared-utils.js";

// ── WebGPU Adapter Probe (deferred) ────────────────────────────────────────
// Probing must NOT be a top-level await because it causes a race condition:
// postMessage() sent during the await is delivered before self.onmessage is
// set, silently dropping the message and leaving the Worker idle forever.
// Instead, the probe runs lazily on the first loadTransformersModule() call.
let _gpuProbeComplete = false;

async function ensureGpuProbeComplete() {
    if (_gpuProbeComplete) return;
    _gpuProbeComplete = true;

    if (typeof navigator !== 'undefined' && navigator.gpu && typeof navigator.gpu.requestAdapter === 'function') {
        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.info("[Worker] WebGPU adapter not available, disabling navigator.gpu for WASM fallback");
                Object.defineProperty(navigator, 'gpu', { value: undefined, configurable: true });
            } else {
                // GPU available — patch requestAdapter to suppress 'powerPreference' warning
                // See https://crbug.com/369219127
                const originalRequestAdapter = navigator.gpu.requestAdapter;
                navigator.gpu.requestAdapter = function(options) {
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
}

// ============================================================================
// OPFS Fetch Interceptor (Worker)
// ============================================================================

const originalWorkerFetch = self.fetch.bind(self);

/**
 * HuggingFace resolve URL을 파싱하여 modelId와 filePath를 추출합니다.
 * @param {string} rawUrl
 * @returns {{ modelId: string, filePath: string } | null}
 */
function parseHfResolveUrl(rawUrl) {
    try {
        const parsed = new URL(rawUrl);
        const host = parsed.hostname.toLowerCase();
        if (host !== "huggingface.co" && host !== "www.huggingface.co") return null;
        // Bypass explicit download requests
        if (parsed.searchParams.get("download") === "1") return null;

        const segments = parsed.pathname
            .split("/")
            .filter(Boolean)
            .map((s) => decodeURIComponent(s));
        const resolveIndex = segments.indexOf("resolve");
        if (resolveIndex < 2 || resolveIndex + 2 >= segments.length) return null;

        const modelId = segments.slice(0, resolveIndex).join("/");
        const filePath = segments.slice(resolveIndex + 2).join("/");
        if (!modelId || !filePath) return null;
        return { modelId, filePath };
    } catch {
        return null;
    }
}

/**
 * 모델 ID와 파일 경로로부터 OPFS 후보 경로 목록을 생성합니다.
 * @param {string} modelId
 * @param {string} filePath
 * @returns {string[]}
 */
function buildOpfsWorkerCandidatePaths(modelId, filePath) {
    const bundleDir = modelId.replaceAll("/", "--");
    const candidates = [];
    candidates.push(`${bundleDir}/${filePath}`);
    // onnx/ 하위 파일에 대해 onnx/ prefix 없는 경로도 시도
    if (filePath.startsWith("onnx/")) {
        candidates.push(`${bundleDir}/${filePath.slice(5)}`);
    }
    return candidates;
}

/**
 * OPFS에서 상대 경로로 파일을 읽습니다.
 * @param {string} relativePath
 * @returns {Promise<File|null>}
 */
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

/**
 * 파일 경로에서 Content-Type을 추론합니다.
 * @param {string} path
 * @returns {string}
 */
function inferWorkerContentType(path) {
    const lower = String(path ?? "").toLowerCase();
    if (lower.endsWith(".json")) return "application/json";
    if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".jinja")) {
        return "text/plain; charset=utf-8";
    }
    return "application/octet-stream";
}

/**
 * Range 헤더를 파싱합니다.
 * @param {*} init
 * @param {*} input
 * @returns {string}
 */
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

// Worker fetch 인터셉터 설치 — HuggingFace URL 요청을 OPFS에서 우선 해결
self.fetch = async (input, init) => {
    const method = String(init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
        return originalWorkerFetch(input, init);
    }

    const url = typeof input === "string"
        ? input
        : (input instanceof URL ? input.toString() : (input instanceof Request ? input.url : ""));

    const request = parseHfResolveUrl(url);
    if (!request) {
        return originalWorkerFetch(input, init);
    }

    const candidates = buildOpfsWorkerCandidatePaths(request.modelId, request.filePath);
    for (const candidatePath of candidates) {
        const file = await readOpfsFileInWorker(candidatePath);
        if (!file || file.size <= 0) continue;



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

                if (startText && endText) {
                    start = parseInt(startText, 10);
                    end = parseInt(endText, 10);
                    if (Number.isNaN(start) || Number.isNaN(end)) {
                        if (method === "HEAD") {
                            return new Response(null, { status: 200, headers });
                        }
                        return new Response(file, { status: 200, headers });
                    }
                } else if (startText) {
                    start = parseInt(startText, 10);
                    if (Number.isNaN(start)) {
                        if (method === "HEAD") {
                            return new Response(null, { status: 200, headers });
                        }
                        return new Response(file, { status: 200, headers });
                    }
                } else if (endText) {
                    const suffix = parseInt(endText, 10);
                    if (Number.isNaN(suffix)) {
                        if (method === "HEAD") {
                            return new Response(null, { status: 200, headers });
                        }
                        return new Response(file, { status: 200, headers });
                    }
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

    // OPFS miss — fall through to real network fetch
    return originalWorkerFetch(input, init);
};

/**
 * @type {Object|null}
 */
let transformersModule = null;

/**
 * @type {Map<string, Object>}
 */
const pipelines = new Map();

// 초기화 진행 중인 키 추적 (Race Condition 방지)
const initializingKeys = new Map(); // key → Promise<void>

// ============================================================================
// Module Loading
// ============================================================================

/**
 * Transformers.js 모듈을 로드합니다.
 * @returns {Promise<Object>}
 */
async function loadTransformersModule() {
    if (transformersModule) return transformersModule;

    // Probe WebGPU adapter before loading ONNX Runtime (via Transformers.js).
    // Must happen before the first import() so ONNX RT sees navigator.gpu state
    // correctly and doesn't attempt a broken WebGPU backend.
    await ensureGpuProbeComplete();

    let lastError = null;
    for (const url of TRANSFORMERS_JS_IMPORT_CANDIDATES) {
        try {
            const mod = await import(url);
            transformersModule = mod;

            // Configure environment
            const env = mod.env || mod.default?.env;
            if (env) {
                env.allowLocalModels = false;
                // allowRemoteModels = true so Transformers.js constructs HuggingFace
                // resolve URLs, which our OPFS fetch interceptor serves from local cache.
                env.allowRemoteModels = true;
                // Disable TJS internal browser Cache API usage — we already
                // serve files from OPFS so double-caching wastes storage quota
                // and causes "Failed to execute 'put' on 'Cache'" errors.
                env.useBrowserCache = false;
                if (typeof env.useCache !== "undefined") env.useCache = false;

                // ── ONNX Runtime WASM thread fix ──────────────────────────
                // When Transformers.js / ONNX Runtime is loaded from CDN, the
                // multi-threaded WASM backend tries to create a Worker from a
                // cross-origin script URL, which browsers block with a
                // SecurityError.  Disable multi-threading to avoid this.
                // Also disable the WASM proxy worker for the same reason.
                if (env.backends?.onnx?.wasm) {
                    env.backends.onnx.wasm.numThreads = 1;
                    env.backends.onnx.wasm.proxy = false;
                }
            }

            // Also try configuring via ONNX Runtime's own env if available
            const ort = mod.ort || mod.default?.ort;
            if (ort?.env?.wasm) {
                ort.env.wasm.numThreads = 1;
                ort.env.wasm.proxy = false;
            }
            return mod;
        } catch (e) {
            lastError = e;
            console.warn(`[Worker] Failed to load transformers from ${url}`, e);
        }
    }
    throw lastError || new Error("Failed to load transformers.js");
}

/**
 * 파이프라인 팩토리 함수를 가져옵니다.
 * @param {Object} mod
 * @returns {Function}
 */
function getPipelineFactory(mod) {
    return mod.pipeline || mod.default?.pipeline;
}

// ============================================================================
// Message Handler
// ============================================================================

// Global uncaught error handlers for debugging Worker crashes
self.addEventListener("error", (e) => {
    console.error("[Worker] uncaught error:", e?.message ?? "", e?.filename ?? "", e?.lineno ?? "", e?.colno ?? "");
    // Notify main thread
    self.postMessage({
        type: "worker_error",
        message: e?.message ?? "Unknown error",
        filename: e?.filename ?? "",
        lineno: e?.lineno ?? 0,
        colno: e?.colno ?? 0
    });
});

self.addEventListener("unhandledrejection", (e) => {
    console.error("[Worker] unhandled rejection:", e?.reason ?? "");
    // Notify main thread
    self.postMessage({
        type: "worker_error",
        message: e?.reason?.message ?? String(e?.reason ?? "Unhandled rejection"),
        source: "unhandledrejection"
    });
});

// Generation abort controller
let currentGenerationAbortController = null;

self.onmessage = async (e) => {
    const { type, id, data } = e.data;

    try {
        if (type === 'init') {
            await handleInit(id, data);
        } else if (type === 'generate') {
            await handleGenerate(id, data);
        } else if (type === 'abort') {
            await handleAbort(id, data);
        } else if (type === 'dispose') {
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

/**
 * 파이프라인을 초기화합니다.
 * @param {string} id
 * @param {Object} data
 */
async function handleInit(id, data) {
    if (!data || typeof data !== 'object') {
        throw new Error('[Worker] handleInit: data is required');
    }
    const { task, modelId, options, key } = data;

    if (pipelines.has(key)) {
        self.postMessage({ type: 'init_done', id, key });
        return;
    }

    // 이미 동일 key로 초기화가 진행 중이면 완료 대기
    if (initializingKeys.has(key)) {
        await initializingKeys.get(key);
        self.postMessage({ type: 'init_done', id, key });
        return;
    }

    const { promise: initPromise, resolve: resolveInit } = Promise.withResolvers();
    initializingKeys.set(key, initPromise);

    try {
        const mod = await loadTransformersModule();
        const pipelineFactory = getPipelineFactory(mod);

        if (typeof pipelineFactory !== 'function') {
            throw new Error('[Worker] Transformers.js pipeline factory not found. Module structure may have changed.');
        }

        // Create pipeline
        const pipe = await pipelineFactory(task, modelId, options);

        pipelines.set(key, pipe);
        self.postMessage({ type: 'init_done', id, key });
    } finally {
        initializingKeys.delete(key);
        resolveInit();
    }
}

/**
 * 텍스트 생성을 수행합니다.
 * @param {string} id
 * @param {Object} data
 */
async function handleGenerate(id, data) {
    if (!data || typeof data !== 'object') {
        throw new Error('[Worker] handleGenerate: data is required');
    }
    const { key, prompt, options } = data;
    const pipe = pipelines.get(key);

    if (!pipe) {
        throw new Error(`Pipeline not found for key: ${key}`);
    }

    let streamedText = "";
    let lastTokenCount = 0;
    let totalTokenCount = 0;
    let aborted = false;

    // Set up abort controller
    const localAbortController = { aborted: false };
    currentGenerationAbortController = localAbortController;

    /**
     * 빔 서치 콜백 함수 — 토큰이 생성될 때마다 호출됩니다.
     * @param {Object} beamPayload
     */
    const callback_function = (beamPayload) => {
        // Check for abort
        if (localAbortController.aborted) {
            aborted = true;
            throw new Error('Generation aborted by user');
        }

        let tokenIds = [];
        try {
            tokenIds = extractTokenIdsFromBeamPayload(beamPayload);
            if (!Array.isArray(tokenIds) || tokenIds.length === 0) return;

            const currentTokenCount = tokenIds.length;
            const tokenIncrement = Math.max(0, currentTokenCount - lastTokenCount);
            lastTokenCount = currentTokenCount;
            totalTokenCount += tokenIncrement;

            if (pipe.tokenizer && typeof pipe.tokenizer.decode === "function") {
                const decoded = pipe.tokenizer.decode(tokenIds, { skip_special_tokens: true });
                const { delta, fullText } = computeStreamTokenDelta(decoded, streamedText);
                streamedText = fullText;

                if (delta || tokenIncrement > 0) {
                    self.postMessage({
                        type: "token",
                        id,
                        token: delta,
                        tokenIncrement,
                        totalTokens: totalTokenCount,
                    });
                }
            }
        } catch (e) {
            // Check if this is an abort error
            if (aborted || e.message === 'Generation aborted by user') {
                // Notify main thread of abort
                self.postMessage({
                    type: "generation_aborted",
                    id,
                    reason: "user_cancelled"
                });
                throw e; // Re-throw to stop generation
            }
            
            console.error("[Worker] Token decode error", e);
            // Notify main thread of decode error
            self.postMessage({
                type: "token_error",
                id,
                error: {
                    message: e.message,
                    tokenCount: tokenIds?.length ?? 0
                }
            });
        }
    };

    const generateOptions = {
        ...options,
        callback_function,
    };

    try {
        const output = await pipe(prompt, generateOptions);

        if (!aborted) {
            self.postMessage({
                type: "generate_done",
                id,
                output,
            });
        }
    } finally {
        currentGenerationAbortController = null;
    }
}

/**
 * 생성 중단을 처리합니다.
 * @param {string} id
 * @param {Object} data
 */
async function handleAbort(id, data) {
    console.log("[Worker] Abort requested for generation", id);
    
    if (currentGenerationAbortController) {
        currentGenerationAbortController.aborted = true;
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

/**
 * 파이프라인을 해제합니다.
 * @param {string} id
 * @param {Object} data
 */
async function handleDispose(id, data) {
    if (!data || typeof data !== 'object') {
        throw new Error('[Worker] handleDispose: data is required');
    }
    const { key } = data;
    const pipe = pipelines.get(key);
    if (pipe) {
        if (typeof pipe.dispose === 'function') {
            await pipe.dispose();
        }
        pipelines.delete(key);
    }
    self.postMessage({ type: 'dispose_done', id });
}
