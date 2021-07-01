module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier', 'import'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'import/extensions': 'off',
    'import/no-unresolved': 'error',
    'no-console': 'off',
    'func-names': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
      },
    ],
  },
};
