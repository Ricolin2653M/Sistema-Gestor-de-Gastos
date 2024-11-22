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
    'https://fonts.googleapis.com/css2?family=Inter:wght@300&family=Roboto:wght@100&display=swap',
    'https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics-compat.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js'
];

const EXCLUDED_PATHS = ['/src/pages/login/', '/src/pages/register/', '/node_modules/'];

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

// Manejo de API de Notas PARA INDEXDB
const manejoApiNotass = (cacheName, req) => {
    if (req.clone().method === 'POST') {
        if (self.registration.sync) {
            return req.clone().text().then(body => {
                const bodyObj = JSON.parse(body);
                return guardarNota(bodyObj);
            });
        } else {
            return fetch(req);
        }
    } else {
        return fetch(req).then(resp => {
            if (resp.ok) {
                actualizarCacheDinamico(cacheName, req, resp.clone());
                return resp.clone();
            } else {
                return caches.match(req);
            }
        }).catch(() => caches.match(req));
    }
};

//Manejo de API de Expenses  para indexDB
const manejoApiExpensess = (cacheName, req) => {
    if (req.clone().method === 'POST') {
        if (self.registration.sync) {
            return req.clone().text().then(body => {
                const bodyObj = JSON.parse(body);
                return guardarExpense(bodyObj);
            });
        } else {
            return fetch(req);
        }
    } else {
        return fetch(req).then(resp => {
            if (resp.ok) {
                actualizarCacheDinamico(cacheName, req, resp.clone());
                return resp.clone();
            } else {
                return caches.match(req);
            }
        }).catch(() => caches.match(req));
    }
};

self.addEventListener('install', event => {
    const cacheStaticPromise = caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_FILES));
    const cacheInmutablePromise = caches.open(CACHE_INMUTABLE).then(cache => cache.addAll(INMUTABLE_FILES));

    event.waitUntil(Promise.all([cacheStaticPromise, cacheInmutablePromise]));
});

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

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    //funciones para indexdb
            if (url.href.includes('https://aplicacion-sgp.vercel.app/api/deposit')) {
                event.respondWith(manejoApiNotas(CACHE_DYNAMIC, event.request));
                return;
            }

            if (url.href.includes('https://aplicacion-sgp.vercel.app/api/expense')) {
                event.respondWith(manejoApiExpenses(CACHE_DYNAMIC, event.request));
                return;
            }//fin

    if (EXCLUDED_PATHS.some(path => url.pathname.startsWith(path))) {
        return event.respondWith(fetch(event.request));
    }

    const networkFirstResponse = fetch(event.request)
        .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
            }
            return caches.open(CACHE_DYNAMIC).then(cache => {
                cache.put(event.request, networkResponse.clone()).catch(() => {});
                return networkResponse;
            });
        })
        .catch(() => caches.match(event.request));

    event.respondWith(networkFirstResponse);
});

self.addEventListener('sync', event => {
    if (event.tag === 'nueva-nota') {
        event.waitUntil(postearNotas());
    }

    if (event.tag === 'nueva-expense') {
        event.waitUntil(postearExpenses());
    }
 });
