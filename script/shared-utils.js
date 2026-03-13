/**
 * Shared Utilities & Global API Module
 * 공통 유틸리티 함수와 전역 API 노출 기능을 제공합니다.
 */

// No i18n import here to prevent circular dependency
import {
    OPFS_MODELS_DIR,
    TRANSFORMERS_JS_VERSION,
    TRANSFORMERS_JS_IMPORT_CANDIDATES,
    WORKER_MSG,
    TOAST_MS,
    STORAGE_KEYS,
    TRANSFORMERS_GLOBAL_KEY,
    LUCID_APP_GLOBAL_KEY,
} from "./constants.js";
import {
    isValidModelId,
    decodeUriComponentSafe,
    isHfHostName,
    isExplicitHfDownloadRequest,
    isHfApiRequest,
    parseHfResolveUrl,
    parseLocalModelRequestUrl,
    normalizeModelId,
    normalizeOpfsModelRelativePath,
    normalizeOnnxFileName,
    normalizeStoragePrefixFromModelId,
    toSafeModelBundleDirectoryName,
    toSafeModelPathSegment,
    toSafeModelBundleRelativePath,
    toSafeModelStorageFileName,
    toSafeModelStorageAssetFileName,
    buildOpfsCandidatePaths,
} from "./opfs-utils.js";

// ============================================================================
// Constants
// ============================================================================






// ============================================================================
// Error & UI Utilities
// ============================================================================

/**
 * 문자열을 정규화합니다 (trim + lowercase).
 * @param {*} value
 * @param {string} defaultVal
 * @returns {string}
 */
export function normalizeLowercase(value, defaultVal = "") {
    return String(value ?? defaultVal).trim().toLowerCase();
}

/**
 * 대소문자를 무시하고 두 문자열이 같은지 확인합니다.
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
export function eqIgnoreCase(a, b) {
    return normalizeLowercase(a) === normalizeLowercase(b);
}

/**
 * 대소문자를 무시하고 부분 문자열이 포함되어 있는지 확인합니다.
 * @param {*} str
 * @param {*} sub
 * @returns {boolean}
 */
export function includesIgnoreCase(str, sub) {
    return normalizeLowercase(str).includes(normalizeLowercase(sub));
}



/**
 * HTML 특수 문자를 이스케이프합니다.
 * @param {*} value
 * @returns {string}
 */
const HTML_ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
/**
 * HTML 특수 문자를 이스케이프 처리합니다.
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => HTML_ESCAPE_MAP[c]);
}

/**
 * 지정된 밀리초만큼 지연합니다.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * 바이트 크기를 읽기 쉬운 형식으로 변환합니다.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
    const size = Number(bytes);
    if (!Number.isFinite(size) || size < 0) return "0 B";
    if (size < 1024) return `${size.toFixed(0)} B`;
    if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 ** 3) return `${(size / (1024 ** 2)).toFixed(2)} MB`;
    return `${(size / (1024 ** 3)).toFixed(2)} GB`;
}

/**
 * 전송 속도를 포맷팅합니다.
 * @param {number} bytesPerSecond
 * @returns {string}
 */
export function formatSpeed(bytesPerSecond) {
    const speed = Number(bytesPerSecond);
    if (!Number.isFinite(speed) || speed <= 0) return "-";
    return `${formatBytes(speed)}/s`;
}


// ============================================================================
// File & Text Utilities
// ============================================================================


/**
 * 텍스트의 대략적인 토큰 수를 계산합니다.
 * @param {string} text
 * @returns {number}
 */
export function countApproxTokens(text) {
    const s = String(text ?? "");
    if (!s) return 0;
    let count = 0;
    // S-3: Use for...of to correctly iterate over Unicode characters (handles surrogate pairs like emojis)
    for (const char of s) {
        const code = char.codePointAt(0);
        // ASCII characters (English, numbers, basic symbols) are roughly 4 chars/token
        if (code <= 127) {
            count += 0.25;
        } else {
            // CJK and other multi-byte characters are roughly 0.6-1.0 chars/token
            count += 0.75;
        }
    }
    return Math.max(1, Math.ceil(count));
}

/**
 * 프롬프트 텍스트를 정규화합니다.
 * @param {*} value
 * @returns {string}
 */
export function normalizePromptText(value) {
    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");
}

// ============================================================================
// Network & Backend Utilities
// ============================================================================

/**
 * 지수 백오프 지연 시간을 계산합니다.
 * @param {number} baseDelayMs
 * @param {number} attempt
 * @param {{maxDelayMs?: number}} options
 * @returns {number}
 */
