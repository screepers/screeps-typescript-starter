import { SController } from "./Controller";
import { SSpawn } from "./Spawn";
import { SContainer } from "./Container";
import { SRoad } from "./road";
import { SExtension } from "./Extension";

export const StructuresController = function (context: StructureControllerContext) {
  const run = function (): void {
    const room = context.room;
    // run controller
    if (room.controller) SController.run(room.controller);
    for (const spawn of room.spawn) {
      SSpawn.run(spawn, context.addCarryTask);
    }
    for (const container of room.container) {
      SContainer.run(container, context.addRepairTask);
    }
    for (const road of room.road) {
      SRoad.run(road, context.addRepairTask);
    }
    for (const extension of room.extension) {
      SExtension.run(extension, context.addCarryTask);
    }
  };

  return { run };
};

interface StructureControllerContext {
  room: Room;
  addRepairTask: (task: RepairTask) => void;
  addCarryTask: (task: CarryTask) => void;
}
