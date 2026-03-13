/**
 * Shared Utilities with i18n dependency
 */

import { t, I18N_KEYS } from "./i18n.js";
import { formatBytes } from "./shared-utils.js";

/**
 * 오류 객체에서 메시지를 추출합니다.
 * @param {*} error
 * @returns {string}
 */
export function getErrorMessage(error) {
    if (error == null) return t(I18N_KEYS.ERROR_UNKNOWN);
    if (typeof error === "string") return error;
    if (typeof error.message === "string") return error.message;
    return String(error);
}

/**
 * 예상 소요 시간을 포맷팅합니다.
 * @param {number} seconds
 * @returns {string}
 */
export function formatEta(seconds) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return "-";
    if (value < 60) return `${Math.ceil(value)}${t(I18N_KEYS.TIME_SECOND)}`;
    if (value < 3600) return `${Math.ceil(value / 60)}${t(I18N_KEYS.TIME_MINUTE)}`;
    return `${Math.ceil(value / 3600)}${t(I18N_KEYS.TIME_HOUR)}`;
}

/**
 * 파일을 Data URL 로 읽습니다.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataUrl(file) {
    const { promise, resolve, reject } = Promise.withResolvers();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(t(I18N_KEYS.ERROR_FILE_READ_FAILED)));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
    return promise;
}
