# Prettier

[Prettier](https://prettier.io/) is an automatic code formatter which supports various languages, including TypeScript. It also has extensions for various text editors like [VSCode](https://github.com/prettier/prettier-vscode), [Atom](https://github.com/prettier/prettier-atom), and even [Vim](https://github.com/prettier/vim-prettier). If you have installed these extensions, it will use Prettier's service to automatically format your code after saving.

If you would rather not use Prettier instead, you can easily disable it too. In VSCode, open `.vscode/settings.json`, then change the `"editor.formatOnSave"` option to `false`:

```javascript
{
  "[json]": {
    "editor.formatOnSave": false
  },
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[typescript]": {
    "editor.formatOnSave": false
  }
}
```

## Configuring ESLint for Prettier

The `.prettierrc` file configures how Prettier formats your code. By default we use the following options.

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": false,
  "trailingComma": "none",
  "arrowParens": "avoid",
  "endOfLine": "auto"
}
```

We can use ESLint config and plugin for Prettier to override some ESLint rules to not conflict with Prettier.

```bash
$ yarn add --dev eslint-plugin-prettier eslint-config-prettier prettier
```

Then in your `.eslintrc` file, add the following:

```javascript
module.exports = {
  // other configuration omitted for brevity
  extends: ["prettier", "prettier/@typescript-eslint", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  }
};
```
