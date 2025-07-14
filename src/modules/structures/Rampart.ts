import { info } from "../Message";

export const SRampart = {
  run(
    rampart: StructureRampart,
    addRepairTask: (task: RepairTask) => void,
    getRampartTargetHits: () => number,
    addEmergencyRepairTask: (task: RepairTask) => void
  ) {
    // repair task
    if (rampart.hits < getRampartTargetHits() * 0.667)
      addRepairTask({
        tgt: rampart.id,
        hits: getRampartTargetHits(),
        sn: STRUCTURE_RAMPART
      });
    if (rampart.hits <= 400) {
      addEmergencyRepairTask({
        tgt: rampart.id,
        hits: 500,
        sn: STRUCTURE_RAMPART
      });
    }
  }
};
