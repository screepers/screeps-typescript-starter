import { err, info } from "../Message";
import { CreepAPI } from "./CreepAPI";

function error(message: string, throwError: boolean = false) {
  err(`[UPGRADER] ${message}`, throwError);
}

export const Creep_upgrader = {
  run(creep: Creep): void {
    if (creep.spawning) return;

    let state: STATE = creep.memory.state;
    if (!creep.memory.data) {
      if (state == STATE.IDLE) {
        // init memory data
        const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
        creep.memory.data = config.creepMemoryData;
      } else {
        creep.say("No data");
        error(`Center Carrier ${creep.name} data not found`);
      }
    }
    let data = creep.memory.data as Upgrader_data;
    if (!data.stop) data.stop = 0;
    if (data.stop > 0) {
      data.stop --;
      return;
    }
    let room = creep.room;

    if (state == STATE.IDLE) {
      creep.memory.state = STATE.FETCH;
      state = STATE.FETCH;
    }
    if (state == STATE.FETCH) {
      function withdraw(structure: Structure): void {
        // structure must have .store. use ignore to simplify code.
        // @ts-ignore
        if (structure.store.energy < 600) {
          data.stop = 5;
          return;
        }
        const result = creep.withdraw(structure, RESOURCE_ENERGY);
        switch (result) {
          case ERR_FULL:
          case OK:
            creep.memory.state = STATE.WORK;
            break;
          case ERR_NOT_IN_RANGE:
            creep.moveTo(structure.pos);
            break;
          case ERR_NOT_ENOUGH_RESOURCES:
            data.stop = 5;
            creep.say("No resource");
            break;
          default:
            error(`Unhandled withdraw error code: ${result}`);
        }
      }

      // storage exists or not has huge difference
      if (room.storage) {
        // storage exists, rcl >= 4
        withdraw(room.storage);
      } else {
        // storage not exists, rcl <= 4, fetch energy from center container
        if (Math.max(Math.abs(creep.pos.x - room.memory.center.x), Math.abs(creep.pos.y - room.memory.center.y)) > 1) {
          creep.moveTo(room.memory.center.x, room.memory.center.y);
        } else {
          // find container
          let structures = room.lookForAt(LOOK_STRUCTURES, room.memory.center.x, room.memory.center.y);
          if (structures.length == 0) {
            error(`Cannot find container at (${room.memory.center.x}, ${room.memory.center.y})`);
            return;
          }
          withdraw(structures[0]);
        }
      }
    } else if (state == STATE.WORK) {
      // assume upgrader will not go outside the room
      const controller = creep.room.controller!;
      const result = creep.upgradeController(controller);
      switch (result) {
        case OK:
          creep.memory.no_pull = true;
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(controller.pos);
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          creep.memory.no_pull = false;
          creep.memory.state = STATE.FETCH;
          state = STATE.FETCH;
          break;
        default:
          error(`Unhandled upgrade controller error code: ${result}`);
      }
    }
  },
  destroy(creep: Creep, room: Room): void {
    info(`Destroying creep ${creep.name}`);
    delete Memory.creeps[creep.name];
    let creeps = room.memory.creeps;
    const index = creeps.indexOf(creep.name);
    if (index > -1) creeps.splice(index, 1);
    creep.suicide();
  }
};

interface Upgrader_data {
  stop: number;
}

enum STATE {
  IDLE,
  FETCH, // fetch energy
  WORK // upgrade
}
