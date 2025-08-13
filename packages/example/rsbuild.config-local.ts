import path from 'node:path'
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const APP = '../app/src'
const LIB = '../lib/src/lib'

// XXX rsbuild is used
// XXX until vite fixes handling of libs with separate worker .js files

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    base: '',
    port: 5173,
  },
  html: {
    template: './template.html',
  },
  source: {
    entry: {
      index: './src/main.ts',
    },
  },
  resolve: {
    alias: {
      'svgmapviewer-app': path.resolve(__dirname, `${APP}/index.ts`),
      'svgmapviewer/box': path.resolve(
        __dirname,
        `${LIB}/box/prefixed/index.ts`
      ),
      'svgmapviewer/carto-objects': path.resolve(
        __dirname,
        `${LIB}/carto/objects/index.ts`
      ),
      'svgmapviewer/carto-symbols': path.resolve(
        __dirname,
        `${LIB}/carto/symbols/index.ts`
      ),
      'svgmapviewer/carto': path.resolve(
        __dirname,
        `${LIB}/carto/index.ts`
      ),
      'svgmapviewer/geo': path.resolve(
        __dirname,
        `${LIB}/geo/index.ts`
      ),
      'svgmapviewer/map': path.resolve(
        __dirname,
        `${LIB}/map/index.ts`
      ),
      'svgmapviewer/map-floors': path.resolve(
        __dirname,
        `${LIB}/map/floors/index.ts`
      ),
      'svgmapviewer/matrix': path.resolve(
        __dirname,
        `${LIB}/matrix/prefixed/index.ts`
      ),
      'svgmapviewer/search': path.resolve(
        __dirname,
        `${LIB}/search/index.ts`
      ),
      'svgmapviewer/tuple': path.resolve(
        __dirname,
        `${LIB}/tuple/index.ts`
      ),
      'svgmapviewer/vec': path.resolve(
        __dirname,
        `${LIB}/vec/prefixed/index.ts`
      ),
      'svgmapviewer': path.resolve(__dirname, `${LIB}/../index.ts`),
    },
  },
});
