import { defineConfig } from '@rslib/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      bundle: false,
      dts: { bundle: false, distPath: './dist' },
    },
  ],
  source: {
    entry: {
      'index': ['src/**/*.{ts,tsx}', '!src/**/*.test.*'],
    },
    tsconfigPath: './tsconfig.app.json',
  },
})
