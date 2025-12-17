import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: {
      index: 'src/index.ts',
    },
    tsconfig: 'tsconfig.app.json',
    external: [
      'flatbush',
      'react',
      'react-dom',
      'svgmapviewer',
      'xstate',
      '@xstate/react',
    ],
  }),
]
