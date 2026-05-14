import path from 'node:path'

import { defineConfig } from '@rsbuild/core'

const dir = (subdir: string): string => path.resolve(__dirname, subdir)

export const alias = {
  'svgmapviewer-app-floors': dir('./src/index.ts'),
}

export default defineConfig({
  resolve: {
    alias,
  },
})