export function calculateExponentialBackoffDelay(baseDelayMs, attempt, options = {}) {
    const base = Math.max(0, Number.isFinite(Number(baseDelayMs)) ? Number(baseDelayMs) : 0);
    const step = Math.max(1, Math.trunc(Number(attempt) || 1));
    const maxDelay = Number.isFinite(Number(options.maxDelayMs))
        ? Math.max(0, Number(options.maxDelayMs))
        : Number.POSITIVE_INFINITY;
    const raw = base * (2 ** Math.max(0, step - 1));
    const bounded = Math.min(raw, maxDelay);
    return Math.max(0, Math.trunc(bounded));
}

/**
 * 비동기 함수를 지수 백오프 기반으로 재시도합니다.
 * @param {(attempt: number) => Promise<*>} fn
 * @param {{
 *   maxRetries?: number,
 *   baseDelayMs?: number,
 *   shouldRetry?: (error: any, attempt: number) => boolean,
 *   onRetry?: ((attempt: number, maxRetries: number) => void) | null,
 *   onNonRetryable?: ((error: any) => void) | null,
 *   maxDelayMs?: number
 * }} options
 * @returns {Promise<*>}
 */
export async function withRetry(fn, options = {}) {
    const {
        maxRetries = 3,
        baseDelayMs = 1000,
        shouldRetry = () => true,
        onRetry = null,
        onNonRetryable = null,
        maxDelayMs,
    } = options;
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries + 1; attempt += 1) {
        try {
            return await fn(attempt);
        } catch (error) {
            lastError = error;
            if (attempt > maxRetries || !shouldRetry(error, attempt)) {
                if (typeof onNonRetryable === "function") {
                    try {
                        onNonRetryable(error);
                    } catch {
                        // no-op
                    }
                }
                throw error;
            }
            if (typeof onRetry === "function") {
                try {
                    onRetry(attempt, maxRetries);
                } catch {
                    // no-op
                }
            }
            await delay(calculateExponentialBackoffDelay(
                baseDelayMs,
                attempt,
                maxDelayMs != null ? { maxDelayMs } : {},
            ));
        }
    }
    throw lastError || new Error("Retry attempts exhausted");
}

/**
 * HTTPS URL 인지 확인합니다.
 * @param {*} value
 * @param {{allowLocalhostHttp?: boolean}} options
 * @returns {boolean}
 */
export function isHttpsUrl(value, options = {}) {
    const text = String(value ?? "").trim();
    if (!text) return false;

    // S7: 상대경로 방지를 위해 base URL 없이 파싱
    try {
        // 절대 URL인지 확인 (프로토콜로 시작해야 함)
        if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(text)) {
            return false;
        }
        const parsed = new URL(text);
        const protocol = String(parsed.protocol ?? "").toLowerCase();
        if (protocol === "https:") {
            return true;
        }
        if (protocol !== "http:") {
            return false;
        }

        const allowLocalhostHttp = options.allowLocalhostHttp === true;
        if (!allowLocalhostHttp) {
            return false;
        }

        const host = String(parsed.hostname ?? "").toLowerCase();
        return host === "localhost" || host === "127.0.0.1" || host === "::1";
    } catch {
        return false;
    }
}

/**
 * 추론 백엔드 체인을 해결합니다.
 * @param {*} preferredDevice
 * @param {{webgpu?: boolean, wasm?: boolean}} capabilities
 * @returns {string[]}
 */
export function resolveInferenceBackendChain(preferredDevice, capabilities = {}) {
    const preferred = String(preferredDevice ?? "").trim().toLowerCase();
    const hasWebGpu = capabilities.webgpu === true;
    const hasWasm = capabilities.wasm !== false;

    const order = (preferred === "webgpu") ? ["webgpu", "wasm"] : ["wasm", "webgpu"];
    const result = order.filter(d => (d === "webgpu" && hasWebGpu) || (d === "wasm" && hasWasm));
    return result.length > 0 ? result : ["wasm"];
}

// ============================================================================
// Streaming Utilities
// ============================================================================


/**
 * 버퍼링된 텍스트의 길이에 따라 한 번에 드레인할 문자 수를 결정합니다.
 * 버퍼가 클수록 더 많이 드레인하여 렌더링 지연을 방지합니다.
 * @param {number} bufferedLength
 * @returns {number}
 */
const STREAM_DRAIN_THRESHOLDS = Object.freeze({
    LARGE_BUFFER: 500,   // 버퍼 > 500 자: 빠른 flush
    MEDIUM_BUFFER: 100,  // 버퍼 > 100 자: 중간 flush
    DRAIN_LARGE: 20,
    DRAIN_MEDIUM: 5,
    DRAIN_SMALL: 3,
});

export function computeStreamDrainCount(bufferedLength) {
    const len = Math.max(0, Math.trunc(Number(bufferedLength) || 0));
    if (len <= 0) return 0;
    if (len > STREAM_DRAIN_THRESHOLDS.LARGE_BUFFER) return STREAM_DRAIN_THRESHOLDS.DRAIN_LARGE;
    if (len > STREAM_DRAIN_THRESHOLDS.MEDIUM_BUFFER) return STREAM_DRAIN_THRESHOLDS.DRAIN_MEDIUM;
    return Math.min(len, STREAM_DRAIN_THRESHOLDS.DRAIN_SMALL);
}

