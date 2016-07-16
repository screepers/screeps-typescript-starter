import * as Config from "./../../config/config";

export interface ICreepAction {
  creep: Creep;
  renewStation: Spawn;
  _minLifeBeforeNeedsRenew: number;

  setCreep(creep: Creep): void;

  /**
   * Wrapper for Creep.moveTo() method.
   */
  moveTo(target: RoomPosition | { pos: RoomPosition }): number;

  needsRenew(): boolean;
  tryRenew(): number;
  moveToRenew(): void;

  action(): boolean;
}

export default class CreepAction implements ICreepAction {
  public creep: Creep;
  public renewStation: Spawn;

  public _minLifeBeforeNeedsRenew: number = Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;

  public setCreep(creep: Creep) {
    this.creep = creep;
    this.renewStation = Game.getObjectById<Spawn>(this.creep.memory.renew_station_id);
  }

  public moveTo(target: RoomPosition | { pos: RoomPosition }) {
    return this.creep.moveTo(target);
  }

  public needsRenew(): boolean {
    return (this.creep.ticksToLive < this._minLifeBeforeNeedsRenew);
  }

  public tryRenew(): number {
    return this.renewStation.renewCreep(this.creep);
  }

  public moveToRenew(): void {
    if (this.tryRenew() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.renewStation);
    }
  }

  public action(): boolean {
    return true;
  }
}
