import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      dts: { bundle: false, distPath: './dist' },
    },
  ],
  source: {
    entry: {
      'index': 'src/index.ts',
      'lib/box/prefixed/index': 'src/lib/box/prefixed/index.ts',
      'lib/carto/index': 'src/lib/carto/index.ts',
      'lib/carto/objects/index': 'src/lib/carto/objects/index.ts',
      'lib/carto/symbols/index': 'src/lib/carto/symbols/index.ts',
      'lib/geo/index': 'src/lib/geo/index.ts',
      'lib/map/index': 'src/lib/map/index.ts',
      'lib/matrix/prefixed/index': 'src/lib/matrix/prefixed/index.ts',
      'lib/search/index': 'src/lib/search/index.ts',
      'lib/tuple/index': 'src/lib/box/index.ts',
      'lib/vec/prefixed/index': 'src/lib/box/prefixed/index.ts',
      'search-worker': 'src/lib/search/search-worker.ts',
    },
    tsconfigPath: './tsconfig.app.json',
  },
})
