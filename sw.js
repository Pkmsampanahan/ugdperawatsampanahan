const CACHE_NAME = 'absensi_ugd_auto_v1'; 
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

// Install & langsung aktifkan aset dasar
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
}); 

// Bersihkan cache usang otomatis jika nama cache diganti
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
}); 

// STRATEGI NETWORK FIRST: Selalu ambil dari internet dulu, kalau offline baru ambil dari cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Jika sukses dapet file baru dari internet, simpan salinannya ke cache
        if (response && response.status === 200 && e.request.method === 'GET') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(e.request).then(res => res)) // Jika internet mati/offline, gunakan cache lokal
  );
});
