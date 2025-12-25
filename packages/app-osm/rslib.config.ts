import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

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
      },
    },
  ],
  source: {
    // bundleless
    entry: {
      index: ['src/**/*.{ts,tsx}', '!src/**/*.test.*'],
    },
    tsconfigPath: './tsconfig.app.json',
  },
})
