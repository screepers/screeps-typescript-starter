import { SController } from "./Controller";
import { SSpawn } from "./Spawn";
import { SContainer } from "./Container";
import { SRoad } from "./road";
import { SExtension } from "./Extension";
import { STower } from "./Tower";
import { SRampart } from "./Rampart";
import { err } from "../Message";

export const StructuresController = function (context: StructureControllerContext) {
  const handleError = function (fn: () => void): void {
    try {
      fn();
    } catch (e) {
      err(`[Structures Controller] Caught error ${(e as Error).message}`, false);
    }
  };
  const run = function (): void {
    const room = context.room;
    // run controller
    if (room.controller)
      handleError(() => {
        SController.run(room.controller!);
      });
    for (const spawn of room.spawn) {
      handleError(() => {
        SSpawn.run(spawn, context.addCarryTask);
      });
    }
    for (const container of room.container) {
      handleError(() => {
        SContainer.run(container, context.addRepairTask);
      });
    }
    for (const road of room.road) {
      handleError(() => {
        SRoad.run(road, context.addRepairTask);
      });
    }
    for (const extension of room.extension) {
      handleError(() => {
        SExtension.run(extension, context.addCarryTask);
      });
    }
    for (const tower of room.tower) {
      handleError(() => {
        STower.run(
          tower,
          context.addCarryTask,
          context.getAttackTarget,
          context.fetchEmergencyRepairTask,
          context.finishEmergencyRepairTask
        );
      });
    }
    for (const rampart of room.rampart) {
      handleError(() => {
        SRampart.run(rampart, context.addRepairTask, context.getRampartTargetHits, context.addEmergencyRepairTask);
      });
    }
  };

  return { run };
};

interface StructureControllerContext {
  room: Room;
  addRepairTask: (task: RepairTask) => void;
  addCarryTask: (task: CarryTask) => void;
  getAttackTarget: () => AnyCreep | Structure | null;
  createLayout: (createFn: (x: number, y: number, type: BuildableStructureConstant) => void) => void;
  getRampartTargetHits: () => number;
  addEmergencyRepairTask: (task: RepairTask) => void;
  fetchEmergencyRepairTask: () => RepairTask | null;
  finishEmergencyRepairTask: (task: RepairTask) => void;
}
