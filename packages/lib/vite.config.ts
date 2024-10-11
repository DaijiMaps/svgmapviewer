import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        box: 'src/lib/box/prefixed/index.ts',
        index: 'src/lib/index.ts',
        map: 'src/lib/map/index.ts',
        matrix: 'src/lib/matrix/prefixed/index.ts',
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
    libInjectCss(),
    dts({ rollupTypes: true, tsconfigPath: './tsconfig.app.json' }),
    svgr({ include: '**/*.svg' }),
  ],
})
