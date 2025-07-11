export const SExtension = {
  run(extension: StructureExtension, addCarryTask: (task: CarryTask) => void) {
    // carry task
    if (extension.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      addCarryTask({
        tgt: extension.id,
        rt: RESOURCE_ENERGY
      });
  }
}
