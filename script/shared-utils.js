/**
 * Shared Utilities & Global API Module
 * 공통 유틸리티 함수와 전역 API 노출 기능을 제공합니다.
 */

import { t, I18N_KEYS } from "./i18n.js";

// ============================================================================
// Constants
// ============================================================================

export const OPFS_MODELS_DIR = "models";

export const TRANSFORMERS_JS_VERSION = "4.0.0-next.1";
export const TRANSFORMERS_JS_IMPORT_CANDIDATES = Object.freeze([
    // Prefer the self-hosted bundle so worker/runtime assets stay same-origin.
    `../vendor/transformers/transformers.bundle.min.mjs`,
    `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}/+esm`,
    `https://unpkg.com/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}?module`,
]);
export const WORKER_MSG = {
    INIT: "init",
    GENERATE: "generate",
    WARMUP: "warmup",
    WARMUP_DONE: "warmup_done",
    ABORT: "abort",
    DISPOSE: "dispose",
    INIT_DONE: "init_done",
    INIT_ERROR: "init_error",
    GENERATE_TOKEN: "generate_token",
    GENERATE_DONE: "generate_done",
    ABORT_ACK: "abort_ack",
    DISPOSE_DONE: "dispose_done",
    TOKEN: "token",
    GENERATION_ABORTED: "generation_aborted",
    TOKEN_ERROR: "token_error",
    ERROR: "error",
    WORKER_ERROR: "worker_error",
};


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
 * 오류 객체에서 메시지를 추출합니다.
 * @param {*} error
 * @returns {string}
 */
export function getErrorMessage(error) {
    if (error == null) return "알 수 없는 오류가 발생했습니다.";
    if (typeof error === "string") return error;
    if (typeof error.message === "string") return error.message;
    return String(error);
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

/**
 * 예상 소요 시간을 포맷팅합니다.
 * @param {number} seconds
 * @returns {string}
 */
export function formatEta(seconds) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return "-";
    if (value < 60) return `${Math.ceil(value)}초`;
    if (value < 3600) return `${Math.ceil(value / 60)}분`;
    return `${Math.ceil(value / 3600)}시간`;
}

// ============================================================================
// File & Text Utilities
// ============================================================================

/**
 * 파일을 Data URL 로 읽습니다.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataUrl(file) {
    const { promise, resolve, reject } = Promise.withResolvers();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(t(I18N_KEYS.ERROR_FILE_READ_FAILED)));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
    return promise;
}

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
export function computeStreamDrainCount(bufferedLength) {
    const len = Math.max(0, Math.trunc(Number(bufferedLength) || 0));
    if (len <= 0) return 0;
    if (len > 500) return 20;
    if (len > 100) return 5;
    return Math.min(len, 3);
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

const TRANSFORMERS_GLOBAL_KEY = "__LUCID_TRANSFORMERS_MODULE__";

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

const LUCID_APP_GLOBAL_KEY = "LucidApp";

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
function safeJsonStringify(data) {
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
        console.warn("[Storage] Failed to read storage estimate:", getErrorMessage(error));
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

export const TOAST_MS = {
    SHORT: 1500,
    DEFAULT: 2200,
    LONG: 2800,
    ERROR: 3200,
};

export const STORAGE_KEYS = {
    token: "lucid_hf_token",
    systemPrompt: "lucid_system_prompt",
    maxOutputTokens: "lucid_max_output_tokens",
    contextWindow: "lucid_context_window",
    generationTemperature: "lucid_generation_temperature",
    generationTopP: "lucid_generation_top_p",
    generationPresencePenalty: "lucid_generation_presence_penalty",
    generationMaxLength: "lucid_generation_max_length",
    inferenceDevice: "lucid_inference_device",
    opfsModelManifest: "lucid_opfs_model_manifest",
    lastLoadedSessionFile: "lucid_last_loaded_session_file",
    chatSessions: "lucid_chat_sessions_v1",
    activeChatSessionId: "lucid_active_chat_session_id_v1",
    userProfile: "lucid_user_profile_v1",
    theme: "lucid_theme",
    language: "lucid_language",
    googleDriveClientId: "lucid_google_drive_client_id",
    googleDriveAutoBackup: "lucid_google_drive_auto_backup",
    googleDriveLastSyncAt: "lucid_google_drive_last_sync_at",
    googleDriveBackupLimitMb: "lucid_google_drive_backup_limit_mb",
    updateLastCheckAt: "lucid_update_last_check_at",
    updateLatestRelease: "lucid_update_latest_release",
    updateDismissedVersion: "lucid_update_dismissed_version",
    generationConfigBootstrapByModel: "lucid_generation_config_bootstrap_by_model",
    fontScale: "lucid_font_scale",
    warmupEnabled: "lucid_model_warmup_enabled",
};

// ============================================================================
// OPFS Path & Candidate Utilities
// ============================================================================

/**
 * 모델 ID의 유효성을 검사합니다.
 * @param {string} modelId
 * @returns {boolean}
 */
