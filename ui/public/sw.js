// Service worker minimo, siguiendo el criterio de las apps hermanas: NO cachea
// nada de la aplicacion. Un service worker "offline-first" obliga a invalidar
// cache en cada despliegue, y aqui los precios y el estado de la
// infraestructura son datos vivos que nunca deben servirse desde cache.
//
// Existe por dos motivos concretos:
//   1. Chrome exige un service worker con un manejador `fetch` para ofrecer la
//      instalacion de la PWA. Sin esto el manifest solo no basta.
//   2. Deja el sitio listo para Web Push si algun dia se anade (ver la seccion
//      PWA de la guia de enerfris-init), sin volver a tocar el registro.

const VERSION = 'pricecloud-v1';

self.addEventListener('install', () => {
  // Sin precache: activa de inmediato en vez de esperar a que se cierren las
  // pestanas con la version anterior.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Por si una version anterior llego a cachear algo: se limpia todo lo
      // que no sea de esta version.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Passthrough deliberado: cumple el requisito de instalabilidad sin
// interponerse entre la app y la red.
self.addEventListener('fetch', () => {});
