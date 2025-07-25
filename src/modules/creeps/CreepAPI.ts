import { DevelopConfig } from "../mood/develop";
import { err } from "../Message";

export const CreepAPI = {
  getCreepConfig(creepName: string, context: CreepAPIContext = {}): CreepConfig {
    let ctx = {
      getSpawnInfo: context.getSpawnInfo ?? false,
      getCreepType: context.getCreepType ?? false,
      getCreepMemoryData: context.getCreepMemoryData ?? false,
      getCreepRoom: context.getCreepRoom ?? false
    };
    let returnConfig = new CreepConfig();

    // parse creep name
    let nameInfoList = creepName.split("_");
    // parse creep type
    const creepType = getCreepType(nameInfoList[0]);

    if (ctx.getSpawnInfo) {
      // TODO: use different mood
      let creepConfig = DevelopConfig.creep.getCreepConfig(creepType, Game.rooms[nameInfoList[2]]);
      returnConfig.body = creepConfig.body;
      returnConfig.spawnCost = getCreepCost(returnConfig.body);
    }

    if (ctx.getCreepType) {
      returnConfig.creepType = creepType;
    }

    if (ctx.getCreepMemoryData) {
      returnConfig.creepMemoryData = getCreepMemoryData(creepType, nameInfoList);
    }

    if (ctx.getCreepRoom) {
      returnConfig.room = Game.rooms[nameInfoList[2]];
    }

    return returnConfig;
  },
  getCreepNum(creepType: CreepType, room: Room): number {
    // TODO: use different mood
    return DevelopConfig.creep.getCreepNum(creepType, room);
  }
};

interface CreepAPIContext {
  getSpawnInfo?: boolean;
  getCreepType?: boolean;
  getCreepMemoryData?: boolean;
  getCreepRoom?: boolean;
}

export class CreepConfig {
  body?: BodyPartConstant[];
  spawnCost?: number;
  creepType?: CreepType;
  creepMemoryData?: Object;
  room?: Room;
}

// creep role definition
export const HARVESTER = "HARVESTER";
export const CCARRIER = "CCARRIER";
export const CENTER = "CENTER";
export const CARRIER = "CARRIER";
export const REPAIRER = "REPAIRER";
export const UPGRADER = "UPGRADER";
export const CONSTRUCTOR = "CONSTRUCTOR";
export const RESERVER = "RESERVER";

export const SRHARVESTER = "SRHARVESTER";
export const SRCARRIER = "SRCARRIER";
export const SRDEFENDER = "SRDEFENDER";
export enum CreepType {
  HARVESTER,
  CARRIER,
  CCARRIER,
  SRDEFENDER,
  REPAIRER,
  CONSTRUCTOR,
  UPGRADER,
  RESERVER,

  SRHARVESTER,
  SRCARRIER
}
export function getCreepTypeList() {
  return [
    CreepType.HARVESTER,
    CreepType.CCARRIER,
    CreepType.CARRIER,
    CreepType.REPAIRER,
    CreepType.UPGRADER,
    CreepType.CONSTRUCTOR,
    CreepType.RESERVER,

    CreepType.SRHARVESTER,
    CreepType.SRCARRIER,
    CreepType.SRDEFENDER,
  ];
}

// tool function
const MOVE_COST = 50;
const WORK_COST = 100;
const CARRY_COST = 50;
const ATTACK_COST = 80;
const RANGED_ATTACK_COST = 150;
const HEAL_COST = 250;
const CLAIM_COST = 600;
const TOUGH_COST = 10;
export function getCreepCost(body: BodyPartConstant[]): number {
  let cost = 0;
  for (let part of body) {
    switch (part) {
      case "attack":
        cost += ATTACK_COST;
        break;
      case "carry":
        cost += CARRY_COST;
        break;
      case "claim":
        cost += CLAIM_COST;
        break;
      case "heal":
        cost += HEAL_COST;
        break;
      case "move":
        cost += MOVE_COST;
        break;
      case "ranged_attack":
        cost += RANGED_ATTACK_COST;
        break;
      case "tough":
        cost += TOUGH_COST;
        break;
      case "work":
        cost += WORK_COST;
        break;
    }
  }
  return cost;
}

function getCreepType(typeName: string): CreepType {
  switch (typeName) {
    case HARVESTER:
      return CreepType.HARVESTER;
    case CCARRIER:
      return CreepType.CCARRIER;
    case CARRIER:
      return CreepType.CARRIER;
    case REPAIRER:
      return CreepType.REPAIRER;
    case UPGRADER:
      return CreepType.UPGRADER;
    case CONSTRUCTOR:
      return CreepType.CONSTRUCTOR;
    case RESERVER:
      return CreepType.RESERVER;
    case SRHARVESTER:
      return CreepType.SRHARVESTER;
    case SRCARRIER:
      return CreepType.SRCARRIER;
    case SRDEFENDER:
      return CreepType.SRDEFENDER;
    default:
      throw new Error(`[CREEP API] Unknown creep type ${typeName}`);
  }
}

// creep data getter
function getCreepMemoryData(type: CreepType, nameInfoList: string[]): Object {
  switch (type) {
    case CreepType.HARVESTER: {
      // nameInfoList[2] indicates the room of source
      const room = Game.rooms[nameInfoList[2]];
      if (!room) {
        // room invisible
        return {
          sid: "",
          cid: ""
        };
      }
      const idx = Number(nameInfoList[1]);
      const source = room.source[idx];
      // find container
      let structures = room.lookForAtArea(
        LOOK_STRUCTURES,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true
      );
      let container: StructureContainer | null = null;
      for (let structure of structures) {
        if (structure.structure.structureType == STRUCTURE_CONTAINER) {
          container = structure.structure as StructureContainer;
          break;
        }
      }
      if (!container) {
        err(`[CREEP API] Cannot find source container, idx = ${idx}`, false);
        return {
          sid: source.id,
          cid: ""
        };
      }
      return {
        sid: source.id,
        cid: container!.id
      };
    }
    case CreepType.CARRIER:
      return {
        task: null
      };
    case CreepType.REPAIRER:
      return {
        task: null,
        stop: 0
      };
    case CreepType.CONSTRUCTOR:
      return {
        task: null,
        source: null,
        stop: 0
      };
    case CreepType.UPGRADER:
    case CreepType.CCARRIER:
      return {
        stop: 0
      };
    case CreepType.RESERVER:
      return {
        pos: null
      };
    case CreepType.SRCARRIER:
      return {
        container: null,
        repairId: null
      };
    default:
      throw new Error(`[CREEP API] Unknown creep type ${type}`);
  }
}
