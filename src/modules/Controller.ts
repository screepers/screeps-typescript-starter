import { CreepController } from "./creeps/Controller";
import { SpawnController } from "./Spawn";
import { StructuresController } from "./structures/StructuresController";
import { RoomMemoryController } from "./memory/RoomMemory";
import { DefenseController } from "./defense/Controller";
import { LayoutController } from "./layout/Controller";

export const MainController = {
  run(): void {
    const rooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
    for (const room of rooms) {
      this.checkAndInitRoom(room);
      // create controller
      const layoutController = LayoutController({ room: room });
      const roomMemoryController = RoomMemoryController({ room: room });
      const spawnController = SpawnController({ room: room });
      const creepController = CreepController({
        spawnFunc: spawnController.createSpawnTask,
        room: room,
        fetchCarryTask: roomMemoryController.fetchCarryTask,
        returnCarryTask: roomMemoryController.returnCarryTask,
        finishCarryTask: roomMemoryController.finishCarryTask,
        fetchRepairTask: roomMemoryController.fetchRepairTask,
        returnRepairTask: roomMemoryController.returnRepairTask,
        finishRepairTask: roomMemoryController.finishRepairTask
      });
      const defenseController = DefenseController({
        room: room,
        getHostileCreeps: creepController.getHostileCreeps,
        getHostilePowerCreeps: creepController.getHostilePowerCreeps
      });
      const structureController = StructuresController({
        room: room,
        addRepairTask: roomMemoryController.addRepairTask,
        addCarryTask: roomMemoryController.addCarryTask,
        getAttackTarget: defenseController.getAttackTarget,
        createLayout: layoutController.createLayout,
        getRampartTargetHits: layoutController.getRampartTargetHits,
        addEmergencyRepairTask: roomMemoryController.addEmergencyRepairTask,
        fetchEmergencyRepairTask: roomMemoryController.fetchEmergencyRepairTask,
        finishEmergencyRepairTask: roomMemoryController.finishEmergencyRepairTask
      });

      // prerun
      creepController.prerun();

      // run
      spawnController.run();
      structureController.run();
      creepController.run();

      // postrun
      roomMemoryController.postRun();
    }
  },

  checkAndInitRoom(room: Room): void {
    if (room.memory.creeps == undefined) {
      const spawnPos = room.spawn[0].pos;
      Memory.rooms[room.name] = {
        tm: {},
        creeps: [],
        caq: [],
        cis: [],
        rq: [],
        erq: [],
        ris: [],
        eris: [],
        cq: [],
        sq: [],
        center: { x: spawnPos.x - 1, y: spawnPos.y },
        lv: 0,
        lastCreepCheck: 0,
        creepConfigUpdate: true
      };
    }
  },

  checkAndInit(): void {
    if (Memory.rooms == undefined || Object.keys(Memory.rooms).length == 0) {
      // init
      Memory.rooms = {};
      Memory.creeps = {};
      Memory.flags = {};
      Memory.spawns = {};
    }
  }
};
