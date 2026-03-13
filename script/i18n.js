import { I18N_KEYS, SUPPORTED_LANGUAGES } from "./i18n-keys.js";
import { KO_SPECIFIC } from "./locales/ko.js";
import { EN_SPECIFIC } from "./locales/en.js";
import { JA_DICT } from "./locales/ja.js";
import { ZH_CN_DICT } from "./locales/zh-CN.js";

// Re-export for backward compatibility
export { I18N_KEYS, SUPPORTED_LANGUAGES };

/* ─── 타입 정의 ─── */
/**
 * @typedef {typeof I18N_KEYS[keyof typeof I18N_KEYS]} I18nKey
 */

/* ─── 버전 관리 ─── */
// main.js 에서 설정하는 버전 문자열
let _appVersion = "Version-Pre-AT";

/**
 * 앱 버전을 설정합니다. main.js 에서 호출합니다.
 * @param {string} version
 */
export function setAppVersion(version) {
    _appVersion = version;
}

/* ─── 번역 사전 (정적 구성) ─── */

// 공통 키 (모든 언어에서 동일)
const COMMON_STATIC = Object.freeze({
    [I18N_KEYS.HEADER_DEVICE_WEBGPU]: "⚡ WebGPU",
    [I18N_KEYS.HEADER_DEVICE_WASM]: "🧩 CPU (WASM)",
    [I18N_KEYS.CHAT_LABEL_LUCID]: "Lucid Chat",
    [I18N_KEYS.CHAT_META_YOU]: "YOU",
    [I18N_KEYS.CHAT_META_ASSISTANT]: "ASSISTANT",
    [I18N_KEYS.PROFILE_CHIP_DEFAULT_NAME]: "YOU",
    [I18N_KEYS.OPFS_BTN_MODELS]: "/models",
    [I18N_KEYS.LLM_GENERATION_TEMPERATURE]: "temperature",
    [I18N_KEYS.LLM_GENERATION_TOP_P]: "top_p",
    [I18N_KEYS.LLM_GENERATION_PRESENCE_PENALTY]: "presence penalty",
    [I18N_KEYS.THEME_DARK]: "Dark",
    [I18N_KEYS.THEME_LIGHT]: "Light",
    [I18N_KEYS.THEME_OLED]: "OLED Black",
    [I18N_KEYS.THEME_HIGH_CONTRAST]: "High Contrast",
    [I18N_KEYS.INFERENCE_DEVICE_WEBGPU]: "WebGPU",
    [I18N_KEYS.INFERENCE_DEVICE_WASM]: "WASM",
    [I18N_KEYS.HTML_TITLE]: "LucidLLM Chat",
    [I18N_KEYS.LLM_TOP_K]: "top_k",
    [I18N_KEYS.LLM_REPEAT_PENALTY]: "repeat_penalty",
    [I18N_KEYS.PROFILE_VERSION_LABEL]: "v{appVersion}",
    [I18N_KEYS.CHAT_DISCLAIMER]: "LucidLLM can make mistakes. Check important info.",
    [I18N_KEYS.UPDATE_BADGE_LABEL]: "Update",
    [I18N_KEYS.UPDATE_MODAL_TITLE]: "Update {version} ({date})",
    [I18N_KEYS.UPDATE_MODAL_APPLY]: "Apply Update (Reload Page)",
    [I18N_KEYS.UPDATE_MODAL_LATER]: "Later",
    [I18N_KEYS.UPDATE_MODAL_RELEASE_NOTES]: "Release Notes",
    [I18N_KEYS.UPDATE_MODAL_VIEW_GITHUB]: "View on GitHub →",
    [I18N_KEYS.UPDATE_TOAST_NEW_VERSION]: "New version {version} is ready.",
    [I18N_KEYS.UPDATE_TOAST_APPLYING]: "Applying update...",
    [I18N_KEYS.TIME_SECOND]: "s",
    [I18N_KEYS.TIME_MINUTE]: "m",
    [I18N_KEYS.TIME_HOUR]: "h",
});

// 초기 사전을 구성합니다.
// 각 언어별 사전은 별도의 파일에서 import 됩니다
const DICTIONARIES = {
    ko: Object.freeze({ ...COMMON_STATIC, ...KO_SPECIFIC }),
    en: Object.freeze({ ...COMMON_STATIC, ...EN_SPECIFIC }),
    ja: Object.freeze({ ...COMMON_STATIC, ...JA_DICT }),
    "zh-CN": Object.freeze({ ...COMMON_STATIC, ...ZH_CN_DICT }),
};

/* ─── 인터폴레이션 함수 ─── */

const INTERPOLATION_RE = /\{(\w+)\}/g;

/**
 * 템플릿 문자열의 변수를 치환합니다.
 * @param {string} template
 * @param {Object} vars
 * @returns {string}
 */
function interpolate(template, vars) {
    if (!vars || !Object.keys(vars).length) return template;

    return template.replace(INTERPOLATION_RE, (_, key) => {
        return Object.hasOwn(vars, key)
            ? `${vars[key]}`
            : `{${key}}`;  // 변수 없으면 원본 표시 (디버깅 용이)
    });
}

/* ─── 언어 유틸 ─── */

