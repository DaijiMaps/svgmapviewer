import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      //syntax: 'esnext',
    },
  ],
  output: {
    distPath: 'out',
    target: 'node',
    externals: ['vscode'],
    sourceMap: true,
  },
  source: {
    entry: {
      extension: ['src/extension.ts'],
    },
  },
})
