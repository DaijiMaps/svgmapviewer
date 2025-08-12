import { defineConfig } from '@rslib/core'

export default defineConfig({
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
