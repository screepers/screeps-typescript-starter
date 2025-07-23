import { createBunkerLayout } from "../layout/bunkerLayout";
import { err } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`[STRUCTURE CONTROLLER] ${message}`, throwError);
}

export const SController = {
  run(controller: StructureController) {
    // check level
    const room = controller.room;
    if (controller.level > room.memory.lv) {
      room.memory.lv = controller.level;
      createBunkerLayout(room, (x, y, type) => {
        const result = room.createConstructionSite(x, y, type);
        switch (result) {
          case OK:
            room.memory.cq.unshift({
              tgt: `|${x}|${y}|${room.name}`,
            } as ConstructTask);
            break;
          default:
            error(`Unhandled construction error code ${result}, type = ${type}, position = (${x}, ${y})`);
        }
      });
      room.memory.creepConfigUpdate = true;
    }
  }
};
