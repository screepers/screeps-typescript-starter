export const SContainer = {
  run(container: StructureContainer, addRepairTask: (task: Task) => void) {
    const room = container.room;
    const memory = room.memory;
    // repair task
    if (container.hits < (container.hitsMax >> 1)) {
      addRepairTask({
        type: "Repair",
        time: 0,
        data: {
          targetId: container.id,
          hits: container.hitsMax - 10
        } as RepairTaskData
      });
    }
    // add to energy source
    if (!room.storage) {
      // room has no storage
      if ((memory.source.id == "" || memory.source.type == "Spawn") && container.store.energy > 500) {
        memory.source = {
          id: container.id,
          type: "Container"
        }
      }
    }
  }
}