export function matchSupportedLanguage(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";

    const normalized = raw.replaceAll("_", "-");
    const lower = normalized.toLowerCase();

    // [Lucid] zh-CN: Handle various Chinese Simplified and Traditional variants.
    // Map zh-TW/HK to zh-CN for now as a better fallback than English, 
    // until specific traditional dictionaries are added.
    if (
        lower === "zh-cn"
        || lower.startsWith("zh-cn")
        || lower.startsWith("zh-hans")
        || lower === "zh-tw"
        || lower.startsWith("zh-tw")
        || lower === "zh-hk"
        || lower.startsWith("zh-hk")
        || lower.startsWith("zh-hant")
    ) {
        return "zh-CN";
    }

    // 나머지 언어: SUPPORTED_LANGUAGES 기반 prefix 자동 매칭
    for (const lang of SUPPORTED_LANGUAGES) {
        const tag = String(lang).toLowerCase();
        if (lower === tag || lower.startsWith(tag + "-")) return lang;
    }
    return "";
}

export function normalizeLanguage(value) {
    return matchSupportedLanguage(value) || "en";
}

export function detectNavigatorLanguage() {
    if (typeof navigator === "undefined" || !navigator) return "en";

    // Gather unique, non-null language strings
    const navLangs = Array.isArray(navigator.languages) ? navigator.languages : [];
    const langs = [...new Set([
        ...navLangs,
        navigator.language
    ])].filter(Boolean);

    for (const lang of langs) {
        const matched = matchSupportedLanguage(lang);
        if (matched) return matched;
    }
    return "en";
}

/* ─── 현재 언어 상태 ─── */
let _currentLanguage = "en";

export function setCurrentLanguage(lang) {
    _currentLanguage = normalizeLanguage(lang);
}

export function getCurrentLanguage() {
    return _currentLanguage;
}

/* ─── 번역 함수 ─── */

/**
 * 번역 키에 해당하는 다국어 문자열을 반환합니다.
 * @param {I18nKey} key - 번역 키
 * @param {Object|null} vars - 템플릿 변수 (선택)
 * @param {string} fallback - 대체 문자열 (선택)
 * @returns {string} 번역된 문자열
 */
export function t(key, vars = null, fallback = "") {
    if (key === I18N_KEYS.CHAT_VERSION) return _appVersion;

    const lang = _currentLanguage;
    const dict = DICTIONARIES[lang];

    // Fallback Order: current -> en -> key
    let template = dict?.[key];
    if (template === undefined && lang !== "en") {
        template = DICTIONARIES["en"]?.[key];
    }
    
    // Explicitly return fallback or key if no template found in current or English
    if (template === undefined) {
        return (fallback || String(key || ""));
    }

    if (typeof template !== "string") {
        return template; 
    }

    const firstBrace = template.indexOf("{");
    if (firstBrace === -1) return template;

    const hasAppVersion = template.includes("{appVersion}");
    if (!vars && !hasAppVersion) return template;

    const mergedVars = hasAppVersion ? { appVersion: _appVersion, ...vars } : vars;
    return interpolate(template, mergedVars);
}

/* ─── data-i18n 자동 적용 (최적화) ─── */

let _lastAppliedLanguage = "";
const I18N_DOM_CACHE = new WeakMap();

const I18N_ATTR_HANDLERS = [
    { attr: "i18n", cacheKey: "text", apply: (el, val) => { el.textContent = val; } },
    { attr: "i18nPlaceholder", cacheKey: "placeholder", apply: (el, val) => { if ("placeholder" in el) el.placeholder = val; } },
    { attr: "i18nTitle", cacheKey: "title", apply: (el, val) => { el.title = val; } },
    { attr: "i18nAriaLabel", cacheKey: "ariaLabel", apply: (el, val) => { el.setAttribute("aria-label", val); } },
    { attr: "i18nAlt", cacheKey: "alt", apply: (el, val) => { el.setAttribute("alt", val); } },
];

/**
 * DOM 내 모든 data-i18n 속성을 갖는 요소에 번역을 적용합니다.
 * @param {Document|Element} [root=document]
 * @param {boolean} [force=false]
 */
export function applyI18nToDOM(root = document, force = false) {
    const lang = _currentLanguage;
    const isFullScan = root === document || root === document.documentElement;
    
    // Optimization: Skip full-document scans if language hasn't changed
    if (!force && isFullScan && _lastAppliedLanguage === lang) {
        return;
    }

    const selectors = "[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria-label], [data-i18n-alt]";
    const elements = root.querySelectorAll(selectors);

    for (const el of elements) {
        let cache = I18N_DOM_CACHE.get(el);
        if (!cache) {
            cache = { lang: "" };
            I18N_DOM_CACHE.set(el, cache);
        }

        // If language changed for this element, reset caches to force update
        if (cache.lang !== lang) {
            for (const key in cache) delete cache[key];
            cache.lang = lang;
        }

        for (const { attr, cacheKey, apply } of I18N_ATTR_HANDLERS) {
            const key = el.dataset[attr];
            if (!key) continue;
            
            const val = t(key);
            if (cache[cacheKey] !== val) {
                apply(el, val);
                cache[cacheKey] = val;
            }
        }
    }

    if (isFullScan) {
        _lastAppliedLanguage = lang;
    }
}
