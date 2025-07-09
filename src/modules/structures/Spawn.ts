export const SSpawn = {
  run(spawn: StructureSpawn, addCarryTask: (task: Task) => void) {
    const room = spawn.room;
    const memory = room.memory;
    // check energy
    if (memory.sq.length > 0 && spawn.store.energy < 300) {
      // create carry task
      addCarryTask({
        type: "Carry",
        time: 0,
        data: {
          targetId: spawn.id,
          resourceType: RESOURCE_ENERGY,
          resourceNum: 300,
          carriedNum: 0,
        } as CarryTaskData
      });
    }
    // add to energy source
    if (!room.storage && memory.source.id == "" && memory.sq.length == 0) {
      memory.source = {
        id: spawn.id,
        type: "Spawn"
      };
    }
  }
};
