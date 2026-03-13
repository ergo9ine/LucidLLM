/**
 * Shared Constants Module
 * 이 파일은 어떤 모듈도 import 하지 않습니다 (순환 의존 방지).
 */

// ============================================================================
// OPFS Constants
// ============================================================================

export const OPFS_MODELS_DIR = "models";

// ============================================================================
// Transformers.js Constants
// ============================================================================

export const TRANSFORMERS_JS_VERSION = "4.0.0-next.6";
export const TRANSFORMERS_JS_IMPORT_CANDIDATES = Object.freeze([
    // Prefer the self-hosted bundle so worker/runtime assets stay same-origin.
    `../vendor/transformers/transformers.web.min.js`,
    `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}/+esm`,
    `https://unpkg.com/@huggingface/transformers@${TRANSFORMERS_JS_VERSION}?module`,
]);

// ============================================================================
// Worker Message Types
// ============================================================================

export const WORKER_MSG = Object.freeze({
    INIT: "init",
    GENERATE: "generate",
    WARMUP: "warmup",
    WARMUP_DONE: "warmup_done",
    ABORT: "abort",
    DISPOSE: "dispose",
    INIT_DONE: "init_done",
    INIT_ERROR: "init_error",
    GENERATE_DONE: "generate_done",
    ABORT_ACK: "abort_ack",
    DISPOSE_DONE: "dispose_done",
    TOKEN: "token",
    GENERATION_ABORTED: "generation_aborted",
    TOKEN_ERROR: "token_error",
    ERROR: "error",
    WORKER_ERROR: "worker_error",
});

// ============================================================================
// Service Worker Event Types
// ============================================================================

export const SW_EVENT = Object.freeze({
    SKIP_WAITING: "SKIP_WAITING",
    UPDATE_WAITING: "swUpdateWaiting",
});

// ============================================================================
// Toast Timing Constants
// ============================================================================

export const TOAST_MS = Object.freeze({
    SHORT: 1500,
    DEFAULT: 2200,
    LONG: 2800,
    ERROR: 3200,
});

// ============================================================================
// Storage Keys & Schema
// ============================================================================

export const STORAGE_SCHEMA_VERSION = "v1.1";
export const STORAGE_KEYS = Object.freeze({
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
});

// ============================================================================
// Internal Keys (not for direct use by consumers)
// ============================================================================

export const TRANSFORMERS_GLOBAL_KEY = "__LUCID_TRANSFORMERS_MODULE__";
export const LUCID_APP_GLOBAL_KEY = "LucidApp";

// ============================================================================
// Validation Utils (Dev Only)
// ============================================================================

/**
 * [Lucid] 상수의 정합성을 검증합니다.
 */
export function validateConstants() {
    const checkUniqueness = (obj, name) => {
        const values = Object.values(obj);
        const seen = new Set();
        for (const val of values) {
            if (seen.has(val)) {
                console.error(`[Constants] Duplicate value detected in ${name}: "${val}"`);
                return false;
            }
            seen.add(val);
        }
        return true;
    };

    checkUniqueness(WORKER_MSG, "WORKER_MSG");
    checkUniqueness(STORAGE_KEYS, "STORAGE_KEYS");
}

// 로컬 개발 환경에서 자동 실행
if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.")) {
        validateConstants();
    }
}
