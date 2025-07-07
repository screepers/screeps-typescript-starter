import { err } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`<UPGRADER> ${message}`, throwError);
}

export const Creep_upgrader = {
  run(creep: Creep): void {
    if (creep.spawning) return;

    let state: STATE = creep.memory.state;

    if (state == STATE.IDLE) {
      creep.memory.state = STATE.FETCH;
      state = STATE.FETCH;
    }
    if (state == STATE.FETCH) {
      // get source
      const sourceConfig = creep.room.memory.source;
      if (sourceConfig.id == "") {
        creep.say("No source");
        if (creep.store.energy > 0) {
          creep.memory.state = STATE.WORK;
        }
        return;
      }
      const source = Game.getObjectById(sourceConfig.id as Id<Structure>);
      if (!source) {
        error("Cannot find room source");
        return;
      }
      const result = creep.withdraw(source, RESOURCE_ENERGY);
      switch (result) {
        case ERR_FULL:
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(source.pos);
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
  destroy(creep: Creep): void {
    delete Memory.creeps[creep.name];
    let creeps = creep.room.memory.creeps;
    creeps.splice(creeps.indexOf(creep.name), 1);
    creep.suicide();
  }
};

enum STATE {
  IDLE,
  FETCH, // fetch energy
  WORK // upgrade
}
