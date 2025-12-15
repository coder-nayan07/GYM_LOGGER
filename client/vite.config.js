import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'IronLog Gym Tracker',
        short_name: 'IronLog',
        description: 'Personalized Workout Tracker',
        theme_color: '#171717',
        background_color: '#171717',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-512.png', // Ensure this exists in /public
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});