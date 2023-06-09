module.exports = {
  ignorePatterns: ['!**/*'],
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:cypress/recommended',
  ],
  plugins: ['vitest-globals'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    'vitest-globals/env': true,
  },
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    curly: 'error',

    // I'll probably add some typescript types instead
    'react/prop-types': 'off',
  },
};
