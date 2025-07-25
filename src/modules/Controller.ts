import { CreepController } from "./creeps/Controller";
import { SpawnController } from "./Spawn";
import { StructuresController } from "./structures/StructuresController";
import { RoomMemoryController } from "./memory/RoomMemory";
import { DefenseController } from "./defense/Controller";
import { LayoutController } from "./layout/Controller";
import { SourceRoomController } from "./structures/SourceRoomController";
import { err, info } from "./Message";

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
      const sourceRoomController = SourceRoomController({
        getFatherCenter: (): RoomPosition => {
          return room.getPositionAt(room.memory.center.x, room.memory.center.y)!;
        },
        createConstructionSiteByPath: (path: RoomPosition[]): void => {
          console.log(path.length);
          if (path.length == 0) {
            err(`[MAIN CONTROLLER] path is null`, false);
            return;
          }
          let containerPos = path.pop()!;
          let cq = [];
          for (let pos of path) {
            // exclude center
            if (pos.roomName === room.name && layoutController.checkPositionInsideLayout(pos.x, pos.y)) continue;
            let r = Game.rooms[pos.roomName]!;
            let result = r.createConstructionSite(pos, STRUCTURE_ROAD);
            switch (result) {
              case ERR_INVALID_ARGS:
                err(
                  `Put construction site on invalid position, room = ${pos.roomName}, pos = (${pos.x}, ${pos.y})`,
                  false
                );
                break;
              case OK:
                cq.push({ tgt: `|${pos.x}|${pos.y}|${pos.roomName}` } as ConstructTask);
                break;
              default:
                err(`Unhandled createConstructionSite error code ${result}`, false);
            }
          }
          // create container
          let r = Game.rooms[containerPos.roomName]!;
          let result = r.createConstructionSite(containerPos, STRUCTURE_CONTAINER);
          switch (result) {
            case ERR_INVALID_ARGS:
              err(
                `Put construction site on invalid position, room = ${containerPos.roomName}, pos = (${containerPos.x}, ${containerPos.y})`,
                false
              );
              break;
            case OK:
              cq.push({ tgt: `|${containerPos.x}|${containerPos.y}|${containerPos.roomName}` } as ConstructTask);
              break;
            default:
              err(`Unhandled createConstructionSite error code ${result}`, false);
          }
          // push cq
          room.memory.cq = cq.reverse().concat(room.memory.cq);
        },
        updateCreepCheckFlag: (): void => {
          room.memory.creepConfigUpdate = true;
        }
      });

      // prerun
      creepController.prerun();

      // run
      for (let srName of room.memory.sr) sourceRoomController.run(srName);
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
        fb: false,
        fbc: -1,
        sr: [],
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
