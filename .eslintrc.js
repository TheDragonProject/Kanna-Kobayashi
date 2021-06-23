module.exports = {
  env: { node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [ '@typescript-eslint' ],
  root: true,
  rules:
  {
    /*
     * ESLint rules
     */
    'arrow-spacing': ['error', { after: true, before: true }],
    'brace-style': 'off',
    'comma-dangle': 'off',
    curly: [ 'error', 'multi-line' ],
    'keyword-spacing': 'off',
    quotes: 'off',
    'quote-props': [ 'error', 'as-needed' ],
    semi: 'off',
    'space-before-function-paren': 'off',
    'no-trailing-spaces': 'error',
    indent: 'off',
    'no-unexpected-multiline': 'off',
    radix: 'off',
    'require-atomic-updates': 'off',
    /*
     * TSLint rules
     */
    '@typescript-eslint/indent': [ 'error', 2 ],
    '@typescript-eslint/brace-style': [ 'error', 'allman' ],
    '@typescript-eslint/comma-dangle': [ 'warn', 'always-multiline' ],
    '@typescript-eslint/keyword-spacing': [ 'error', { after: true, before: true } ],
    '@typescript-eslint/quotes': [ 'error', 'single', {
      avoidEscape: true,
    }],
    '@typescript-eslint/semi': [ 'error', 'always' ],
    '@typescript-eslint/space-before-function-paren': [ 'error', 'always' ],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
};
