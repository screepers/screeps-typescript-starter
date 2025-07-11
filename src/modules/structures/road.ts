export const SRoad = {
  run(road: StructureRoad, addRepairTask: (task: RepairTask) => void) {
    // repair task
    if (road.hits < (road.hitsMax >> 1))
      addRepairTask({
        tgt: road.id,
        hits: road.hitsMax,
      });
  }
}
