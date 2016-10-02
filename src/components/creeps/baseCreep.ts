export class BaseCreep {
  protected creep: Creep;
  protected minLifeBeforeNeedsRenew: number = 0;
  protected debug: boolean = false;

  private working: boolean;

  /**
   * Creates an instance of BaseCreep.
   *
   * @param {Creep} creep
   *
   * @memberOf BaseCreep
   */
  constructor(creep: Creep) {
    this.creep = creep;

    if (!creep.memory.working) {
      creep.memory.working = false;
    }
  }

  /**
   * Extended method of `Creep.moveTo()`.
   *
   * @param {(Structure | RoomPosition)} target
   * @returns {number}
   *
   * @memberOf BaseCreep
   */
  public moveTo(target: Structure | RoomPosition): number {
    let result: number = 0;

    // Execute moves by cached paths at first
    result = this.creep.moveTo(target);

    return result;
  }

  /**
   * Returns true if the `ticksToLive` of a creep has dropped below the renew
   * limit set in config.
   *
   * @returns {boolean}
   */
  public needsRenew(): boolean {
    return (this.creep.ticksToLive < this.minLifeBeforeNeedsRenew);
  }

  /**
   * Shorthand method for `renewCreep()`.
   *
   * @param {Spawn} spawn
   * @returns {number}
   */
  public tryRenew(spawn: Spawn): number {
    return spawn.renewCreep(this.creep);
  }

  /**
   * Moves a creep to a designated renew spot (in this case the spawn).
   *
   * @param {Spawn} spawn
   */
  public moveToRenew(spawn: Spawn): void {
    if (this.tryRenew(spawn) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);
    }
  }

  /**
   * Attempts transferring available resources to the creep.
   *
   * @param {RoomObject} roomObject
   */
  public getEnergy(roomObject: RoomObject): void {
    let energy: Resource = <Resource> roomObject;

    if (energy) {
      if (this.creep.pos.isNearTo(energy)) {
        this.creep.pickup(energy);
      } else {
        this.moveTo(energy.pos);
      }
    }
  }

  /**
   * Returns true if a creep's `working` memory entry is set to true, and false
   * otherwise.
   *
   * @returns {boolean}
   */
  public canWork(): boolean {
    this.working = this.creep.memory.working;

    if (this.working && _.sum(this.creep.carry) === 0) {
      this.creep.memory.working = false;
      return false;
    } else if (!this.working && _.sum(this.creep.carry) === this.creep.carryCapacity) {
      this.creep.memory.working = true;
      return true;
    } else {
      return this.creep.memory.working;
    }
  }
}
