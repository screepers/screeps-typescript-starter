/*
  Kung Fu Klan's Screeps Code
  Written and maintained by -
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/

// ------ end imports
import EmpireManager from "Managers/EmpireManager";
import MemoryManager from "Managers/MemoryManagement";
import RoomManager from "Managers/RoomManager";
import SpawnManager from "Managers/SpawnManager";
import { ErrorMapper } from "utils/ErrorMapper";
import UtilHelper from "Helpers/UtilHelper";
import RoomVisualManager from "Managers/RoomVisuals/RoomVisualManager";
import {
  ROOM_OVERLAY_ON,
  CREEP_MANAGER_BUCKET_LIMIT,
  SPAWN_MANAGER_BUCKET_LIMIT,
  EMPIRE_MANAGER_BUCKET_LIMIT,
  ROOM_MANAGER_BUCKET_LIMIT
} from "utils/config";
import CreepManager from "Managers/CreepManager";
import { ConsoleCommands } from "Helpers/ConsoleCommands";

export const loop = ErrorMapper.wrapLoop(() => {

  // Init console commands
  ConsoleCommands.init();

  // run the empire and get all relevant info from that into memory
  if (Game.cpu['bucket'] > EMPIRE_MANAGER_BUCKET_LIMIT) {
  }
  try { EmpireManager.runEmpireManager(); } catch (e) { UtilHelper.printError(e); }

  // run rooms
  if (Game.cpu['bucket'] > ROOM_MANAGER_BUCKET_LIMIT) {
  }
  try { RoomManager.runRoomManager(); } catch (e) { UtilHelper.printError(e); }

  // run spawning
  if (Game.cpu['bucket'] > SPAWN_MANAGER_BUCKET_LIMIT) {
  }
  try { SpawnManager.runSpawnManager(); } catch (e) { UtilHelper.printError(e); }


  // run creeps
  if (Game.cpu['bucket'] > CREEP_MANAGER_BUCKET_LIMIT) {
    try { CreepManager.runCreepManager(); } catch (e) { UtilHelper.printError(e); }
  }

  // clean up memory
  try { MemoryManager.runMemoryManager(); } catch (e) { UtilHelper.printError(e); }

  // Display room visuals if we have a fat enough bucket and config option allows it
  if (Game.cpu['bucket'] > 2000 && ROOM_OVERLAY_ON) {
    try { RoomVisualManager.runRoomVisualManager(); } catch (e) { UtilHelper.printError(e); }
  }

  // -------- end managers --------
});
