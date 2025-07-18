export const SRoad = {
  run(road: StructureRoad, addRepairTask: (task: RepairTask) => void, addEmergencyRepairTask: (task: RepairTask) => void) {
    // repair task
    if (road.hits < (road.hitsMax >> 1))
      addRepairTask({
        tgt: road.id,
        hits: road.hitsMax,
        sn: STRUCTURE_ROAD
      });
    if (road.hits < 1000)
      addEmergencyRepairTask({
        tgt: road.id,
        hits: 2000,
        sn: STRUCTURE_ROAD
      });
  }
}
