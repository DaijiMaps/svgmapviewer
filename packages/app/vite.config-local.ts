import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@daijimaps/svgmapviewer/box": path.resolve(__dirname, '../lib/src/lib/box/prefixed/index.ts'),
      "@daijimaps/svgmapviewer/carto": path.resolve(__dirname, '../lib/src/lib/carto/index.ts'),
      "@daijimaps/svgmapviewer/carto-objects": path.resolve(__dirname, '../lib/src/lib/carto/objects/index.ts'),
      "@daijimaps/svgmapviewer/carto-symbols": path.resolve(__dirname, '../lib/src/lib/carto/symbols/index.ts'),
      "@daijimaps/svgmapviewer/geo": path.resolve(__dirname, '../lib/src/lib/geo/index.ts'),
      "@daijimaps/svgmapviewer/matrix": path.resolve(__dirname, '../lib/src/lib/matrix/prefixed/index.ts'),
      "@daijimaps/svgmapviewer/search": path.resolve(__dirname, '../lib/src/lib/search/index.ts'),
      "@daijimaps/svgmapviewer/tuple": path.resolve(__dirname, '../lib/src/lib/tuple/index.ts'),
      "@daijimaps/svgmapviewer/vec": path.resolve(__dirname, '../lib/src/lib/vec/prefixed/index.ts'),
      "@daijimaps/svgmapviewer": path.resolve(__dirname, '../lib/src/lib/index.ts'),
    }
  }
})
