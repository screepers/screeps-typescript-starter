export const STower = {
  run(
    tower: StructureTower,
    addCarryTask: (task: CarryTask) => void,
    getAttackTarget: () => AnyCreep | Structure | null
  ) {
    // carry task
    if (tower.store.energy * 2 < tower.store.getCapacity(RESOURCE_ENERGY))
      addCarryTask({
        tgt: tower.id,
        rt: RESOURCE_ENERGY
      });
    // attack target
    let target = getAttackTarget();
    if (target) tower.attack(target);
  }
};
