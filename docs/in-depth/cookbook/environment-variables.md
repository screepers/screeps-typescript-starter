# Managing deploys with environment variables

Environment variables provide a more streamlined way to manage your build process. We can also use it to define "build toggles", or environment-based variables that will be injected into your scripts to be used during runtime.

## Setting it up

Let's say that we want to set `NODE_ENV` to `production` for uploading to our main branch, and `development` for uploading to our Simulation branch. First we'll catch the environment variable and assign the compile target.

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

[TODO]
