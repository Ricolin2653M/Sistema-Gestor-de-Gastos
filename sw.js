//Script  firebase
importScripts('/public/firebase-messaging-sw.js')


const CACHE_STATIC = 'static-v1'; // App Shell
const CACHE_DYNAMIC = 'dynamic-v1'; // Recursos dinámicos que cambian
const CACHE_INMUTABLE = 'inmutable-v1'; // Recursos de terceros que no cambian

const STATIC_FILES = [
    '/',
    '/index.html',
    '/js/app.js',
    '/sw.js',
    'static/js/bundle.js',
    'favicon.ico'
];

const INMUTABLE_FILES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300&family=Roboto:wght@100&display=swap',
    'https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics-compat.js'
];

const limpiarCache = (cacheName, maxItems) => {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > maxItems) {
                cache.delete(keys[0]).then(() => limpiarCache(cacheName, maxItems));
            }
        });
    });
};

self.addEventListener('install', event => {
    const cacheStaticPromise = caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_FILES));
    const cacheInmutablePromise = caches.open(CACHE_INMUTABLE).then(cache => cache.addAll(INMUTABLE_FILES));

    event.waitUntil(Promise.all([cacheStaticPromise, cacheInmutablePromise]));
});

// Activación: Limpiar versiones antiguas de cachés
self.addEventListener('activate', event => {
    const cleanOldCaches = caches.keys().then(keys => {
        return Promise.all(
            keys.map(key => {
                if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC && key !== CACHE_INMUTABLE) {
                    return caches.delete(key);
                }
            })
        );
    });
    event.waitUntil(cleanOldCaches);
});

// Cache Network Fallback 
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Excluir rutas de login y registro de la caché dinámica
    if (requestUrl.pathname.includes('login') || requestUrl.pathname.includes('register')) {
        return;
    }

    if (STATIC_FILES.includes(requestUrl.pathname)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request).then(networkResponse => {
                    caches.open(CACHE_STATIC).then(cache => cache.put(event.request, networkResponse.clone()));
                    return networkResponse;
                });
            })
        );
        return;
    }

    // Cache Network Race
    if (!STATIC_FILES.includes(requestUrl.pathname)) {
        const raceStrategy = new Promise((resolve, reject) => {
            let fetchFailed = false;

            const failOnce = () => {
                if (fetchFailed) reject('No se encontró respuesta');
                else fetchFailed = true;
            };

            fetch(event.request).then(networkResponse => {
                if (networkResponse.ok) resolve(networkResponse);
                else failOnce();
            }).catch(failOnce);

            caches.match(event.request).then(cacheResponse => {
                if (cacheResponse) resolve(cacheResponse);
                else failOnce();
            }).catch(failOnce);
        });

        event.respondWith(raceStrategy);
    }
});
