import {log} from '../../../lib/logger/log'

export class Base {
  protected readonly _creep: Creep;

  constructor(c: Creep) {
    this._creep = c;
  }

  get name(): string {
    return this._creep.name;
  }

  get state(): State {
    return this._creep.memory.state as State || State.Idle;
  }
  set state(newState: State) {
    this._creep.memory.state = newState;
  }

  get isIdle(): boolean {
    return this.state === State.Idle;
  }

  protected collectEnergy(): number {
    let silo = this.findClosestSilo();
    if (silo) {
      let code = this._creep.withdraw(silo, RESOURCE_ENERGY);
      if (code == ERR_NOT_IN_RANGE)
        return this.moveTo(silo);
      return code;
    }

    // there is no container on the board that has energy in them, we'll go straight to the source
    let source = this.findClosestSource();
    if (source) {
      let code = this._creep.harvest(source);
      if (code == ERR_NOT_IN_RANGE)
        return this.moveTo(source);
      return code;
    }

    log.warning(`${this._creep.name} cannot find a place to get energy`);
    return -999;
  }

  protected findClosestSilo(): StructureContainer {
    let silo = this._creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s: Structure) =>
      s.structureType == STRUCTURE_CONTAINER && (s as StructureContainer).store.energy > 0});
    return silo as StructureContainer;
  }

  protected findClosestSource(): Source {
    let source = this._creep.pos.findClosestByPath(FIND_SOURCES);
    return source;
  }

  protected moveTo(target: { pos: RoomPosition; }) {
    return this._creep.moveTo(target, {visualizePathStyle:{stroke: 'white'}});
  }
}

