# Module bundling

Bundling your Screeps codebase using module bundlers like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/) allows you to improve your Screeps AI development workflow.

For instance, it allows you to easily include third-party libraries, like [screeps-profiler](https://github.com/screepers/screeps-profiler) and [Traveler](https://github.com/bonzaiferroni/Traveler). Instead of manually copy-pasting these libraries into your code, you can simply install it as an `npm` module:

```bash
npm install screeps-profiler
```

Then you can import these libraries just like you would any other `npm` module. When you run the module bundler, it will bundle up all your files and third-party modules into one single JS file.

Some module bundlers even support performing further optimisations like eliminating unused module functions from your final bundled code \(aka. _tree-shaking_\), reducing the size of your final bundled JS even further.

## Rollup

From version 3.0 onwards, the starter kit uses Rollup as its main module bundler. Some useful features of Rollup include:

* Bundled modules are entirely flat \(no weird boilerplate code emitted like in Webpack\)
* Advanced tree-shaking \(eliminates unused modules from the final bundle\)
* Simpler configuration \(compared to Webpack\)

If you're still comfortable with using Webpack, the old version of the starter kit is available [here](https://github.com/screepers/screeps-typescript-starter/tree/legacy/webpack), but moving forward, no new features will be added to the Webpack version.

### Note: Rollup and named exports

By default, Rollup recognises ES6 modules. This means that some adjustments are necessary in order for Rollup to work well with CommonJS modules, particularly those with named exports like `screeps-profiler`. \(See [\#77](https://github.com/screepers/screeps-typescript-starter/issues/77)\)

In this case, you will have to manually specify the named exports you use, which is where the `rollup-plugin-commonjs` plugin comes into play. This plugin resolves any CommonJS modules and converts them to ES6 modules, which can be bundled.

Simply include the modules you want to bundle complete with its named exports, like so:

```javascript
commonjs({
  namedExports: {
    // left-hand side can be an absolute path, a path
    // relative to the current directory, or the name
    // of a module in node_modules
    'node_modules/my-lib/index.js': ['named']
  }
})
```

**For more info:** [`rollup-plugin-commonjs` docs](https://github.com/rollup/rollup-plugin-commonjs)

