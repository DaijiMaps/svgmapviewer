import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: {
      'box/index': 'src/lib/box/prefixed/index.ts',
      'carto/index': 'src/lib/carto/index.ts',
      'carto-objects/index': 'src/lib/carto/objects/index.ts',
      'carto-symbols/index': 'src/lib/carto/symbols/index.ts',
      'geo/index': 'src/lib/geo/index.ts',
      'map/index': 'src/lib/map/index.ts',
      'matrix/index': 'src/lib/matrix/prefixed/index.ts',
      'search/index': 'src/lib/search/index.ts',
      'search-worker/index': 'src/lib/search/search-worker.ts',
      'tuple/index': 'src/lib/tuple/index.ts',
      'vec/index': 'src/lib/vec/prefixed/index.ts',
      index: 'src/index.ts',
    },
    tsconfig: 'tsconfig.app.json',
    external: [
      'flatbush',
      'react',
      'react-dom',
      'xstate',
      '@xstate/react',
    ],
  }),
]
