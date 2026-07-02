/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

// 1. MENGURUS OFFLINE CACHE
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// 2. MENANGKAP PUSH NOTIFICATION DARI SERVER (FIREBASE FORMAT)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  // Firebase biasanya mengirimkan payload dalam format JSON tertentu
  const payload = event.data.json();
  console.log("Push payload diterima di background:", payload);

  // Ambil data dari object 'notification' (bawaan Firebase) atau 'data' (custom)
  const title = payload.notification?.title || payload.data?.title || 'Notifikasi Mutiara Kost';
  const body = payload.notification?.body || payload.data?.body || 'Kamu memiliki pesan baru, silakan cek aplikasi.';
  const url = payload.data?.url || '/';

  const options = {
    body: body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: { url: url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 3. MENANGANI AKSI SAAT NOTIFIKASI DI-KLIK
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});