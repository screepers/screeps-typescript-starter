
export class Job {
  constructor(readonly target: JobTarget, readonly action: JobAction) {
  }

  public toMemory(): any {
    return {target: this.target.id, action: this.action};
  }

  public equals(other: Job): boolean {
    if (!other) return false;
    return this.target != null && other.target != null && this.target.id == other.target.id && this.action == other.action;
  }

  static fromMemory(mem: any) {
    const target = Game.getObjectById(mem.target);
    const action = mem.action;
    return new Job(target as JobTarget, action);
  }
}

export interface JobTarget {
  id: string
  pos: RoomPosition
}

export enum JobAction {
  Repair,
  Build,
  Transfer
}
