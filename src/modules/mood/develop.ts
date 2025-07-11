import { CreepType } from "../creeps/CreepAPI";

const CreepDict = {
  HARVESTER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1) return 0;
      const num_ext = room.extension.length;
      if (num_ext < 5) return 1;
      if (num_ext < 10) return 2;
      return 3;
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
      { body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]}, // cost 650 energy, perfect form
    ]
  },
  CENTER_CARRIER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1) return 0;
      return 1;
    },
    getNum: function (room: Room): number {
      // try to find center container
      const structures = room.lookForAt(LOOK_STRUCTURES, room.memory.center.x, room.memory.center.y);
      if (structures.length == 0) return 0;
      else {
        let num = 0;
        if (room.name == "sim") num = 2;
        else num = room.source.length;
        if (room.controller!.level <= 3) return num * 2;
        else return num;
      }
    },
    CONFIG: [{ body: [CARRY, CARRY, MOVE, MOVE] }, { body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] }]
  },
  CARRIER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1) return 0;
      return 1;
    },
    getNum: function (room: Room): number {
      // try to find center container
      const structures = room.lookForAt(LOOK_STRUCTURES, room.memory.center.x, room.memory.center.y);
      if (structures.length == 0) return 0;
      else return 1;
    },
    CONFIG: [{ body: [CARRY, MOVE] }, { body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] }]
  },
  REPAIRER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      return 0;
    },
    getNum: function (room: Room): number {
      return room.memory.rq.length == 0 ? 0 : 1;
    },
    CONFIG: [{ body: [CARRY, CARRY, MOVE, MOVE, WORK] }]
  },
  UPGRADER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1) return 0;

      return 1;
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
          return 1;
        case 2:
        case 3:
          return 4;
        default:
          return 3;
      }
    },
    CONFIG: [{ body: [WORK, CARRY, MOVE] }, { body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] }]
  },
  CONSTRUCTOR: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1) return 1;
      if (room.extension.length >= 5) return 2;
      return 0;
    },
    getNum: function (room: Room): number {
      if (room.memory.cq.length == 0) return 0;
      // TODO: implement
      if (room.controller!.level == 1) return 3;
      else return 2;
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] },
      { body: [WORK, WORK, CARRY, MOVE] },
      { body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] } // cost 550
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
        default:
          throw new Error(`<DEVELOP CONFIG> Unknown creep type ${creepType} in function getCreepConfig`);
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
        default:
          throw new Error(`<DEVELOP CONFIG> Unknown creep type ${creepType} in function getCreepNum`);
      }
    }
  }
};
