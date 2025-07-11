export const SSpawn = {
  run(spawn: StructureSpawn, addCarryTask: (task: CarryTask) => void) {
    const room = spawn.room;
    const memory = room.memory;
    // check energy
    if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      // create carry task
      addCarryTask({
        tgt: spawn.id,
        rt: RESOURCE_ENERGY,
      });
  }
};
