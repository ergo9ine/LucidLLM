const LUCID_APP_GLOBAL_KEY = "LucidApp";

function resolveHost(hostCandidate) {
    if (hostCandidate && (typeof hostCandidate === "object" || typeof hostCandidate === "function")) {
        return hostCandidate;
    }
    return globalThis;
}

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
