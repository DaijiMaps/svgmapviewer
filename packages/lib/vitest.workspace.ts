import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      environment: 'node',
      include: ['tests/unit/**/*.{test,spec}.ts'],
    },
  },
  {
    test: {
      name: 'browser',
      include: ['tests/browser/**/*.{test,spec}.ts'],
      browser: {
        provider: 'playwright',
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  },
])
