import { HARVESTER } from "../creeps/CreepAPI";

const CreepDict = {
  "HARVESTER": {
    getConfigIndex: function (): number {
      return 0;
    },
    "CONFIG": [
      { "body": [WORK, CARRY, MOVE], },                   // before source bounded container is built
      { "body": [WORK, WORK, MOVE, MOVE], },              // cost 300 energy, used before extension is built
      { "body": [WORK, WORK, WORK, WORK, WORK, MOVE], },  // perfect form
    ]
  },
  "UPGRADER": {},
}

export const DevelopConfig = {
  // creep: {
  //   "HARVESTER": {
  //     getConfigIndex: function (): number {
  //       return 0;
  //     },
  //     "CONFIG": [
  //       {
  //         "body": [WORK, CARRY, MOVE],
  //       }
  //     ]
  //   },
  //   "UPGRADER": {
  //
  //   }
  // }
  creep: {
    getCreepConfig: (creepTypeString: string): {body: BodyPartConstant[]} => {
      switch (creepTypeString) {
        case HARVESTER:
          let roleConfig = CreepDict.HARVESTER;
          return roleConfig.CONFIG[roleConfig.getConfigIndex()];
        default:
          throw new Error(`<DEVELOP CONFIG> Unhandled creep type ${creepTypeString}`);
      }
    }
  }
}
