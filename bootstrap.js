import {
    detectNavigatorLanguage,
    setCurrentLanguage,
    applyI18nToDOM,
} from "./i18n.js";

const MAIN_MODULE_PATH = "./main.js";
const SERVICE_WORKER_PATH = "./sw.js";
const USER_PROFILE_KEY = "lucid_user_profile_v1";

/**
 * 초기 i18n 설정: main.js 로드 전에 기본적인 UI 번역을 적용합니다.
 */
function initEarlyI18n() {
    let lang = "en";
    try {
        const stored = localStorage.getItem(USER_PROFILE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            lang = parsed.language || detectNavigatorLanguage();
        } else {
            lang = detectNavigatorLanguage();
        }
    } catch (error) {
        lang = detectNavigatorLanguage();
    }

    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    applyI18nToDOM();
}

async function loadMainBundle() {
    try {
        await import(MAIN_MODULE_PATH);
    } catch (error) {
        console.error("[BOOT] Failed to load main bundle", error);
    }
}

function isLocalhostHost(hostname) {
    const host = String(hostname ?? "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    const secure = window.isSecureContext || isLocalhostHost(window.location.hostname);
    if (!secure) {
        console.info("[BOOT] Service worker skipped: insecure context");
        return;
    }
    try {
        await navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: "./" });
        console.info("[BOOT] Service worker registered");
    } catch (error) {
        console.warn("[BOOT] Service worker registration failed", error);
    }
}

function bootstrapWithCodeSplitting() {
    // 1. i18n 즉시 초기화
    initEarlyI18n();

    const start = () => {
        void loadMainBundle();
        void registerServiceWorker();
    };

    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(start, { timeout: 1200 });
        return;
    }

    window.setTimeout(start, 0);
}

bootstrapWithCodeSplitting();
