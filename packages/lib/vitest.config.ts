import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'node',
    environment: 'jsdom',
    browser: {
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
