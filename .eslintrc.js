module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.wxml', '*.html'],
      extends: ['plugin:prettier/recommended'],
      rules: {
        'wxml/report-wxml-syntax-error': 'error',
      },
      plugins: ['wxml', 'prettier'],
      processor: 'wxml/wxml',
      parser: '@wxml/parser',
    },
    {
      files: ['*.js', '*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-types': 'off',
      },
    },
  ],
}
