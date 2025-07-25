import { CreepAPI } from "./CreepAPI";
import { err, info, warn } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`[CONSTRUCTOR] ${message}`, throwError);
}

export const Creep_constructor = {
  run(creep: Creep, room: Room): void {
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
        return;
      }
    }
    let data = creep.memory.data as Constructor_data;
    if (!data.stop) data.stop = 0;
    if (data.stop && data.stop > 0) {
      data.stop--;
      return;
    }

    if (state == STATE.IDLE) {
      // try to fetch task
      let cq = room.memory.cq;
      if (cq.length > 0) {
        data.task = <ConstructTask>cq[cq.length - 1];
        let task = data.task as ConstructTask;
        if (task.tgt[0] == "|") {
          let positionList = task.tgt.split("|");
          let siteRoom = Game.rooms[positionList[3]];
          if (siteRoom) {
            const sites = siteRoom.lookForAt(
              LOOK_CONSTRUCTION_SITES,
              parseInt(positionList[1]),
              parseInt(positionList[2])
            );
            if (sites.length == 0) {
              warn(`Cannot find construction site (${positionList[1]}, ${positionList[2]})`);
              cq.pop();
              return;
            }
            task.tgt = sites[0].id;
          }
        }
        if (creep.store.energy < 5) {
          creep.memory.state = STATE.FETCH;
          state = STATE.FETCH;
        } else {
          creep.memory.state = STATE.WORK;
          state = STATE.WORK;
        }
      } else room.memory.creepConfigUpdate = true;
    }
    if (state == STATE.FETCH) {
      if (room.controller!.level == 1) {
        function harvest(source: Source): void {
          const result = creep.harvest(source);
          switch (result) {
            case OK:
              creep.memory.no_pull = true;
              break;
            case ERR_NOT_IN_RANGE:
              creep.moveTo(source.pos);
              break;
            case ERR_NOT_ENOUGH_RESOURCES:
              if (creep.store.energy > 0) {
                creep.memory.state = STATE.WORK;
                state = STATE.WORK;
              }
              break;
            default:
              error(`Unhandled harvest error: ${result}`);
          }
          if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.no_pull = false;
            creep.memory.state = STATE.WORK;
            state = STATE.WORK;
          }
        }
        // harvest energy from source
        if (data.source) harvest(Game.getObjectById(data.source as Id<Source>) as Source);
        else {
          // find nearest source
          // get construction site position
          const site = Game.getObjectById(data.task!.tgt as Id<ConstructionSite>);
          if (!site) {
            error(`Cannot find construction site ${data.task!.tgt}`);
            return;
          }
          let source: Source | null = null;
          let cost = 100000;
          for (const s of room.source) {
            const path = PathFinder.search(site.pos, { pos: s.pos, range: 1 });
            if (path.cost < cost) {
              source = s;
              cost = path.path.length;
            }
          }
          if (!source) {
            error(`No source in room ${room.name}`);
            return;
          }
          data.source = source.id;
          harvest(source);
        }
      } else {
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
          if (
            Math.max(Math.abs(creep.pos.x - room.memory.center.x), Math.abs(creep.pos.y - room.memory.center.y)) > 1
          ) {
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
    } else if (state == STATE.WORK) {
      const task = data.task!;
      const site = Game.getObjectById(task.tgt as Id<ConstructionSite>);
      if (!site) {
        // construction finished
        creep.memory.state = STATE.IDLE;
        creep.memory.no_pull = false;
        let cq = room.memory.cq;
        if (cq.length > 0 && task.tgt == cq[cq.length - 1].tgt) cq.pop();
        data.task = null;
        data.source = null;
        creep.room.update();
        return;
      }
      if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49) creep.moveTo(site.pos); // in case creep stuck at the boarder
      const result = creep.build(site);
      switch (result) {
        case ERR_NOT_ENOUGH_RESOURCES:
          break;
        case OK:
          if (room.controller!.level <= 4) creep.memory.no_pull = true;
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
  destroy(creep: Creep, room: Room): void {
    info(`Destroying creep ${creep.name}`);
    delete Memory.creeps[creep.name];
    let creeps = room.memory.creeps;
    const index = creeps.indexOf(creep.name);
    if (index > -1) creeps.splice(index, 1);
    creep.suicide();
  }
};

interface Constructor_data {
  stop: number | null;
  task: ConstructTask | null;
  source: string | null;
}

enum STATE {
  IDLE,
  FETCH,
  WORK
}
