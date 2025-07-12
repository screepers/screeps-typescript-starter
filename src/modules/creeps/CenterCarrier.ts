// Carry energy from source container to center container
import { err } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`<CENTER CARRIER> ${message}`, throwError);
}

export const Creep_center_carrier = {
  run(creep: Creep, room: Room): void {
    if (creep.spawning) return;
    let memory = creep.memory;
    let state: STATE = memory.state;

    if (state == STATE.FETCH) {
      // parse index
      const idx = parseInt(creep.name.split("_")[1]) % room.source.length;
      const source = room.source[idx];
      // find container
      let structures = room.lookForAtArea(
        LOOK_STRUCTURES,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true
      );
      let container: StructureContainer | null = null;
      for (let structure of structures) {
        if (structure.structure.structureType == STRUCTURE_CONTAINER) {
          container = structure.structure as StructureContainer;
          break;
        }
      }
      if (!container) {
        error(`Cannot find container around source at (${source.pos.x}, ${source.pos.y})`);
        return;
      }
      const result = creep.withdraw(container, RESOURCE_ENERGY);
      switch (result) {
        case ERR_FULL:
        case OK:
          creep.memory.state = STATE.WORK;
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(container.pos);
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          creep.say("No resource");
          break;
        default:
          error(`Unhandled withdraw error code: ${result}`);
      }
    }
    if (state == STATE.WORK) {
      function transfer(structure: Structure): void {
        const result = creep.transfer(structure, RESOURCE_ENERGY);
        switch (result) {
          case ERR_NOT_ENOUGH_RESOURCES:
          case OK:
            creep.memory.state = STATE.FETCH;
            break;
          case ERR_FULL:
            break;
          case ERR_NOT_IN_RANGE:
            creep.moveTo(structure);
            break;
          default:
            error(`Unhandled transfer error code: ${result}`);
        }
      }
      // find target
      if (room.storage) {
        // TODO: check storage energy capacity
        transfer(room.storage);
      } else {
        // get center container
        let structures = room.lookForAt(LOOK_STRUCTURES, room.memory.center.x, room.memory.center.y);
        let container: StructureContainer | null = null;
        for (let structure of structures) {
          if (structure.structureType == STRUCTURE_CONTAINER) {
            container = structure as StructureContainer;
            break;
          }
        }
        if (!container) {
          error(`Cannot find center container`);
          return;
        }
        if (container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) transfer(container);
      }
    }
  },
  destroy(creep: Creep, room: Room) {
    delete Memory.creeps[creep.name];
    let creeps = room.memory.creeps;
    const index = creeps.indexOf(creep.name);
    if (index > -1) creeps.splice(index, 1);
    creep.suicide();
  }
};

enum STATE {
  FETCH,
  WORK
}
