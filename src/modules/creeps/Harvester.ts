import { CreepAPI } from "./CreepAPI";
import { err } from "../Message";

// TODO: 1. calculate px and py; 2. fill state IDLE by get memory data from creepapi

function error(message: string, throwError: boolean = false) {
  err(`<HARVESTER> ${message}`, throwError);
}

export const Creep_harvester = {
  run(creep: Creep): void {
    if (creep.spawning) return;
    let memory = creep.memory;
    let state: STATE = memory.state;

    // check data
    if (!creep.memory.data) {
      if (state == STATE.MOVE) {
        // init memory data
        const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
        creep.memory.data = config.creepMemoryData;
      } else {
        creep.say("No data");
        error(`Harvester ${creep.name} data not found`);
      }
    }
    let data = creep.memory.data as Harvester_data;

    if (state == STATE.MOVE) {
      // find container
      let container = Game.getObjectById(data.cid as Id<StructureContainer>);
      if (container) {
        if (!creep.pos.isEqualTo(container.pos)) {
          creep.moveTo(container.pos);
        } else {
          creep.memory.state = STATE.WORK;
          state = STATE.WORK;
        }
      } else {
        error(`Harvester ${creep.name} cannot find source container`);
        return;
      }
    }
    if (state == STATE.WORK) {
      let container = Game.getObjectById(data.cid as Id<StructureContainer>);
      if (!container) {
        error(`Harvester ${creep.name} cannot find source container`);
        return;
      }
      if (container.store.getFreeCapacity(RESOURCE_ENERGY) == 0) return;
      let source = Game.getObjectById(data.sid as Id<Source>);
      if (source) {
        const result = creep.harvest(source);
        if (result != OK) {
          creep.say("Cannot harvest");
          error(`Harvester ${creep.name} cannot harvest, error code = ${result}`);
          return;
        }
      } else {
        creep.say("No source");
        error(`Cannot find source`);
      }
    }
  }
}

interface Harvester_data {
  sid: string; // source id
  cid: string; // container id (if needed)
}

enum STATE {
  MOVE, // move to an energy source
  WORK, // harvest
}
