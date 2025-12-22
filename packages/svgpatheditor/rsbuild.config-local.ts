import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { alias as appFloorsAlias } from '../app-floors/rsbuild-common.config'
import { alias as appOsmAlias } from '../app-osm/rsbuild-common.config'
import { alias as libAlias } from '../lib/rsbuild-common.config'

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
    alias: { ...appFloorsAlias, ...appOsmAlias, ...libAlias },
  },
})
