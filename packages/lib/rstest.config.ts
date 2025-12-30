import { defineConfig } from '@rstest/core'

export default defineConfig({
  testEnvironment: 'node',
  include: ['tests/unit/**/*.test.{js,ts}'],
  exclude: ['tests/browser'],
})
