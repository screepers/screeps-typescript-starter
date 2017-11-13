# screeps-typescript-starter v2.0

> Starter kit for [TypeScript](http://www.typescriptlang.org/)-based [Screeps](https://screeps.com/) AI codes.

-----

**screeps-typescript-starter** is a starter kit for building [Screeps](https://screeps.com/) AIs in [TypeScript](http://www.typescriptlang.org/).
It is based on [the original starter kit](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project) by [Marko Sulamägi](https://github.com/MarkoSulamagi), but with extra tools for easy compiling/deploying of scripts to the Screeps server, as well as a base framework for running tests.

[Download the latest zipped copy here.](https://github.com/screepers/screeps-typescript-starter/archive/master.zip)

## What's new

* [@bonzaiferroni](https://github.com/bonzaiferroni) has put out some really useful guides to get started with TypeScript development on Screeps. Go read them! ([Guide #1](https://screepsworld.com/2017/07/typescreeps-getting-started-with-ts-in-screeps/), [Guide #2](https://screepsworld.com/2017/07/typescreeps-installing-everything-you-need/))
* We've consolidated all of our guides into the [wiki page](https://github.com/screepers/screeps-typescript-starter/wiki). This README will be simplified to include the essentials to get you up and running. Feel free to contribute to the wiki as well!

---

## Table of contents

* [Features](#features)
* [Quick start](#quick-start)
* [Initial configuration](#initial-configuration)
* [Running the compiler](#running-the-compiler)
* [Further reading](#further-reading)
* [Contributing](#contributing)
* [Special thanks](#special-thanks)

## Features

- Automated deploy to public and private Screeps servers
- Live reload compiling of typescript code
- Highly configurable environment with sane defaults
- Pre-configured linting rules customized for screeps
- Typescript Screeps typings
- Logger which links with source code and git repo
- Screeps profiler
- "Snippets" directory for code you want to save, but don't want compiled or linted
- Modest starter code to get you started, but not hold your hand

## Quick start

By far, the easiest and quickest way to get started with TypeScript development on Screeps is to follow @bonzaiferroni's guides on Screeps World. Go read them!

* https://screepsworld.com/2017/07/typescreeps-getting-started-with-ts-in-screeps/
* https://screepsworld.com/2017/07/typescreeps-installing-everything-you-need/

### Requirements

We'll assume you have already downloaded/cloned the starter kit.

* [Node.js](https://nodejs.org/en/) (latest LTS is recommended)
* [Yarn](https://yarnpkg.com/en/) - Optional. You can use `npm` if you don't want to, but this is for your own sanity.

> **Why Yarn?** Yarn has a stronger dependency tree, supports lockfiles, and fixes most of the issues pre-`npm@5`. It also has a host of unique features as described on [their website](https://yarnpkg.com/en/), and is entirely compatible with `npm`.

### Installing the modules

Run the following the command to install the required packages and TypeScript declaration files if you are using yarn:

```bash
$ yarn
```

or, for npm:

```bash
$ npm install
```

## Initial configuration

### Configuring Screeps credentials

Create a copy of `config/credentials.example.json` and rename it to `config/credentials.json`.

**WARNING:** This file contains your secret credentials. **DO NOT** commit it into your repository!

```bash
# config/credentials.json
$ cp config/credentials.example.json config/credentials.json
```

In the newly created `credentials.json` file, change the `email` and `password` properties with your Screeps credentials.  The `serverPassword`, `token`, and `gzip` options are only for private servers that support them.  If you are uploading to the public Screeps server, you should delete these fields from your credentials file.

### Changing the upload branch

Go to `config/config.dev.ts`, and you'll find the following lines:

```ts
const credentials: Credentials = require("./credentials.json");
credentials.branch = "dev";
```

Change the `credentials.branch` property you want to initially build and upload to, e.g. `"default"`. Note that due to the Screeps API limitations, you still have to create a branch with a matching name in the Screeps client by cloning an existing branch. The compiler will yell at you when you forgot to do so.

You can also set it to `$activeWorld` to upload to whatever branch is active in the Screeps world.

### Advanced configuration

See [Configuration page](https://github.com/screepers/screeps-typescript-starter/wiki/Configuration) on the screeps-typescript-starter wiki for more in-depth info on configuration options.

## Running the compiler

```bash
# To compile and upload your TypeScript files on the fly in "watch mode":
$ npm start

# To compile and deploy once:
$ npm run deploy
```

## Further reading

To find out more about what else you can do with screeps-typescript-starter, head over to the [screeps-typescript-starter wiki](https://github.com/screepers/screeps-typescript-starter/wiki) to find more guides, tips and tricks.

## Contributing

Issues, Pull Requests, and Wiki contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) beforehand.

## Special thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).
