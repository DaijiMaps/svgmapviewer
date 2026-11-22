import react from '@astrojs/react'
// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  /*
  vite: {
    build: {
      target: 'safari13',
      modulePreload: { polyfill: false },
    },
  },
  */
})
