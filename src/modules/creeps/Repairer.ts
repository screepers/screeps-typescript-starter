import { err } from "../Message";
import { CreepAPI } from "./CreepAPI";

function error(message: string, throwError: boolean = false) {
  err(`[REPAIRER] ${message}`, throwError);
}

export const Creep_repairer = {
  run(
    creep: Creep,
    room: Room,
    fetchRepairTask: () => RepairTask | null,
    returnRepairTask: (task: RepairTask) => void,
    finishRepairTask: (task: RepairTask) => void
  ): void {
    if (creep.spawning) return;
    let memory = creep.memory;
    if (creep.ticksToLive! < 2) {
      let task = (memory.data as Repairer_data).task;
      if (task) returnRepairTask(task);
      creep.suicide();
      return;
    }

    let state: STATE = memory.state;
    // check data
    if (!memory.data) {
      if (state == STATE.IDLE) {
        // init memory data
        const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
        creep.memory.data = config.creepMemoryData;
      } else {
        creep.say("No data");
        error(`Repairer ${creep.name} data not found`);
      }
    }
    let data = memory.data as Repairer_data;

    if (state == STATE.IDLE) {
      let task = fetchRepairTask();
      if (!task) return;
      data.task = task;
      if (creep.store.energy == 0) {
        creep.memory.state = STATE.FETCH;
        state = STATE.FETCH;
      } else {
        creep.memory.state = STATE.WORK;
        state = STATE.WORK;
      }
    }
    if (state == STATE.FETCH) {
      function withdraw(structure: Structure): void {
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
    }
    if (state == STATE.WORK) {
      let task = data.task!;
      function repair(structure: Structure): void {
        const result = creep.repair(structure);
        switch (result) {
          case OK:
            break;
          case ERR_NOT_IN_RANGE:
            creep.moveTo(structure.pos);
            break;
          case ERR_NOT_ENOUGH_RESOURCES:
            creep.memory.state = STATE.FETCH;
            break;
          default:
            error(`Unhandled repair error code: ${result}`);
        }
        if (structure.hits >= task.hits) {
          finishRepairTask(task);
          data.task = null;
          creep.memory.state = STATE.IDLE;
        }
      }
      let structure = Game.getObjectById(task.tgt as Id<Structure>);
      if (structure) repair(structure);
      else error(`Cannot find structure ${task.tgt}`);
    }
  },
  destroy(creep: Creep, room: Room, returnRepairTask: (task: RepairTask) => void): void {
    let data = creep.memory.data as Repairer_data;
    if (data.task) returnRepairTask(data.task);
    delete Memory.creeps[creep.name];
    let creeps = room.memory.creeps;
    const index = creeps.indexOf(creep.name);
    if (index > -1) creeps.splice(index, 1);
    creep.suicide();
  }
};

interface Repairer_data {
  task: RepairTask | null;
}

enum STATE {
  IDLE,
  FETCH,
  WORK
}
