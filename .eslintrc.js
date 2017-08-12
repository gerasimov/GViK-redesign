module.exports = {
    extends: [
        "google",
        "plugin:flowtype/recommended",
        "plugin:react/recommended",
        "prettier",
        "prettier/flowtype",
        "prettier/react"
    ],
    plugins: ["babel", "flowtype", "react", "prettier"],
    parserOptions: {
        parser: "babel-eslint",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        es6: true,
        node: true,
        jest: true
    },
    parser: "babel-eslint"
};
