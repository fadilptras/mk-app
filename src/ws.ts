/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

// Import Workbox dari bawaan vite-plugin-pwa untuk kebutuhan offline cache
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

// 1. MENGURUS OFFLINE CACHE
// Membersihkan cache lama jika ada update aplikasi
cleanupOutdatedCaches();
// Menyimpan semua aset aplikasi agar bisa dibuka saat offline
precacheAndRoute(self.__WB_MANIFEST);

// 2. MENANGKAP PUSH NOTIFICATION DARI SERVER
self.addEventListener('push', (event) => {
  // Parsing data yang dikirim dari server
  const data = event.data ? event.data.json() : {};

  // Menyusun tampilan visual notifikasi di HP
  const title = data.title || 'Notifikasi Mutiara Kost';
  const options = {
    body: data.body || 'Kamu memiliki pesan baru, silakan cek aplikasi.',
    icon: '/pwa-192x192.png', // Logo aplikasi yang akan muncul di notifikasi
    badge: '/pwa-192x192.png', // Ikon kecil (monokrom) di status bar atas HP Android
    data: {
      url: data.url || '/', // URL tujuan saat notifikasi ini di-klik
    },
  };

  // Memerintahkan sistem operasi HP untuk memunculkan pop-up notifikasi
  event.waitUntil(self.registration.showNotification(title, options));
});

// 3. MENANGANI AKSI SAAT NOTIFIKASI DI-KLIK OLEH PENGHUNI
self.addEventListener('notificationclick', (event) => {
  // Tutup pop-up notifikasi setelah di-klik
  event.notification.close();

  // Ambil URL tujuan dari payload data (misal: /penghuni/tagihan)
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Jika aplikasi Mutiara Kost ternyata sedang terbuka di background, langsung fokus ke tab tersebut
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika aplikasi tertutup total, buka aplikasi/tab baru ke URL tujuan
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});