import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'cjs',
      output: {
        distPath: './dist',
        minify: {
          js: true,
        },
      },
    },
  ],
})
