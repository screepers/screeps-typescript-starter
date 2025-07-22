import { CreepAPI } from "./CreepAPI";
import { err } from "../Message";

function error(message: string, throwError: boolean = false) {
  err(`[RESERVER] ${message}`, throwError);
}

export const Creep_reserver = {
  run(creep: Creep, room: Room) {
    if (creep.spawning) return;
    let infoList = creep.name.split("_");
    let index = parseInt(infoList[1]);
    if (index >= room.memory.sr.length) return;

    // check data
    if (!creep.memory.data) {
      // init memory data
      const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
      creep.memory.data = config.creepMemoryData;
    }
    let data = creep.memory.data as Reserver_data;

    // function searchPath(pos: RoomPosition): DirectionConstant[] | null {
    //   let dirPath: DirectionConstant[] = [];
    //   let result = PathFinder.search(creep.pos, { pos: pos, range: 1 });
    //   let idx2Direction = [TOP_LEFT, TOP, TOP_RIGHT, LEFT, LEFT, RIGHT, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT];
    //   function getDirection(pos1: RoomPosition, pos2: RoomPosition): DirectionConstant | null {
    //     // get direction from pos1 to pos2
    //     let dx = pos2.x - pos1.x;
    //     let dy = pos2.y - pos1.y;
    //     if (dx < -1) dx += 50;
    //     else if (dx > 1) dx -= 50;
    //     if (dx < -1 || dx > 1) {
    //       error(
    //         `Position (${pos1.roomName}, ${pos1.x}, ${pos1.y}) is not beside Position (${pos1.roomName}, ${pos1.x}, ${pos1.y})`
    //       );
    //       return null;
    //     }
    //     if (dy < -1) dy += 50;
    //     else if (dy > 1) dy -= 50;
    //     if (dy < -1 || dy > 1) {
    //       error(
    //         `Position (${pos1.roomName}, ${pos1.x}, ${pos1.y}) is not beside Position (${pos1.roomName}, ${pos1.x}, ${pos1.y})`
    //       );
    //       return null;
    //     }
    //     let idx = dx + 1 + (dy + 1) * 3;
    //     // TOP:           dx = 0, dy = -1 => idx = 1
    //     // TOP_RIGHT:     dx = 1, dy - -1 => idx = 2
    //     // RIGHT:         dx = 1, dy = 0  => idx = 5
    //     // BOTTOM_RIGHT:  dx = 1, dy = 1  => idx = 8
    //     // BOTTOM:        dx = 0, dy = 1  => idx = 7
    //     // BOTTOM_LEFT:   dx = -1, dy = 1 => idx = 6
    //     // LEFT:          dx = -1, dy = 0 => idx = 3
    //     // TOP_LEFT:      dx = -1, dy = -1=> idx = 0
    //     return idx2Direction[idx];
    //   }
    //   let path = result.path;
    //   for (let i = 0; i < path.length; i++) {
    //     let dir: DirectionConstant | null = null;
    //     if (i == 0) dir = getDirection(creep.pos, path[i]);
    //     else dir = getDirection(path[i - 1], path[i]);
    //     if (!dir) return null;
    //     dirPath.push(dir);
    //   }
    //   return dirPath.reverse();
    // }

    if (creep.room.name !== room.memory.sr[index]) {
      if (data.pos) creep.moveTo(new RoomPosition(data.pos.x, data.pos.y, room.memory.sr[index]));
      else creep.moveTo(new RoomPosition(25, 25, room.memory.sr[index]));
    } else {
      let controller = creep.room.controller;
      if (!controller) {
        error(`No controller in room ${creep.room.name}`);
        return;
      }
      if (!data.pos) data.pos = { x: controller.pos.x, y: controller.pos.y };
      let result = creep.reserveController(controller);
      switch (result) {
        case ERR_NOT_IN_RANGE:
          creep.moveTo(controller.pos);
          break;
        case OK:
          break;
        default:
          error(`Unhandled reserve error code ${result}`);
      }
    }
  }
};

interface Reserver_data {
  pos: { x: number; y: number } | null;
}
