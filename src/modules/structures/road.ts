export const SRoad = {
  run(road: StructureRoad, addRepairTask: (task: Task) => void) {
    // repair task
    if (road.hits < (road.hitsMax >> 1)) {
      addRepairTask({
        type: "Repair",
        time: 0,
        data: {
          targetId: road.id,
          hits: road.hitsMax - 10
        } as RepairTaskData
      });
    }
  }
}
