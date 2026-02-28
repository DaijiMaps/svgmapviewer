import { defineConfig } from '@rsbuild/core'
import path from 'node:path'

const dir = (subdir: string): string => path.resolve(__dirname, subdir)

export const alias = {
  'svgmapviewer-app-floors': dir('./src/index.ts'),
}

export default defineConfig({
  resolve: {
    alias,
  },
})
