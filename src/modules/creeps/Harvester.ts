import { CreepAPI } from "./CreepAPI";
import { err } from "../Message";

// TODO: 1. calculate px and py; 2. fill state IDLE by get memory data from creepapi

function error(message: string, throwError: boolean = false) {
  err(`<HARVESTER> ${message}`, throwError);
}

export const Creep_harvester = {
  run(creep: Creep): void {
    if (creep.spawning) return;

    let state: STATE = creep.memory.state;

    // check data
    if (!creep.memory.data) {
      if (state == STATE.IDLE) {
        // init memory data
        const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
        creep.memory.data = config.creepMemoryData;
        creep.memory.state = STATE.MOVE;
        state = STATE.MOVE;
      } else {
        creep.say("No data");
        error(`Harvester ${creep.name} data not found`);
      }
    }
    let data = creep.memory.data as Harvester_data;

    // initialize source
    let source = Game.getObjectById(data.sid as Id<Source>);
    if (!source) {
      creep.say("Cannot find source");
      error(`Cannot find source ${data.sid}`);
      return;
    }

    // TODO: get px and py from structure controller
    let px = source.pos.x;
    let py = source.pos.y;
    const dir_x = [1, 1, 0, -1, -1, -1, 0, 1];
    const dir_y = [0, -1, -1, -1, 0, 1, 1, 1];
    const terrain = source.room.getTerrain();
    for (let i = 0; i < 8; i++) {
      if (terrain.get(px + dir_x[i], py + dir_y[i]) != TERRAIN_MASK_WALL) {
        px += dir_x[i];
        py += dir_y[i];
        break;
      }
    }

    // Execute workflow by state
    if (state == STATE.IDLE) {
      creep.memory.state = STATE.MOVE;
      state = STATE.MOVE;
    }
    if (state == STATE.CARRY) {
      if (!data.cid) {
        creep.say("No container");
        error(`Container id is null`);
        return;
      }
      let container = Game.getObjectById(data.cid as Id<StructureSpawn>); // Carry state exists only when RCL = 1
      if (!container) {
        creep.say("No container");
        error(`Cannot find container ${data.cid}`);
        return;
      }
      let result = creep.transfer(container, RESOURCE_ENERGY); // try to move energy to spawn
      switch (result) {
        case ERR_NOT_IN_RANGE:
          creep.moveTo(container); // move to spawn
          break;
        case ERR_FULL:
          creep.say("Full!");
          break;
        case OK:
          break;
        default:
          creep.say("Transfer failed");
          error(`Unhandled transfer error code: ${result}`); // Unhandled error code

        if (creep.store.energy == 0) {
          creep.memory.state = STATE.MOVE; // Energy transferred. Move to source
          state = STATE.MOVE;
        }
      }
    }
    if (state == STATE.MOVE) {
      if (creep.pos.x != px || creep.pos.y != py) {
        creep.moveTo(px, py); // move to source
      } else {
        creep.memory.state = STATE.WORK; // start harvest
        state = STATE.WORK;
      }
    }
    if (state == STATE.WORK) {
      // check if container exists
      let container: StructureContainer | null = null;
      let structures = creep.room.lookForAt(LOOK_STRUCTURES, px, py);
      for (let structure of structures) {
        if (structure.structureType == STRUCTURE_CONTAINER) {
          container = structure as StructureContainer;
          break;
        }
      }
      if (!container) {
        // container does not exist, carry energy to spawn if energy is full
        // check if creep has carry part
        let body_parts = creep.body;
        let has_carry: boolean = false;
        for (let body_part of body_parts) {
          if (body_part.type == "carry") {
            has_carry = true;
            break;
          }
        }
        if (!has_carry) {
          creep.say("Wierd error");
          error(`Harvester ${creep.name} does not have carry part and no container exists. Unhandled error.`);
        }
        // harvest
        let harvest_result = creep.harvest(source);
        if (harvest_result != OK) {
          creep.say("Cannot harvest");
          error(`Harvester cannot harvest source ${data.sid}, error code = ${harvest_result}`);
        }
        // if energy is full, move to spawn
        if (creep.store.getFreeCapacity() == 0) {
          creep.memory.state = STATE.CARRY;
          state = STATE.CARRY;
        }
      } else {
        // container exists, harvest
        let harvest_result = creep.harvest(source);
        if (harvest_result != OK) {
          creep.say("Cannot harvest");
          error(`Harvester cannot harvest source ${data.sid}, error code = ${harvest_result}`);
        }
      }
    }
  }
};

interface Harvester_data {
  sid: string; // source id
  cid?: string; // container id (if needed)
}

enum STATE {
  IDLE,
  WORK, // harvest
  CARRY, // move to energy container (used when container is unavailable)
  MOVE // move to an energy source
}