export function isValidModelId(modelId) {
    return /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(String(modelId ?? ""));
}

/**
 * URL 디코딩을 안전하게 수행합니다.
 * @param {string} value
 * @returns {string}
 */
export function decodeUriComponentSafe(value) {
    try {
        return decodeURIComponent(String(value ?? ""));
    } catch {
        return String(value ?? "");
    }
}

/**
 * Hugging Face 호스트네임인지 확인합니다.
 * @param {string} hostname
 * @returns {boolean}
 */
export function isHfHostName(hostname) {
    const h = String(hostname ?? "").toLowerCase();
    return h === "huggingface.co" || h === "www.huggingface.co" || h === "cdn-lfs.huggingface.co";
}

/**
 * 명시적인 Hugging Face 다운로드 요청인지 확인합니다.
 * @param {string} url
 * @returns {boolean}
 */
export function isExplicitHfDownloadRequest(url) {
    try {
        const parsed = new URL(url);
        return isHfHostName(parsed.hostname) && parsed.searchParams.get("download") === "1";
    } catch {
        return false;
    }
}

/**
 * Hugging Face API 요청인지 확인합니다.
 * @param {string} url
 * @returns {boolean}
 */
export function isHfApiRequest(url) {
    try {
        const parsed = new URL(String(url ?? ""));
        return isHfHostName(parsed.hostname) && parsed.pathname.startsWith("/api/");
    } catch {
        return false;
    }
}

/**
 * HuggingFace resolve URL을 파싱하여 modelId와 filePath를 추출합니다.
 * @param {string} rawUrl
 * @returns {{ modelId: string, filePath: string, revision: string } | null}
 */
export function parseHfResolveUrl(rawUrl) {
    try {
        const parsed = new URL(rawUrl);
        if (!isHfHostName(parsed.hostname)) return null;
        if (parsed.searchParams.get("download") === "1") return null;

        const segments = parsed.pathname
            .split("/")
            .filter(Boolean)
            .map((s) => decodeUriComponentSafe(s));

        const resolveIndex = segments.indexOf("resolve");
        if (resolveIndex < 2 || resolveIndex + 2 >= segments.length) return null;

        const modelId = segments.slice(0, resolveIndex).join("/");
        const revision = segments[resolveIndex + 1] || "main";
        const filePath = normalizeOpfsModelRelativePath(segments.slice(resolveIndex + 2).join("/"));

        if (!modelId || !filePath) return null;
        return { modelId, revision, filePath };
    } catch {
        return null;
    }
}

/**
 * 로컬 모델 요청 URL을 파싱합니다.
 * @param {string} rawUrl
 * @param {string} [baseOrigin] - (선택 사항) 베이스 오리진
 * @returns {{ modelId: string, revision: string, filePath: string, url: string } | null}
 */
export function parseLocalModelRequestUrl(rawUrl, baseOrigin) {
    const text = String(rawUrl ?? "").trim();
    if (!text) return null;

    try {
        const parsed = new URL(text, baseOrigin || (typeof window !== "undefined" ? window.location.origin : undefined));
        const segments = parsed.pathname
            .split("/")
            .filter(Boolean)
            .map((part) => decodeUriComponentSafe(part));

        if (segments.length < 4) return null;
        if (String(segments[0] ?? "").toLowerCase() !== OPFS_MODELS_DIR) {
            return null;
        }

        const modelId = normalizeModelId(`${segments[1] ?? ""}/${segments[2] ?? ""}`);
        if (!isValidModelId(modelId)) {
            return null;
        }

        const filePath = normalizeOpfsModelRelativePath(segments.slice(3).join("/"));
        if (!filePath) {
            return null;
        }

        return {
            modelId,
            revision: "local",
            filePath,
            url: parsed.toString(),
        };
    } catch {
        return null;
    }
}

