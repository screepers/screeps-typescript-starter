# Module bundling

Bundling your Screeps codebase using module bundlers like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/) allows you to improve your Screeps AI development workflow.

For instance, it allows you to easily include third-party libraries, like [screeps-profiler](https://github.com/screepers/screeps-profiler) and [Traveler](https://github.com/bonzaiferroni/Traveler). Instead of manually copy-pasting these libraries into your code, you can simply install it as an `npm` module:

```bash
npm install screeps-profiler
```

Then you can import these libraries just like you would any other `npm` module. When you run the module bundler, it will bundle up all your files and third-party modules into one single JS file.

Some module bundlers even support performing further optimisations like eliminating unused module functions from your final bundled code (aka. _tree-shaking_), reducing the size of your final bundled JS even further.

[TODO: more advantages of bundling code, if any]

## Rollup

From version 3.0 onwards, the starter kit uses Rollup as its main module bundler. Some useful features of Rollup include:

* Bundled modules are entirely flat (no weird boilerplate code emitted like in Webpack)
* Advanced tree-shaking (eliminates unused modules from the final bundle)
* Simpler configuration (compared to Webpack)

If you're still comfortable with using Webpack, the old version of the starter kit is available here (**TODO:** legacy branch link), but moving forward, no new features will be added to the Webpack version.
