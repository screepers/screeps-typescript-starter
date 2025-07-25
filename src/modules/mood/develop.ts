import { CARRIER, CreepType, getCreepCost, HARVESTER } from "../creeps/CreepAPI";

export function updateFallback(room: Room) {
  let fallback = false;
  // use fallback creep config when
  // 1. creep carrier is dead, or
  // 2. creep harvester is dead
  for (const name of room.memory.sq) {
    if (name.startsWith(CARRIER)) {
      fallback = true;
      break;
    } else if (name.startsWith(HARVESTER)) {
      // TODO: add timer, when harvester is in spawnQueue more than 50 ticks, fallback
    }
  }

  if (fallback) {
    // use fallback
    room.memory.fb = true;
    // calculate remaining energy in extensions and spawns
    let energy_amount = 0;
    for (const extension of room.extension) {
      energy_amount += extension.store.energy;
    }
    let min_energy = 10000;
    for (const spawn of room.spawn) {
      min_energy = Math.min(min_energy, spawn.store.energy);
    }
    room.memory.fbc = Math.max(min_energy + energy_amount, 300);
  } else {
    room.memory.fb = false;
    room.memory.fbc = -1;
  }
}

function getSRReadyNum(room: Room) {
  let srs = room.memory.sr;
  let num = 0;
  for (let sr of srs) {
    let r = Game.rooms[sr];
    if (!r) continue;
    let memory = r.memory as unknown as SRMemory;
    if (memory.ready) num += memory.numSource;
  }
  return num;
}

const CreepDict = {
  HARVESTER: {
    getConfigIndex: function (room: Room): number {
      let index = 0;
      const num_ext = room.extension.length;
      if (room.controller!.level == 1) index = 0;
      else if (num_ext < 5) index = 1;
      else if (num_ext < 10) index = 2;
      else index = 3;
      // check fallback
      if (room.memory.fb) {
        for (; index >= 1; index--) {
          if (getCreepCost(this.CONFIG[index].body) <= room.memory.fbc) break;
        }
      }
      return index;
    },
    getNum: function (room: Room): number {
      if (room.controller!.level == 1 && room.memory.cq.length > 0) return 0;
      if (room.name == "sim") {
        return 2; // simulation only
      }
      return room.source.length;
    },
    CONFIG: [
      { body: [WORK, MOVE] }, // before source bounded container is built
      { body: [WORK, WORK, MOVE, MOVE] }, // cost 300 energy, used before extension is built
      { body: [WORK, WORK, WORK, WORK, MOVE, MOVE] }, // cost 500 energy
      { body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE] } // cost 650 energy, perfect form
    ]
  },
  CENTER_CARRIER: {
    getConfigIndex: function (room: Room): number {
      let index = 0;
      if (room.controller!.level == 1) index = 0;
      else if (room.extension.length < 20) index = 1;
      else index = 2;
      // check fallback
      if (room.memory.fb) {
        for (; index >= 0; index--) {
          if (getCreepCost(this.CONFIG[index].body) <= room.memory.fbc) break;
        }
      }
      return index;
    },
    getNum: function (room: Room): number {
      // try to find center container
      const structures = room.lookForAt(LOOK_STRUCTURES, room.memory.center.x, room.memory.center.y);
      if (structures.length == 0) return 0;
      else {
        let num = 0;
        if (room.name == "sim") num = 2;
        else num = room.source.length;
        if (room.extension.length < 20) return num * 2;
        else return num;
      }
    },
    CONFIG: [
      { body: [CARRY, CARRY, MOVE, MOVE] },
      { body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] },
      { body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] }
    ]
  },
  CARRIER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      let index = 0;
      if (room.controller!.level == 1) index = 0;
      else if (room.extension.length < 30) index = 1;
      else index = 2;
      if (room.memory.fb) {
        for (; index >= 0; index--) {
          if (getCreepCost(this.CONFIG[index].body) <= room.memory.fbc) break;
        }
      }
      return index;
    },
    getNum: function (room: Room): number {
      // try to find center container
      const structures = room.lookForAt(LOOK_STRUCTURES, room.memory.center.x, room.memory.center.y);
      if (structures.length == 0) return 0;
      else return 1;
    },
    CONFIG: [
      { body: [CARRY, MOVE] },
      { body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] },
      { body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] }
    ]
  },
  REPAIRER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.extension.length < 10) return 0;
      return 1;
    },
    getNum: function (room: Room): number {
      return room.memory.rq.length == 0 ? 0 : 1;
    },
    CONFIG: [
      { body: [CARRY, CARRY, MOVE, MOVE, WORK] },
      { body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] }
    ]
  },
  UPGRADER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1 || room.extension.length < 5) return 0;
      if (room.extension.length < 20) return 1;
      return 2;
    },
    getNum: function (room: Room): number {
      const controller = room.controller;
      if (!controller) return 0;
      if (room.memory.cq.length != 0) {
        if (controller.ticksToDowngrade < 3500) return 1;
        return 0;
      }
      switch (controller.level) {
        case 0:
        case 1:
        case 8:
          return 1;
        case 5:
          return 3;
        default:
          return 4;
      }
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] },
      { body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] },
      { body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] }
    ]
  },
  CONSTRUCTOR: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1) return 1;
      if (room.extension.length <= 25) return 2;
      if (room.extension.length > 25) return 3;
      return 0;
    },
    getNum: function (room: Room): number {
      if (room.memory.cq.length == 0) return 0;
      // TODO: implement
      if (room.controller!.level == 1) return 3;
      if (room.extension.length > 25) return 1;
      else return 2;
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] },
      { body: [WORK, WORK, CARRY, MOVE] },
      { body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] }, // cost 550
      {
        body: [
          WORK,
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ]
      } // cost 1150
    ]
  },
  RESERVER: {
    getConfigIndex: function (room: Room): number {
      return 0;
    },
    getNum: function (room: Room): number {
      if (room.extension.length < 30) return 0;
      return room.memory.sr.length;
    },
    CONFIG: [
      { body: [CLAIM, CLAIM, MOVE, MOVE] } // cost 1300
    ]
  },
  SRHARVESTER: {
    getConfigIndex: function (room: Room): number {
      return 0;
    },
    getNum: function (room: Room): number {
      return getSRReadyNum(room);
    },
    CONFIG: [{ body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE] }]
  },
  SRCARRIER: {
    getConfigIndex: function (room: Room): number {
      return 0;
    },
    getNum: function (room: Room): number {
      return getSRReadyNum(room);
    },
    CONFIG: [
      {
        body: [
          WORK,
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ]
      }
    ]
  },
  SRDEFENDER: {
    getConfigIndex: function (room: Room): number {
      return 0;
    },
    getNum: function (room: Room): number {
      let numDefender = 0;
      for (let srName of room.memory.sr) {
        let room = Game.rooms[srName];
        if (!room) continue;
        let mem = room.memory as unknown as SRMemory;
        if (mem.hasInvader) numDefender++;
      }
      return numDefender;
    },
    CONFIG: [
      {
        body: [...Array(10).fill(TOUGH), ...Array(15).fill(MOVE), ...Array(6).fill(RANGED_ATTACK), MOVE]
      }
    ]
  }
};

