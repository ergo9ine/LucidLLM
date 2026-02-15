export function getErrorMessage(error) {
    if (!error) return "알 수 없는 오류";
    if (typeof error === "string") return error;
    if (typeof error.message === "string" && error.message.trim()) return error.message;
    return String(error);
}

export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatBytes(bytes) {
    const size = Number(bytes);
    if (!Number.isFinite(size) || size < 0) return "0 B";
    if (size < 1024) return `${size.toFixed(0)} B`;
    if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 ** 3) return `${(size / (1024 ** 2)).toFixed(2)} MB`;
    return `${(size / (1024 ** 3)).toFixed(2)} GB`;
}

export function formatSpeed(bytesPerSecond) {
    const speed = Number(bytesPerSecond);
    if (!Number.isFinite(speed) || speed <= 0) return "-";
    return `${formatBytes(speed)}/s`;
}

export function formatEta(seconds) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return "-";
    if (value < 60) return `${Math.ceil(value)}초`;
    if (value < 3600) return `${Math.ceil(value / 60)}분`;
    return `${Math.ceil(value / 3600)}시간`;
}

export function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.readAsDataURL(file);
    });
}

export function countApproxTokens(text) {
    const source = String(text ?? "").trim();
    if (!source) return 0;
    const tokens = source.match(/\S+/g);
    return Array.isArray(tokens) ? tokens.length : 0;
}

export function normalizePromptText(value) {
    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");
}

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

export function resolveInferenceBackendChain(preferredDevice, capabilities = {}) {
    const preferred = String(preferredDevice ?? "").trim().toLowerCase();
    const hasWebGpu = capabilities.webgpu === true;
    const hasWebGl = capabilities.webgl === true;
    const hasWasm = capabilities.wasm !== false;

    const supported = new Set();
    if (hasWebGpu) supported.add("webgpu");
    if (hasWebGl) supported.add("webgl");
    if (hasWasm) supported.add("wasm");
    if (supported.size === 0) {
        return ["wasm"];
    }

    let order = ["wasm", "webgl", "webgpu"];
    if (preferred === "webgpu") {
        order = ["webgpu", "webgl", "wasm"];
    } else if (preferred === "webgl") {
        order = ["webgl", "wasm", "webgpu"];
    } else if (preferred === "wasm") {
        order = ["wasm", "webgl", "webgpu"];
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

export function calculatePerformanceDropPercent(baselineDurationMs, loadedDurationMs) {
    const baseline = Number(baselineDurationMs);
    const loaded = Number(loadedDurationMs);
    if (!Number.isFinite(baseline) || baseline <= 0 || !Number.isFinite(loaded) || loaded <= 0) {
        return null;
    }
    if (loaded <= baseline) {
        return 0;
    }
    return ((loaded - baseline) / baseline) * 100;
}
