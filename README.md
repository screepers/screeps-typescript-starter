# screeps-starter

> Starter kit for [TypeScript](http://www.typescriptlang.org/)-based [Screeps](https://screeps.com/) AI codes.

This starter kit is a modified version of the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project) by [Marko Sulamägi](https://github.com/MarkoSulamagi).

## Getting Started

After you create a spawn, this bot will create 4 creeps which will start to harvest the closest source. The bots harvest, then transfer energy back to Spawn. If a creep's lifespan has depleted enough, it will refill in Spawn.

### Important note about Typings definitions

The Screeps type definitions included might not be the latest version available! Until it's available from within the Typings repository, don't forget to update the **commit hash** of the Screeps type definitions from within `typings.json` into the latest hash. View their repository [here](https://github.com/screepers/Screeps-Typescript-Declarations) for latest updates.

Another option is to install it directly via npm.

```bash
$ npm install --save screeps-typescript-declarations
```

Once installed include it by going to `tsconfig.json` and adding `node_modules/screeps-typescript-declarations/dist/screeps.d.ts` just after `typings/index.d.ts` within the `files` property.

> **Heads up!** Be sure to add the type definitions **before** other files within the `files` property of the `tsconfig.json` file, else VS Code will (sometimes) shit the bed and show a lot of errors regarding missing types.

### Requirements

* [Node.js](https://nodejs.org/en/) (v4.0.0+)
* Gulp - `npm install -g gulp`
* TypeScript - `npm install -g typescript`
* Typings - `npm install -g typings`

### Quick setup

First, create a copy of `config.example.json` and rename it to `config.json`.

```bash
$ cp config.example.json config.json
```

Then change the `username` and `password` properties with your Screeps credentials.

If you want to push your code to another branch, for example, if you have some sort of a staging branch where you test around in Simulation mode, we have left a `branch` option for you to easily change the target branch of the upload process. The `default` branch is set as the default.

**WARNING: DO NOT** commit this file into your repository!

Then run the following the command to install the required npm packages and TypeScript type definitions.

```bash
$ npm install
```

### Running the compiler

```bash
# To compile your TypeScript files on the fly
$ npm start

# To deploy the code to Screeps
$ npm run deploy
```

## Special thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).
