import react from '@vitejs/plugin-react'
import os from 'node:os'
import path from 'node:path'
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

const APP = '../../../../svgmapviewer/packages/app/src'
const LIB = '../../../../svgmapviewer/packages/lib/src/lib'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  server: {
    fs: {
      allow: [
        '.',
        '../../../../svgmapviewer/packages/app',
        '../../../../svgmapviewer/packages/lib',
      ],
    },
  },
  plugins: [
    react(),
    basicSsl({ name: 'ubuntu', domains: ['*.ubuntu'], certDir: os.homedir() }),
  ],
  resolve: {
    alias: {
      '@daijimaps/svgmapviewer-app': path.resolve(__dirname, `${APP}/index.ts`),
      '@daijimaps/svgmapviewer/box': path.resolve(
        __dirname,
        `${LIB}/box/prefixed/index.ts`
      ),
      '@daijimaps/svgmapviewer/carto-objects': path.resolve(
        __dirname,
        `${LIB}/carto/objects/index.ts`
      ),
      '@daijimaps/svgmapviewer/carto-symbols': path.resolve(
        __dirname,
        `${LIB}/carto/symbols/index.ts`
      ),
      '@daijimaps/svgmapviewer/carto': path.resolve(
        __dirname,
        `${LIB}/carto/index.ts`
      ),
      '@daijimaps/svgmapviewer/geo': path.resolve(
        __dirname,
        `${LIB}/geo/index.ts`
      ),
      '@daijimaps/svgmapviewer/map': path.resolve(
        __dirname,
        `${LIB}/map/index.ts`
      ),
      '@daijimaps/svgmapviewer/matrix': path.resolve(
        __dirname,
        `${LIB}/matrix/prefixed/index.ts`
      ),
      '@daijimaps/svgmapviewer/search': path.resolve(
        __dirname,
        `${LIB}/search/index.ts`
      ),
      '@daijimaps/svgmapviewer/tuple': path.resolve(
        __dirname,
        `${LIB}/tuple/index.ts`
      ),
      '@daijimaps/svgmapviewer/vec': path.resolve(
        __dirname,
        `${LIB}/vec/prefixed/index.ts`
      ),
      '@daijimaps/svgmapviewer': path.resolve(__dirname, `${LIB}/../index.ts`),
    },
  },
})
