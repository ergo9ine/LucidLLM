const TRANSFORMERS_GLOBAL_KEY = "__LUCID_TRANSFORMERS_MODULE__";

export function getInjectedTransformersModule(host = globalThis) {
    return host?.[TRANSFORMERS_GLOBAL_KEY] || null;
}

export function setInjectedTransformersModule(runtimeModule, host = globalThis) {
    host[TRANSFORMERS_GLOBAL_KEY] = runtimeModule;
    return host[TRANSFORMERS_GLOBAL_KEY];
}