/**
 * 모델 ID를 정규화합니다.
 * @param {*} raw
 * @returns {string}
 */
export function normalizeModelId(raw) {
    return String(raw ?? "").trim().replace(/^\/+|\/+$/g, "");
}

/**
 * OPFS 모델 상대 경로를 정규화합니다.
 * @param {string} path
 * @returns {string}
 */
export function normalizeOpfsModelRelativePath(path) {
    let value = String(path ?? "").trim();
    if (!value) return "";
    value = value.replace(/\\/g, "/");
    if (!value) return "";

    const segments = value.match(/[^/]+/g) ?? [];
    if (segments.length === 0) return "";

    const result = [];
    for (const s of segments) {
        if (s === "." || s === "..") return "";
        result.push(s);
    }
    return result.join("/");
}

/**
 * ONNX 파일명을 정규화합니다.
 * @param {string} fileName
 * @returns {string}
 */
export function normalizeOnnxFileName(fileName) {
    const value = normalizeOpfsModelRelativePath(fileName);
    if (!value) return "";
    if (!value.toLowerCase().endsWith(".onnx")) return "";
    return value;
}

/**
 * 모델 ID로부터 저장소 프리픽스를 정규화합니다.
 * @param {string} modelId
 * @returns {string}
 */
export function normalizeStoragePrefixFromModelId(modelId) {
    return normalizeModelId(modelId)
        .replaceAll("/", "--")
        .replace(/[^A-Za-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * 모델 번들 디렉토리명을 안전하게 생성합니다.
 * @param {string} modelId
 * @returns {string}
 */
export function toSafeModelBundleDirectoryName(modelId = "") {
    return normalizeStoragePrefixFromModelId(modelId) || "model-bundle";
}

/**
 * 파일명 세그먼트를 안전하게 변환합니다.
 * @param {string} segment
 * @param {string} fallback
 * @returns {string}
 */
export function toSafeModelPathSegment(segment, fallback = "entry") {
    const safe = String(segment ?? "")
        .replace(/[^A-Za-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return safe || fallback;
}

/**
 * 모델 번들 내의 상대 경로를 안전하게 생성합니다.
 * @param {string} sourceFileName
 * @param {string} fallbackFileName
 * @returns {string}
 */
export function toSafeModelBundleRelativePath(sourceFileName, fallbackFileName = "file.bin") {
    const normalized = normalizeOpfsModelRelativePath(sourceFileName);
    const rawSegments = normalized ? normalized.split("/") : [fallbackFileName];
    if (rawSegments.length === 0) {
        return fallbackFileName;
    }
    return rawSegments
        .map((segment, index) => toSafeModelPathSegment(
            segment,
            index === rawSegments.length - 1 ? fallbackFileName : "dir",
        ))
        .join("/");
}

/**
 * 안전한 모델 저장 파일명을 생성합니다.
 * @param {string} sourceFileName
 * @param {string} modelId
 * @returns {string}
 */
export function toSafeModelStorageFileName(sourceFileName, modelId = "") {
    const bundleDir = toSafeModelBundleDirectoryName(modelId);
    const relativePath = toSafeModelBundleRelativePath(sourceFileName, "model.onnx");
    const segments = relativePath.split("/").filter(Boolean);
    if (segments.length === 0) return "";
    const base = segments.at(-1);
    const normalizedBase = base.toLowerCase().endsWith(".onnx")
        ? base
        : `${base.replace(/\.[^.]+$/g, "")}.onnx`;
    segments[segments.length - 1] = normalizedBase ?? "model.onnx";
    const merged = `${bundleDir}/${segments.join("/")}`;
    return normalizeOnnxFileName(merged);
}

/**
 * 안전한 모델 자산 저장 파일명을 생성합니다.
 * @param {string} sourceFileName
 * @param {string} modelId
 * @returns {string}
 */
export function toSafeModelStorageAssetFileName(sourceFileName, modelId = "") {
    const bundleDir = toSafeModelBundleDirectoryName(modelId);
    const relativePath = toSafeModelBundleRelativePath(sourceFileName, "asset.bin");
    const normalized = normalizeOpfsModelRelativePath(`${bundleDir}/${relativePath}`);
    return normalized ?? "";
}

/**
 * HuggingFace resolve 요청에 대한 OPFS 후보 경로들을 생성합니다.
 * @param {{modelId: string, filePath: string}} request
 * @param {string} [activeFileName] - (선택 사항) 현재 활성화된 파일명
 * @returns {string[]}
 */
export function buildOpfsCandidatePaths(request, activeFileName = "", externalDataChunkCount = 0) {
    const candidates = [];
    const sourcePaths = [];
    const addSourcePath = (value) => {
        const normalized = normalizeOpfsModelRelativePath(value);
        if (!normalized) return;
        if (!sourcePaths.includes(normalized)) {
            sourcePaths.push(normalized);
        }
    };
    const addCandidate = (value) => {
        const normalized = normalizeOpfsModelRelativePath(value);
        if (!normalized) return;
        if (!candidates.includes(normalized)) {
            candidates.push(normalized);
        }
    };

    const primarySource = normalizeOpfsModelRelativePath(request?.filePath ?? "");
    if (!primarySource) return [];
    addSourcePath(primarySource);
    if (primarySource.includes("onnx/onnx/")) {
        addSourcePath(primarySource.replace("onnx/onnx/", "onnx/"));
    }
    if (primarySource.startsWith("onnx/")) {
        addSourcePath(primarySource.slice(5));
    }

    const primarySourceLower = primarySource.toLowerCase();

    // Active file is the strongest candidate for ONNX files
    if (primarySourceLower.endsWith(".onnx") && activeFileName) {
        const normalizedActive = normalizeOnnxFileName(activeFileName);
        if (normalizedActive) {
            addCandidate(normalizedActive);
        }
    }

    // Active file is the strongest anchor for external data files (.onnx_data or .onnx.data)
    if (activeFileName && (primarySourceLower.includes(".onnx_data") || primarySourceLower.includes(".onnx.data"))) {
        const normalizedActive = normalizeOnnxFileName(activeFileName);
        if (normalizedActive) {
            const chunkCount = Math.max(0, Math.trunc(Number(externalDataChunkCount ?? 0)));
            const requestShardMatch = primarySourceLower.match(/\.onnx(?:_|\.)data(?:_(\d+))?$/);
            const requestedShard = requestShardMatch?.[1] ? Number(requestShardMatch[1]) : null;
            const addActiveShardCandidates = (index = null) => {
                if (index === null) {
                    addCandidate(`${normalizedActive}_data`);
                    addCandidate(`${normalizedActive}.data`);
                    return;
                }
                addCandidate(`${normalizedActive}_data_${index}`);
                addCandidate(`${normalizedActive}.data_${index}`);
            };

            // Derive sidecar candidates from the exact active ONNX file identity.
            // Example:
            //   model_q4.onnx -> model_q4.onnx_data, model_q4.onnx_data_0, ...
            addActiveShardCandidates(requestedShard);
            if (requestedShard == null) {
                addActiveShardCandidates(null);
                if (chunkCount > 0) {
                    for (let index = 0; index < chunkCount; index += 1) {
                        addActiveShardCandidates(index);
                    }
                } else {
                    // Some repositories store a single sidecar as `_data_0`.
                    addActiveShardCandidates(0);
                }
            }
        }
    }

    const modelId = request.modelId || "";

    for (const sourcePath of sourcePaths) {
        if (sourcePath.toLowerCase().endsWith(".onnx")) {
            addCandidate(toSafeModelStorageFileName(sourcePath, modelId));
            continue;
        }
        addCandidate(toSafeModelStorageAssetFileName(sourcePath, modelId));
    }

    return candidates;
}
