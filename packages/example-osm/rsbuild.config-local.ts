import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

import appFloorsConfig from '../app-floors/rsbuild-common.config'
import appOsmConfig from '../app-osm/rsbuild-common.config'
import libConfig from '../lib/rsbuild-common.config'

export default mergeRsbuildConfig(
  appFloorsConfig,
  appOsmConfig,
  libConfig,
  defineConfig({
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
  })
)
