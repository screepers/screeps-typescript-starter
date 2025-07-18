export const SContainer = {
  run(container: StructureContainer, addRepairTask: (task: RepairTask) => void, addEmergencyRepairTask: (task: RepairTask) => void) {
    const room = container.room;
    const memory = room.memory;
    // repair task
    if (container.hits < (container.hitsMax * 0.75))
      addRepairTask({
        tgt: container.id,
        hits: container.hitsMax,
        sn: STRUCTURE_CONTAINER
      });
    // emergency repair task
    if (container.hits < 15000)
      addEmergencyRepairTask({
        tgt: container.id,
        hits: 30000,
        sn: STRUCTURE_CONTAINER
      })
  }
}
