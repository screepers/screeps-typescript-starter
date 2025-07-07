export const SSpawn = {
  run(spawn: StructureSpawn) {
    const room = spawn.room;
    const memory = room.memory;
    // check energy
    // if (memory.sq.length > 0 && spawn.store.energy < 200) {
    //   // create carry task
    //   const energy_sum = Math.min(200, spawn.store.getFreeCapacity(RESOURCE_ENERGY));
    //   if (energy_sum > 25) {
    //     memory.mq.push({
    //       type: "Carry",
    //       time: 0,
    //       data: {
    //         targetId: spawn.id,
    //         resourceType: RESOURCE_ENERGY,
    //         resourceNum: energy_sum,
    //         carriedNum: 0
    //       } as CarryTaskData
    //     });
    //   }
    // }
    // add to energy source
    if (!room.storage && memory.source.id == "" && memory.sq.length == 0) {
      memory.source = {
        id: spawn.id,
        type: "Spawn"
      };
    }
  }
};
