# Deploying

## Building your configuration file

The starter kit builds your code using `rollup`, which uses a `screeps.json` file we built on the previous section as its configuration file.

The `screeps.json` file is a JSON configuration file separated into multiple environments. We're going to focus on the `main` environment to get you started. If you'd like to deploy to a different branch, be sure to change the `branch` key to the branch you'd like to deploy to.

{% hint style="info" %}
You don't have to manually create the target branch in your Screeps client if it doesn't exist yet. `rollup-plugin-screeps` will do it for you.
{% endhint %}

## Running your first deploy

Once you're done, run the following command:

```bash
npm run push-main
```

You're done! Now go to your Screeps client and make sure your code is deployed properly.

![deploying-2](../.gitbook/assets/deploying-2.png)

## Deploying to a private server

Screeps also lets you run your own private server. This can be a great way to test your code in a safe environment, and you can add mods that allow you to customize your server as well, such as drastically increasing the tickrate.

To find out more about how to use or run your own private server, see the official server repository [here](https://github.com/screeps/screeps).

To deploy to a private server, run the following command:

```bash
npm run push-pserver
```

If you are having trouble pushing your code, make sure to check your `screeps.json`.

For `"pserver"` the json properties are a little confusing:

- `"email"` should actually contain the username of your account on the private server you are trying to connect to, __which may be different from your account on the official Screeps shards!__

- `"password"` will need to be set for that account manually on the private server, [see here](https://github.com/screeps/screeps#authentication)

- `"hostname"` is the IP address of the server. If you are hosting your own server locally, the default localhost IP for most networks is `127.0.0.1`

Ready for something extra? [Read on.](../in-depth/module-bundling.md)

