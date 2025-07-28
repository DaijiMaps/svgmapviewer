import react from '@vitejs/plugin-react-oxc'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import libCss from 'vite-plugin-libcss'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
      name: 'svgmapviewer-app',
    },
    rollupOptions: {
      external: ['flatbush', 'react', 'react-dom', 'svgmapviewer', 'xstate', '@xstate/react'],
      jsx: 'react',
    },
  },
  plugins: [
    react(),
    UnoCSS(),
    libCss(),
  ],
})
