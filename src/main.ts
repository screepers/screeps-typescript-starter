/*
  Kung Fu Klan's Screeps Code
  Written and maintained by -
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/

// ------ end imports
// @ts-ignore
import ConsoleCommands from "Helpers/ConsoleCommands";
// @ts-ignore
import EmpireManager from "Managers/EmpireManager";
// @ts-ignore
import MemoryManager from "Managers/MemoryManagement";
// @ts-ignore
import RoomManager from "Managers/RoomManager";
// @ts-ignore
import SpawnManager from "Managers/SpawnManager";
// @ts-ignore
import { ErrorMapper } from "utils/ErrorMapper";
// @ts-ignore
import UtilHelper from "Helpers/UtilHelper";
// @ts-ignore
import RoomVisualManager from "Managers/RoomVisuals/RoomVisualManager";

import { ERROR_FATAL, ERROR_ERROR, ERROR_INFO, ERROR_WARN } from "utils/Constants";

export const loop = ErrorMapper.wrapLoop(() => {

  // run the empire and get all relevant info from that into memory
  try { EmpireManager.runEmpireManager(); } catch (e) { UtilHelper.printError(e); }

  // run rooms
  try { RoomManager.runRoomManager(); } catch (e) { UtilHelper.printError(e); }

  // run spawning
  try { SpawnManager.runSpawnManager(); } catch (e) { UtilHelper.printError(e); }

  // clean up memory
  try { MemoryManager.runMemoryManager(); } catch (e) { UtilHelper.printError(e); }

  // Display room visuals if we have a fat enough bucket
  if (Game.cpu['bucket'] > 2000) {
    try { RoomVisualManager.runRoomVisualManager(); } catch (e) { UtilHelper.printError(e); }
  }


  // -------- end managers --------
});
