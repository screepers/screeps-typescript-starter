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
  console.log("!!!!!!!!!");
  const cred = require('./credentials.json');
  console.log(JSON.stringify(cred));
  Object.assign(cred, { branch: 'dev' });
  console.log(JSON.stringify(cred));
  return cred;
}
