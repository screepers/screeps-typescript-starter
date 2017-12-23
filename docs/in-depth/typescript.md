# TypeScript

TypeScript is, in our opinion, the best language to write your Screeps codebase in. It combines the familiarity of JavaScript with the power of static typing.

Static typing helps reduce the amount of bugs in your code by detecting type errors during compile time. In general, static type checkers like TypeScript and Flow [can prevent about 15%](https://blog.acolyer.org/2017/09/19/to-type-or-not-to-type-quantifying-detectable-bugs-in-javascript/) of the bugs that end up in committed code. Not only static typing, TypeScript also provides various productivity enhancements like advanced statement completion, as well as smart code refactoring.

To read more about how TypeScript can help you in Screeps, read [this Screeps World article](https://screepsworld.com/2017/07/typescreeps-getting-started-with-ts-in-screeps/) by [@bonzaiferroni](https://github.com/bonzaiferroni).

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

This project provides TSLint rules through a `tslint.json` file, which extends the recommended rules from TSLint defined [here](https://github.com/palantir/tslint/blob/next/src/configs/recommended.ts).

We've made some changes to these rules, which we considered necessary and/or relevant to a proper Screeps project:

 - set the [forin](http://palantir.github.io/tslint/rules/forin/) rule to `false`, it was forcing `for ( ... in ...)` loops to check if object members were not coming from the class prototype.
 - set the [interface-name](http://palantir.github.io/tslint/rules/interface-name/) rule to `false`, in order to allow interfaces that are not prefixed with `I`.
 - set the [no-console](http://palantir.github.io/tslint/rules/no-console/) rule to `false`, in order to allow using `console`.
 - in the [variable-name](http://palantir.github.io/tslint/rules/variable-name/) rule, added `allow-leading-underscore`.

### Customising TSLint

You can also customise your `tslint.json` file to match the preferences of your codebase. Click [here](https://palantir.github.io/tslint/usage/configuration/), to find out how, and click [here](https://palantir.github.io/tslint/rules/) for a complete list of rules available.

If you believe that some rules should not apply to a part of your code (e.g. for one-off cases like having to use `require()` to include a module), you can use flags to let TSLint know about it: https://palantir.github.io/tslint/usage/rule-flags/

**More info about TSLint:** https://palantir.github.io/tslint/
