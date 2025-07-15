import react from '@vitejs/plugin-react-oxc'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        box: 'src/lib/box/prefixed/index.ts',
        carto: 'src/lib/carto/index.ts',
        'carto-objects': 'src/lib/carto/objects/index.ts',
        'carto-symbols': 'src/lib/carto/symbols/index.ts',
        geo: 'src/lib/geo/index.ts',
        index: 'src/lib/index.ts',
        map: 'src/lib/map/index.ts',
        matrix: 'src/lib/matrix/prefixed/index.ts',
        search: 'src/lib/search/index.ts',
        'search-worker': 'src/lib/search/search-worker.ts',
        tuple: 'src/lib/tuple/index.ts',
        vec: 'src/lib/vec/prefixed/index.ts',
      },
      formats: ['es'],
      name: 'svgmapviewer',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'xstate', '@xstate/react'],
      jsx: 'react',
    },
  },
  plugins: [
    react(),
    UnoCSS(),
  ],
})
