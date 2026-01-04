const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports', '@prettier/plugin-oxc'],

  // @ianvs/prettier-plugin-sort-imports
  importOrderParserPlugins: ['typescript', 'jsx'],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderCaseSensitive: false,
}

export default config
