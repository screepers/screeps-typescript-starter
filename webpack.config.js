const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/main.ts',
  output: {
    filename: './dist/[name].js',
    pathinfo: true,
    libraryTarget: 'commonjs2',
    sourceMapFilename: '[file].map.js', // normally this is [file].map, but we need a js file, or it will be rejected by screeps server.
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
        'main.js.map': './main.js.map'
    },
  ],

  plugins: [
    new CheckerPlugin(),
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
        exclude: [ path.resolve(__dirname, "src/snippets") ],
        loader: 'awesome-typescript-loader',
        options: { configFileName: "tsconfig.json" }
      },
      ////
      // tslint rules
      {
        test: /\.tsx?$/,
        exclude: [ path.resolve(__dirname, "src/snippets") ],
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
};
