/**
 * OPFS & HuggingFace Utilities Module
 * OPFS 파일 관리 및 HuggingFace URL 처리 전용 유틸리티입니다.
 */

import { OPFS_MODELS_DIR } from "./constants.js";

// ============================================================================
// Model ID & Path Normalization
// ============================================================================

/**
 * 모델 ID 의 유효성을 검사합니다.
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
 * HuggingFace resolve URL 을 파싱하여 modelId 와 filePath 를 추출합니다.
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
        // [Lucid] Validate modelId early to prevent malformed paths or traversal attempts
        if (!modelId || !isValidModelId(modelId)) return null;

        const revision = segments[resolveIndex + 1] || "main";
        // [Lucid] Sanitize revision to reject navigation segments or empty strings
        if (!revision || revision === "." || revision === ".." || revision.includes("/")) {
            return null; 
        }

        const filePath = normalizeOpfsModelRelativePath(segments.slice(resolveIndex + 2).join("/"));
        if (!filePath) return null;

        return { modelId, revision, filePath };
    } catch {
        return null;
    }
}

/**
 * 로컬 모델 요청 URL 을 파싱합니다.
 * @param {string} rawUrl
 * @param {string} [baseOrigin] - (선택 사항) 베이스 오리진
 * @returns {{ modelId: string, revision: string, filePath: string, url: string } | null}
 */
export function parseLocalModelRequestUrl(rawUrl, baseOrigin) {
    const text = String(rawUrl ?? "").trim();
    if (!text) return null;

    try {
        // [Lucid] In Workers or SSR, window is undefined. If baseOrigin is also missing,
        // relative URLs cannot be resolved. Handle this early to avoid silent throws.
        const effectiveBase = baseOrigin || (typeof window !== "undefined" ? window.location.origin : undefined);
        if (!effectiveBase && !text.includes("://")) {
            return null;
        }

        const parsed = new URL(text, effectiveBase);
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
 * 모델 ID 를 정규화합니다.
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
 * 모델 ID 로부터 저장소 프리픽스를 정규화합니다.
 * @param {string} modelId
 * @returns {string}
 */
export function normalizeStoragePrefixFromModelId(modelId) {
    const normalized = normalizeModelId(modelId)
        .replaceAll("/", "--")
        .replace(/[^A-Za-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // [Lucid] Cap storage prefix length to avoid extremely long OPFS paths.
    // Deep directory structures or very long model names can hit OS filesystem limits.
    if (normalized.length > 200) {
        return normalized.slice(0, 180) + "-" + normalized.length;
    }
    return normalized;
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
    const lowerBase = base.toLowerCase();
    
    // [Lucid] Preserve existing known model extensions instead of always forcing .onnx
    const isKnownModelExt = lowerBase.endsWith(".onnx") || 
                           lowerBase.endsWith(".bin") || 
                           lowerBase.endsWith(".safetensors") ||
                           lowerBase.endsWith(".pt");
    
    const normalizedBase = isKnownModelExt
        ? base
        : `${base.replace(/\.[^.]+$/g, "")}.onnx`;
    
    segments[segments.length - 1] = normalizedBase ?? "model.onnx";
    const merged = `${bundleDir}/${segments.join("/")}`;
    // Use the generic relative path normalizer since we handled the extension manually
    return normalizeOpfsModelRelativePath(merged);
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

// ============================================================================
// OPFS Candidate Path Generation (C3: Split into 3 helper functions)
// ============================================================================

/**
 * 요청 경로에서 source 경로 후보 Set 을 생성합니다.
 * @param {string} primarySource
 * @returns {Set<string>}
 */
function collectSourcePaths(primarySource) {
    const sourceSet = new Set();
    const addSourcePath = (value) => {
        const normalized = normalizeOpfsModelRelativePath(value);
        if (!normalized) return;
        sourceSet.add(normalized);
    };

    addSourcePath(primarySource);
    
    // [Lucid] Handle common HF CDN / transformers.js model layout quirks.
    // Some older or specific bundles might duplicate "onnx/" in the URL or 
    // hide the primary file behind a nested "onnx/" directory.
    if (primarySource.includes("onnx/onnx/")) {
        addSourcePath(primarySource.replace("onnx/onnx/", "onnx/"));
    }
    if (primarySource.startsWith("onnx/")) {
        addSourcePath(primarySource.slice(5));
    }

    return sourceSet;
}

/**
 * active ONNX 파일과 external data 파일의 shard 후보를 생성합니다.
 * @param {string} primarySourceLower
 * @param {string} normalizedActive
 * @param {number} chunkCount
 * @returns {Set<string>}
 */
function collectShardCandidates(primarySourceLower, normalizedActive, chunkCount) {
    const candidateSet = new Set();
    const addCandidate = (value) => {
        const normalized = normalizeOpfsModelRelativePath(value);
        if (!normalized) return;
        candidateSet.add(normalized);
    };

    if (!normalizedActive) return candidateSet;

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

    return candidateSet;
}

/**
 * source 경로 Set 을 modelId 기반 저장 경로로 변환합니다.
 * @param {Set<string>} sourceSet
 * @param {string} modelId
 * @returns {string[]}
 */
function resolveStoragePaths(sourceSet, modelId) {
    const results = [];
    for (const sourcePath of sourceSet) {
        if (sourcePath.toLowerCase().endsWith(".onnx")) {
            results.push(toSafeModelStorageFileName(sourcePath, modelId));
        } else {
            results.push(toSafeModelStorageAssetFileName(sourcePath, modelId));
        }
    }
    return results;
}

/**
 * HuggingFace resolve 요청에 대한 OPFS 후보 경로들을 생성합니다.
 * @param {{modelId: string, filePath: string}} request
 * @param {string} [activeFileName] - (선택 사항) 현재 활성화된 파일명
 * @param {number} [externalDataChunkCount] - (선택 사항) 외부 데이터 청크 수
 * @returns {string[]}
 */
export function buildOpfsCandidatePaths(request, activeFileName = "", externalDataChunkCount = 0) {
    const candidateSet = new Set();
    const primarySource = normalizeOpfsModelRelativePath(request?.filePath ?? "");
    if (!primarySource) return [];

    // 1. Collect source paths
    const sourceSet = collectSourcePaths(primarySource);

    // 2. Collect shard candidates from active file
    const primarySourceLower = primarySource.toLowerCase();
    const normalizedActive = normalizeOnnxFileName(activeFileName);

    // Active file is the strongest candidate for ONNX files
    if (primarySourceLower.endsWith(".onnx") && normalizedActive) {
        candidateSet.add(normalizedActive);
    }

    // Active file is the strongest anchor for external data files
    if (activeFileName && (primarySourceLower.includes(".onnx_data") || primarySourceLower.includes(".onnx.data"))) {
        // [Lucid] Bound chunkCount to prevent memory/performance issues with massive candidate lists.
        // Hugging Face shards usually stay under 50. Capping at 200 as a safe upper bound.
        const chunkCount = Math.max(0, Math.min(200, Math.trunc(Number(externalDataChunkCount ?? 0))));
        for (const candidate of collectShardCandidates(primarySourceLower, normalizedActive, chunkCount)) {
            candidateSet.add(candidate);
        }
    }

    // 3. Resolve storage paths
    const modelId = request.modelId || "";
    for (const path of resolveStoragePaths(sourceSet, modelId)) {
        candidateSet.add(path);
    }

    return [...candidateSet];
}
