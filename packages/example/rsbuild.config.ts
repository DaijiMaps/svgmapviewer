import { defineConfig } from '@rsbuild/core';
//import { pluginReact } from '@rsbuild/plugin-react';

// XXX rsbuild is used
// XXX until vite fixes handling of libs with separate worker .js files

export default defineConfig({
  //plugins: [pluginReact()],
  server: {
    base: '',
    port: 5173,
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
