/**
 * Shared Utilities & Global API Module
 * 공통 유틸리티 함수와 전역 API 노출 기능을 제공합니다.
 */

import { t, I18N_KEYS } from "./i18n.js";

// ============================================================================
// Constants
// ============================================================================

export const OPFS_MODELS_DIR = "models";

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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
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

    if (current.startsWith(prev)) {
        // 정상적인 성장: 이전 텍스트 이후의 새로운 부분만 delta로 반환
        return { delta: current.slice(prev.length), fullText: current };
    }

    // 텍스트 후퇴: current가 prev보다 짧아진 경우 (빔 재평가 등)
    if (prev.startsWith(current)) {
        return { delta: "", fullText: current };
    }

    // 완전히 다른 텍스트: current 전체를 delta로 (스트림 리셋과 유사)
    return { delta: current, fullText: current };
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
    if (!text || typeof text !== "string") {
        return { success: false, value: defaultValue, error: "Input is not a string" };
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
        if (!raw) {
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
        if (value === null || value === undefined) {
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
            stringValue = String(value);
        }
        
        localStorage.setItem(key, stringValue);
        return { success: true, error: null };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMsg };
    }
}

/**
 * LocalStorage에서 JSON 객체를 읽고 검증합니다.
 * @param {string} key
 * @param {Function} validator - (value: any) => boolean
 * @param {*} defaultValue
 * @returns {*}
 */
export function readStorageWithValidation(key, validator, defaultValue = null) {
    const result = readFromStorage(key, null, { deserialize: true });
    if (!result.success || result.value === null) {
        return defaultValue;
    }
    try {
        if (typeof validator === "function" && !validator(result.value)) {
            return defaultValue;
        }
        return result.value;
    } catch {
        return defaultValue;
    }
}

// ============================================================================
// Event Binding Utilities
// ============================================================================

/**
 * 여러 이벤트 리스너를 일괄 등록합니다.
 * @param {{element: HTMLElement, event: string, handler: Function}[]} bindings
 * @returns {Function} - 등록된 모든 리스너를 제거하는 함수
 */
/**
 * 브라우저 저장소 할당량 정보를 조회합니다.
 * @returns {Promise<{quota: number, usage: number}>}
 */
export async function getStorageEstimate() {
    try {
        const est = await (navigator.storage?.estimate
            ? navigator.storage.estimate()
            : Promise.resolve({ quota: 0, usage: 0 }));
        return { quota: est.quota ?? 0, usage: est.usage ?? 0 };
    } catch {
        return { quota: 0, usage: 0 };
    }
}

export function bindMultipleEvents(bindings) {
    const handlers = [];
    
    for (const binding of bindings) {
        const { element, event, handler } = binding;
        if (!element || typeof event !== "string" || typeof handler !== "function") {
            continue;
        }
        element.addEventListener(event, handler);
        handlers.push({ element, event, handler });
    }
    
    // 정리 함수 반환
    return () => {
        for (const { element, event, handler } of handlers) {
            element.removeEventListener(event, handler);
        }
    };
}

/**
 * 이벤트 위임을 설정합니다 (event delegation).
 * @param {HTMLElement} container
 * @param {string} event - 이벤트 타입
 * @param {string} selector - CSS 선택자
 * @param {Function} handler - (event, element) => void
 * @returns {Function} - 리스너를 제거하는 함수
 */
export function setupEventDelegation(container, event, selector, handler) {
    if (!container) return () => {};
    
    const delegateHandler = (e) => {
        const target = e.target;
        if (target && typeof target.closest === "function") {
            const element = target.closest(selector);
            if (element && container.contains(element)) {
                handler(e, element);
            }
        }
    };
    
    container.addEventListener(event, delegateHandler);
    
    return () => {
        container.removeEventListener(event, delegateHandler);
    };
}

/**
 * 특정 조건이 만족될 때까지만 이벤트를 처리합니다.
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} handler
 * @param {Function} predicate - () => boolean
 * @returns {Function} - 리스너를 제거하는 함수
 */
export function bindConditionalEvent(element, event, handler, predicate) {
    if (!element) return () => {};
    
    const conditionalHandler = (e) => {
        if (typeof predicate === "function" && predicate()) {
            handler(e);
        }
    };
    
    element.addEventListener(event, conditionalHandler);
    
    return () => {
        element.removeEventListener(event, conditionalHandler);
    };
}

// ============================================================================
// Normalization & Validation Utilities (Enhanced)
// ============================================================================

/**
 * 여러 문자열 정규화기를 조합합니다.
 * @param {Array<Function>} normalizers
 * @returns {Function}
 */
export function composeNormalizers(...normalizers) {
    return (value) => {
        let result = value;
        for (const normalizer of normalizers) {
            if (typeof normalizer === "function") {
                result = normalizer(result);
            }
        }
        return result;
    };
}

/**
 * 범위 내 값으로 제한합니다.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) return Number.isFinite(min) ? min : 0;
    return Math.max(min, Math.min(max, num));
}

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


// ============================================================================
// GPU/VRAM Utilities
// ============================================================================

/**
 * GPU 메모리 정보를 수집합니다.
 * WebGPU API를 사용하여 GPU 메모리 정보를 조회합니다.
 * @returns {Promise<{available: number, maxSize: number, adapter: string}>}
 */
