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
      index: ['src/index.ts'],
    },
    tsconfigPath: './tsconfig.json',
  },
})
