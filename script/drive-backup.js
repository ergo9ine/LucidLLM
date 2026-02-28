/**
 * Drive Backup Module
 * 백업 파일 생성, 암호화, 복호화 및 유틸리티 기능을 제공합니다.
 */

import { t, I18N_KEYS } from "./i18n.js";
import { safeJsonParse } from "./shared-utils.js";

/**
 * Crypto operations timeout wrapper (30s)
 */
async function withCryptoTimeout(promise, timeoutMs = 30000) {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Crypto operation timed out")), timeoutMs);
    });
    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        clearTimeout(timer);
    }
}

// ============================================================================
// Compression Utilities
// ============================================================================

const HAS_COMPRESSION_STREAM = typeof CompressionStream === "function" && typeof DecompressionStream === "function";

async function compressBytesGzip(bytes) {
    if (!HAS_COMPRESSION_STREAM) return bytes;
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
    const blob = await new Response(stream).blob();
    return new Uint8Array(await blob.arrayBuffer());
}

async function decompressBytesGzip(bytes) {
    if (!HAS_COMPRESSION_STREAM) {
        throw new Error(t(I18N_KEYS.ERROR_DECOMPRESSION_UNSUPPORTED));
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const blob = await new Response(stream).blob();
    return new Uint8Array(await blob.arrayBuffer());
}

// ============================================================================
// Encoding Utilities
// ============================================================================

function bytesToBase64(bytes) {
    const step = 0x8000;
    const chunks = [];
    for (let i = 0; i < bytes.length; i += step) {
        chunks.push(String.fromCharCode(...bytes.subarray(i, i + step)));
    }
    return btoa(chunks.join(""));
}

function base64ToBytes(value) {
    const binary = atob(String(value ?? ""));
    let n = binary.length;
    const out = new Uint8Array(n);
    while (n--) {
        out[n] = binary.charCodeAt(n);
    }
    return out;
}

// ============================================================================
// Cryptography Utilities
// ============================================================================

function normalizeKdfIterations(n) {
    // DB-3/DB-5: 최소 100_000, 최대 2_000_000 보장
    return Math.max(100_000, Math.min(2_000_000, Math.trunc(Number(n || 100_000))));
}

async function deriveBackupAesKey(passphrase, saltBytes, iterations) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(passphrase),
        { name: "PBKDF2" },
        false,
        ["deriveKey"],
    );
    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBytes,
            iterations,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
    );
}

// ============================================================================
// Backup Creation & Parsing
// ============================================================================

/**
 * 백업 업로드용 텍스트를 생성합니다.
 * @param {Object} payload - 백업할 데이터
 * @param {Object} options - 옵션 (passphrase, compress, kdfIterations)
 * @returns {Promise<{text: string, encrypted: boolean, compressed: boolean}>}
 */
export async function createBackupUploadText(payload, options = {}) {
    const {
        passphrase = "",
        compress = false,
        kdfIterations = 250000,
    } = options;

    const plainText = JSON.stringify(payload);
    const normalizedPassphrase = String(passphrase ?? "").trim();
    if (!normalizedPassphrase) {
        return {
            text: plainText,
            encrypted: false,
            compressed: false,
        };
    }

    const enc = new TextEncoder();
    let bytes = enc.encode(plainText);
    let compressed = false;
    if (compress && HAS_COMPRESSION_STREAM) {
        bytes = await compressBytesGzip(bytes);
        compressed = true;
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const iterations = normalizeKdfIterations(kdfIterations);
    const key = await deriveBackupAesKey(normalizedPassphrase, salt, iterations);
    const cipher = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        bytes,
    );

    const envelope = {
        format: "lucid-backup-envelope.v1",
        encrypted: true,
        algorithm: "AES-GCM-256",
        kdf: {
            name: "PBKDF2",
            hash: "SHA-256",
            iterations,
        },
        compression: compressed ? "gzip" : "none",
        salt: bytesToBase64(salt),
        iv: bytesToBase64(iv),
        data: bytesToBase64(new Uint8Array(cipher)),
    };
    return {
        text: JSON.stringify(envelope),
        encrypted: true,
        compressed,
    };
}

/**
 * 백업 텍스트를 파싱하여 원본 payload 를 복원합니다.
 * @param {string} rawText - 백업 텍스트
 * @param {Object} options - 옵션 (passphrase, kdfIterations)
 * @returns {Promise<Object>}
 */
