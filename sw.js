const CACHE_VERSION = 'v8';
const CACHE_NAME = `oasis-menu-${CACHE_VERSION}`;
const IMAGE_CACHE = `oasis-images-${CACHE_VERSION}`;
const APP_SCOPE_URL = new URL(self.registration.scope);
const APP_SCOPE_PATH = APP_SCOPE_URL.pathname;
const ASSETS_TO_CACHE = [
    APP_SCOPE_URL.href,
    new URL('index.html', APP_SCOPE_URL).href,
    new URL('css/styles.css', APP_SCOPE_URL).href,
    new URL('js/script.js', APP_SCOPE_URL).href,
    new URL('manifest.json', APP_SCOPE_URL).href,
    new URL('assets/branding/logo-oasis.webp', APP_SCOPE_URL).href
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE) {
                        return caches.delete(cacheName);
                    }
                    return undefined;
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_SCOPE_PATH)) {
        return;
    }

    if (url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.webp') ||
        url.pathname.endsWith('.svg')) {
        event.respondWith(networkFirst(request, IMAGE_CACHE));
        return;
    }

    if (url.pathname.endsWith('.json')) {
        event.respondWith(networkOnly(request));
        return;
    }

    if (shouldUseNetworkFirst(request, url)) {
        event.respondWith(networkFirst(request, CACHE_NAME));
        return;
    }

    event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        if (request.mode === 'navigate') {
            const fallbackResponse = await caches.match(APP_SCOPE_URL.href);
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

async function fetchFresh(request) {
    return fetch(new Request(request, { cache: 'no-store' }));
}

async function networkFirst(request, cacheName = CACHE_NAME) {
    try {
        const networkResponse = await fetchFresh(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        if (request.mode === 'navigate') {
            const fallbackResponse = await caches.match(APP_SCOPE_URL.href) ||
                await caches.match(new URL('index.html', APP_SCOPE_URL).href);
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

async function networkOnly(request) {
    try {
        const networkResponse = await fetchFresh(request);
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline', { status: 503 });
    }
}

function shouldUseNetworkFirst(request, url) {
    return request.mode === 'navigate' ||
        url.pathname.endsWith('.html') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.webmanifest') ||
        url.pathname.endsWith('manifest.json');
}

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
