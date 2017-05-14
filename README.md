# screeps-typescript-starter v2.0

> Starter kit for [TypeScript](http://www.typescriptlang.org/)-based [Screeps](https://screeps.com/) AI codes.

-----

**screeps-typescript-starter** is a starter kit for building [Screeps](https://screeps.com/) AIs in [TypeScript](http://www.typescriptlang.org/).
It is based on [the original starter kit](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project) by [Marko Sulamägi](https://github.com/MarkoSulamagi), but with extra tools for easy compiling/deploying of scripts to the Screeps server, as well as a base framework for running tests.

[Download the latest zipped copy here.](https://github.com/screepers/screeps-typescript-starter/archive/master.zip)

## Table of Contents
* [Features](#features)
* [Quick Start](#quick-start)
* [Configuration](#configuration)
* [Testing](#testing)
* [Notes](#notes)
* [Contributing](#contributing)

## Features

- Automated deploy to public and private Screeps servers
- Live reload compiling of typescript code
- Highly configurable environment with sane defaults
- Pre-configured linting rules customized for screeps
- Typescript Screeps typings
- Logger which links with source code and git repo (TODO: pending documentation)
- Screeps profiler
- "Snippets" directory for code you want to save, but don't want compiled or linted
- Modest starter code to get you started, but not hold your hand


## Quick Start

### Requirements

* [Node.js](https://nodejs.org/en/) (latest LTS is recommended)
* [Yarn](https://yarnpkg.com/en/) - Optional. You can use `npm` if you don't want to, but this is for your own sanity.

For testing **NOTE** _Testing is currently a work-in-progress_:

* [Mocha](https://mochajs.org/) test runner and [NYC](https://istanbul.js.org/) for code coverage - `yarn global add nyc mocha`

### Download

To get started, [download a zipped copy](https://github.com/screepers/screeps-typescript-starter/archive/master.zip) of the starter kit and extract it somewhere, or clone this repo.

### Install all required modules!

Run the following the command to install the required packages and TypeScript declaration files if you are using yarn:

```bash
$ yarn
```

or, for npm:

```bash
$ npm install
```
### Configure Screeps credentials

Create a copy of `config/credentials.example.json` and rename it to `config/credentials.json`.

**WARNING: DO NOT** commit this file into your repository!

```bash
# config/credentials.json
$ cp config/credentials.example.json config/credentials.json
```

In the newly created `credentials.json` file, change the `email` and `password` properties with your Screeps credentials.  The `serverPassword`, `token`, and `gzip` options are only for private servers that support them.  If you are uploading to the public Screeps server, you should delete these fields from your credentials file.

See [Configuration](#configuration) for more in-depth info on configuration options.

### Run the compiler

```bash
# To compile and upload your TypeScript files on the fly in "watch mode":
$ npm start

# To compile and deploy once:
$ npm run deploy
```


## Configuration

This project is configured in two places. `config/` is for deployment configuration, and contains your screeps login credentials along with other options.
`src/config/` contains a file you can use to configure your runtime Screeps code.

### Runtime config

You can use the configuration variables in `src/config` by importing the file:

```js
import * as Config from "../path/to/config";
```

... and simply calling the config variables with `Config.CONFIG_VARIABLE` in your code.  This file mostly servers as an example for making configurable code.

_**NOTE**: You may want to consider adding this file to `.gitignore` if you end up storing confidential information there._

### Deployment / Compiling configuration

The files under `config/`, as well as `webpack.config.ts` are where deployment configuration options are set.

It's helpful to remember that the config is just a javascript object, and can be passed around and modifide using [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain).


#### Environment:

`webpack.config.ts` is for setting environment variables defaults throughout the rest of the config.
You can use these variables to pass options to the rest of the config through the command line.
For example:

```bash
# (npm requires arguments be seperated by a double dash)
$ npm run build -- --env.TEST=true
```
Will set the member `TEST` to `true` on the options object.

Remember, the config code is just a typescript function that return a config object, so you can hypothetically configure it wherever and however is most convenient.

#### Build toggles / deployment-dependent variables

Inside `config.common.ts` is where the majority of the webpack configuration happens.

Of particular interest is the Plugins section where `DefinePlugin` is configured (look for the line about half-way down statring with `config.plugin("define")`).

Variables set in the object here will be replaced in the actual output JS code.
When compiling your code, webpack will perform a search and replace, replacing the variable names with the output of the supplied expression or value.

Because these values are evaluated once as a string (for the find-and-replace), and once as an expression, they either need to be wrapped in `JSON.stringify` or double quoted (ex. `VARIABLE: '"value-in-double-quotes"'`).

Webpack can do a lot with these variables and dead code elimination.

*__Caveats__: you need to let typescript know about these variables by declaring them in a type definitions (`.d.ts`) file.
Also be careful not to use too common of a name, because it will replace it throughout your code without warning.
A good standard is to make the variables all caps, and surrounded by double underscores, so they stand out (ex: `__REVISION__`).*

#### Additional Options

`config.common.js` is for config options common to all environments.  Other environments can inherit from this file, and add to, or override options on the config object.

`config.dev.js` is a specific environment configuration.  You can potentially have as many environments as you make files for (only a `dev` environment is provided to start with).  To specify which environment to use, append `--env.ENV=` and the environment name to any commands.  An example is provided in `package.json`.

Common options you may wish to configure:

`output.path`:  This is the output path for the compiled js.  If you are running a local server, you may consider adding an environment that outputs directly to the screeps local folder.  This is equivalent to the `localPath` setting in older versions of the screeps-typescript-starter.

`watchOptions.ignored`:  This option is only to save computer resources, since watch-mode (`npm start`) can be CPU intensive.  You can exclude directories you know don't need to be watched.

`module.rules`:  These are the individual rules webpack uses to process your code.  The defaults are generally all you will need.  The most useful change you may want to make here is to explicity `exclude` files or directories from being compiled or linted (in case of 3rd party code, for example).  These values, like all others can be passed around and modified before webpack acts on them.

#### Change the upload branch

You code is uploaded to the branch configured by the `branch` property on the object sent to `new ScreepsWebpackPlugin` (see `config/config.dev.ts`).  You have three ways to customize this:

1.  Multiple config environment files, each with a seperate branch
2.  Use the special variables `'$activeWorld'` to upload to whatever brach is active in the Screeps world
3.  Configure a new environment variable in `webpack.config.ts` and use that in your code.  For example:

```typescript
// webpack.custom-env.ts
const ScreepsWebpackPlugin = require("screeps-webpack-plugin");
const git = require('git-rev-sync'); // make sure you require `git-rev-sync`

const credentials: Credentials = require("./credentials.json");
credentials.branch = git.branch();

config.plugin("screeps").use(ScreepsWebpackPlugin, [credentials]);

```

The above example will automatically set your upload branch to be the same as your active git branch.  This is functionally equivalent to the option `"autobranch": true` in older versions.

You still have to create matching branch in screeps client by cloning an existing branch (API limitation). This is useful when setting up deployment pipelines that upload on commit after successful build (so a commit to `major_refactoring` branch doesn't overwrite your default branch in the middle of epic alliance action just because you forgot to update a pipeline configuration).


## Testing

### Running Tests
**WARNING** _Testing functionality is currently not finished in the 2.0 build of the Starter.

To enable tests as part of the build and deploy process, flip the `test` flag in your `config.json` to `true`.

You can always run tests by running `npm test`. You can get a code coverage report by running
`npm test:coverage`. Then opening `coverage/index.html` in your browser.

### Writing Tests

All tests should go in the `test/` directory and end in the extension `.test.ts`.

All constants are available globally as normal.

The game state is no simulated, so you must mock all game objects and state that your code requires.
As part of this project, we hope to provide some helpers for generating game objects.

It is recommended to test the smallest pieces of your code at a time. That is, write tests that
assert the behavior of single, small functions. The advantages of this are:

1. less mocking to setup and maintain
2. allows you to test behavior, not implementation

See [test/components/creeps/creepActions.test.ts](test/components/creeps/creepActions.test.ts) as
an example on how to write a test, including the latest game object mocking support.

For writing assertions we provide [chai](http://chaijs.com). Check out their
[documentation](http://chaijs.com/guide/styles/) to learn how to write assertions in your tests.

**Important:** In your tests, if you want to use lodash you must import it explicitly to avoid errors:

```js
import * as _  from "lodash"
```

## Notes

### Sample code

This starter kit includes a bit of sample code, which uses some of the new TS2 features mentioned earlier. Feel free to build upon this as you please, but if you don't want to use them, you can remove everything from within the `src/` directory and start from scratch.

When starting from scratch, make sure a `main.ts` file exists with a `loop()` function. This is necessary in order to run the game loop.

**Source:** http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture

### The `noImplicitAny` compiler flag

TypeScript developers disagree about whether the `noImplicitAny` flag should be `true` or `false`. There is no correct answer and you can change the flag later. But your choice now can make a difference in larger projects so it merits discussion.

When the `noImplicitAny` flag is `false` (the default), the compiler silently defaults the type of a variable to `any` if it cannot infer the type based on how the variable is used.

When the `noImplicitAny` flag is `true` and the TypeScript compiler cannot infer the type, it still generates the JavaScript files. But it also reports an error. Many seasoned developers prefer this stricter setting because type checking catches more unintentional errors at compile time.

In this starter kit, the `noImplicitAny` is set to `true` for a more stricter environment. If you don't like this, you can change the `noImplicitAny` flag to `false` on the `tsconfig.json` file.

**Source:** https://angular.io/docs/ts/latest/guide/typescript-configuration.html


### TSLint

TSLint checks your TypeScript code for readability, maintainability, and functionality errors, and can also enforce coding style standards.

After each successful compiling of the project, TSLint will parse the TypeScript source files and display a warning for any issues it will find.

You can change the file paths checked automatically by editing the paths in the `tslint` section of `config.json`.

This project provides TSLint rules through a `tslint.json` file, which extends the recommended set of rules from TSLint github repository: https://github.com/palantir/tslint/blob/next/src/configs/recommended.ts

We made some changes to those rules, which we considered necessary and/or relevant to a proper Screeps project:

 - set the [forin](http://palantir.github.io/tslint/rules/forin/) rule to `false`, it was forcing `for ( ... in ...)` loops to check if object members were not coming from the class prototype.
 - set the [interface-name](http://palantir.github.io/tslint/rules/interface-name/) rule to `false`, in order to allow interfaces that are not prefixed with `I`.
 - set the [no-console](http://palantir.github.io/tslint/rules/no-console/) rule to `false`, in order to allow using `console`.
 - in the [variable-name](http://palantir.github.io/tslint/rules/variable-name/) rule, added `allow-leading-underscore`.

If you believe that some rules should not apply to a part of your code, you can use flags to let TSLint know about it: https://palantir.github.io/tslint/usage/rule-flags/

**More info about TSLint:** https://palantir.github.io/tslint/

### Source maps

**TODO: Fix this readme info**
Works out of the box with "npm run deploy-prod" and default values from src/config/config.example.ts. Links back to source control when configured. Code has to be committed at build time and pushed to remote at run time for this to work correctly.

Doesn't work in sim, because they do lots of evals with scripts in sim.

Currently maps are generated, but "source-maps" module doesn't get uploaded for non-webpack builds.

Log level and output can be controlled from console by setting level, showSource and showTick properties on log object.

```js
// print errors only, hide ticks and source locations
log.level = 1;
log.showSource = false;
log.showTick = false;
```

![Console output example](/console.png "Console output example")

**TODO: Fix this readme info**
**Note:** As a side effect of changing the project to webpack, the built-in URL template is no longer automatically configured. GitHub and GitLab. If you use Bitbucket, replace `LOG_VSC_URL_TEMPLATE` on your `config.ts` with this:

```ts
export const LOG_VSC_URL_TEMPLATE = (path: string, line: string) => {
  const parts = path.split('/');
  const filename: string = parts[parts.length - 1];
  return `${LOG_VSC.repo}/src/${LOG_VSC.revision}/${path}?fileviewer=file-view-default#${filename}-${line}`;
};
```

(Thanks to crzytrane on Slack for this code sample!)

## Contributing

1. [Fork it](https://github.com/screepers/screeps-typescript-starter/fork)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Create a new Pull Request

## Special thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).
