import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: './node_modules/.bin/rsbuild dev --port 3000',
    url: 'http://localhost:3000',
    timeout: 5 * 1000,
  },
})
