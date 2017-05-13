const { Config } = require('webpack-config');
const ScreepsWebpackPlugin = require('screeps-webpack-plugin');

// There is a potential bug in screeps webpack plugin causing the modules
// to take the same name as the exported file.. including the extension
// https://github.com/langri-sha/screeps-webpack-plugin/blob/master/index.js#L110
// our exported file must not end in `.js` to work around this
module.exports = new Config().extend('./config/config.defaults').merge({
  // output: {
  //   filename: 'main', // Screeps webpack expects this file to just be named `main`
  //   pathinfo: false,  // the docs strongly recommend `false` in production
  //   libraryTarget: 'commonjs2',
  //   sourceMapFilename: '[file].map.js', // normally this is [file].map, but we need a js file, or it will be rejected by screeps server.
  //   devtoolModuleFilenameTemplate: '[resource-path]'
  // },
  plugins: [
    new ScreepsWebpackPlugin(Object.assign(require('./credentials.json'), {
      branch: 'dev'
    }))
  ]
});
