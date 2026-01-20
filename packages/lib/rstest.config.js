import { defineConfig } from '@rstest/core'
export default defineConfig({
  testEnvironment: 'happy-dom',
  include: ['src/**/*.test.{js,ts}', 'tests/unit/**/*.test.{js,ts}'],
  exclude: ['tests/browser'],
})
