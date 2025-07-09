import { CreepAPI } from "./CreepAPI";
import { err, warn } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`<CONSTRUCTOR> ${message}`, throwError);
}

export const Creep_constructor = {
  run(creep: Creep): void {
    if (creep.spawning) return;
    if (creep.ticksToLive! < 2) {
      creep.suicide();
    }

    let state: STATE = creep.memory.state;

    // check data
    if (!creep.memory.data) {
      if (state == STATE.IDLE) {
        // init memory data
        const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
        creep.memory.data = config.creepMemoryData;
      } else {
        creep.say("No data");
        error(`Constructor ${creep.name} data not found`);
      }
    }
    let data = creep.memory.data as Constructor_data;

    if (state == STATE.IDLE) {
      // try to fetch task
      let cq = creep.room.memory.cq;
      if (cq.length > 0) {
        data.task = <Task>cq[cq.length - 1];
        let d = (data.task as Task).data as BuildTaskData;
        if (d.targetId[0] == "|") {
          let positionList = d.targetId.split("|");
          const sites = creep.room.lookForAt(
            LOOK_CONSTRUCTION_SITES,
            parseInt(positionList[1]),
            parseInt(positionList[2])
          );
          if (sites.length == 0) {
            warn(`Cannot find construction site (${positionList[1]}, ${positionList[2]})`);
            cq.pop();
            return;
          }
          d.targetId = sites[0].id;
        }
        if (creep.store.energy < 5) {
          creep.memory.state = STATE.FETCH;
          state = STATE.FETCH;
        } else {
          creep.memory.state = STATE.WORK;
          state = STATE.WORK;
        }
      }
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
        case ERR_NOT_IN_RANGE:
          creep.moveTo(source.pos);
          break;
        case ERR_FULL:
        case OK:
          creep.memory.state = STATE.WORK;
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          creep.say("No energy");
          break;
        default:
          error(`Unhandled withdraw error code ${result}`);
      }
    } else if (state == STATE.WORK) {
      const task = data.task!.data as BuildTaskData;
      const site = Game.getObjectById(task.targetId as Id<ConstructionSite>);
      if (!site) {
        // construction finished
        creep.memory.state = STATE.IDLE;
        creep.memory.no_pull = false;
        let task = (creep.memory.data as Constructor_data).task!;
        let cq = creep.room.memory.cq;
        if ((task.data as BuildTaskData).targetId == (cq[cq.length - 1].data as BuildTaskData).targetId) cq.pop();
        (creep.memory.data as Constructor_data).task = null;
        creep.room.update();
        return;
      }
      const result = creep.build(site);
      switch (result) {
        case ERR_NOT_ENOUGH_RESOURCES:
          break;
        case OK:
          creep.memory.no_pull = true;
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(site.pos);
          break;
        default:
          error(`Unhandled build error code ${result}`);
      }
      if (creep.store.energy == 0) {
        creep.memory.state = STATE.FETCH;
        creep.memory.no_pull = false;
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

interface Constructor_data {
  task: Task | null;
}

enum STATE {
  IDLE,
  FETCH,
  WORK
}
