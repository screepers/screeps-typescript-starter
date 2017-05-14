const { Config } = require('webpack-config');
const ScreepsWebpackPlugin = require('screeps-webpack-plugin');

// There is a potential bug in screeps webpack plugin causing the modules
// to take the same name as the exported file.. including the extension
// https://github.com/langri-sha/screeps-webpack-plugin/blob/master/index.js#L110
// our exported file must not end in `.js` to work around this
module.exports = new Config().extend('./config/config.defaults').merge({
  // the "branch" member needs to be merged with credentials in order
  // for ScreepsWebpackPlugin to use it.
  plugins: [
    new ScreepsWebpackPlugin(Object.assign(require('./credentials.json'), {
      branch: 'dev'
    }))
  ]
});
