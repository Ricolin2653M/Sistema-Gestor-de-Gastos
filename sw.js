// Script Firebase
importScripts('/public/firebase-messaging-sw.js');

const CACHE_STATIC = 'static-v3'; // App Shell
const CACHE_DYNAMIC = 'dynamic-v2'; // Recursos dinámicos que cambian
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

const EXCLUDED_PATHS = [
    '/src/pages/login/', 
    '/src/pages/register/',
    '/node_modules/'
]; 

// Función para limpiar el caché dinámico
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

// Fetch: Implementar estrategias de caché
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Excluir rutas específicas del caché
    if (EXCLUDED_PATHS.some(path => url.pathname.startsWith(path))) {
        return event.respondWith(fetch(event.request));
    }

    // Estrategia "Network First" para rutas API
    if (url.pathname.startsWith('/api/')) {
        const networkFirstResponse = fetch(event.request)
            .then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                // Actualizar el caché dinámico
                return caches.open(CACHE_DYNAMIC).then(cache => {
                    cache.put(event.request, networkResponse.clone()).catch(() => {});
                    return networkResponse;
                });
            })
            .catch(() => {
                return caches.match(event.request);
            });

        event.respondWith(networkFirstResponse);
        return;
    }

    // Estrategia "Cache First" para otras rutas
    const respuesta = caches.match(event.request).then(response => {
        if (response) {
            return response; 
        }

        // Fetch desde la red y guardar en el caché dinámico
        return fetch(event.request)
            .then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.status !== 201) {
                    return networkResponse;
                }

                // Guardar en caché dinámico
                return caches.open(CACHE_DYNAMIC).then(cache => {
                    cache.put(event.request, networkResponse.clone()).catch(() => {});
                    limpiarCache(CACHE_DYNAMIC, 50); // Limitar a 50 elementos
                    return networkResponse;
                });
            })
            .catch(() => {
                // Intentar responder desde el caché en caso de error
                return caches.match(event.request);
            });
    });

    event.respondWith(respuesta);
});
