import { CreepController } from "./creeps/Controller";
import { SpawnController } from "./Spawn";
import { StructuresController } from "./structures/StructuresController";
import { RoomMemoryController } from "./memory/RoomMemory";

export const MainController = {
  run(): void {
    const rooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
    for (const room of rooms) {
      // create controller
      const roomMemoryController = RoomMemoryController({ room: room });
      const spawnController = SpawnController({ room: room });
      const creepController = CreepController({
        spawnFunc: spawnController.createSpawnTask,
        room: room,
        fetchMaintenanceTask: roomMemoryController.fetchMaintenanceTask,
        returnMaintenanceTask: roomMemoryController.returnMaintenanceTask,
        finishCarryTask: roomMemoryController.finishCarryTask,
        finishRepairTask: roomMemoryController.finishRepairTask,
      });
      const structureController = StructuresController({
        room: room,
        addRepairTask: roomMemoryController.addRepairTask,
        addCarryTask: roomMemoryController.addCarryTask,
      });

      // prerun
      roomMemoryController.preRun();
      creepController.prerun();

      // run
      roomMemoryController.run();
      spawnController.run();
      structureController.run();
      creepController.run();

      // postrun
      roomMemoryController.postRun();
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
          cis: [],
          ris: [],
          cq: [],
          sq: [],
          center: { x: spawnPos.x - 1, y: spawnPos.y },
          lv: 0,
          source: { id: "", type: "" },
          lastCreepCheck: 0,
          creepConfigUpdate: true
        };
      }
    }
  }
};
