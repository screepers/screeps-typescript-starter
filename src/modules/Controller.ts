import { CreepController } from "./creeps/Controller";
import { SpawnController } from "./Spawn";

export const MainController = {
  run(): void {
    const rooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
    for (const room of rooms) {
      // create controller
      const spawnController = SpawnController({ room: room });
      const creepController = CreepController({ spawnFunc: spawnController.createSpawnTask });

      // prerun
      creepController.prerun();

      // run
      spawnController.run();
      creepController.run();
    }
  },

  checkAndInit(): void {
    if (Memory.sq == undefined) {
      // init
      Memory.sq = [];
      Memory.lastCreepCheck = 0;
      Memory.creepConfigUpdate = true;
      const rooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
      for (const room of rooms) {
        Memory.rooms[room.name] = { creeps: [] };
      }
    }
  }
};
