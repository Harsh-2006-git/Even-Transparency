import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Even Cargo Apprenticeship Portal',
        short_name: 'Even Cargo',
        description: 'Apprenticeship platform for women in logistics and gig economy',
        theme_color: '#0A1628',
        background_color: '#0A1628',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Cache API responses for offline capability
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\/candidates\/profile/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'candidate-profile', expiration: { maxAgeSeconds: 3600 } },
          },
          {
            urlPattern: /^https:\/\/.*\/api\/jobs/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'job-listings', expiration: { maxAgeSeconds: 1800 } },
          },
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
