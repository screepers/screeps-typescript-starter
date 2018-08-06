# Troubleshooting

This page outlines any common issues that you'll run into while setting up the TypeScript starter, as well as how to fix them.

## Unable to upload code to Screeps private server

If you're getting the following error:

```text
(node:80116) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Cannot POST /api/auth/signin
```

Make sure you have [screepsmod-auth](https://github.com/ScreepsMods/screepsmod-auth) installed on your private server, and you've set a password on the account in your private server as well.

## Unable to extend type interfaces \(e.g. `Game`, `Memory`\)

Make sure you declare any extensions to the type interfaces as an [_ambient declaration_](https://stackoverflow.com/a/40916055). You can either:

* put them inside a `*.d.ts` file, or
* in an existing `.ts` file \(with at least one `import` or `export`\), you can use `declare global { interface CreepMemory { ... } }` to accomplish the same effect.

**For more info:** [https://github.com/screepers/typed-screeps/issues/27](https://github.com/screepers/typed-screeps/issues/27)

