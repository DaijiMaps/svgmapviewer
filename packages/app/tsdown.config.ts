import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: {
      index: 'src/index.ts',
    },
    tsconfig: 'tsconfig.app.json',
  }),
]
