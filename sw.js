const CACHE_PREFIX = 'religion-web-';
const CACHE_NAME = `${CACHE_PREFIX}v3`;
const LEGACY_CACHES = new Set(['awakening-map-v1']);
const CORE = [
  './', './index.html', './styles/reflections.css', './js/main.js', './js/search.js',
  './content/content.js', './manifest.json', './journeys.html', './style.css', './app.js', './data.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) || LEGACY_CACHES.has(key))
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(async response => {
      if (response.ok) {
        const copy=response.clone();
        await caches.open(CACHE_NAME).then(cache => cache.put(request,copy));
      }
      return response;
    }).catch(async () => {
      const cache=await caches.open(CACHE_NAME);
      return (await cache.match(request)) || cache.match('./index.html');
    }));
    return;
  }
  event.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const hit=await cache.match(request);
    if(hit)return hit;
    const response=await fetch(request);
    if(response.ok){const copy=response.clone();await cache.put(request,copy);}
    return response;
  }));
});
