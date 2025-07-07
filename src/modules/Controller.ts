import { CreepController } from "./creeps/Controller";
import { SpawnController } from "./Spawn";
import { StructuresController } from "./structures/StructuresController";
import { MemoryController } from "./memory/Controller";

export const MainController = {
  run(): void {
    const rooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
    for (const room of rooms) {
      // create controller
      const spawnController = SpawnController({ room: room });
      const creepController = CreepController({ spawnFunc: spawnController.createSpawnTask, room: room });
      const memoryController = MemoryController({ room: room });
      const structureController = StructuresController({ room: room });

      // prerun
      creepController.prerun();

      // run
      memoryController.run();
      spawnController.run();
      structureController.run();
      creepController.run();
    }
  },

  checkAndInit(): void {
    if (Memory.rooms == undefined || Object.keys(Memory.rooms).length == 0) {
      // init
      Memory.rooms = {};
      Memory.creeps = {};
      Memory.flags = {};
      Memory.spawns = {};
      const rooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
      for (const room of rooms) {
        const spawnPos = room.spawn[0].pos;
        Memory.rooms[room.name] = {
          creeps: [],
          mq: [],
          cq: [],
          sq: [],
          center: { x: spawnPos.x - 1, y: spawnPos.y },
          lv: 0,
          source: { id: "", type: "" },
          lastCreepCheck: 0,
          creepConfigUpdate: true,
        };
      }
    }
  }
};
