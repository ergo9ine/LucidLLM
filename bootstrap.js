const MAIN_MODULE_PATH = "./main.js";
const SERVICE_WORKER_PATH = "./sw.js";

async function loadMainBundle() {
    try {
        await import(MAIN_MODULE_PATH);
    } catch (error) {
        console.error("[BOOT] Failed to load main bundle", error);
    }
}

function isLocalhostHost(hostname) {
    const host = String(hostname || "").toLowerCase();
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
