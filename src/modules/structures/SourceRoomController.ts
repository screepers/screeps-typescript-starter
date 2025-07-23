import { SRoad } from "./road";
import { SContainer } from "./Container";

export const SourceRoomController = function (context: SourceRoomControllerContext) {
  const run = function (roomName: string): SRError {
    let room = Game.rooms[roomName];
    if (!room) return SRError.ROOM_INVISIBLE;

    let controller = room.controller;
    if (!controller) return SRError.NO_CONTROLLER;
    if (controller.owner) return SRError.HAS_OWNER;
    if (!controller.reservation) return SRError.NOT_RESERVED;
    if (controller.reservation.username !== "FlagerLee") return SRError.HAS_RESERVATION;

    let memory = room.memory as unknown as SRMemory;
    if (!memory.init) {
      // init memory
      memory.init = false;
    }

    if (!memory.init) {
      // init room
      let center = context.getFatherCenter();
      for (let source of room.source) {
        let result = PathFinder.search(center, { pos: source.pos, range: 1 });
        context.createConstructionSiteByPath(result.path);
      }
      memory.init = true;
    }

    // structures self check
    for (const road of room.road) {
      SRoad.run(road, context.addRepairTask, (task: RepairTask) => {
        return;
      });
    }
    for (const container of room.container) {
      SContainer.run(container, context.addRepairTask, (task: RepairTask) => {
        return;
      });
    }
    return SRError.OK;
  };
};

interface SRMemory {
  init: boolean;
}

enum SRError {
  OK,
  ROOM_INVISIBLE,
  NO_CONTROLLER,
  HAS_OWNER,
  NOT_RESERVED,
  HAS_RESERVATION
}

interface SourceRoomControllerContext {
  getFatherCenter: () => RoomPosition;
  createConstructionSiteByPath: (path: RoomPosition[]) => void;
  addRepairTask: (task: RepairTask) => void;
}
