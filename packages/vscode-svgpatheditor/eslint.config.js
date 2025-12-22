import js from '@eslint/js'
import functional from 'eslint-plugin-functional'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import ts from 'typescript-eslint'

//import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    ignores: [
      '**/dist',
      '**/out',
      '**/*.d.ts',
      '**/*.config.{js,ts}',
      '**/*.config-*.{js,ts}',
    ],
  },
  { files: ['src/**/*.{js,jsx,mjs,ts,tsx}'] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  //stylistic.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
    ignores: ['tests/**/*.*', 'src/**/*.test.*', '**/*-test.*'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        project: ['tsconfig.app.json'],
        sourceType: 'module',
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
  },
]
