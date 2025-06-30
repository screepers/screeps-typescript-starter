import {Creep_harvester} from "./harvester"

export const CreepController = {
  run(): void {
    for (let [name, creep] of Object.entries(Game.creeps)) {
      // use name to identify the creep's type
      switch(name.split('_')[0]) {
        case 'HARVESTER':
          Creep_harvester.run(creep);
          break;
        default:
          throw new Error(`Unhandled creep type: ${name}`);
      }
    }
  }
}
