import { CreepAPI } from "./CreepAPI";
import { err } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`<UPGRADER> ${message}`, throwError);
}

export const Creep_upgrader = {
  run(creep: Creep): void {
    if (creep.spawning) return;

    let state: STATE = creep.memory.state;

    // check data
    if (!creep.memory.data) {
      if (state == STATE.IDLE) {
        // init memory data
        const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
        creep.memory.data = config.creepMemoryData;
        creep.memory.state = STATE.FETCH;
        state = STATE.FETCH;
      } else {
        creep.say("No data");
        error(`Upgrader ${creep.name} data not found`);
      }
    }
    let data = creep.memory.data as Upgrader_data;

    if (state == STATE.IDLE) {
      creep.memory.state = STATE.FETCH;
      state = STATE.FETCH;
    }
    if (state == STATE.FETCH) {
      // get container instance
      const container = Game.getObjectById(data.cid as Id<Structure>);
      if (!container) {
        creep.say("Null container");
        error(`Cannot find container ${data.cid}`);
        return;
      }
      const result = creep.withdraw(container, RESOURCE_ENERGY);
      switch (result) {
        case ERR_FULL:
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(container.pos);
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          // wait until source is filled
          creep.say("Waiting");
          break;
        default:
          error(`Unhandled withdraw error code: ${result}`);
      }
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.state = STATE.WORK;
        state = STATE.WORK;
      }
    } else if (state == STATE.WORK) {
      // assume upgrader will not go outside the room
      const controller = creep.room.controller!;
      const result = creep.upgradeController(controller);
      switch (result) {
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(controller.pos);
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          creep.memory.state = STATE.FETCH;
          state = STATE.FETCH;
          break;
        default:
          error(`Unhandled upgrade controller error code: ${result}`);
      }
    }
  }
}

interface Upgrader_data {
  cid: string;  // container id
}

enum STATE {
  IDLE,
  FETCH,  // fetch energy
  WORK    // upgrade
}
