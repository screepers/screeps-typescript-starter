# Managing deploys with environment variables

Environment variables provide a more streamlined way to manage your build process. We can also use it to define "build toggles", or environment-based variables that will be injected into your scripts to be used during runtime.

## Setting it up

Let's say that we want to set `NODE_ENV` to `production` for uploading to our main branch, and `development` for uploading to our Simulation branch. First we'll catch the environment variable and assign the compile target based on it.

```js
// rollup.config.js

const isProduction = process.env.NODE_ENV === 'production'

// use the `main` target from `screeps.json` in production mode
const cfg = isProduction ? 'main' : 'sim';

export default {
  // ...
  plugins: [
    // ...
    screeps({
      config: require("./screeps")[cfg],
      // if `NODE_ENV` is local, perform a dry run
      dryRun: process.env.NODE_ENV === 'local'
    })
  ]
}
```

## Running a deploy

Then we'll change the build tasks on `package.json` to pass the environment variable before running the rollup command.

```json
{
  "tasks": {
    "deploy-prod": "NODE_ENV=production rollup -c",
    "deploy-dev": "NODE_ENV=development rollup -c",
  }
}
```

**Note:** On Windows, setting the environment variables as defined above will not work. For a cross-platform solution to define environment variables, use `cross-env`.

```bash
npm install --save-dev cross-env
```

```json
{
  "tasks": {
    "deploy-prod": "cross-env NODE_ENV=production rollup -c",
    "deploy-dev": "cross-env NODE_ENV=development rollup -c",
  }
}
```

Now let's give it a try! Run `npm run deploy-dev` or `npm run deploy-prod` and see if your code is uploaded properly.

## Setting up build toggles

You can also setup deployment-dependent variables (aka. "build toggles") that are injected to your code during build time to allow for more advanced optimisations like dead code elimination.

To do this, install `rollup-plugin-replace`.

```bash
# npm
$ npm install --save-dev rollup-plugin-replace

# yarn
$ yarn add --dev rollup-plugin-replace
```

Then configure your `rollup.config.js` to include your desired variables.

```js
// rollup.config.js
import replace from 'rollup-plugin-replace';

export default {
  plugins: [
    replace({
      // returns 'true' if code is bundled in prod mode
      PRODUCTION: JSON.stringify(isProduction),
      // you can also use this to include deploy-related data, such as
      // date + time of build, as well as latest commit ID from git
      __BUILD_TIME__: JSON.stringify(Date.now()),
      __REVISION__: JSON.stringify(require('git-rev-sync').short()),
    })
  ]
};
```

> **Note:** Generally, you need to ensure that `rollup-plugin-replace` goes *before* other plugins, so we can be sure Rollup replaces these variables correctly and the remaining plugins can apply any optimisations (e.g. dead code elimination) correctly.

> **Note:** Because these values are evaluated once as a string (for the find-and-replace), and once as an expression, they need to be wrapped in `JSON.stringify`.

Variables set by this plugin will be replaced in the actual output JS code. When compiling your code, Rollup will replace the variable names with the output of the supplied expression or value.

Once it's set up, you use it in your code.

```ts
// log the latest commit ID from git
if (__REVISION__) {
  console.log(`Revision ID: ${__REVISION__}`)
}

export function loop() {
  if (!PRODUCTION) {
    // will only be included in development mode
    devLogger.log('loop started')
  }
}
```

### Notes

Since TypeScript won't recognise these variables if you pass it blindly into your code, you will still need to declare them in a type definition (.d.ts) file.

```ts
// file.d.ts

declare const __REVISION__: string;
declare const __BUILD_TIME__: string;
```

Also, be careful not to use too common of a name, because it will replace it throughout your code without warning. A good standard is to make the variables all caps, and surrounded by double underscores, so they stand out (e.g. `__REVISION__`).
