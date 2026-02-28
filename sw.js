const CACHE_VERSION = "1.2.0";
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
const NETWORK_ONLY_SET = new Set([
    "huggingface.co", "www.huggingface.co",
    "unpkg.com", "www.unpkg.com",
    "accounts.google.com", "fonts.googleapis.com", "fonts.gstatic.com",
    "www.googleapis.com", "api.github.com",
]);

// WASM 캐시 전용 이름 (앱 업데이트와 독립적 수명 관리)
const WASM_CACHE_NAME = "lucidllm-wasm-v1";

// WASM/ORT 관련 리소스 판별
function isOrtWasmResource(url) {
    if (!url || !url.hostname || !url.pathname) return false;
    // CDN (jsdelivr)
    if (url.hostname === "cdn.jsdelivr.net"
        && url.pathname.includes("onnxruntime-web")
        && /\.(wasm|mjs)$/.test(url.pathname)) {
        return true;
    }
    return false;
}

// 1. Install Event: 자산 사전캐시 (skipWaiting 없음 -> waiting 상태 유지)
self.addEventListener("install", (event) => {
    // 새 SW 즉시 활성화 → 구버전 대기 없이 바로 교체
    self.skipWaiting();

    event.waitUntil((async () => {
        try {
            const cache = await caches.open(CACHE_NAME);
            console.log(`[SW] Pre-caching assets for v${CACHE_VERSION}`);
            await Promise.all(
                PRECACHE_ASSETS.map(async (asset) => {
                    try {
                        await cache.add(asset);
                    } catch (err) {
                        console.warn(`[SW] Failed to cache: ${asset}`, err);
                    }
                })
            );
        } catch (err) {
            console.error("[SW] Pre-cache failed:", err);
        }
    })());
});

// 2. Activate Event: 구버전 캐시 삭제 + clients.claim()
self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== WASM_CACHE_NAME)
                    .map((cacheName) => {
                        console.log(`[SW] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    })
            );
            // 새 SW가 활성화되자마자 모든 클라이언트를 제어
            await self.clients.claim();
        } catch (err) {
            console.error("[SW] Activate error:", err);
        }
    })());
});

// 3. Fetch Event: 자체 자산 -> 캐시 우선 / 외부 URL -> 네트워크 전용
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // OPT-16/17: Early return for network-only hosts using O(1) Set
    if (NETWORK_ONLY_SET.has(url.hostname)) return;

    // ── ONNX Runtime WASM: CDN에서 가져온 뒤 영구 캐싱 ──
    if (isOrtWasmResource(url)) {
        event.respondWith((async () => {
            const cached = await caches.match(event.request);
            if (cached) return cached;
            try {
                const response = await fetch(event.request);
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(WASM_CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => { });
                }
                return response;
            } catch {
                return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
            }
        })());
        return;
    }

    event.respondWith((async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        try {
            return await fetch(event.request);
        } catch (err) {
            console.warn("[SW] Fetch failed, no cache match:", err?.message ?? String(err));
            return new Response("Offline - Service Unavailable", {
                status: 503,
                statusText: "Service Unavailable",
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }
    })());
});

// 4. Message Event: { type: "SKIP_WAITING" } 수신 시 skipWaiting() 호출
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        console.log("[SW] Skipping waiting...");
        self.skipWaiting();
    }
});
