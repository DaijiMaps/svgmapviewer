import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import path from 'node:path'

const APP = '../app-osm/src'
const LIB = '../lib/src'

const resolve = (dir: string, subdir: string): string =>
  path.resolve(__dirname, `${dir}/${subdir}`)
const app = (subdir: string): string => resolve(APP, subdir)
const lib = (subdir: string): string => resolve(LIB, subdir)

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    base: '',
    port: 5173,
  },
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: './src/main.ts',
    },
  },
  resolve: {
    alias: {
      'svgmapviewer-app-osm': app('index.ts'),
      'svgmapviewer/box': lib('lib/box/prefixed/index.ts'),
      'svgmapviewer/carto-objects': lib('lib/carto/objects/index.ts'),
      'svgmapviewer/carto-symbols': lib('lib/carto/symbols/index.ts'),
      'svgmapviewer/carto': lib('lib/carto/index.ts'),
      'svgmapviewer/geo': lib('lib/geo/index.ts'),
      'svgmapviewer/map': lib('lib/map/index.ts'),
      'svgmapviewer/map-floors': lib('lib/map/floors/index.ts'),
      'svgmapviewer/matrix': lib('lib/matrix/prefixed/index.ts'),
      'svgmapviewer/search': lib('lib/search/index.ts'),
      'svgmapviewer/tuple': lib('lib/tuple/index.ts'),
      'svgmapviewer/vec': lib('lib/vec/prefixed/index.ts'),
      svgmapviewer: lib('index.ts'),
    },
  },
})
