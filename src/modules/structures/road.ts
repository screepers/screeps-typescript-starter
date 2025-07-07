export const SRoad = {
  run(road: StructureRoad) {
    // repair task
    if (road.hits < road.hitsMax >> 2) {
      road.room.memory.mq.push({
        type: "Repair",
        time: 0,
        data: {
          targetId: road.id,
          hits: road.hitsMax - 10
        } as RepairTaskData
      })
    }
  }
}
