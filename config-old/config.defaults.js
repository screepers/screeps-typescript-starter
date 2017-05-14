const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ScreepsSourceMapToJson = require('../libs/screeps-webpack-sources');
const { Config } = require('webpack-config');
const git = require('git-rev-sync');
const webpack = require('webpack');
const path = require('path');

// WARNING: don't use `__dirname` in these files unless you are sure of
// what you want, since it will resolve to the `config/` dir, instead of
// the project root

module.exports = new Config().merge({
  // devtool: 'source-map-inline', // https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',
  entry: { main: './src/main.ts' },
  output: {
    // filename: 'main.js',
    filename: 'main.js',
    path: path.join('[root]', 'dist', '[env]'),
    pathinfo: false,  // the docs strongly recommend `false` in production
    libraryTarget: 'commonjs2',
    sourceMapFilename: '[file].map', // normally this is [file].map, but we need a js file, or it will be rejected by screeps server.
    devtoolModuleFilenameTemplate: '[resource-path]'
  },

  target: 'node',

  node: {
    console: true,
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },

  watchOptions: {
    ignored: [
      /node_modules/,
    ]
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    // https://basarat.gitbooks.io/typescript/docs/quick/browser.html
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    // see for more info about TsConfigPathsPlugin
    // https://github.com/s-panferov/awesome-typescript-loader/issues/402
    plugins: [
      new TsConfigPathsPlugin()
    ]
    // alternative method
    // modules: [path.resolve(__dirname, "src"), "node_modules"]
  },

  externals: [
    {
        // webpack will not try to rewrite require("main.js.map")
        'main.js.map': 'main.js.map'
    },
  ],

  plugins: [
    // this plugin is for typescript's typeschecker to run in async mode
    new CheckerPlugin(),
    // this plugin wipes the `dist` directory clean before each new deploy
    new CleanWebpackPlugin(
      [ 'dist/[env]/*' ],  // array of paths to clean
      { root: '[root]' }
    ),
    // you can use this to define build toggles; keys defined here
    // will be replaced in the output code with their values;
    // Note that because the plugin does a direct text replacement,
    //   the value given to it must include actual quotes inside of the
    //   string itself. Typically, this is done either with either
    //   alternate quotes, such as '"production"', or by using
    //   JSON.stringify('production').
    // Make sure to let typescript know about these via `define` !
    // See https://github.com/kurttheviking/git-rev-sync-js for more git options
    new webpack.DefinePlugin({
      __BUILD_TIME__: JSON.stringify(Date.now()),  // example defination
      __REVISION__: JSON.stringify(git.short()),
      PRODUCTION: JSON.stringify(true)
    }),
    new ScreepsSourceMapToJson()
  ],

  module: {
    rules: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre' },
      { test: /\.tsx?$/, loader: 'source-map-loader', enforce: 'pre' },

      ////
      // typescript rules
      {
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        test: /\.tsx?$/,
        exclude: [ path.join("[root]", "src/snippets") ],
        loader: 'awesome-typescript-loader',
        options: { configFileName: "tsconfig.json" }
      },
      ////
      // tslint rules
      {
        test: /\.tsx?$/,
        exclude: [
          path.join("[root]", "src/snippets"),
          path.join("[root]", "src/lib")
        ],
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          // enables type checked rules like 'for-in-array'
          // uses tsconfig.json from current working directory
          typeCheck: false,
          // automaticall fix linting errors
          fix: false,
          // you can search NPM and install custom formatters
          formatter: 'stylish'
        }
      }
    ]
  }
});
