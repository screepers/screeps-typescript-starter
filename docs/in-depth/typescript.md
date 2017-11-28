# TypeScript

This section provides TypeScript-specific tips &amp; tricks for you to make the best out of the ecosystem.

## Strict mode

The `--strict` compiler flag was introduced in TypeScript 2.3 which activates TypeScript's "strict mode". The strict mode sets all strict typechecking options to `true` by default.

As of TypeScript 2.6, the affected options are:

* `--noImplicitAny`
* `--noImplicitThis`
* `--alwaysStrict`
* `--strictNullChecks`
* `--strictFunctionTypes`

Starting from version 2.0 of the starter kit, we've enabled the `--strict` flag in `tsconfig.json`. If this gives you compile time errors, you can try setting `"strict"` to `false`, or by overriding one or more of the options listed above.

**For more info:** https://blog.mariusschulz.com/2017/06/09/typescript-2-3-the-strict-compiler-option

## TSLint

TSLint checks your TypeScript code for readability, maintainability, and functionality errors, and can also enforce coding style standards.

[TODO: describe TSlint rules used in brief]

### Customising TSLint

You can also customise your `tslint.json` file to match the preferences of your codebase. Click [here](https://palantir.github.io/tslint/usage/configuration/), to find out how, and click [here](https://palantir.github.io/tslint/rules/) for a complete list of rules available.

If you believe that some rules should not apply to a part of your code (e.g. for one-off cases like having to use `require()` to include a module), you can use flags to let TSLint know about it: https://palantir.github.io/tslint/usage/rule-flags/

**More info about TSLint:** https://palantir.github.io/tslint/
