// Maintenancer = Builder + Repairer + Carrier
import { err } from "../Message";
import { CreepAPI } from "./CreepAPI";
import PriorityQueue from "../../utils/PriorityQueue";

function error(message: string, throwError: boolean = false) {
  err(`<MAINTENANCER> ${message}`, throwError);
}

export const Creep_maintenancer = {
  run(
    creep: Creep,
    room: Room,
    fetchMaintenanceTask: () => Task | null,
    returnMaintenanceTask: (task: Task) => void,
    finishCarryTask: (task: Task) => void,
    finishRepairTask: (task: Task) => void
  ): void {
    if (creep.spawning) return;
    // check if creep will die. If so, return the task.
    if (creep.ticksToLive! < 2) {
      let task = (creep.memory.data as Maintenancer_data).task;
      if (task) returnMaintenanceTask(task);
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
        error(`Maintenancer ${creep.name} data not found`);
      }
    }
    let data = creep.memory.data as Maintenancer_data;

    if (state == STATE.IDLE) {
      let task = fetchMaintenanceTask();
      if (!task) return;
      data.task = task;
      const resourceTy = data.task.type == "Carry" ? (data.task.data as CarryTaskData).resourceType : RESOURCE_ENERGY;
      if (data.task.type == "Build") {
        // convert position info to target id
        const position = (data.task.data as BuildTaskData).targetId.split("|");
        if (position.length > 1) {
          const x = parseInt(position[0]),
            y = parseInt(position[1]);
          (data.task.data as BuildTaskData).targetId = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y)[0].id;
        }
      }
      if (creep.store.getUsedCapacity(resourceTy) <= 10) {
        creep.memory.state = STATE.FETCH;
        state = STATE.FETCH;
      } else {
        switch (data.task.type) {
          case "Carry":
            creep.memory.state = STATE.CARRY;
            state = STATE.CARRY;
            break;
          case "Build":
            creep.memory.state = STATE.BUILD;
            state = STATE.BUILD;
            break;
          case "Repair":
            creep.memory.state = STATE.REPAIR;
            state = STATE.REPAIR;
            break;
        }
      }
    }
    if (state == STATE.FETCH) {
      let findNewSource = false;
      let source: Structure | null = null;
      let resourceTy = data.task!.type == "Carry" ? (data.task!.data as CarryTaskData).resourceType : RESOURCE_ENERGY;
      // check if source exists
      if (data.sourceId == "") {
        findNewSource = true;
      }
      // check if current source has enough energy
      else {
        let store: StoreDefinition | null = null;
        source = Game.getObjectById(data.sourceId as Id<Structure>);
        if (!source) findNewSource = true;
        else
          switch (data.sourceTy) {
            case "Storage":
              store = (source as StructureStorage).store;
              break;
            case "Container":
              store = (source as StructureContainer).store;
              break;
            case "Terminal":
              store = (source as StructureTerminal).store;
              break;
            case "Factory":
              store = (source as StructureFactory).store;
              break;
            case "Spawn":
              store = (source as StructureSpawn).store;
              break;
            default:
              console.error(`Unknown source type ${data.sourceTy}`, true);
          }
        let resourceNum = 0;
        if (data.sourceTy == "Spawn" && room.memory.sq.length > 0) {
          resourceNum = store!.getUsedCapacity(RESOURCE_ENERGY) - 200;
        } else resourceNum = store!.getUsedCapacity(resourceTy);
        if (resourceNum <= 0) {
          findNewSource = true;
        }
      }
      if (findNewSource) {
        source = null;
        // try to find mass store first
        if (room.storage && room.storage.store.getUsedCapacity(resourceTy) > 0) {
          data.sourceTy = "Storage";
          data.sourceId = room.storage.id;
          source = room.storage;
        }
        if (!source && room.container.length > 0) {
          for (const container of room.container) {
            if (container.store.getUsedCapacity(resourceTy) > 0) {
              data.sourceTy = "Container";
              data.sourceId = container.id;
              source = container;
              break;
            }
          }
        }
        if (!source && room.terminal && room.terminal.store.getUsedCapacity(resourceTy) > 0) {
          data.sourceTy = "Terminal";
          data.sourceId = room.terminal.id;
          source = room.terminal;
        }
        if (!source && room.factory && room.factory.store.getUsedCapacity(resourceTy) > 0) {
          data.sourceTy = "Factory";
          data.sourceId = room.factory.id;
          source = room.factory;
        }
        if (!source && resourceTy == RESOURCE_ENERGY && room.spawn.length > 0) {
          for (const spawn of room.spawn) {
            let energy = 0;
            if (room.memory.sq.length > 0) energy = spawn.store.energy - 200;
            else energy = spawn.store.energy;
            if (energy > 0) {
              data.sourceTy = "Spawn";
              data.sourceId = spawn.id;
              source = spawn;
              break;
            }
          }
        }
      }
      if (!source) {
        // cannot find source
        error(`Creep ${creep.name} cannot find source`);
        data.sourceId = "";
        return;
      }

      const result = creep.withdraw(source, resourceTy);
      switch (result) {
        case ERR_FULL:
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(source.pos);
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          creep.say("No resource");
          break;
        default:
          error(`Unhandled withdraw error code: ${result}`);
      }
      if (creep.store.getFreeCapacity(resourceTy) == 0) {
        let newState: STATE | null = null;
        switch (data.task!.type) {
          case "Carry":
            newState = STATE.CARRY;
            break;
          case "Repair":
            newState = STATE.REPAIR;
            break;
          case "Build":
            newState = STATE.BUILD;
            break;
        }
        creep.memory.state = newState!;
        state = newState!;
      }
    }
    if (state == STATE.BUILD) {
      const task = data.task!.data as BuildTaskData;
      const site = Game.getObjectById(task.targetId as Id<ConstructionSite>);
      if (!site) {
        // construction finished
        creep.memory.state = STATE.IDLE;
        (creep.memory.data as Maintenancer_data).task = null;
        room.update();
        return;
      }
      const result = creep.build(site);
      switch (result) {
        case ERR_NOT_ENOUGH_RESOURCES:
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(site.pos);
          break;
        default:
          error(`Unhandled build error code ${result}`);
      }
      if (creep.store.energy == 0) {
        creep.memory.state = STATE.FETCH;
      }
    }
    if (state == STATE.CARRY) {
      const task = data.task!.data as CarryTaskData;
      const target = Game.getObjectById(task.targetId as Id<Structure>);
      if (!target) {
        error(`Carry target ${task.targetId} not found`);
        return;
      }

      const resourceBefore = creep.store.getUsedCapacity(task.resourceType);
      const result = creep.transfer(target, task.resourceType);
      switch (result) {
        case ERR_NOT_ENOUGH_RESOURCES:
        case OK:
          break;
        case ERR_FULL:
          finishCarryTask((creep.memory.data as Maintenancer_data).task!);
          (creep.memory.data as Maintenancer_data).task = null;
          creep.memory.state = STATE.IDLE;
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target);
          break;
        default:
          error(`Unhandled transfer error code ${result}`);
      }
      const resourceAfter = creep.store.getUsedCapacity(task.resourceType);
      const carriedNum = task.carriedNum + resourceBefore - resourceAfter;
      if (carriedNum > task.resourceNum) {
        finishCarryTask((creep.memory.data as Maintenancer_data).task!);
        creep.memory.state = STATE.IDLE;
        (creep.memory.data as Maintenancer_data).task = null;
      } else if (resourceAfter == 0) {
        creep.memory.state = STATE.FETCH;
      }
    }
    if (state == STATE.REPAIR) {
      const task = data.task!.data as RepairTaskData;
      const target = Game.getObjectById(task.targetId as Id<Structure>);
      if (!target) {
        error(`Repair target ${task.targetId} not found`);
        return;
      }

      const result = creep.repair(target);
      switch (result) {
        case ERR_NOT_ENOUGH_RESOURCES:
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target);
          break;
        default:
          error(`Unhandled repair error code ${result}`);
      }
      if (target.hits >= task.hits) {
        finishRepairTask((creep.memory.data as Maintenancer_data).task!);
        creep.memory.state = STATE.IDLE;
        (creep.memory.data as Maintenancer_data).task = null;
      } else if (creep.store.energy == 0) {
        creep.memory.state = STATE.FETCH;
      }
    }
  },
  destroy(creep: Creep): void {
    let task = (creep.memory.data as Maintenancer_data).task;
    if (task) creep.room.memory.mq.push(task);
    delete Memory.creeps[creep.name];
    let creeps = creep.room.memory.creeps;
    creeps.splice(creeps.indexOf(creep.name), 1);
    creep.suicide();
  }
};

interface Maintenancer_data {
  task: Task | null;
  sourceId: string;
  sourceTy: string; // Container/Storage/Terminal/Factory/Spawn
}

enum STATE {
  IDLE,
  FETCH,
  BUILD,
  CARRY,
  REPAIR
}
