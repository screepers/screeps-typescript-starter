module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {}
    }
  },
  rules: {
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "explicit"
      }
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/space-within-parens": ["off", "never"],
    "@typescript-eslint/unified-signatures": "error",
    "arrow-parens": ["off", "as-needed"],
    camelcase: "error",
    complexity: "off",
    "dot-notation": "error",
    "eol-last": "off",
    eqeqeq: ["error", "smart"],
    "guard-for-in": "off",
    "id-blacklist": ["error", "any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined"],
    "id-match": "error",
    "linebreak-style": "off",
    "max-classes-per-file": ["error", 1],
    "new-parens": "off",
    "newline-per-chained-call": "off",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-console": "off",
    "no-eval": "error",
    "no-invalid-this": "off",
    "no-multiple-empty-lines": "off",
    "no-new-wrappers": "error",
    "no-shadow": [
      "error",
      {
        hoist: "all"
      }
    ],
    "no-throw-literal": "error",
    "no-trailing-spaces": "off",
    "no-undef-init": "error",
    "no-underscore-dangle": "warn",
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "quote-props": "off",
    radix: "error",
    "sort-imports": "warn",
    "spaced-comment": "error",
  }
};
