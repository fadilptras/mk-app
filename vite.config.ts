import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Mutiara Kost',
        short_name: 'Mutiara Kost',
        description: 'Aplikasi Manajemen dan Layanan Penghuni Mutiara Kost',
        theme_color: '#0D2F5C', // Warna tema bar HP (Midnight Navy kita)
        background_color: '#F0F4F8', // Latar belakang splash screen (Biru soft kita)
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          }
        ],
      },
    }),
  ],
});