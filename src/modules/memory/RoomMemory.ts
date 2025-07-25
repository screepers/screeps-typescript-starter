import { warn } from "../Message";
import PriorityQueue from "../../utils/PriorityQueue";

let carryIdSet: Set<string> | undefined = undefined;
let repairIdSet: Set<string> | undefined = undefined;
let emergencyRepairIdSet: Set<string> | undefined = undefined;


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

function initEmergencyRepairIdSet(memory: RoomMemory) {
  emergencyRepairIdSet = new Set();
  for (const id of memory.eris) {
    emergencyRepairIdSet.add(id);
  }
}

let carryQueue: PriorityQueue<CarryTask> | undefined = undefined;
let repairQueue: PriorityQueue<RepairTask> | undefined = undefined;
let emergencyRepairQueue: PriorityQueue<RepairTask> | undefined = undefined;

function repairTaskPriority(task1: RepairTask, task2: RepairTask): boolean {
  function score(task: RepairTask) {
    if (task.sn == STRUCTURE_RAMPART) return 1;
    else if (task.sn == STRUCTURE_CONTAINER) return 10;
    else if (task.sn == STRUCTURE_ROAD) return 5;
    else return 7;
  }
  return score(task1) > score(task2);
}

function initCarryQueue(room: Room) {
  function carryTaskPriority(task1: CarryTask, task2: CarryTask): boolean {
    let structure1 = Game.getObjectById(task1.tgt as Id<Structure>);
    let structure2 = Game.getObjectById(task2.tgt as Id<Structure>);
    if (!structure1 || !structure2) return true;
    let st1 = structure1.structureType;
    let st2 = structure2.structureType;

    function ty(st: StructureConstant) {
      if (st === STRUCTURE_SPAWN) return 10;
      if (st === STRUCTURE_TOWER) return 9;
      if (st === STRUCTURE_EXTENSION) return 8;
      return 7;
    }

    if (st1 !== st2) return ty(st1) > ty(st2);
    let cx = room.memory.center.x, cy = room.memory.center.y;
    function dist(pos: RoomPosition): number {
      return Math.abs(cx - pos.x) + Math.abs(cy - pos.y);
    }
    return dist(structure1.pos) < dist(structure2.pos);
  }
  carryQueue = new PriorityQueue<CarryTask>(carryTaskPriority);
  for (const task of room.memory.caq) carryQueue.push(task);
}

function initRepairQueue(memory: RoomMemory) {
  repairQueue = new PriorityQueue<RepairTask>(repairTaskPriority);
  for (const task of memory.rq) repairQueue.push(task);
}

function initEmergencyRepairQueue(memory: RoomMemory) {
  emergencyRepairQueue = new PriorityQueue<RepairTask>(repairTaskPriority);
  for (const task of memory.erq) emergencyRepairQueue.push(task);
}

