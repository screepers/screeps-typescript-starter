export const SExtension = {
  run(extension: StructureExtension, addCarryTask: (task: Task) => void) {
    // carry task
    if (extension.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      addCarryTask({
        type: "Carry",
        time: 0,
        data: {
          targetId: extension.id,
          resourceType: RESOURCE_ENERGY,
          resourceNum: extension.store.getFreeCapacity(RESOURCE_ENERGY),
          carriedNum: 0
        } as CarryTaskData
      })
  }
}
