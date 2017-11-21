# Screeps Typescript Starter

Screeps Typescript Starter is a starting point for a Screeps AI written in Typescript. It provides everything you need to start writing your AI whilst leaving `main.ts` as empty as possible.

## Usage

You will need:

 - Node.JS (Latest LTS is recommended)
 - A Package Manager (Yarn or NPM)

Download the latest source [here](https://github.com/screepers/screeps-typescript-starter/archive/v3.0.zip) and extract it to a folder.

Open the folder in your terminal and run `npm install` (or `yarn`) to install the dependencies.

Fire up your preferred editor with typescript installed and you are good to go!

### Rollup

Screeps Typescript Starter uses rollup to compile your typescript and upload it to a screeps server.

Change `screeps.sample.json` to `screeps.json` and update the settings.

Running `rollup -c` will compile and upload your code.

## Typings

The typings for Screeps comes from [typed-screeps](https://github.com/screepers/typed-screeps), if you have an issue with incorrect typings open an issue there.
