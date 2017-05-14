import * as Config from "webpack-chain";

import { EnvOptions } from "./options";

export function init(options: EnvOptions = {}): Config {
  const config = new Config();

  // set all common configurations here


  // return the config object
  return config;
}
