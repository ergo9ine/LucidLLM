
const TRANSFORMERS_JS_VERSION = "3.8.1";
const TRANSFORMERS_JS_IMPORT_CANDIDATES = [
    `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}/+esm`,
    `https://unpkg.com/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}?module`,
];

let transformersModule = null;
const pipelines = new Map();

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
                env.allowLocalModels = false; // Worker doesn't need local file access usually, but let's check
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

function getPipelineFactory(mod) {
    return mod.pipeline || mod.default?.pipeline;
}

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

function extractTokenIdsFromGenerationBeamPayload(payload) {
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

async function handleGenerate(id, data) {
    const { key, prompt, options } = data;
    const pipe = pipelines.get(key);

    if (!pipe) {
        throw new Error(`Pipeline not found for key: ${key}`);
    }

    let streamedText = "";
    let lastTokenCount = 0;
    const callback_function = (beamPayload) => {
        try {
            const tokenIds = extractTokenIdsFromGenerationBeamPayload(beamPayload);
            if (!Array.isArray(tokenIds) || tokenIds.length === 0) return;

            const currentTokenCount = tokenIds.length;
            const tokenIncrement = Math.max(0, currentTokenCount - lastTokenCount);
            lastTokenCount = currentTokenCount;

            // Decode in worker
            if (pipe.tokenizer && typeof pipe.tokenizer.decode === "function") {
                const decoded = pipe.tokenizer.decode(tokenIds, { skip_special_tokens: true });

                let delta = "";
                if (decoded.startsWith(streamedText)) {
                    delta = decoded.slice(streamedText.length);
                } else {
                    delta = decoded;
                }
                streamedText = decoded;

                if (delta || tokenIncrement > 0) {
                    self.postMessage({
                        type: 'token',
                        id,
                        token: delta,
                        tokenIncrement
                    });
                }
            }
        } catch (e) {
            console.error("[Worker] Token decode error", e);
        }
    };

    const generateOptions = {
        ...options,
        callback_function
    };

    const output = await pipe(prompt, generateOptions);

    // Serialize output if necessary, or just send back text
    // We usually want the full output object/array
    self.postMessage({
        type: 'generate_done',
        id,
        output
    });
}

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
