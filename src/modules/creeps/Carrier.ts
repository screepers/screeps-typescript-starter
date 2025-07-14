import { CreepAPI } from "./CreepAPI";
import { err, info } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`[CARRIER] ${message}`, throwError);
}

export const Creep_carrier = {
  run(
    creep: Creep,
    room: Room,
    fetchCarryTask: () => CarryTask | null,
    returnCarryTask: (task: CarryTask) => void,
    finishCarryTask: (task: CarryTask) => void
  ): void {
    if (creep.spawning) return;
    // if creep will die soon, return task
    let memory = creep.memory;
    if (creep.ticksToLive! < 2) {
      let task = (memory.data as Carrier_data).task;
      if (task) returnCarryTask(task);
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
        error(`Carrier ${creep.name} data not found`);
      }
    }
    let data = memory.data as Carrier_data;

    if (state == STATE.IDLE) {
      let task = fetchCarryTask();
      if (!task) return;
      data.task = task;
      if (creep.store.getUsedCapacity(task.rt) == 0) {
        creep.memory.state = STATE.FETCH;
        state = STATE.FETCH;
      } else {
        creep.memory.state = STATE.WORK;
        state = STATE.WORK;
      }
    }
    if (state == STATE.FETCH) {
      let task = data.task!;
      function withdraw(structure: Structure): void {
        const result = creep.withdraw(structure, task.rt);
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
      function transfer(structure: Structure): void {
        const result = creep.transfer(structure, task.rt);
        switch (result) {
          case OK:
          case ERR_FULL:
            finishCarryTask(task);
            data.task = null;
            creep.memory.state = STATE.IDLE;
            break;
          case ERR_NOT_IN_RANGE:
            creep.moveTo(structure);
            break;
          case ERR_NOT_ENOUGH_RESOURCES:
            creep.memory.state = STATE.FETCH;
            break;
          default:
            error(`Unhandled transfer error code: ${result}`);
        }
      }
      let structure = Game.getObjectById(task.tgt as Id<Structure>);
      if (structure) transfer(structure);
      else error(`Cannot find structure ${task.tgt}`);
    }
  },
  destroy(creep: Creep, room: Room, returnCarryTask: (task: CarryTask) => void) {
    info(`Destroying creep ${creep.name}`);
    let data = creep.memory.data as Carrier_data;
    if (data.task) returnCarryTask(data.task);
    delete Memory.creeps[creep.name];
    let creeps = room.memory.creeps;
    const index = creeps.indexOf(creep.name);
    if (index > -1) creeps.splice(index, 1);
    creep.suicide();
  }
};

interface Carrier_data {
  task: CarryTask | null;
}

enum STATE {
  IDLE,
  FETCH,
  WORK
}
