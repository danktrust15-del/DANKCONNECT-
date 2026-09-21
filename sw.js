const CACHE_NAME = 'dankconnect-v30';
const ASSETS = [
  './',
  './index.html?v=30',
  './index.html',
  './manifest.json?v=30',
  './manifest.json',
  './logo.png?v=30',
  './logo.png'
];

self.addEventListener('install', (e) => {
  console.log('[SW V30] Install');
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(err=>console.log('cache fail',err))));
});

self.addEventListener('activate', (e) => {
  console.log('[SW V30] Activate');
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.hostname.includes('firestore') || url.hostname.includes('firebase') || url.hostname.includes('googleapis') || url.pathname.includes('fcm') || req.method !== 'GET') {
    return;
  }

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c=>c.put(req, copy));
        return res;
      }).catch(() => caches.match('./index.html') || caches.match('./index.html?v=30') || caches.match(req))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c=>c.put(req, copy));
        }
        return res;
      }).catch(()=>cached);
    })
  );
});
