/* =============================================
   service-worker.js
   オフライン対応・キャッシュ管理
   ============================================= */

const CACHE_NAME = 'english-quiz-v2';
const BASE = self.location.pathname.replace(/\/service-worker\.js$/, '');

const FILES_TO_CACHE = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/style.css',
  BASE + '/questions.js',
  BASE + '/phrases.js',
  BASE + '/quest_special.js',
  BASE + '/app.js',
  BASE + '/firebase.js',
  BASE + '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
