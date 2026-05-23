import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Even Cargo Candidates',
        short_name: 'Even Cargo',
        description: 'Candidate Operations Platform',
        theme_color: '#4F7DCB',
        icons: [
          {
            src: 'https://via.placeholder.com/192x192.png?text=EC',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://via.placeholder.com/512x512.png?text=EC',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
