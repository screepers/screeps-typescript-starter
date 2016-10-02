import { WorkerCreep } from "../workerCreep";

export class Harvester extends WorkerCreep {
  private room: Room;
  private spawn: Spawn;
  private energySource: Source;

  constructor(creep: Creep, room: Room) {
    super(creep);
    this.room = room;
    this.spawn = this.creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    this.energySource = this.creep.room.find<Source>(FIND_SOURCES_ACTIVE)[0];
  }

  public run(): void {
    if (this.needsRenew()) {
      this.moveToRenew(this.spawn);
    } else if (_.sum(this.creep.carry) === this.creep.carryCapacity) {
      this.moveToDropEnergy(this.spawn);
    } else {
      this.moveToHarvest(this.energySource);
    }
  }
}
