# Deploying

## Building your configuration file

The starter kit builds your code using `rollup`, which uses a `screeps.json` file as its configuration file. A sample config file is provided within the project, to use it, simply make a copy and rename it to `screeps.json`.

```bash
cp screeps.sample.json screeps.json
```

> **IMPORTANT:** The `screeps.json` file contains your Screeps credentials. If you use any source control, **DO NOT** check in this file into your repository.

The `screeps.json` file is a JSON configuration file separated into multiple environments. We're going to focus on the `main` environment to get you starter. Fill in your Screeps credentials accordingly, along with your target branch.

![deploying-1](img/deploying-1.png)

> **Note:** You don't have to manually create the target branch in your Screeps client if it doesn't exist yet. `rollup-plugin-screeps` will do it for you.

## Running Your First Deploy

Once you're done, run the following command:

```bash
npm run push-main
```

You're done! Now go to your Screeps client and make sure your code is deployed properly.

![deploying-2](img/deploying-2.png)

Ready for something extra? Read on.
