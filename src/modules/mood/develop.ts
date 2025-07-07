import { CreepType } from "../creeps/CreepAPI";

const CreepDict = {
  HARVESTER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      if (room.controller!.level == 1) return 0;
      return 1;
    },
    getNum: function (room: Room): number {
      if (room.name == "sim") {
        return 2; // simulation only
      }
      return room.source.length;
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] }, // before source bounded container is built
      { body: [WORK, WORK, MOVE, MOVE] }, // cost 300 energy, used before extension is built
      { body: [WORK, WORK, WORK, WORK, WORK, MOVE] } // perfect form
    ]
  },
  UPGRADER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      return 0;
    },
    getNum: function (room: Room): number {
      const controller = room.controller;
      if (!controller) return 0;
      if (room.memory.cq.length != 0 && controller.level < 2) {
        if (controller.ticksToDowngrade < 3500) return 1;
        return 0;
      }
      switch (controller.level) {
        case 0:
        case 1:
          return 1;
        case 2:
          if (room.memory.cq.length == 0) return 4;
          else return 2;
        default:
          return 3;
      }
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] },
    ]
  },
  CONSTRUCTOR: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      return 0;
    },
    getNum: function (room: Room): number {
      if (room.memory.cq.length == 0) {
        let stay = false;
        // get existing creeps
        for (const name of room.memory.creeps) {
          // @ts-ignore
          if (Game.creeps[name].memory.data.task != null) {
            stay = true;
            break;
          }
        }
        return stay ? 2 : 0;
      }
      // TODO: implement
      else return 2;
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] },
    ]
  },
  MAINTENANCER: {
    getConfigIndex: function (room: Room): number {
      // TODO: implement
      return 0;
    },
    getNum: function (room: Room): number {
      // TODO: implement
      if (room.memory.mq.length == 0) return 0;
      else return 1;
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] },
    ]
  },
};

export const DevelopConfig = {
  creep: {
    getCreepConfig: (creepType: CreepType, room: Room): {body: BodyPartConstant[]} => {
      switch (creepType) {
        case CreepType.HARVESTER: {
          let roleConfig = CreepDict.HARVESTER;
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
        case CreepType.MAINTENANCER: {
          let roleConfig = CreepDict.MAINTENANCER;
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
        case CreepType.UPGRADER:
          return CreepDict.UPGRADER.getNum(room);
        case CreepType.CONSTRUCTOR:
          return  CreepDict.CONSTRUCTOR.getNum(room);
        case CreepType.MAINTENANCER:
          return CreepDict.MAINTENANCER.getNum(room);
        default:
          throw new Error(`<DEVELOP CONFIG> Unknown creep type ${creepType} in function getCreepNum`);
      }
    }
  }
}
