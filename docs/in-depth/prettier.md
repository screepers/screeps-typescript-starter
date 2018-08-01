# Code formatting with Prettier

[Prettier](https://prettier.io/) is an automatic code formatter which supports various languages, including TypeScript. It also has extensions for various text editors like [VSCode](https://github.com/prettier/prettier-vscode), [Atom](https://github.com/prettier/prettier-atom), and even [Vim](https://github.com/prettier/vim-prettier). If you have installed these extensions, it will use Prettier's service to automatically format your code after saving.

If you would rather not use Prettier instead, you can easily disable it too. In VSCode, open `.vscode/settings.json`, then change the `"editor.formatOnSave"` option to `false`:

```json
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

## Configuring TSLint for Prettier

The `.prettierrc` file configures how Prettier formats your code. By default we use the following options.

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": false,
  "trailingComma": "none"
}
```

We can use `tslint-config-prettier` to override some TSLint rules with its Prettier counterparts. In your `tslint.json` file, extend `tslint-config-prettier`.

```json
{
  "extends" : [
    "tslint:recommended",
    "tslint-config-prettier"
  ]
}
```

To make Prettier error out on formatting errors, we can also use `tslint-plugin-prettier` to add a custom rule for this.

```bash
yarn add --dev tslint-plugin-prettier
```

```json
{
  "rulesDirectory": ["tslint-plugin-prettier"],
  "rules": {
    "prettier": true
  }
}
