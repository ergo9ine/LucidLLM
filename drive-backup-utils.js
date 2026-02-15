export function formatBackupFileName(prefix = "backup_", now = new Date()) {
    const safePrefix = String(prefix || "backup_");
    const timestamp = now instanceof Date ? now : new Date(now);
    const pad = (num) => String(num).padStart(2, "0");
    const stamp = `${timestamp.getFullYear()}${pad(timestamp.getMonth() + 1)}${pad(timestamp.getDate())}_${pad(timestamp.getHours())}${pad(timestamp.getMinutes())}${pad(timestamp.getSeconds())}`;
    return `${safePrefix}${stamp}.json`;
}

export function escapeDriveQueryLiteral(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function buildBackupSignature(payload) {
    const sessions = Array.isArray(payload?.chatSessions) ? payload.chatSessions : [];
    const active = String(payload?.activeChatSessionId || "");
    const settings = payload?.settings || {};
    return JSON.stringify({ sessions, active, settings });
}

export function estimateBackupPayloadBytes(payload) {
    try {
        return new Blob([JSON.stringify(payload)]).size;
    } catch (_) {
        return 0;
    }
}
