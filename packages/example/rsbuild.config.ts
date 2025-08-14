import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

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
})
