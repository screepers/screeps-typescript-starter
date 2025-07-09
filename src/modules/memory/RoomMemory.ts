import { warn } from "../Message";
import PriorityQueue from "../../utils/PriorityQueue";

let carryIdSet: Set<string> | undefined = undefined;
let repairIdSet: Set<string> | undefined = undefined;

function initCarryIdSet(memory: RoomMemory) {
  carryIdSet = new Set();
  for (const id of memory.cis) {
    carryIdSet.add(id);
  }
}

function initRepairIdSet(memory: RoomMemory) {
  repairIdSet = new Set();
  for (const id of memory.ris) {
    repairIdSet.add(id);
  }
}

let maintenanceQueue: PriorityQueue<Task> | undefined = undefined;

function initMaintenanceQueue(memory: RoomMemory) {
  maintenanceQueue = new PriorityQueue<Task>((task1: Task, task2: Task): boolean => {
    function score(task: Task): number {
      let score = 0;
      switch (task.type) {
        case "Carry":
          score += 10;
          break;
        case "Build":
          score += 5;
          break;
        case "Repair":
          score += 8;
          break;
      }
      return score * task.time;
    }
    return score(task1) < score(task2);
  });
  for (const task of memory.mq) maintenanceQueue.push(task);
}

export const RoomMemoryController = function (context: RoomMemoryControllerContext) {
  const preRun = function () {
    carryIdSet = undefined;
    repairIdSet = undefined;
    maintenanceQueue = undefined;
  };

  const run = function () {
    const memory = context.room.memory;
    // check source
    if (memory.source.id != "") {
      switch (memory.source.type) {
        case "Spawn":
          // if sq is not empty, reset to none
          if (memory.sq.length > 0) memory.source.id = "";
          break;
        case "Container": {
          // if container has no energy, reset to none
          const container = Game.getObjectById(memory.source.id as Id<StructureContainer>);
          if (!container) memory.source.id = "";
          else if (container.store.energy < 50) memory.source.id = "";
          break;
        }
        default:
          warn(`<ROOM MEMORY> memory source type invalid, reset to none. current type is ${memory.source.type}`);
          memory.source.id = "";
      }
    }
  };

  const postRun = function () {
    let memory = context.room.memory;
    // move data back to memory
    if (carryIdSet) {
      memory.cis = [];
      for (const id of carryIdSet) {
        memory.cis.push(id);
      }
    }
    if (repairIdSet) {
      memory.ris = [];
      for (const id of repairIdSet) {
        memory.ris.push(id);
      }
    }
    if (maintenanceQueue) {
      memory.mq = [];
      while (!maintenanceQueue.empty()) {
        memory.mq.push(maintenanceQueue.poll());
      }
    }
  };

  const addCarryTask = function (task: Task) {
    if (!carryIdSet) initCarryIdSet(context.room.memory);
    carryIdSet = carryIdSet!;
    const id = (task.data as CarryTaskData).targetId;
    if (!carryIdSet.has(id)) {
      carryIdSet.add(id);
      if (!maintenanceQueue) initMaintenanceQueue(context.room.memory);
      maintenanceQueue = maintenanceQueue!;
      maintenanceQueue.push(task);
    }
  };

  const finishCarryTask = function (task: Task) {
    if (!carryIdSet) initCarryIdSet(context.room.memory);
    carryIdSet = carryIdSet!;
    carryIdSet.delete((task.data as CarryTaskData).targetId);
  };

  const addRepairTask = function (task: Task) {
    if (!repairIdSet) initRepairIdSet(context.room.memory);
    repairIdSet = repairIdSet!;
    const id = (task.data as RepairTaskData).targetId;
    if (!repairIdSet.has(id)) {
      repairIdSet.add(id);
      if (!maintenanceQueue) initMaintenanceQueue(context.room.memory);
      maintenanceQueue = maintenanceQueue!;
      maintenanceQueue.push(task);
    }
  };

  const finishRepairTask = function (task: Task) {
    if (!repairIdSet) initRepairIdSet(context.room.memory);
    repairIdSet = repairIdSet!;
    repairIdSet.delete((task.data as RepairTaskData).targetId);
  };

  const fetchMaintenanceTask = function (): Task | null {
    if (!maintenanceQueue) initMaintenanceQueue(context.room.memory);
    maintenanceQueue = maintenanceQueue!;
    if (maintenanceQueue.empty()) return null;
    return maintenanceQueue.poll();
  };

  const returnMaintenanceTask = function (task: Task) {
    if (!maintenanceQueue) initMaintenanceQueue(context.room.memory);
    maintenanceQueue = maintenanceQueue!;
    maintenanceQueue.push(task);
  };

  return {
    preRun,
    run,
    postRun,
    addCarryTask,
    finishCarryTask,
    addRepairTask,
    finishRepairTask,
    fetchMaintenanceTask,
    returnMaintenanceTask
  };
};

interface RoomMemoryControllerContext {
  room: Room;
}
