import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

import { define } from './rsbuild-common.config'

export default defineConfig({
  plugins: [pluginReact()],
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      // bundleless
      bundle: false,
      // bundleless
      dts: {
        bundle: false,
        distPath: './dist',
        tsgo: true,
      },
    },
  ],
  source: {
    // bundleless
    define,
    entry: {
      index: ['src/**/*.{ts,tsx}', '!src/**/*.test.*', '!src/**/*-fixtures.ts'],
    },
    tsconfigPath: './tsconfig.app.json',
  },
})
