export const CreepAPI = {
  getCreepConfig(creepName: string, context: CreepAPIContext = {}): CreepConfig {
    let ctx = {
      getSpawnInfo: context.getSpawnInfo ?? false,
      getCreepType: context.getCreepType ?? false,
    }
  }
}

interface CreepAPIContext {
  getSpawnInfo?: boolean;
  getCreepType?: boolean;
}

export interface CreepConfig {
  body?: BodyPartConstant[];
  spawnCost?: number;
  creepType?: CreepType;
}

export enum CreepType {
  HARVESTER,
}
