import { Creep_harvester } from "./Harvester";
import { checkCreepMemory, checkCreepNum } from "./CreepChecker";
import { Creep_upgrader } from "./Upgrader";
import { CreepAPI, CreepType } from "./CreepAPI";
import { Creep_maintenancer } from "./Maintenancer";
import { Creep_constructor } from "./Constructor";

const CREEP_CHECK_DURATION = 1000;

export const CreepController = function (context: CreepControllerContext) {
  const prerun = function (): void {
    checkCreepMemory(context.spawnFunc);
  };

  const run = function (): void {
    const room = context.room;

    // check creep num
    let destroyedNames: string[] = [];
    if (room.memory.creepConfigUpdate || room.memory.lastCreepCheck > CREEP_CHECK_DURATION) {
      checkCreepNum(room, (names) => {
        destroyedNames = names;
      });
      room.memory.creepConfigUpdate = false;
      room.memory.lastCreepCheck = 0;
    }
    // get maintenancer queue
    let maintenancerQueue = Creep_maintenancer.getMaintenancerQueue(room);
    for (let [name, creep] of Object.entries(Game.creeps)) {
      let destroy = destroyedNames.includes(name);
      // use name to identify the creep's type
      const config = CreepAPI.getCreepConfig(name, { getCreepType: true });
      switch (config.creepType) {
        case CreepType.HARVESTER:
          Creep_harvester.run(creep);
          if (destroy) Creep_harvester.destroy(creep);
          break;
        case CreepType.UPGRADER:
          Creep_upgrader.run(creep);
          if (destroy) Creep_upgrader.destroy(creep);
          break;
        case CreepType.CONSTRUCTOR:
          Creep_constructor.run(creep);
          if (destroy) Creep_constructor.destroy(creep);
          break;
        case CreepType.MAINTENANCER:
          Creep_maintenancer.run(creep, room, maintenancerQueue);
          if (destroy) Creep_maintenancer.destroy(creep);
          break;
        default:
          throw new Error(`Unhandled creep type: ${name}`);
      }
    }
    room.memory.lastCreepCheck += 1;
    // destroy maintenancer queue
    Creep_maintenancer.destroyMaintenancerQueue(room, maintenancerQueue);
  };

  return { prerun, run };
};

interface CreepControllerContext {
  spawnFunc(name: string): void;
  room: Room;
}
