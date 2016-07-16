import * as Config from "./../../config/config";

export let spawns: { [spawnName: string]: Spawn };
export let spawnNames: string[] = [];
export let spawnCount: number;

export function loadSpawns() {
  spawns = Game.spawns;
  spawnCount = _.size(spawns);

  _loadSpawnNames();

  if (Config.VERBOSE) {
    console.log(spawnCount + " spawns in room.");
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
