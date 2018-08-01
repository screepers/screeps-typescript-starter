# Prettier

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
