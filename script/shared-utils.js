/**
 * Shared Utilities & Global API Module
 * 공통 유틸리티 함수와 전역 API 노출 기능을 제공합니다.
 */

// ============================================================================
// Error & HTML Utilities
// ============================================================================

/**
 * 오류 객체에서 메시지를 추출합니다.
 * @param {*} error
 * @returns {string}
 */
export function getErrorMessage(error) {
    if (!error) return "알 수 없는 오류";
    if (typeof error === "string") return error;
    if (typeof error.message === "string" && error.message.trim()) return error.message;
    return String(error);
}

/**
 * HTML 특수 문자를 이스케이프합니다.
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
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
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.readAsDataURL(file);
    });
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
    for (let i = 0; i < s.length; i++) {
        const code = s.charCodeAt(i);
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
    const base = Math.max(0, Number(baseDelayMs) ?? 0);
    const step = Math.max(1, Math.trunc(Number(attempt) || 1));
    const maxDelay = Number.isFinite(Number(options.maxDelayMs))
        ? Math.max(0, Number(options.maxDelayMs))
        : Number.POSITIVE_INFINITY;
    const raw = base * (2 ** Math.max(0, step - 1));
    const bounded = Math.min(raw, maxDelay);
    return Math.max(0, Math.trunc(bounded));
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

    try {
        const parsed = new URL(text, "https://example.com");
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
    } catch (_) {
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

    const supported = new Set();
    if (hasWebGpu) supported.add("webgpu");
    if (hasWasm) supported.add("wasm");
    if (supported.size === 0) {
        return ["wasm"];
    }

    let order = ["wasm", "webgpu"];
    if (preferred === "webgpu") {
        order = ["webgpu", "wasm"];
    } else if (preferred === "wasm") {
        order = ["wasm", "webgpu"];
    }

    const deduped = [];
    for (const device of order) {
        if (!supported.has(device)) continue;
        if (deduped.includes(device)) continue;
        deduped.push(device);
    }
    if (!deduped.includes("wasm") && supported.has("wasm")) {
        deduped.push("wasm");
    }
    return deduped.length > 0 ? deduped : ["wasm"];
}

// ============================================================================
// Streaming Utilities
// ============================================================================

/**
 * 빔 서치/생성 결과에서 토큰 ID 배열을 추출합니다.
 * Transformers.js 의 다양한 출력 형식을 지원합니다.
 * @param {*} payload
 * @returns {number[]}
 */
export function extractTokenIdsFromBeamPayload(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) {
        const first = payload[0];
        if (first && typeof first === "object" && Array.isArray(first.output_token_ids)) {
            return first.output_token_ids;
        }
        if (Array.isArray(first)) {
            return first;
        }
    }
    if (payload && typeof payload === "object") {
        if (Array.isArray(payload.output_token_ids)) return payload.output_token_ids;
        if (Array.isArray(payload.token_ids)) return payload.token_ids;
        if (Array.isArray(payload.ids)) return payload.ids;
    }
    return [];
}

/**
 * 누적 디코딩된 텍스트에서 이전 텍스트 대비 새로 생성된 델타를 계산합니다.
 * @param {string} decoded - 현재까지 누적 디코딩된 전체 텍스트
 * @param {string} previousText - 이전 단계까지의 텍스트
 * @returns {{ delta: string, fullText: string }}
 */
export function computeStreamTokenDelta(decoded, previousText) {
    const prev = String(previousText ?? "");
    const current = String(decoded ?? "");
    if (!current) return { delta: "", fullText: prev };
    const delta = current.startsWith(prev) ? current.slice(prev.length) : current;
    return { delta, fullText: current };
}

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
    return 1;
}

/**
 * 토큰 생성 속도를 계산합니다 (tokens per second).
 * @param {number} totalTokens
 * @param {number} startedAtMs - 생성 시작 시각 (밀리초)
 * @param {number} nowMs - 현재 시각 (밀리초)
 * @returns {number}
 */
export function computeTokensPerSecond(totalTokens, startedAtMs, nowMs) {
    if (!startedAtMs || totalTokens <= 0) return 0;
    const elapsedSec = Math.max((nowMs - startedAtMs) / 1000, 0.001);
    return totalTokens / elapsedSec;
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
