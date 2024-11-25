importScripts('/public/firebase-messaging-sw.js');
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js');
importScripts('js/sw-bd.js');
importScripts('js/sw-utils.js');

const CACHE_STATIC = 'static-v3';
const CACHE_DYNAMIC = 'dynamic-v2';
const CACHE_INMUTABLE = 'inmutable-v1';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/js/app.js',
    '/sw.js',
    'static/js/bundle.js',
    'favicon.ico'
];

const INMUTABLE_FILES = [
    'https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics-compat.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js',
];

const EXCLUDED_PATHS = ['/src/pages/login/', '/src/pages/register/', '/node_modules/'];

// Función para limpiar el caché dinámico
const limpiarCache = (cacheName, maxItems) => {
    caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
            if (keys.length > maxItems) {
                cache.delete(keys[0]).then(() => limpiarCache(cacheName, maxItems));
            }
        });
    });
};

// Eventos del SW
self.addEventListener('install', (event) => {
    const cacheStaticPromise = caches.open(CACHE_STATIC).then((cache) => cache.addAll(STATIC_FILES));
    const cacheInmutablePromise = caches.open(CACHE_INMUTABLE).then((cache) => cache.addAll(INMUTABLE_FILES));

    event.waitUntil(Promise.all([cacheStaticPromise, cacheInmutablePromise]));
});

self.addEventListener('activate', (event) => {
    const cleanOldCaches = caches.keys().then((keys) => {
        return Promise.all(
            keys.map((key) => {
                if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC && key !== CACHE_INMUTABLE) {
                    return caches.delete(key);
                }
            })
        );
    });
    event.waitUntil(cleanOldCaches);
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (EXCLUDED_PATHS.some((path) => url.pathname.startsWith(path))) {
        return event.respondWith(fetch(event.request));
    }

    const networkFirstResponse = fetch(event.request)
        .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
            }
            return caches.open(CACHE_DYNAMIC).then((cache) => {
                cache.put(event.request, networkResponse.clone()).catch(() => {});
                return networkResponse;
            });
        })
        .catch(() => caches.match(event.request));

    event.respondWith(networkFirstResponse);
});