export async function getGPUMemoryInfo() {
    try {
        if (!navigator.gpu) {
            return {
                available: 0,
                maxSize: 0,
                adapter: "WebGPU 미지원",
                error: "WebGPU not available"
            };
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            return {
                available: 0,
                maxSize: 0,
                adapter: "GPU 어댑터 없음",
                error: "No GPU adapter"
            };
        }

        // WebGPU에서 직접 메모리 용량을 가져올 수는 없지만,
        // 일반적인 GPU 메모리 크기를 추정할 수 있습니다
        const info = adapter.limits || {};
        const maxBufferSize = info.maxBufferSize || 0;
        const maxStorageBufferBindingSize = info.maxStorageBufferBindingSize || 0;

        const adapterInfo = await adapter.requestAdapterInfo?.() || {};
        const vendor = adapterInfo.vendor || "Unknown";
        const architecture = adapterInfo.architecture || "";

        return {
            available: maxStorageBufferBindingSize,
            maxSize: maxBufferSize,
            vendor,
            architecture,
            adapter: `${vendor} ${architecture}`.trim() || "WebGPU"
        };
    } catch (error) {
        return {
            available: 0,
            maxSize: 0,
            adapter: "GPU 정보 조회 실패",
            error: getErrorMessage(error)
        };
    }
}

/**
 * WebGL을 사용하여 GPU 정보를 수집합니다.
 * @returns {{vendor: string, renderer: string, version: string}}
 */
export function getWebGLInfo() {
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

        if (!gl) {
            return {
                vendor: "WebGL 미지원",
                renderer: "-",
                version: "-"
            };
        }

        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        const vendor = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            : gl.getParameter(gl.VENDOR);
        const renderer = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER);
        const version = gl.getParameter(gl.VERSION);

        return { vendor, renderer, version };
    } catch (error) {
        return {
            vendor: "WebGL 정보 조회 실패",
            renderer: "-",
            version: "-"
        };
    }
}

/**
 * 시스템 GPU 정보를 포맷팅합니다.
 * @param {{vendor: string, renderer: string, version: string}} glInfo
 * @returns {string}
 */
export function formatGPUInfo(glInfo) {
    if (!glInfo) return "GPU 정보 없음";

    const parts = [];
    if (glInfo.vendor) parts.push(glInfo.vendor);
    if (glInfo.renderer && glInfo.renderer !== "-") {
        // Render 정보가 너무 길면 간단히 함
        const shortRenderer = glInfo.renderer.split(/\s+/).slice(0, 3).join(" ");
        parts.push(shortRenderer);
    }

    return parts.length > 0 ? parts.join(" - ") : "GPU 정보 없음";
}

/**
 * VRAM 사용량 추정 (브라우저 제약으로 인한 추정값)
 * @returns {Promise<{used: number, estimate: number, unit: string}>}
 */
export async function estimateVRAMUsage() {
    try {
        // 현재 성능 메트릭에서 추정
        // 실제 VRAM은 WebGL/WebGPU 렌더링으로 인한 메모리 사용량
        const perfMemory = performance.memory;
        
        // JavaScript 힙 메모리의 일부를 GPU 메모리 추정으로 사용
        // 이는 정확하지 않지만 참고 정보로 제공
        let estimatedGPUMB = 0;

        if (perfMemory) {
            // 일반적으로 JS 힙의 20-30%가 GPU 메모리로 사용되는 것으로 추정
            estimatedGPUMB = (perfMemory.usedJSHeapSize * 0.25) / (1024 * 1024);
        }

        // WebGPU 정보 추가
        const gpuInfo = await getGPUMemoryInfo();
        if (gpuInfo.maxSize > 0) {
            // 더 정확한 GPU 메모리 정보 사용
            estimatedGPUMB = Math.max(estimatedGPUMB, gpuInfo.available / (1024 * 1024));
        }

        return {
            used: estimatedGPUMB,
            estimate: Math.max(512, estimatedGPUMB * 2), // 보수적 추정
            unit: "MB"
        };
    } catch (error) {
        return {
            used: 0,
            estimate: 0,
            unit: "MB",
            error: getErrorMessage(error)
        };
    }
}

/**
 * 메모리 및 VRAM 사용량을 통합 포맷팅합니다.
 * @returns {Promise<{cpu: string, gpu: string, timestamp: number}>}
 */
export async function getMemoryStats() {
    const cpuStats = {
        used: 0,
        total: 0
    };

    // CPU 메모리
    if (performance && performance.memory) {
        cpuStats.used = performance.memory.usedJSHeapSize / (1024 * 1024);
        cpuStats.total = performance.memory.totalJSHeapSize / (1024 * 1024);
    }

    // GPU 메모리
    const gpuStats = await estimateVRAMUsage();

    return {
        cpu: cpuStats.total > 0
            ? `JS Heap: ${cpuStats.used.toFixed(1)} / ${cpuStats.total.toFixed(1)} MB`
            : "JS Heap: - MB",
        gpu: gpuStats.estimate > 0
            ? `VRAM: ~${gpuStats.used.toFixed(1)} MB (est.)`
            : "VRAM: - MB",
        timestamp: Date.now()
    };
}
