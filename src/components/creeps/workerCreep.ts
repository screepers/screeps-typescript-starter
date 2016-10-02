import { BaseCreep } from "./baseCreep";

export class WorkerCreep extends BaseCreep {

  constructor(creep: Creep) {
    super(creep);
  }

  public tryHarvest(target: Source): number {
    return this.creep.harvest(target);
  }

  public moveToHarvest(target: Source): void {
    if (this.tryHarvest(target) === ERR_NOT_IN_RANGE) {
      this.moveTo(target.pos);
    }
  }

  public tryEnergyDropOff(target: Spawn | Structure): number {
    return this.creep.transfer(target, RESOURCE_ENERGY);
  }

  public moveToDropEnergy(target: Spawn | Structure): void {
    if (this.tryEnergyDropOff(target) === ERR_NOT_IN_RANGE) {
      this.moveTo(target.pos);
    }
  }

}
