export const SContainer = {
  run(container: StructureContainer, addRepairTask: (task: RepairTask) => void) {
    const room = container.room;
    const memory = room.memory;
    // repair task
    if (container.hits < (container.hitsMax >> 1))
      addRepairTask({
        tgt: container.id,
        hits: container.hitsMax,
        sn: STRUCTURE_CONTAINER
      });
  }
}
