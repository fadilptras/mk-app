/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

// 1. MENGURUS OFFLINE CACHE
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// 2. MENANGKAP PUSH NOTIFICATION DARI SERVER (FIREBASE FORMAT)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const payload = event.data.json();
  console.log("Push payload diterima di background:", payload);

  const title = payload.notification?.title || payload.data?.title || 'Notifikasi Mutiara Kost';
  const body = payload.notification?.body || payload.data?.body || 'Kamu memiliki pesan baru, silakan cek aplikasi.';
  const url = payload.data?.url || '/';

  const options = {
    body: body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png', 
    data: { url: url },
  };

  // LOGIKA PENCEGAHAN DOUBLE NOTIFICATION
  const promiseChain = self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let isAppFocused = false;

    // Cek apakah ada tab aplikasi yang sedang aktif & dilihat user
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused) {
        isAppFocused = true;
        break;
      }
    }

    if (isAppFocused) {
      // Jika aplikasi sedang dibuka, JANGAN tampilkan notifikasi OS (Biar UI Toast yang bekerja)
      console.log('Aplikasi sedang aktif di foreground. Notifikasi OS disembunyikan.');
      return; 
    }

    // Jika aplikasi di background / ditutup, TAMPILKAN notifikasi OS
    return self.registration.showNotification(title, options);
  });

  event.waitUntil(promiseChain);
});

// 3. MENANGANI AKSI SAAT NOTIFIKASI OS DI-KLIK
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Tutup notifikasi setelah diklik

  const urlToOpen = event.notification.data?.url || '/';

  const promiseChain = self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    // Cari tab yang sudah terbuka
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      // Jika tab sudah ada, fokuskan dan arahkan ke URL
      if (client.url.includes(self.location.origin) && 'focus' in client) {
        client.navigate(urlToOpen); // Paksa navigasi ke URL notif
        return client.focus();
      }
    }
    
    // Jika tidak ada tab yang terbuka, buka tab baru
    if (self.clients.openWindow) {
      return self.clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});