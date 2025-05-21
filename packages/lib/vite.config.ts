import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import circleDependency from 'vite-plugin-circular-dependency'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        //app: 'src/lib/app/index.ts',
        box: 'src/lib/box/prefixed/index.ts',
        carto: 'src/lib/carto/index.ts',
        'carto-objects': 'src/lib/carto/objects/index.ts',
        'carto-symbols': 'src/lib/carto/symbols/index.ts',
        geo: 'src/lib/geo/index.ts',
        index: 'src/lib/index.ts',
        matrix: 'src/lib/matrix/prefixed/index.ts',
        search: 'src/lib/search/index.ts',
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
    circleDependency(),
    dts({ rollupTypes: true, tsconfigPath: './tsconfig.app.json' }),
    libInjectCss(),
    react(),
    UnoCSS(),
  ],
})
