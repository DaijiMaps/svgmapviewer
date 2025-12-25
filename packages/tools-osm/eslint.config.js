import js from '@eslint/js'
import functional from 'eslint-plugin-functional'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      '**/dist',
      '**/*.d.ts',
      '**/*.config.{js,ts}',
      '**/*.config-*.{js,ts}',
      '**/test',
      '**/*.test.{js,ts}',
    ],
  },
  {
    files: ['src/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
  },
  js.configs.recommended,
  ts.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },
  },
  {
    ...functional.configs.recommended,
    ignores: [
      'packages/app/src/**/*',
      '**/*.test.{js,ts}',
      '**/*-react.{js,ts}',
      '**/*-xstate.{js,ts}',
    ],
  },
  {
    ...functional.configs.strict,
    ignores: ['**/*'],
  },
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  }
)
