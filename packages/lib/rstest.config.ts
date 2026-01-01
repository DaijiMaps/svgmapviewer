import { defineConfig } from '@rstest/core'

export default defineConfig({
  testEnvironment: 'happy-dom',
  include: ['tests/unit/**/*.test.{js,ts}'],
  exclude: ['tests/browser'],
})
