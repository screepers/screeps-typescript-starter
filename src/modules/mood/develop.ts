import { CreepType } from "../creeps/CreepAPI";

const CreepDict = {
  HARVESTER: {
    getConfigIndex: function (): number {
      // TODO: implement
      return 0;
    },
    getNum: function (room: Room): number {
      return room.source.length;
    },
    CONFIG: [
      { body: [WORK, CARRY, MOVE] }, // before source bounded container is built
      { body: [WORK, WORK, MOVE, MOVE] }, // cost 300 energy, used before extension is built
      { body: [WORK, WORK, WORK, WORK, WORK, MOVE] } // perfect form
    ]
  },
  UPGRADER: {}
};

export const DevelopConfig = {
  creep: {
    getCreepConfig: (creepType: CreepType): {body: BodyPartConstant[]} => {
      switch (creepType) {
        case CreepType.HARVESTER:
          let roleConfig = CreepDict.HARVESTER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex()];
        default:
          throw new Error(`<DEVELOP CONFIG> Unknown creep type ${creepType} in function getCreepConfig`);
      }
    },
    getCreepNum: (creepType: CreepType, room: Room): number => {
      switch (creepType) {
        case CreepType.HARVESTER:
          return CreepDict.HARVESTER.getNum(room);
        default:
          throw new Error(`<DEVELOP CONFIG> Unknown creep type ${creepType} in function getCreepNum`);
      }
    }
  }
}
