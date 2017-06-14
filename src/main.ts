import * as CreepManager from "./components/creeps/creepManager";

// uncomment the following line if you want to use the profiler
// import * as Profiler from "lib/Profiler";

import { log } from "./lib/logger/log";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// uncomment the following line if you want to use the profiler
// see the documentation https://github.com/screepers/screeps-typescript-profiler
// global.P = Profiler.init();

log.info(`loading revision: ${ __REVISION__ }`);

function mainLoop() {
  // Check memory for null or out of bounds custom objects
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  for (const i in Game.rooms) {
    const room: Room = Game.rooms[i];

    CreepManager.run(room);

    // Clears any non-existing creep memory.
    for (const name in Memory.creeps) {
      const creep: any = Memory.creeps[name];

      if (creep.room === room.name) {
        if (!Game.creeps[name]) {
          log.info("Clearing non-existing creep memory:", name);
          delete Memory.creeps[name];
        }
      }
    }
  }
}

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export const loop = mainLoop;
