const { Config } = require('webpack-config');
const ScreepsWebpackPlugin = require('screeps-webpack-plugin');

module.exports = new Config().extend('./config/config.defaults').merge({
  plugins: [
    new ScreepsWebpackPlugin(getCredentials())
    // new ScreepsWebpackPlugin(Object.assign(require('./credentials.json'), {
    //   branch: 'dev'
    // }))
  ]
});

function getCredentials() {
  const cred = require('./credentials.json');
  Object.assign(cred, { branch: 'dev' });
  return cred;
}
