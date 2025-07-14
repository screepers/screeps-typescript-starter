import { err } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`[TOWER] ${message}`, throwError);
}

export const STower = {
  run(
    tower: StructureTower,
    addCarryTask: (task: CarryTask) => void,
    getAttackTarget: () => AnyCreep | Structure | null,
    fetchEmergencyRepairTask: () => RepairTask | null,
    finishEmergencyRepairTask: (task: RepairTask) => void
  ) {
    // carry task
    if (tower.store.energy * 2 < tower.store.getCapacity(RESOURCE_ENERGY))
      addCarryTask({
        tgt: tower.id,
        rt: RESOURCE_ENERGY
      });
    // init memory
    let memory = tower.room.memory.tm[tower.id];
    if (memory == undefined) {
      tower.room.memory.tm[tower.id] = { rt: null };
    }
    // repair
    function repair(task: RepairTask): number {
      let structure = Game.getObjectById(task.tgt as Id<Structure>);
      if (structure) {
        if (structure.hits >= task.hits) return 1;
        let result = tower.repair(structure);
        if (result == OK || result == ERR_NOT_ENOUGH_RESOURCES) return 0;
        else {
          error(`Repair error code ${result}`);
          return -1;
        }
      } else {
        error(`Cannot find repair structure ${task.tgt}`);
        return -1;
      }
    }
    if (!memory.rt) memory.rt = fetchEmergencyRepairTask();
    if (memory.rt) {
      let result = repair(memory.rt);
      if (result != 0) {
        // fetch new task
        finishEmergencyRepairTask(memory.rt);
        memory.rt = fetchEmergencyRepairTask();
      }
      return;
    }
    // attack target
    let target = getAttackTarget();
    if (target) tower.attack(target);
  }
};
