/*
  Kung Fu Klan's Screeps Code
  Written and maintained by -
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/

// Define prototypes
import { ErrorMapper, ManagerManager } from "utils/internals";

export const loop = ErrorMapper.wrapLoop(() => {
    ManagerManager.runManagerManager();
});
