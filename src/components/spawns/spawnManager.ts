import { Config } from './../../config/config';

export namespace SpawnManager {

  export var spawns: { [spawnName: string]: Spawn } = null;
  export var spawnNames: string[] = [];
  export var spawnCount: number = 0;

  export function loadSpawns() {
    spawns = Game.spawns;
    spawnCount = _.size(spawns);

    _loadSpawnNames();

    if (Config.VERBOSE) {
      console.log(spawnCount + ' spawns in room.');
    }
  }

  export function getFirstSpawn(): Spawn {
    return spawns[spawnNames[0]];
  }

  function _loadSpawnNames(): void {
    for (let spawnName in spawns) {
      if (spawns.hasOwnProperty(spawnName)) {
        spawnNames.push(spawnName);
      }
    }
  }

}
