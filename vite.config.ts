import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Mengubah strategi menjadi injectManifest agar kita bisa menulis logika Push Notification secara custom
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts', 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Mutiara Kost',
        short_name: 'Mutiara Kost',
        description: 'Aplikasi Manajemen dan Layanan Penghuni Mutiara Kost',
        theme_color: '#0D2F5C', 
        background_color: '#F0F4F8', 
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
      },
      
      // Mengaktifkan fitur PWA selama development (npm run dev) untuk mempermudah proses testing
      devOptions: {
        enabled: true,
        type: 'module',
      }
    }),
  ],
});