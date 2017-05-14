import * as webpack from "webpack";
// import * as Config from "webpack-chain";

import * as CommonConfig from "./config.common";
import { EnvOptions } from "./options";

function webpackConfig(options: EnvOptions = {}): webpack.Configuration {
  // get the common configuration to start with
  const config = CommonConfig.init(options);

  // make "dev" specific changes here

  // call `toConfig` to convert to webpack object, and return it
  return config.toConfig();
}

module.exports = webpackConfig;
