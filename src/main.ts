/*
  Kung Fu Klan's Screeps Code
  Written and maintained by - 
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/

// @ts-ignore
import { MemoryManager } from "Managers/MemoryManagement";
// @ts-ignore
import { ErrorMapper } from "utils/ErrorMapper";
// ------ end imports


export const loop = ErrorMapper.wrapLoop(() => {

  // clean up memory first
  MemoryManager.garbageCollector();

  // start running the empire
  console.log(`Current game tick is ${Game.time}!`);
});