export const RoomMemoryController = function (context: RoomMemoryControllerContext) {
  const postRun = function () {
    let memory = context.room.memory;
    // move data back to memory
    if (carryIdSet) {
      memory.cis = [];
      for (const id of carryIdSet) {
        memory.cis.push(id);
      }
      carryIdSet = undefined;
    }
    if (repairIdSet) {
      memory.ris = [];
      for (const id of repairIdSet) {
        memory.ris.push(id);
      }
      repairIdSet = undefined;
    }
    if (emergencyRepairIdSet) {
      memory.eris = [];
      for (const id of emergencyRepairIdSet) {
        memory.eris.push(id);
      }
      emergencyRepairIdSet = undefined;
    }
    if (carryQueue) {
      memory.caq = [];
      while (!carryQueue.empty()) {
        memory.caq.push(carryQueue.poll());
      }
      carryQueue = undefined;
    }
    if (repairQueue) {
      memory.rq = [];
      while (!repairQueue.empty()) {
        memory.rq.push(repairQueue.poll());
      }
      repairQueue = undefined;
    }
    if (emergencyRepairQueue) {
      memory.erq = [];
      while (!emergencyRepairQueue.empty()) {
        memory.erq.push(emergencyRepairQueue.poll());
      }
      emergencyRepairQueue = undefined;
    }
  };

  const addCarryTask = function (task: CarryTask) {
    if (!carryIdSet) initCarryIdSet(context.room.memory);
    carryIdSet = carryIdSet!;
    if (!carryIdSet.has(task.tgt)) {
      carryIdSet.add(task.tgt);
      if (!carryQueue) initCarryQueue(context.room);
      carryQueue!.push(task);
    }
  };

  const finishCarryTask = function (task: CarryTask) {
    if (!carryIdSet) initCarryIdSet(context.room.memory);
    carryIdSet = carryIdSet!;
    carryIdSet.delete(task.tgt);
  };

  const addRepairTask = function (task: RepairTask) {
    if (!repairIdSet) initRepairIdSet(context.room.memory);
    repairIdSet = repairIdSet!;
    if (!repairIdSet.has(task.tgt)) {
      repairIdSet.add(task.tgt);
      if (!repairQueue) initRepairQueue(context.room.memory);
      repairQueue!.push(task);
    }
  };

  const finishRepairTask = function (task: RepairTask) {
    if (!repairIdSet) initRepairIdSet(context.room.memory);
    repairIdSet = repairIdSet!;
    repairIdSet.delete(task.tgt);
  };

  const addEmergencyRepairTask = function (task: RepairTask) {
    if (!emergencyRepairIdSet) initEmergencyRepairIdSet(context.room.memory);
    emergencyRepairIdSet = emergencyRepairIdSet!;
    if (!emergencyRepairIdSet.has(task.tgt)) {
      emergencyRepairIdSet.add(task.tgt);
      if (!emergencyRepairQueue) initEmergencyRepairQueue(context.room.memory);
      emergencyRepairQueue!.push(task);
    }
  }

  const finishEmergencyRepairTask = function (task: RepairTask) {
    if (!emergencyRepairIdSet) initEmergencyRepairIdSet(context.room.memory);
    emergencyRepairIdSet = emergencyRepairIdSet!;
    emergencyRepairIdSet.delete(task.tgt);
  };

  const fetchCarryTask = function (): CarryTask | null {
    if (!carryQueue) initCarryQueue(context.room);
    carryQueue = carryQueue!;
    if (carryQueue.empty()) return null;
    return carryQueue.poll();
  }

  const fetchRepairTask = function (): RepairTask | null {
    if (!repairQueue) initRepairQueue(context.room.memory);
    repairQueue = repairQueue!;
    if (repairQueue.empty()) return null;
    return repairQueue.poll();
  }

  const fetchEmergencyRepairTask = function (): RepairTask | null {
    if (!emergencyRepairQueue) initEmergencyRepairQueue(context.room.memory);
    emergencyRepairQueue = emergencyRepairQueue!;
    if (emergencyRepairQueue.empty()) return null;
    return emergencyRepairQueue.poll();
  }

  const returnCarryTask = function (task: CarryTask) {
    if (!carryQueue) initCarryQueue(context.room);
    carryQueue =  carryQueue!;
    carryQueue.push(task);
  }

  const returnRepairTask = function (task: RepairTask) {
    if (!repairQueue) initRepairQueue(context.room.memory);
    repairQueue = repairQueue!;
    repairQueue.push(task);
  }

  const returnEmergencyRepairTask = function (task: RepairTask) {
    if (!emergencyRepairQueue) initEmergencyRepairQueue(context.room.memory);
    emergencyRepairQueue = emergencyRepairQueue!;
    emergencyRepairQueue.push(task);
  }

  return {
    postRun,
    addCarryTask,
    finishCarryTask,
    addRepairTask,
    finishRepairTask,
    addEmergencyRepairTask,
    finishEmergencyRepairTask,
    fetchCarryTask,
    fetchRepairTask,
    fetchEmergencyRepairTask,
    returnCarryTask,
    returnRepairTask,
    returnEmergencyRepairTask,
  };
};

interface RoomMemoryControllerContext {
  room: Room;
}
