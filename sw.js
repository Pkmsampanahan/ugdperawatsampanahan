const CACHE_NAME = 'absensi_ugd-v1.4.3'; 
const ASSETS = [
  "./", 
  "./manifest.json", 
  "./icon-512.png", 
  "./sw.js", 
  "./db.js",
  "./index.html",
  "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
  "https://unpkg.com/html5-qrcode",
  "https://cdn.tailwindcss.com"
]; 

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
}); 

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
}); 

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
