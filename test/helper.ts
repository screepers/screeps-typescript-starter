/*

 Screeps Typescript Test Helper

 We add the following to the global namespace to mimic the Screeps runtime:
 + lodash
 + Screeps game constants

 */
//

const _ = require("lodash");
(<any> global)._ = _;
import consts from "./mock/game";

_.merge((<any> global), consts);

