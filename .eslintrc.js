module.exports = {
  extends: ['standard', 'plugin:flowtype/recommended'],
  plugins: ['import', 'promise', 'react', 'jsx-a11y', 'import', 'flowtype'],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: false,
  },
};
