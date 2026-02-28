import {
    detectNavigatorLanguage,
    setCurrentLanguage,
    applyI18nToDOM,
    SUPPORTED_LANGUAGES,
} from "./i18n.js";
import {
    readFromStorage,
    STORAGE_KEYS,
} from "./shared-utils.js";

const MAIN_MODULE_PATH = "./main.js";
const USER_PROFILE_KEY = STORAGE_KEYS.userProfile;
const LANGUAGE_KEY = STORAGE_KEYS.language;

/**
 * 초기 i18n 설정: main.js 로드 전에 기본적인 UI 번역 적용
 */
function initEarlyI18n() {
    const defaultLang = detectNavigatorLanguage();

    // 1. New key (primary)
    let lang = readFromStorage(LANGUAGE_KEY, null, { deserialize: false }).value;

    // 2. Legacy key (fallback)
    if (!lang) {
        lang = readFromStorage(USER_PROFILE_KEY, null, { deserialize: true }).value?.language;
    }

    // 3. Final fallback
    lang = lang || defaultLang;

    // BOOT-4: 지원하지 않는 언어 코드인 경우 기본 언어로 폴백
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
        lang = SUPPORTED_LANGUAGES.includes(defaultLang) ? defaultLang : "ko";
    }

    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    applyI18nToDOM();
}

async function loadMainBundle() {
    try {
        await import(MAIN_MODULE_PATH);
        console.log('[BOOT] Main module loaded');
    } catch (error) {
        console.error("[BOOT] Failed to load main bundle", error);
        // 사용자에게 최소한의 에러 피드백 표시
        const el = document.body;
        if (el) {
            const msg = document.createElement('div');
            msg.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:16px;background:#ef4444;color:#fff;font-family:sans-serif;z-index:9999;text-align:center;';
            msg.textContent = '앱을 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.';
            el.prepend(msg);
        }
    }
}

function bootstrapWithCodeSplitting() {
    // 1. i18n 즉시 초기화
    initEarlyI18n();

    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => loadMainBundle(), { timeout: 300 });
        return;
    }

    window.setTimeout(() => loadMainBundle(), 0);
}

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

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

                newWorker.addEventListener("statechange", () => {
                    if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                        // 새 버전이 설치되었고, 기존 컨트롤러(구버전)가 있는 경우 -> 업데이트 대기 중
                        console.log("[SW] New update available (waiting)");
                        window.dispatchEvent(new CustomEvent("swUpdateWaiting"));
                    }
                });
            });
        }).catch((err) => {
            console.error("[SW] Registration failed:", err);
        });
    });
}

registerServiceWorker();
bootstrapWithCodeSplitting();

