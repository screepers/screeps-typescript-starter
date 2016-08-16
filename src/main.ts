/**
 * Application bootstrap.
 * BEFORE CHANGING THIS FILE, make sure you read this:
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 */

import * as Config from "./config/config";
import * as MemoryManager from "./shared/memoryManager";
import * as RoomManager from "./components/rooms/roomManager";
import * as SpawnManager from "./components/spawns/spawnManager";
import * as SourceManager from "./components/sources/sourceManager";
import * as CreepManager from "./components/creeps/creepManager";

// This code is executed only when Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU
// You should extend prototypes before game loop in here.

RoomManager.loadRooms();
SpawnManager.loadSpawns();
SourceManager.loadSources();

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

// Screeps system expects this "loop" method in main.js to run the application.
// If we have this line, we can make sure that globals bootstrap and game loop work.
// http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture

export function loop() {
  // This is executed every tick

  MemoryManager.loadMemory();
  CreepManager.loadCreeps();

  if (!CreepManager.isHarvesterLimitFull()) {
    CreepManager.createHarvester();

    if (Config.VERBOSE) {
      console.log("Need more harvesters!");
    }
  }

  CreepManager.harvestersGoToWork();
}
