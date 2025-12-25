import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      output: {
        distPath: './dist',
        minify: {
          js: true,
        },
      },
    },
  ],
  source: {
    entry: {
      geojsonToTs: ['src/geojsonToTs.ts'],
    },
    tsconfigPath: './tsconfig.app.json',
  },
})
