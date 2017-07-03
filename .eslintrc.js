module.exports = {
  extends: [
    "google",
    "plugin:flowtype/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/flowtype",
    "prettier/react"
  ],
  plugins: ["flowtype", "react", "prettier"],
  parserOptions: {
    ecmaVersion: 2017,

    parser: "babel-eslint",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    node: true
  },
  parser: "babel-eslint",
  rules: {
    "prettier/prettier": "error"
  }
};
