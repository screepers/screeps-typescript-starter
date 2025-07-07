import { SController } from "./Controller";
import { SSpawn } from "./Spawn";
import { SContainer } from "./Container";
import { SRoad } from "./road";

export const StructuresController = function (context: StructureControllerContext) {
  const run = function (): void {
    const room = context.room;
    // run controller
    if (room.controller) SController.run(room.controller);
    for (const spawn of room.spawn) {
      SSpawn.run(spawn);
    }
    for (const container of room.container) {
      SContainer.run(container);
    }
    for (const road of room.road) {
      SRoad.run(road);
    }
  };

  return { run };
};

interface StructureControllerContext {
  room: Room;
}
