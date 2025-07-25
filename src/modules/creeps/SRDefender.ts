import { err } from "../Message";
import { rangedAttackMsg } from "../../utils/ToolFunction";

function error(message: string, throwError: boolean = false) {
  err(`[SR DEFENDER] ${message}`, throwError);
}

export const Creep_sr_defender = {
  run(creep: Creep, room: Room) {
    if (creep.spawning) return;
    let memory = creep.memory;
    if (!memory.data) {
      // find room to defend
      for (let srRoomName of room.memory.sr) {
        let r = Game.rooms[srRoomName];
        if (r && (r.memory as unknown as SRMemory).hasInvader && !(r.memory as unknown as SRMemory).hasDefender) {
          memory.data = { roomName: srRoomName, target: null } as SRDefender_data;
          (r.memory as unknown as SRMemory).hasDefender = true;
        }
      }
    }
    if (!memory.data) return;

    let data = memory.data as SRDefender_data;
    let sr = Game.rooms[data.roomName];
    let srMemory = sr.memory as unknown as SRMemory;
    if (!sr) {
      error(`Cannot find room ${data.roomName}`);
      return;
    }
    if (creep.ticksToLive! < 2) {
      srMemory.hasDefender = false;
      room.memory.creepConfigUpdate = true;
      creep.suicide();
    }

    // move to target room
    if (creep.room.name !== data.roomName) {
      creep.moveTo(sr.controller!);
      return;
    } else {
      let pos = creep.pos;
      if (pos.x == 0 || pos.x == 49 || pos.y == 0 || pos.y == 49) {
        // creep is at the boarder
        creep.moveTo(sr.controller!);
        return;
      }
    }

    // find invaders
    if ((sr.memory as unknown as SRMemory).hasInvader) {
      let invaders = sr.find(FIND_HOSTILE_CREEPS);
      if (invaders.length > 0) {
        data.target = invaders[0].id;
      }
    }

    if (data.target) {
      let target = Game.getObjectById(data.target as Id<Creep>);
      if (!target) {
        // invader is dead
        data.target = null;
        return;
      }
      let rangedAttackResult = creep.rangedAttack(target);
      switch (rangedAttackResult) {
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target);
          break;
        case OK:
          break;
        default:
          error(rangedAttackMsg(rangedAttackResult));
      }
    }
    // check hits
    // else if (creep.hits < creep.hitsMax) {
    //   creep.heal(creep);
    // }
  }
};

interface SRDefender_data {
  roomName: string;
  target: string | null;
}
