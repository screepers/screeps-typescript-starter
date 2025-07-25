import { updateFallback } from "../mood/develop";
import { CreepAPI, CreepType, getCreepTypeList } from "./CreepAPI";

export function checkCreepMemory(room: Room, spawn: (creepName: string) => void) {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps) && name.split("_")[2] == room.name) {
      // creep dead, spawn new one
      spawn(name);
      delete Memory.creeps[name];
    }
  }
}

export function checkCreepNum(room: Room, destroyCreeps: (names: string[]) => void) {
  const creepTypeList = getCreepTypeList();
  let creepTypeMap: Record<CreepType, string[]> = creepTypeList.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as Record<CreepType, string[]>);
  // calculate creep info in memory
  for (const creepName of room.memory.creeps) {
    const config = CreepAPI.getCreepConfig(creepName, { getCreepType: true });
    creepTypeMap[config.creepType!].push(creepName);
  }
  // check each type of creep
  let destroyedCreepNames: string[] = [];
  for (const creepType of creepTypeList) {
    const exceptNum = CreepAPI.getCreepNum(creepType, room);
    const realNum = creepTypeMap[creepType].length;
    if (realNum > exceptNum) {
      let creepNames = creepTypeMap[creepType];
      creepNames.sort((s1, s2) => {
        function getNum(s: string) {
          return parseInt(s.split("_")[1]);
        }
        return getNum(s1) < getNum(s2) ? -1 : 1;
      });
      destroyedCreepNames.push(...creepNames.slice(exceptNum, realNum));
    } else if (realNum < exceptNum) {
      for (let i = realNum; i < exceptNum; i++) {
        const creepName = `${CreepType[creepType]}_${i}_${room.name}`;
        // create creep memory
        Memory.creeps[creepName] = { state: 0, no_pull: false };
        room.memory.creeps.push(creepName);
      }
    }
  }
  destroyCreeps(destroyedCreepNames);
}
