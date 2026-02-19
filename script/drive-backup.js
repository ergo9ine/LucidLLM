/**
 * Drive Backup Module
 * 백업 파일 생성, 암호화, 복호화 및 유틸리티 기능을 제공합니다.
 */

import { t, I18N_KEYS } from "./i18n.js";

// ============================================================================
// Compression Utilities
// ============================================================================

function supportsCompressionStream() {
    return typeof CompressionStream === "function" && typeof DecompressionStream === "function";
}

async function compressBytesGzip(bytes) {
    if (!supportsCompressionStream()) return bytes;
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
    const blob = await new Response(stream).blob();
    return new Uint8Array(await blob.arrayBuffer());
}

async function decompressBytesGzip(bytes) {
    if (!supportsCompressionStream()) {
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
    let binary = "";
    const step = 0x8000;
    for (let i = 0; i < bytes.length; i += step) {
        const chunk = bytes.subarray(i, i + step);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

function base64ToBytes(value) {
    const binary = atob(String(value ?? ""));
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        out[i] = binary.charCodeAt(i);
    }
    return out;
}

// ============================================================================
// Cryptography Utilities
// ============================================================================

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
    if (compress && supportsCompressionStream()) {
        bytes = await compressBytesGzip(bytes);
        compressed = true;
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const iterations = Math.max(1, Math.trunc(Number(kdfIterations || 1)));
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

    const parsed = JSON.parse(String(rawText ?? ""));
    if (!parsed || parsed.format !== "lucid-backup-envelope.v1" || !parsed.encrypted) {
        return parsed;
    }

    const normalizedPassphrase = String(passphrase ?? "").trim();
    if (!normalizedPassphrase) {
        throw new Error(t(I18N_KEYS.ERROR_ENCRYPTED_BACKUP_PASSWORD));
    }

    const salt = base64ToBytes(parsed.salt);
    const iv = base64ToBytes(parsed.iv);
    const encrypted = base64ToBytes(parsed.data);
    const fallbackIterations = Math.max(1, Math.trunc(Number(kdfIterations || 1)));
    const parsedIterations = Math.max(1, Math.trunc(Number(parsed?.kdf?.iterations || fallbackIterations)));
    const key = await deriveBackupAesKey(normalizedPassphrase, salt, parsedIterations);
    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted,
    );
    let plainBytes = new Uint8Array(plainBuffer);
    if (String(parsed.compression ?? "none").toLowerCase() === "gzip") {
        plainBytes = await decompressBytesGzip(plainBytes);
    }
    const plainText = new TextDecoder().decode(plainBytes);
    return JSON.parse(plainText);
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
    const timestamp = now instanceof Date ? now : new Date(now);
    const pad = (num) => String(num).padStart(2, "0");
    const stamp = `${timestamp.getFullYear()}${pad(timestamp.getMonth() + 1)}${pad(timestamp.getDate())}_${pad(timestamp.getHours())}${pad(timestamp.getMinutes())}${pad(timestamp.getSeconds())}`;
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
