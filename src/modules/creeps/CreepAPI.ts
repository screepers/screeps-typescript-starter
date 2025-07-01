import { DevelopConfig } from "../mood/develop";

export const CreepAPI = {
  getCreepConfig(creepName: string, context: CreepAPIContext = {}): CreepConfig {
    let ctx = {
      getSpawnInfo: context.getSpawnInfo ?? false,
      getCreepType: context.getCreepType ?? false
    };
    let returnConfig = new CreepConfig();

    // parse creep name
    let nameInfoList = creepName.split("_");

    if (ctx.getSpawnInfo) {
      // TODO: use different mood
      let creepConfig = DevelopConfig.creep.getCreepConfig(nameInfoList[0]);
      returnConfig.body = creepConfig.body;
      returnConfig.spawnCost = getCreepCost(returnConfig.body);
    }

    if (ctx.getCreepType) {
      switch (nameInfoList[0]) {
        case HARVESTER:
          returnConfig.creepType = CreepType.HARVESTER;
          break;
        default:
          throw new Error(`<CREEP API> Unhandled creep type ${nameInfoList[0]}`);
      }
    }

    return returnConfig;
  }
};

interface CreepAPIContext {
  getSpawnInfo?: boolean;
  getCreepType?: boolean;
}

export class CreepConfig {
  body?: BodyPartConstant[];
  spawnCost?: number;
  creepType?: CreepType;
}

// creep role definition
export const HARVESTER = "HARVESTER";
export enum CreepType {
  HARVESTER,
}

// tool function
const MOVE_COST = 50;
const WORK_COST = 100
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
        cost += ATTACK_COST; break;
      case "carry":
        cost += CARRY_COST; break;
      case "claim":
        cost += CLAIM_COST; break;
      case "heal":
        cost += HEAL_COST; break;
      case "move":
        cost += MOVE_COST; break;
      case "ranged_attack":
        cost += RANGED_ATTACK_COST; break;
      case "tough":
        cost += TOUGH_COST; break;
      case "work":
        cost += WORK_COST; break;
    }
  }
  return cost;
}