/**
 * 토큰 생성 속도를 계산합니다 (tokens per second).
 * @param {number} totalTokens
 * @param {number} startedAtMs - 생성 시작 시각 (밀리초)
 * @param {number} nowMs - 현재 시각 (밀리초)
 * @returns {number}
 */
export function computeTokensPerSecond(totalTokens, startedAtMs, nowMs) {
    // S-2: Better null/negative checks and clock skew defense
    if (startedAtMs == null || totalTokens <= 0 || nowMs == null) return 0;
    const elapsedSec = Math.max((Number(nowMs) - Number(startedAtMs)) / 1000, 0.001);
    return Number(totalTokens) / elapsedSec;
}

// ============================================================================
// Transformers Bridge Utilities
// ============================================================================


/**
 * 주입된 Transformers 런타임 모듈을 가져옵니다.
 * @param {*} host
 * @returns {*}
 */
export function getInjectedTransformersModule(host = globalThis) {
    return host?.[TRANSFORMERS_GLOBAL_KEY] ?? null;
}

/**
 * Transformers 런타임 모듈을 주입합니다.
 * @param {*} runtimeModule
 * @param {*} host
 * @returns {*}
 */
export function setInjectedTransformersModule(runtimeModule, host = globalThis) {
    host[TRANSFORMERS_GLOBAL_KEY] = runtimeModule;
    return host[TRANSFORMERS_GLOBAL_KEY];
}

// ============================================================================
// Global API Utilities
// ============================================================================


/**
 * 호스트 객체를 해결합니다.
 * @param {*} hostCandidate
 * @returns {*}
 */
function resolveHost(hostCandidate) {
    if (hostCandidate && (typeof hostCandidate === "object" || typeof hostCandidate === "function")) {
        return hostCandidate;
    }
    return globalThis;
}

/**
 * Lucid 앱 전역 객체를 보장합니다.
 * @param {*} host
 * @returns {Object}
 */
function ensureLucidAppGlobal(host = globalThis) {
    const root = resolveHost(host);
    const existing = root[LUCID_APP_GLOBAL_KEY];
    if (existing && typeof existing === "object") {
        return existing;
    }
    const created = {};
    root[LUCID_APP_GLOBAL_KEY] = created;
    return created;
}

/**
 * Lucid API 를 전역에 노출합니다.
 * @param {Object} api
 * @param {{host?: any, exposeLegacy?: boolean}} options
 * @returns {Object}
 */
export function publishLucidApi(api = {}, options = {}) {
    const root = resolveHost(options.host);
    const namespace = ensureLucidAppGlobal(root);
    if (api && typeof api === "object") {
        Object.assign(namespace, api);
        if (options.exposeLegacy === true) {
            Object.assign(root, api);
        }
    }
    return namespace;
}

/**
 * 값을 전역에 노출합니다.
 * @param {string} key
 * @param {*} value
 * @param {{host?: any, legacyKey?: string}} options
 * @returns {*}
 */
export function publishLucidValue(key, value, options = {}) {
    const root = resolveHost(options.host);
    const namespace = ensureLucidAppGlobal(root);
    const normalizedKey = String(key ?? "").trim();
    if (normalizedKey) {
        namespace[normalizedKey] = value;
    }
    const legacyKey = String(options.legacyKey ?? "").trim();
    if (legacyKey) {
        root[legacyKey] = value;
    }
    return value;
}


// ============================================================================
// JSON Serialization Utilities
// ============================================================================

/**
 * 안전하게 JSON 데이터를 직렬화합니다.
 * @param {*} data
 * @returns {{success: boolean, value: string|null, error: string|null}}
 */
export function safeJsonStringify(data) {
    try {
        if (data === undefined) return { success: true, value: null, error: null };
        const result = JSON.stringify(data);
        return { success: true, value: result, error: null };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { success: false, value: null, error: errorMsg };
    }
}

/**
 * 안전하게 JSON 데이터를 파싱합니다.
 * @param {string} text
 * @param {*} defaultValue
 * @returns {{success: boolean, value: any, error: string|null}}
 */
export function safeJsonParse(text, defaultValue = null) {
    // S-1: Check text == null to allow empty strings if intention is to parse "" (though JSON.parse("") fails)
    // Actually JSON.parse("") is invalid, so !text is mostly fine, but let's be more precise.
    if (text == null || typeof text !== "string") {
        return { success: false, value: defaultValue, error: "Input is not a string" };
    }
    // Still forbid empty string if we want strictly valid JSON
    if (text.trim() === "") {
        return { success: false, value: defaultValue, error: "Empty string is not valid JSON" };
    }
    try {
        const result = JSON.parse(text);
        return { success: true, value: result, error: null };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { success: false, value: defaultValue, error: errorMsg };
    }
}

