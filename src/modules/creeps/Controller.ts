import {Creep_harvester} from "./Harvester"
import { checkCreepMemory, checkCreepNum } from "./CreepChecker";

export const CreepController = function (context: CreepControllerContext) {
  const prerun = function (): void {
    checkCreepMemory(context.spawnFunc);
    // check creep num every 1000 ticks or when update flag is set
    const CREEP_CHECK_DURATION = 1000;
    if (Memory.creepConfigUpdate) {
      checkCreepNum();
      Memory.creepConfigUpdate = false;
      Memory.lastCreepCheck = 0;
    }
    if (Memory.lastCreepCheck > CREEP_CHECK_DURATION) {
      checkCreepNum();
      Memory.lastCreepCheck = 0;
    }
    Memory.lastCreepCheck += 1;
  };

  const run = function (): void {
    for (let [name, creep] of Object.entries(Game.creeps)) {
      // use name to identify the creep's type
      switch(name.split('_')[0]) {
        case 'HARVESTER':
          Creep_harvester.run(creep);
          break;
        default:
          throw new Error(`Unhandled creep type: ${name}`);
      }
    }
  }

  return { prerun, run };
}

interface CreepControllerContext {
  spawnFunc(name: string): void;
}
