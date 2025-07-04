import { DevelopConfig } from "../mood/develop";

export const CreepAPI = {
  getCreepConfig(creepName: string, context: CreepAPIContext = {}): CreepConfig {
    let ctx = {
      getSpawnInfo: context.getSpawnInfo ?? false,
      getCreepType: context.getCreepType ?? false,
      getCreepMemoryData: context.getCreepMemoryData ?? false
    };
    let returnConfig = new CreepConfig();

    // parse creep name
    let nameInfoList = creepName.split("_");
    // parse creep type
    const creepType = getCreepType(nameInfoList[0]);

    if (ctx.getSpawnInfo) {
      // TODO: use different mood
      let creepConfig = DevelopConfig.creep.getCreepConfig(creepType);
      returnConfig.body = creepConfig.body;
      returnConfig.spawnCost = getCreepCost(returnConfig.body);
    }

    if (ctx.getCreepType) {
      returnConfig.creepType = creepType;
    }

    if (ctx.getCreepMemoryData) {
      returnConfig.creepMemoryData = getCreepMemoryData(creepType, nameInfoList);
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
}

export class CreepConfig {
  body?: BodyPartConstant[];
  spawnCost?: number;
  creepType?: CreepType;
  creepMemoryData?: Object;
}

// creep role definition
export const HARVESTER = "HARVESTER";
export const UPGRADER = "UPGRADER";
export enum CreepType {
  HARVESTER,
  UPGRADER
}
export function getCreepTypeList() {
  return [CreepType.HARVESTER, CreepType.UPGRADER];
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
function getCreepCost(body: BodyPartConstant[]): number {
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
    case UPGRADER:
      return CreepType.UPGRADER;
    default:
      throw new Error(`<CREEP API> Unknown creep type ${typeName}`);
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
      const spawn = room.spawn[0];
      if (!spawn)
        return {
          sid: source.id
        };
      else
        return {
          sid: source.id,
          cid: spawn.id
        };
    }
    case CreepType.UPGRADER: {
      const room = Game.rooms[nameInfoList[2]];
      if (!room.storage)
        return {
          cid: room.spawn[0].id
        };
      else
        return {
          cid: room.storage.id
        };
    }
    default:
      throw new Error(`<CREEP API> Unknown creep type ${type}`);
  }
}