// ============================================================================
// Storage Adapter Utilities
// ============================================================================

/**
 * LocalStorage에서 값을 안전하게 읽습니다.
 * @param {string} key - 저장소 키
 * @param {*} defaultValue - 기본값
 * @param {{deserialize?: boolean}} options
 * @returns {{success: boolean, value: any, error: string|null}}
 */
export function readFromStorage(key, defaultValue = null, options = {}) {
    const { deserialize = false } = options;
    try {
        const raw = localStorage.getItem(key);
        // S3: null 체크로 변경 (빈 문자열은 유효한 값)
        if (raw == null) {
            return { success: true, value: defaultValue, error: null };
        }
        if (deserialize) {
            const parseResult = safeJsonParse(raw, defaultValue);
            return parseResult;
        }
        return { success: true, value: raw, error: null };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { success: false, value: defaultValue, error: errorMsg };
    }
}

/**
 * LocalStorage에 값을 안전하게 저장합니다.
 * @param {string} key - 저장소 키
 * @param {*} value - 저장할 값
 * @param {{serialize?: boolean}} options
 * @returns {{success: boolean, error: string|null}}
 */
export function writeToStorage(key, value, options = {}) {
    const { serialize = false } = options;
    try {
        if (value == null) {
            localStorage.removeItem(key);
            return { success: true, error: null };
        }

        let stringValue;
        if (serialize) {
            const stringifyResult = safeJsonStringify(value);
            if (!stringifyResult.success) {
                return { success: false, error: stringifyResult.error };
            }
            stringValue = stringifyResult.value;
        } else {
            // S2: 객체인 경우 명시적 에러 반환
            if (typeof value === 'object' && value != null) {
                return { success: false, error: 'Cannot store object without serialize=true' };
            }
            stringValue = String(value);
        }

        if (stringValue == null) {
            localStorage.removeItem(key);
            return { success: true, error: null };
        }

        localStorage.setItem(key, stringValue);
        return { success: true, error: null };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMsg };
    }
}

/**
 * 브라우저 저장소 할당량 정보를 조회합니다.
 * @returns {Promise<{quota: number, usage: number, available: number}>}
 */
export async function getStorageEstimate() {
    try {
        const est = await (navigator.storage?.estimate
            ? navigator.storage.estimate()
            : Promise.resolve({ quota: 0, usage: 0 }));
        const quota = Number(est.quota ?? 0);
        const usage = Number(est.usage ?? 0);
        return {
            quota,
            usage,
            available: Math.max(0, quota - usage),
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error || "Unknown Error");
        console.warn("[Storage] Failed to read storage estimate:", errorMsg);
        return { quota: 0, usage: 0, available: 0 };
    }
}

// ============================================================================
// Normalization Utilities
// ============================================================================

/**
 * 문자열을 안전하게 정규화합니다.
 * @param {*} value
 * @param {string} defaultValue
 * @param {Function} transformer
 * @returns {string}
 */
export function normalizeString(value, defaultValue = "", transformer = null) {
    if (value === null || value === undefined) return defaultValue;
    const str = String(value).trim();
    if (!str) return defaultValue;
    if (typeof transformer === "function") {
        try {
            return transformer(str) || defaultValue;
        } catch {
            return defaultValue;
        }
    }
    return str;
}






// Re-exports from constants.js (for backward compatibility)
// ============================================================================

export {
    OPFS_MODELS_DIR,
    TRANSFORMERS_JS_VERSION,
    TRANSFORMERS_JS_IMPORT_CANDIDATES,
    WORKER_MSG,
    TOAST_MS,
    STORAGE_KEYS,
    SW_EVENT,
    TRANSFORMERS_GLOBAL_KEY,
    LUCID_APP_GLOBAL_KEY,
} from "./constants.js";

// ============================================================================
// Re-exports from opfs-utils.js (for backward compatibility)
// ============================================================================

export {
    isValidModelId,
    decodeUriComponentSafe,
    isHfHostName,
    isExplicitHfDownloadRequest,
    isHfApiRequest,
    parseHfResolveUrl,
    parseLocalModelRequestUrl,
    normalizeModelId,
    normalizeOpfsModelRelativePath,
    normalizeOnnxFileName,
    normalizeStoragePrefixFromModelId,
    toSafeModelBundleDirectoryName,
    toSafeModelPathSegment,
    toSafeModelBundleRelativePath,
    toSafeModelStorageFileName,
    toSafeModelStorageAssetFileName,
    buildOpfsCandidatePaths,
} from "./opfs-utils.js";

