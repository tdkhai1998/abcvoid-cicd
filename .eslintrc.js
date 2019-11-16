module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["node"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    // quotes: ["error", "double"],
    // "object-curly-spacing": ["error", "always"],
    // indent: ["error", 2],
    // "linebreak-style": ["error", "unix"],
    // quotes: ["error", "double"],
    // semi: ["error", "always"],
    // "comma-dangle": ["error", "always"]
  }
};
