const CACHE_NAME = 'istore-v1';
const URLS_TO_CACHE = [
  '/',
  '/static/icon.png',
  '/static/manifest.json'
];

// تثبيت service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE).catch(err => {
        console.log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// تنشيط
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استراتيجية: Network First, ثم Cache
self.addEventListener('fetch', event => {
  // تجاهل الطلبات ماشي GET
  if (event.request.method !== 'GET') return;
  
  // تجاهل Firebase و API
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // نسجلو نسخة في الـ cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // إذا فشل الاتصال، نرجعو من الـ cache
        return caches.match(event.request);
      })
  );
});
