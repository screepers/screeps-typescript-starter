/*
  Kung Fu Klan's Screeps Code
  Written and maintained by - 
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/

import { ConsoleCommands } from "Helpers/ConsoleCommands";
import { EmpireManager } from "Managers/EmpireManager";
import { MemoryManager } from "Managers/MemoryManagement";
import { RoomManager} from "Managers/RoomManager";
import { SpawnManager } from "Managers/SpawnManager"
import { ErrorMapper } from "utils/ErrorMapper";
// ------ end imports


export const loop = ErrorMapper.wrapLoop(() => {

  // clean up memory first
  try{ MemoryManager.runMemoryManager(); } catch(e) { console.log("Error running MEMORY manager:\n ", e.stack)}

  // run the empire and get all relevant info from that into memory
  try{ EmpireManager.runEmpireManager();  } catch(e) { console.log("Error running EMPIRE manager:\n ", e.stack)}

  // run rooms
  try { RoomManager.runRoomManager(); } catch(e) { console.log("Error running ROOM manager:\n ", e.stack)}

  // run spawning
  try { SpawnManager.runSpawnManager(); } catch(e) { console.log("Error running SPAWN manager:\n ", e.stack)}
  
  // -------- end managers --------
});
