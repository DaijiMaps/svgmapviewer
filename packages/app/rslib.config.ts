import { defineConfig } from '@rslib/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      dts: { bundle: false, distPath: './dist' },
    },
  ],
  source: {
    entry: {
      'index': 'src/index.ts',
    },
    tsconfigPath: './tsconfig.app.json',
  },
})
