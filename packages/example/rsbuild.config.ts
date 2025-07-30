import { defineConfig } from '@rsbuild/core';

// XXX rsbuild is used only for dev
// XXX until vite fixes handling of libs with separate worker .js files

export default defineConfig({
  server: {
    base: '',
  },
  html: {
    template: './template.html',
  },
  source: {
    entry: {
      index: './src/main.ts',
    },
  },
});
