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
        let result = PathFinder.search(
          center,
          { pos: source.pos, range: 1 },
          {
            plainCost: 2,
            swampCost: 2,
            roomCallback(roomName: string): boolean | CostMatrix {
              let room = Game.rooms[roomName];
              if (!room) return false;
              let costs = new PathFinder.CostMatrix();
              room.find(FIND_STRUCTURES).forEach(function (struct) {
                if (struct.structureType === STRUCTURE_ROAD) {
                  // 相对于平原，寻路时将更倾向于道路
                  costs.set(struct.pos.x, struct.pos.y, 1);
                } else if (
                  struct.structureType !== STRUCTURE_CONTAINER &&
                  (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
                ) {
                  // 不能穿过无法行走的建筑
                  costs.set(struct.pos.x, struct.pos.y, 0xff);
                }
              });
              return costs;
            }
          }
        );
        context.createConstructionSiteByPath(result.path);
      }
      memory.numSource = room.source.length;
      memory.init = true;
      memory.ready = false;
      memory.hasInvader = false;
      memory.hasDefender = false;
    }

    if (room.container.length == room.source.length) memory.ready = true;

    // find enemy creeps
    let creeps = room.find(FIND_HOSTILE_CREEPS);
    if (creeps.length > 0) {
      if (!memory.hasInvader) {
        memory.hasInvader = true;
        context.updateCreepCheckFlag();
      }
    }
    else memory.hasInvader = false;
    return SRError.OK;
  };

  return { run };
};

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
  updateCreepCheckFlag: () => void;
}
