import * as Config from "./config/config";
import { ControlledRoom } from "./components/rooms/controlledRoom";

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

/**
 * This function is executed *every tick*.
 *
 * @export
 */
export function loop() {
  // Screeps system expects this "loop" method in main.js to run the
  // application. If we have this line, we can be sure that the globals are
  // bootstrapped properly and the game loop is executed.
  // http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture

  initializeTick();

  for (let i in Game.rooms) {
    let room: Room = Game.rooms[i];

    // Runs the room scripts.
    if (room.controller) {
      if (room.controller.level >= 1) {
        runControlledRoom(room);
      }
    }

    // Clears any non-existing creep memory.
    for (let name in Memory.creeps) {
      let creep: any = Memory.creeps[name];

      if (creep.room === room.name) {
        if (!Game.creeps[name]) {
          console.log("Clearing non-existing creep memory:", name);
          delete Memory.creeps[name];
        }
      }
    }
  }
}

/**
 * Initialize the tick.
 */
function initializeTick() {
  Memory.flags = Game.flags;
  if (!Memory.rooms) {
    Memory.rooms = Game.rooms;
  }
  Memory.spawns = Game.spawns;

  if (!Memory.uuid || Memory.uuid === 100) {
    Memory.uuid = 0;
  }
}

/**
 * Runs all the tasks on the rooms we own.
 *
 * @param {Room} room The selected room.
 */
function runControlledRoom(room: Room) {
  let controlledRoom: ControlledRoom = new ControlledRoom(room);
  controlledRoom.run();
}
