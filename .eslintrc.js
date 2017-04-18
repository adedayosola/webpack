module.exports = {
  env: {
    browser:true,
    commonjs:true,
    es6:true,
    node:true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parser:'babel-eslint',
  parserOptions: {
    sourceType: 'module',

    allowImportExportEverywhere:true,

    ecmaFeatures: {
      jsx:true,
    },
  },
  plugins:[
    'react',
  ],
  globals: {
    __webpack_public_path__: true
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes : ['error', 'single'],
    semi : ['error', 'always'],
    'no-used-var' : 0,
    'no-console': 0,
  },
};