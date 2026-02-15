const CACHE_NAME = "lucidllm-shell-v1";
const APP_SHELL_ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./bootstrap.js",
    "./main.js",
    "./shared-utils.js",
    "./drive-backup-utils.js",
    "./drive-backup-crypto.js",
    "./transformers-bridge.js",
    "./global-api.js",
    "./favicon.svg",
    "./favicon.ico",
];

self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(APP_SHELL_ASSETS);
        await self.skipWaiting();
    })());
});

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys
                .filter((key) => key !== CACHE_NAME)
                .map((key) => caches.delete(key)),
        );
        await self.clients.claim();
    })());
});

function isCacheableRequest(request) {
    if (!request || request.method !== "GET") return false;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return false;
    if (url.pathname.endsWith("/sw.js")) return false;
    return true;
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (!isCacheableRequest(request)) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
            .then((response) => {
                if (response && response.ok) {
                    cache.put(request, response.clone()).catch(() => {});
                }
                return response;
            })
            .catch(() => null);

        if (cached) {
            networkPromise.catch(() => {});
            return cached;
        }

        const networkResponse = await networkPromise;
        if (networkResponse) {
            return networkResponse;
        }

        const fallback = await cache.match("./index.html");
        if (fallback) {
            return fallback;
        }
        return new Response("Offline", { status: 503 });
    })());
});