export async function parseBackupPayloadFromText(rawText, options = {}) {
    const {
        passphrase = "",
        kdfIterations = 250000,
    } = options;

    const parsedResult = safeJsonParse(String(rawText ?? ""));
    if (!parsedResult.success) {
        throw new Error(`${t(I18N_KEYS.ERROR_BACKUP_FORMAT_INVALID)}: ${parsedResult.error ?? "invalid json"}`);
    }
    const parsed = parsedResult.value;
    if (!parsed || parsed.format !== "lucid-backup-envelope.v1" || !parsed.encrypted) {
        // DB-1: 미인식 포맷 시 에러 throw
        if (parsed && parsed.format && parsed.format !== "lucid-backup-envelope.v1") {
            throw new Error(`${t(I18N_KEYS.ERROR_BACKUP_FORMAT_INVALID)}: unknown format '${parsed.format}'`);
        }
        return parsed;
    }

    const normalizedPassphrase = String(passphrase ?? "").trim();
    if (!normalizedPassphrase) {
        throw new Error(t(I18N_KEYS.ERROR_ENCRYPTED_BACKUP_PASSWORD));
    }

    if (!parsed.salt || !parsed.iv || !parsed.data) {
        throw new Error(t(I18N_KEYS.ERROR_BACKUP_FORMAT_INVALID));
    }

    let salt;
    let iv;
    let encrypted;
    try {
        salt = base64ToBytes(parsed.salt);
        iv = base64ToBytes(parsed.iv);
        encrypted = base64ToBytes(parsed.data);
    } catch {
        throw new Error(`${t(I18N_KEYS.ERROR_BACKUP_FORMAT_INVALID)}: invalid base64`);
    }
    const parsedIterations = normalizeKdfIterations(parsed?.kdf?.iterations ?? kdfIterations);
    const key = await deriveBackupAesKey(normalizedPassphrase, salt, parsedIterations);

    let plainBuffer;
    try {
        // DB-1: Add timeout to prevent indefinite hang in some browsers
        plainBuffer = await withCryptoTimeout(crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            encrypted,
        ));
    } catch (error) {
        // DB-2: Catch OperationError (wrong password) or timeout
        if (error.name === "OperationError" || error.message.includes("Crypto")) {
            throw new Error(`${t(I18N_KEYS.ERROR_BACKUP_FORMAT_INVALID)}: ${t(I18N_KEYS.ERROR_ENCRYPTED_BACKUP_PASSWORD)} (or file corrupted)`);
        }
        throw error;
    }

    let plainBytes = new Uint8Array(plainBuffer);
    if (String(parsed.compression ?? "none").toLowerCase() === "gzip") {
        // DB-2: 압축 비지원 브라우저에서 명확한 에러 메시지
        if (!HAS_COMPRESSION_STREAM) {
            throw new Error(`${t(I18N_KEYS.ERROR_BACKUP_FORMAT_INVALID)}: gzip compression not supported in this browser`);
        }
        plainBytes = await decompressBytesGzip(plainBytes);
    }
    const plainText = new TextDecoder("utf-8", { fatal: true }).decode(plainBytes);
    try {
        return JSON.parse(plainText);
    } catch {
        throw new Error(`${t(I18N_KEYS.ERROR_BACKUP_FORMAT_INVALID)}: decrypted content is not valid JSON`);
    }
}

// ============================================================================
// File Name & Query Utilities
// ============================================================================

/**
 * 백업 파일명을 생성합니다.
 * @param {string} prefix - 파일명 접두사
 * @param {Date|number|string} now - 날짜 (기본값: 현재 시각)
 * @returns {string}
 */
export function formatBackupFileName(prefix = "backup_", now = new Date()) {
    const safePrefix = String(prefix ?? "backup_");
    const d = now instanceof Date ? now : new Date(now);
    // toISOString(): YYYY-MM-DDTHH:mm:ss.sssZ -> YYYYMMDD_HHmmss
    const stamp = d.toISOString().replace(/[-:T]/g, "").slice(0, 14).replace(/(\d{8})(\d{6})/, "$1_$2");
    return `${safePrefix}${stamp}.json`;
}

/**
 * Drive 쿼리용 리터럴 값을 이스케이프합니다.
 * @param {string} value
 * @returns {string}
 */
export function escapeDriveQueryLiteral(value) {
    return String(value ?? "").replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

// ============================================================================
// Payload Utilities
// ============================================================================

/**
 * 백업 서명용 데이터를 생성합니다.
 * @param {Object} payload
 * @returns {string}
 */
export function buildBackupSignature(payload) {
    const sessions = Array.isArray(payload?.chatSessions) ? payload.chatSessions : [];
    const active = String(payload?.activeChatSessionId ?? "");
    const settings = payload?.settings || {};
    return JSON.stringify({ sessions, active, settings });
}

/**
 * 백업 payload 의 바이트 크기를 추정합니다.
 * @param {Object} payload
 * @returns {number}
 */
export function estimateBackupPayloadBytes(payload) {
    try {
        return new Blob([JSON.stringify(payload)]).size;
    } catch {
        return 0;
    }
}
