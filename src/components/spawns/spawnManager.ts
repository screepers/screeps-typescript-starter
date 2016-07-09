import { Config } from './../../config/config';

export namespace SpawnManager {

  export var spawns: { [spawnName: string]: Spawn } = null;
  export var spawnCount: number = 0;

  export function loadSpawns() {
    spawns = Game.spawns;
    spawnCount = _.size(spawns);

    if (Config.VERBOSE) {
      console.log(spawnCount + ' spawns in room.');
    }
  }

  export function getFirstSpawn(): Spawn {
    return this.spawns[0];
  }

}
