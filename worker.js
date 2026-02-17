/**
 * Web Worker - Transformers.js Inference
 * 브라우저 내 AI 추론을 위한 Web Worker 입니다.
 */

import {
    extractTokenIdsFromBeamPayload,
    computeStreamTokenDelta,
} from "./shared-utils.js";

const TRANSFORMERS_JS_VERSION = "3.8.1";

/**
 * Transformers.js CDN 미러 목록
 */
const TRANSFORMERS_JS_IMPORT_CANDIDATES = [
    `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}/+esm`,
    `https://unpkg.com/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}?module`,
];

/**
 * @type {Object|null}
 */
let transformersModule = null;

/**
 * @type {Map<string, Object>}
 */
const pipelines = new Map();

// ============================================================================
// Module Loading
// ============================================================================

/**
 * Transformers.js 모듈을 로드합니다.
 * @returns {Promise<Object>}
 */
async function loadTransformersModule() {
    if (transformersModule) return transformersModule;

    let lastError = null;
    for (const url of TRANSFORMERS_JS_IMPORT_CANDIDATES) {
        try {
            const mod = await import(url);
            transformersModule = mod;

            // Configure environment
            const env = mod.env || mod.default?.env;
            if (env) {
                env.allowLocalModels = false;
                env.allowRemoteModels = true;
                env.useBrowserCache = true;
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

self.onmessage = async (e) => {
    const { type, id, data } = e.data;

    try {
        if (type === 'init') {
            await handleInit(id, data);
        } else if (type === 'generate') {
            await handleGenerate(id, data);
        } else if (type === 'dispose') {
            await handleDispose(id, data);
        }
    } catch (error) {
        self.postMessage({
            type: 'error',
            id,
            error: {
                message: error.message,
                stack: error.stack
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
    const { task, modelId, options, key } = data;

    if (pipelines.has(key)) {
        self.postMessage({ type: 'init_done', id, key });
        return;
    }

    const mod = await loadTransformersModule();
    const pipelineFactory = getPipelineFactory(mod);

    // Create pipeline
    const pipe = await pipelineFactory(task, modelId, options);

    pipelines.set(key, pipe);
    self.postMessage({ type: 'init_done', id, key });
}

/**
 * 텍스트 생성을 수행합니다.
 * @param {string} id
 * @param {Object} data
 */
async function handleGenerate(id, data) {
    const { key, prompt, options } = data;
    const pipe = pipelines.get(key);

    if (!pipe) {
        throw new Error(`Pipeline not found for key: ${key}`);
    }

    let streamedText = "";
    let lastTokenCount = 0;

    /**
     * 빔 서치 콜백 함수 — 토큰이 생성될 때마다 호출됩니다.
     * @param {Object} beamPayload
     */
    const callback_function = (beamPayload) => {
        try {
            const tokenIds = extractTokenIdsFromBeamPayload(beamPayload);
            if (!Array.isArray(tokenIds) || tokenIds.length === 0) return;

            const currentTokenCount = tokenIds.length;
            const tokenIncrement = Math.max(0, currentTokenCount - lastTokenCount);
            lastTokenCount = currentTokenCount;

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
                    });
                }
            }
        } catch (e) {
            console.error("[Worker] Token decode error", e);
        }
    };

    const generateOptions = {
        ...options,
        callback_function,
    };

    const output = await pipe(prompt, generateOptions);

    self.postMessage({
        type: "generate_done",
        id,
        output,
    });
}

/**
 * 파이프라인을 해제합니다.
 * @param {string} id
 * @param {Object} data
 */
async function handleDispose(id, data) {
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

// ============================================================================
// Utilities
// ============================================================================

