# Troubleshooting

This page outlines any common issues that you'll run into while setting up the TypeScript starter, as well as how to fix them.

## Unable to upload code to Screeps private server

If you're getting the following error:

```
(node:80116) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Cannot POST /api/auth/signin
```

Make sure you have [screepsmod-auth](https://github.com/ScreepsMods/screepsmod-auth) installed on your private server, and you've set a password on the account in your private server as well.
