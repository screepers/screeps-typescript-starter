const { Config } = require('webpack-config');
const environment = require('webpack-config').environment;
const path = require('path');

// we need to define a root path here so we can avoid weird relative
// paths in the `config/` dir
//  these variables will be replaced throughout the config when used
//  as a string.  Ex:
//      "config.[env].js" becomes "config.dev.js"
environment.setAll({
  "env": process.env.NODE_ENV || "dev",
  "root": __dirname
});

module.exports = new Config().extend('./config/config.[env].js');
