# screeps-starter

> Starter kit for [TypeScript](http://www.typescriptlang.org/)-based [Screeps](https://screeps.com/) AI codes.

This starter kit is a modified version of the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project) by [Marko Sulamägi](https://github.com/MarkoSulamagi).

## Getting Started

After you create a spawn, this bot will create 4 creeps which will start to harvest the closest source. The bots harvest, then transfer energy back to Spawn. If a creep's lifespan has depleted enough, it will refill in Spawn.

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

## Contributing

1. [Fork it](https://github.com/resir014/screeps-typescript-starter/fork)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Create a new Pull Request

## Special thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).
