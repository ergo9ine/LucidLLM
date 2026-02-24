const CACHE_VERSION = "1.1.0";
const CACHE_NAME = `lucidllm-app-v${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
    "/", "/index.html",
    "/script/main.js", "/script/bootstrap.js", "/script/i18n.js",
    "/script/shared-utils.js", "/script/worker.js", "/script/drive-backup.js",
    "/favicon.svg",
    // Transformers.js bundle (same-origin mandatory for multi-threaded WASM on Cloudflare Pages)
    "/vendor/transformers/transformers.bundle.min.mjs",
];

// 외부 호스트 목록 (이들은 항상 네트워크로만 요청)
const NETWORK_ONLY_HOSTNAMES = [
    "huggingface.co",
    // "cdn.jsdelivr.net", // WASM/MJS 캐싱 허용을 위해 제외
    "unpkg.com",
    "accounts.google.com", "fonts.googleapis.com", "fonts.gstatic.com",
    "www.googleapis.com", "cdn.tailwindcss.com", "api.github.com",
];

// WASM 캐시 전용 이름 (앱 업데이트와 독립적 수명 관리)
const WASM_CACHE_NAME = "lucidllm-wasm-v1";

// WASM/ORT 관련 리소스 판별
function isOrtWasmResource(url) {
    // CDN (jsdelivr)
    if (url.hostname === "cdn.jsdelivr.net"
        && url.pathname.includes("onnxruntime-web")
        && /\.(wasm|mjs)$/.test(url.pathname)) {
        return true;
    }
    // Local vendor
    if (url.origin === self.location.origin
        && url.pathname.startsWith("/vendor/transformers/ort-wasm")
        && /\.(wasm|mjs)$/.test(url.pathname)) {
        return true;
    }
    return false;
}

// 1. Install Event: 자산 사전캐시 (skipWaiting 없음 -> waiting 상태 유지)
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log(`[SW] Pre-caching assets for v${CACHE_VERSION}`);
                return Promise.all(
                    PRECACHE_ASSETS.map((asset) =>
                        cache.add(asset).catch((err) => {
                            console.warn(`[SW] Failed to cache: ${asset}`, err);
                        })
                    )
                );
            })
            .catch((err) => {
                console.error("[SW] Pre-cache failed:", err);
            })
    );
});

// 2. Activate Event: 구버전 캐시 삭제 + clients.claim()
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== WASM_CACHE_NAME)
                        .map((cacheName) => {
                            console.log(`[SW] Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        })
                )
            )
            .then(() => {
                // 새 SW가 활성화되자마자 모든 클라이언트를 제어
                return self.clients.claim();
            })
            .catch((err) => {
                console.error("[SW] Activate error:", err);
            })
    );
});

// 3. Fetch Event: 자체 자산 -> 캐시 우선 / 외부 URL -> 네트워크 전용
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // ── ONNX Runtime WASM: CDN에서 가져온 뒤 영구 캐싱 ──
    if (isOrtWasmResource(url)) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(WASM_CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // 외부 호스트는 항상 네트워크로
    if (NETWORK_ONLY_HOSTNAMES.some(host => url.hostname === host || url.hostname.endsWith("." + host))) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request).catch((err) => {
                console.warn("[SW] Fetch failed, no cache match:", err?.message ?? String(err));
                return new Response("", { status: 503, statusText: "Service Unavailable" });
            });
        })
    );
});

// 4. Message Event: { type: "SKIP_WAITING" } 수신 시 skipWaiting() 호출
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        console.log("[SW] Skipping waiting...");
        self.skipWaiting();
    }
});
