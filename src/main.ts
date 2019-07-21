/*
  Kung Fu Klan's Screeps Code
  Written and maintained by -
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/

// Define prototypes
import { ErrorMapper } from "utils/ErrorMapper";
import ManagerManager from "Managers/ManagerManager";
import "./proto/structures.prototype";

export const loop = ErrorMapper.wrapLoop(() => {
    ManagerManager.runManagerManager();
});
