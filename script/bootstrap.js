import {
    detectNavigatorLanguage,
    setCurrentLanguage,
    applyI18nToDOM,
} from "./i18n.js";
import {
    readFromStorage,
} from "./shared-utils.js";

const MAIN_MODULE_PATH = "./main.js";
const USER_PROFILE_KEY = "lucid_user_profile_v1";

/**
 * 초기 i18n 설정: main.js 로드 전에 기본적인 UI 번역 적용
 */
function initEarlyI18n() {
    const defaultLang = detectNavigatorLanguage();
    const result = readFromStorage(USER_PROFILE_KEY, null, { deserialize: true });

    let lang = defaultLang;
    if (result.success && result.value && typeof result.value === "object") {
        lang = result.value.language || defaultLang;
    }

    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    applyI18nToDOM();
}

async function loadMainBundle() {
    try {
        await import(MAIN_MODULE_PATH);
        console.log('모델 파일 로드 완료');
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
    const start = () => {
        void loadMainBundle();
    };

    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(start, { timeout: 1200 });
        return;
    }

    window.setTimeout(start, 0);
}

bootstrapWithCodeSplitting();

