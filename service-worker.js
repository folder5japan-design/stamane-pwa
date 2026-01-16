const CACHE_NAME = 'stamane-cache-v4'; // ← 更新時に必ず番号を変える
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* インストール */
self.addEventListener('install', event => {
  self.skipWaiting(); // ★ 新SWを即有効化
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

/* 有効化 */
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        )
      ),
      self.clients.claim() // ★ 既存ページを即支配
    ])
  );
});

/* fetch */
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
