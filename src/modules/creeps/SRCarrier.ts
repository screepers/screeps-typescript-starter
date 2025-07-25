import { CreepAPI } from "./CreepAPI";
import { err } from "../Message";
import { lookRangeStructure, lookStructure, repairMsg, transferMsg, withdrawMsg } from "../../utils/ToolFunction";

function error(message: string, throwError: boolean = false) {
  err(`[SR CARRIER] ${message}`, throwError);
}

function getSourceByIdx(room: Room, idx: number): Source | null {
  let sr = room.memory.sr;
  for (let roomName of sr) {
    let sourceNum = (Memory.rooms[roomName] as unknown as SRMemory).numSource;
    if (idx < sourceNum) {
      let r = Game.rooms[roomName];
      if (!r) {
        error(`Room ${roomName} invisible`);
        return null;
      }
      return r.source[idx];
    } else idx -= sourceNum;
  }
  return null;
}

export const Creep_sr_carrier = {
  run(creep: Creep, room: Room) {
    if (creep.spawning) return;

    let memory = creep.memory;
    let state = memory.state;
    if (!memory.data) {
      const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
      creep.memory.data = config.creepMemoryData;
    }
    let data = memory.data as SRCarrier_data;

    if (state == STATE.FETCH) {
      // init container
      if (!data.container) {
        let l = creep.name.split("_");
        let source = getSourceByIdx(room, parseInt(l[1]));
        if (!source) {
          error(`Cannot find outer source, index = ${l[1]}`);
          return;
        }
        let result = lookRangeStructure(source.room, source.pos.x, source.pos.y, 1, STRUCTURE_CONTAINER);
        if (!result) {
          error(
            `Cannot find container around source, room = ${source.room.name}, pos = (${source.pos.x}, ${source.pos.y})`
          );
          return;
        }
        let container = result as StructureContainer;
        data.container = container.id;
      }

      // move to container
      let container = Game.getObjectById(data.container as Id<StructureContainer>);
      if (!container) {
        error(`Cannot find container ${data.container}`);
        return;
      }
      let pos = container.pos;
      if (creep.room.name !== pos.roomName) {
        creep.moveTo(pos);
      }
      else if (Math.max(Math.abs(creep.pos.x - pos.x), Math.abs(creep.pos.y - pos.y)) > 1) creep.moveTo(pos);
      else {
        let srRoom = Game.rooms[pos.roomName];
        if (!srRoom) {
          error(`Room ${pos.roomName} invisible`);
          return;
        }
        let container = lookStructure(srRoom, pos.x, pos.y, STRUCTURE_CONTAINER);
        if (!container) {
          error(`Cannot find container at room ${pos.roomName}, position (${pos.x}, ${pos.y})`);
          return;
        }
        let result = creep.withdraw(container, RESOURCE_ENERGY);
        switch (result) {
          case ERR_NOT_IN_RANGE:
            creep.moveTo(pos);
            break;
          case ERR_FULL:
          case OK:
            if (container.hits < CONTAINER_HITS * 0.8) {
              data.repairId = container.id;
              creep.memory.state = STATE.REPAIR;
            }
            else creep.memory.state = STATE.CARRY;
            break;
          case ERR_NOT_ENOUGH_RESOURCES:
            break;
          default:
            error(withdrawMsg(result));
        }
      }
    }
    if (state == STATE.REPAIR) {
      if (!data.repairId) {
        error(`Cannot find repair target`);
        creep.memory.state = STATE.CARRY;
      } else {
        let structure = Game.getObjectById(data.repairId as Id<Structure>);
        if (!structure) {
          error(`Cannot find repair structure, ID = ${data.repairId}`);
          creep.memory.state = STATE.CARRY;
        } else {
          let result = creep.repair(structure);
          switch (result) {
            case OK:
              if (structure.hits >= structure.hitsMax) creep.memory.state = STATE.CARRY;
              break;
            case ERR_NOT_IN_RANGE:
              error(`Repair task too far away, at position (${structure.pos.x}, ${structure.pos.y})`);
              creep.memory.state = STATE.CARRY;
              break;
            case ERR_NOT_ENOUGH_RESOURCES:
              creep.memory.state = STATE.FETCH;
              break;
            default:
              error(repairMsg(result));
          }
        }
      }
    }
    if (state == STATE.CARRY) {
      // check if road needs to be repaired
      if (creep.room.name !== room.name) {
        // main room has repairer
        let result = lookStructure(creep.room, creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        if (result) {
          // creep is on a road
          let road = result as StructureRoad;
          if (road.hits < road.hitsMax * 0.8) {
            data.repairId = road.id;
            creep.memory.state = STATE.REPAIR;
            return;
          }
        }
      }

      // move to storage
      let target = room.storage;
      if (!target) {
        error(`Room ${room.name} has no storage`);
        return;
      }
      let result = creep.transfer(target, RESOURCE_ENERGY);
      switch (result) {
        case ERR_FULL:
        case OK:
          creep.memory.state = STATE.FETCH;
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target);
          break;
        default:
          error(transferMsg(result));
      }
    }
  }
};

interface SRCarrier_data {
  container: string | null;
  repairId: string | null;
}

enum STATE {
  FETCH,
  REPAIR,
  CARRY
}
