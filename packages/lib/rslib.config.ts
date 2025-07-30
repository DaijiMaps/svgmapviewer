//import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      dts: { bundle: true },
    },
  ],
  source: {
    entry: {
      index: 'src/index.ts',
      'search-worker': 'src/lib/search/search-worker.ts',
    },
    tsconfigPath: './tsconfig.app.json',
  },
  //plugins: [pluginReact()],
})
