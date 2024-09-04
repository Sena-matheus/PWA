// Importa a biblioteca Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "offline-cache";
const OFFLINE_URL = "offline.html";

// Evento de instalação: Adiciona a página offline ao cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        // Outros arquivos que você deseja cachear, se necessário
      ]);
    })
  );
  self.skipWaiting();
});

// Ativa o service worker imediatamente após a instalação
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Habilita o preload de navegação, se suportado
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Evento de busca: Serve a página offline quando a conexão falhar
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResp = await cache.match(OFFLINE_URL);
          return cachedResp;
        }
      })()
    );
  } else {
    // Cache outras requisições, se necessário
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
