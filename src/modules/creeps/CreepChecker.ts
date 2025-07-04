import { CreepAPI, CreepType, getCreepTypeList } from "./CreepAPI";

export function checkCreepMemory(spawn: (creepName: string) => void) {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      // creep dead, spawn new one
      spawn(name);
      delete Memory.creeps[name];
    }
  }
}

export function checkCreepNum() {
  for (const [roomName, singleRoom] of Object.entries(Memory.rooms)) {
    const room = Game.rooms[roomName];

    const creepTypeList = getCreepTypeList();
    let creepTypeMap: Record<CreepType, number> = creepTypeList.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<CreepType, number>);
    // calculate creep info
    for (const creepName of singleRoom.creeps) {
      const config = CreepAPI.getCreepConfig(creepName, { getCreepType: true });
      creepTypeMap[config.creepType!] += 1;
    }
    // check each type of creep
    for (const creepType of creepTypeList) {
      const exceptNum = CreepAPI.getCreepNum(creepType, room);
      const realNum = creepTypeMap[creepType];
      if (realNum > exceptNum) {
        throw new Error(
          "<CREEP NUM CHECKER> Unhandled error: creep number ${realNum} greater than exception ${exceptNum}"
        );
      }
      if (realNum < exceptNum) {
        for (let i = realNum; i < exceptNum; i ++) {
          const creepName = `${CreepType[creepType]}_${i}_${roomName}`;
          // create creep memory
          Memory.creeps[creepName] = {state: 0};
        }
      }
    }
  }
}
