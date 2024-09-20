// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'); // Importando da biblioteca do google

const CACHE = "pwabuilder-page"; // Define o nome de onde o CACHE sera armazenado
const offlineFallbackPage = "offline.html"; // Indica o arquivo que sera direcionado se ficar offline

self.addEventListener("message", (event) => { //Manda uma mensagem
  if (event.data && event.data.type === "SKIP_WAITING") { //Chama a manesagem de Skip
    self.skipWaiting(); //Faz o SW assumir o controle sem esperar que as antigas sejam desativadas
  }
});

self.addEventListener('install', async (event) => { // Dispara a instalacao
  event.waitUntil( // Pede pra esperar isso acontecer
    caches.open(CACHE) // Abre um cache
      .then((cache) => cache.add(offlineFallbackPage)) // Abre o Cache e adiciona a pagina designada
  );
});

if (workbox.navigationPreload.isSupported()) { // Verifica se o navegador suporta o pre load
  workbox.navigationPreload.enable(); // Autoriza o preload caso o navegador suporte
}

self.addEventListener('fetch', (event) => { // Escuta todas as requisicoes de rede feita pela aplicacao
  if (event.request.mode === 'navigate') { //Vai verificar oque foi o pedido e se e uma navegacao de pagina
    event.respondWith((async () => { // Recebe a resposta da requisicao e fornece uma resposta
      try {
        const preloadResp = await event.preloadResponse; // Tenta usar uma resposta pre carregada do preload da pagina

        if (preloadResp) {
          return preloadResp;
        } // Assim que disponivel mandar a resposta

        const networkResp = await fetch(event.request); // Busca a requisicao na rede
        return networkResp; // Retorna com a resposta
      } catch (error) {
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
