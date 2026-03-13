import {
    detectNavigatorLanguage,
    setCurrentLanguage,
    applyI18nToDOM,
    SUPPORTED_LANGUAGES,
} from "./i18n.js";
import {
    readFromStorage,
} from "./shared-utils.js";
import {
    STORAGE_KEYS,
} from "./constants.js";

const MAIN_MODULE_PATH = "./main.js";
const USER_PROFILE_KEY = STORAGE_KEYS.userProfile;
const LANGUAGE_KEY = STORAGE_KEYS.language;

/**
 * 초기 i18n 설정: main.js 로드 전에 기본적인 UI 번역 적용
 */
function initEarlyI18n() {
    if (typeof document === "undefined") return;

    const defaultLang = detectNavigatorLanguage();
    
    // [Lucid] Read storage once if possible. 
    // Usually language and userProfile are separate keys, but we can fetch them sequentially.
    const storedLang = readFromStorage(LANGUAGE_KEY, null, { deserialize: false }).value;
    const profile = storedLang ? null : readFromStorage(USER_PROFILE_KEY, null, { deserialize: true }).value;
    
    const rawLang = storedLang || profile?.language || defaultLang;
    
    // [Lucid] Align fallback with i18n core (en)
    const lang = SUPPORTED_LANGUAGES.includes(rawLang) ? rawLang
        : (SUPPORTED_LANGUAGES.includes(defaultLang) ? defaultLang : "en");

    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    applyI18nToDOM();
}

async function loadMainBundle(retryCount = 0) {
    try {
        await import(MAIN_MODULE_PATH);
        console.log('[BOOT] Main module loaded');
    } catch (error) {
        if (retryCount < 2) {
            console.warn(`[BOOT] Main bundle load failed, retrying... (${retryCount + 1})`);
            setTimeout(() => loadMainBundle(retryCount + 1), 500);
            return;
        }

        console.error("[BOOT] Failed to load main bundle", error);
        
        if (typeof document === "undefined") return;
        
        // [Lucid] Minimal bilingual error UI for critical failure
        const errorHtml = `
            <div id="boot-error-banner" style="position:fixed;top:0;left:0;right:0;padding:16px;background:#ef4444;color:#fff;font-family:sans-serif;z-index:9999;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.2)">
                <div style="font-weight:bold;margin-bottom:4px">Failed to load application. / 앱 로드 실패</div>
                <button onclick="location.reload()" style="background:#fff;color:#ef4444;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-weight:bold">Retry / 새로고침</button>
            </div>
        `;
        document.body?.insertAdjacentHTML('afterbegin', errorHtml);
    }
}

function bootstrapWithCodeSplitting() {
    // 1. i18n 즉시 초기화
    initEarlyI18n();

    // [Lucid] Use requestAnimationFrame for the first load to ensure it starts 
    // as soon as the main thread handles the first layout, improving time-to-interactive.
    if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => loadMainBundle());
        return;
    }

    window.setTimeout(() => loadMainBundle(), 0);
}

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    
    // [Lucid] Broaden dev hostname check for local/LAN environments
    const isDev = location.hostname === "127.0.0.1" || 
                  location.hostname === "localhost" || 
                  location.hostname === "0.0.0.0" || 
                  location.hostname.startsWith("192.168.");

    if (isDev) {
        console.log("[SW] Registration skipped on local development environment.");
        // Unregister any existing service workers on development origins to avoid interference
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (const registration of registrations) {
                registration.unregister();
            }
        });
        return;
    }

    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then((reg) => {
            console.log("[SW] Registered with scope:", reg.scope);

            // 이미 대기 중인 SW가 있다면 이벤트 발생
            if (reg.waiting) {
                window.dispatchEvent(new CustomEvent("swUpdateWaiting"));
            }

            // 새로운 SW 발견 시
            reg.addEventListener("updatefound", () => {
                const newWorker = reg.installing;
                if (!newWorker) return;
                const checkInstalled = () => {
                    if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                        console.log("[SW] New update available (waiting)");
                        window.dispatchEvent(new CustomEvent("swUpdateWaiting"));
                    }
                };
                newWorker.addEventListener("statechange", checkInstalled);
                checkInstalled();
            });
        }).catch((err) => {
            console.error("[SW] Registration failed:", err);
        });
    });
}

registerServiceWorker();
bootstrapWithCodeSplitting();

