import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
// @ts-check
import AstroPWA from '@vite-pwa/astro'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    AstroPWA({
      manifest: false,
      registerType: 'autoUpdate',
      workbox: {
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: false,
        type: 'module',
      },
    }),
  ],
  adapter: cloudflare(),
})
