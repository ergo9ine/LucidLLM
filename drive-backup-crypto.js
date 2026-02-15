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
        throw new Error("이 브라우저는 압축 복원을 지원하지 않습니다.");
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const blob = await new Response(stream).blob();
    return new Uint8Array(await blob.arrayBuffer());
}

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
    const binary = atob(String(value || ""));
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        out[i] = binary.charCodeAt(i);
    }
    return out;
}

async function deriveDriveBackupAesKey(passphrase, saltBytes, iterations) {
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

export async function createBackupUploadText(payload, options = {}) {
    const {
        passphrase = "",
        compress = false,
        kdfIterations = 250000,
    } = options;

    const plainText = JSON.stringify(payload);
    const normalizedPassphrase = String(passphrase || "").trim();
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
    const key = await deriveDriveBackupAesKey(normalizedPassphrase, salt, Math.max(1, Math.trunc(Number(kdfIterations || 1))));
    const cipher = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        bytes,
    );
    const iterations = Math.max(1, Math.trunc(Number(kdfIterations || 1)));
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

export async function parseBackupPayloadFromText(rawText, options = {}) {
    const {
        passphrase = "",
        kdfIterations = 250000,
    } = options;

    const parsed = JSON.parse(String(rawText || ""));
    if (!parsed || parsed.format !== "lucid-backup-envelope.v1" || !parsed.encrypted) {
        return parsed;
    }

    const normalizedPassphrase = String(passphrase || "").trim();
    if (!normalizedPassphrase) {
        throw new Error("암호화된 백업입니다. 백업 암호 문구를 입력하세요.");
    }

    const salt = base64ToBytes(parsed.salt);
    const iv = base64ToBytes(parsed.iv);
    const encrypted = base64ToBytes(parsed.data);
    const fallbackIterations = Math.max(1, Math.trunc(Number(kdfIterations || 1)));
    const parsedIterations = Math.max(1, Math.trunc(Number(parsed?.kdf?.iterations || fallbackIterations)));
    const key = await deriveDriveBackupAesKey(normalizedPassphrase, salt, parsedIterations);
    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted,
    );
    let plainBytes = new Uint8Array(plainBuffer);
    if (String(parsed.compression || "none").toLowerCase() === "gzip") {
        plainBytes = await decompressBytesGzip(plainBytes);
    }
    const plainText = new TextDecoder().decode(plainBytes);
    return JSON.parse(plainText);
}