export const DevelopConfig = {
  creep: {
    getCreepConfig: (creepType: CreepType, room: Room): { body: BodyPartConstant[] } => {
      switch (creepType) {
        case CreepType.HARVESTER: {
          let roleConfig = CreepDict.HARVESTER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.CCARRIER: {
          let roleConfig = CreepDict.CENTER_CARRIER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.CARRIER: {
          let roleConfig = CreepDict.CARRIER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.REPAIRER: {
          let roleConfig = CreepDict.REPAIRER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.UPGRADER: {
          let roleConfig = CreepDict.UPGRADER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.CONSTRUCTOR: {
          let roleConfig = CreepDict.CONSTRUCTOR;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.RESERVER: {
          let roleConfig = CreepDict.RESERVER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.SRHARVESTER: {
          let roleConfig = CreepDict.SRHARVESTER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.SRCARRIER: {
          let roleConfig = CreepDict.SRCARRIER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        case CreepType.SRDEFENDER: {
          let roleConfig = CreepDict.SRDEFENDER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex(room)];
        }
        default:
          throw new Error(`[DEVELOP CONFIG] Unknown creep type ${creepType} in function getCreepConfig`);
      }
    },
    getCreepNum: (creepType: CreepType, room: Room): number => {
      switch (creepType) {
        case CreepType.HARVESTER:
          return CreepDict.HARVESTER.getNum(room);
        case CreepType.CCARRIER:
          return CreepDict.CENTER_CARRIER.getNum(room);
        case CreepType.CARRIER:
          return CreepDict.CARRIER.getNum(room);
        case CreepType.REPAIRER:
          return CreepDict.REPAIRER.getNum(room);
        case CreepType.UPGRADER:
          return CreepDict.UPGRADER.getNum(room);
        case CreepType.CONSTRUCTOR:
          return CreepDict.CONSTRUCTOR.getNum(room);
        case CreepType.RESERVER:
          return CreepDict.RESERVER.getNum(room);
        case CreepType.SRHARVESTER:
          return CreepDict.SRHARVESTER.getNum(room);
        case CreepType.SRCARRIER:
          return CreepDict.SRCARRIER.getNum(room);
        case CreepType.SRDEFENDER:
          return CreepDict.SRDEFENDER.getNum(room);
        default:
          throw new Error(`[DEVELOP CONFIG] Unknown creep type ${creepType} in function getCreepNum`);
      }
    }
  }
};
