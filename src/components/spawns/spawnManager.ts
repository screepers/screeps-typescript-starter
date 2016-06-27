import { Config } from './../../config/config';

export namespace SpawnManager {

  export var spawns: Spawn[];
  export var spawnNames: string[] = [];
  export var spawnCount: number = 0;

  export function loadSpawns() {
    this.spawns = Game.spawns;
    this.spawnCount = _.size(this.spawns);

    _loadSpawnNames();

    if (Config.VERBOSE) {
      console.log(this.spawnCount + ' spawns in room.');
    }
  }

  export function getFirstSpawn(): Spawn {
    return this.spawns[this.spawnNames[0]];
  }

  function _loadSpawnNames() {
    for (let spawnName in spawns) {
      if (spawns.hasOwnProperty(spawnName)) {
        spawnNames.push(spawnName);
      }
    }
  }

}
