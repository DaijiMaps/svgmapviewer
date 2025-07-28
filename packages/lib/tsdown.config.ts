import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: {
      //app: 'src/lib/app/index.ts',
      box: 'src/lib/box/prefixed/index.ts',
      carto: 'src/lib/carto/index.ts',
      'carto-objects': 'src/lib/carto/objects/index.ts',
      'carto-symbols': 'src/lib/carto/symbols/index.ts',
      geo: 'src/lib/geo/index.ts',
      map: 'src/lib/map/index.ts',
      matrix: 'src/lib/matrix/prefixed/index.ts',
      search: 'src/lib/search/index.ts',
      'search-worker': 'src/lib/search/search-worker.ts',
      tuple: 'src/lib/tuple/index.ts',
      vec: 'src/lib/vec/prefixed/index.ts',
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
