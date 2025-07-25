import { Creep_harvester } from "./Harvester";
import { checkCreepMemory, checkCreepNum } from "./CreepChecker";
import { Creep_upgrader } from "./Upgrader";
import { CreepAPI, CreepType } from "./CreepAPI";
import { Creep_constructor } from "./Constructor";
import { Creep_carrier } from "./Carrier";
import { Creep_repairer } from "./Repairer";
import { Creep_center_carrier } from "./CenterCarrier";
import { err } from "../Message";
import { Creep_reserver } from "./Reserver";
import { Creep_sr_harvester } from "./SRHarvester";
import { Creep_sr_carrier } from "./SRCarrier";
import { Creep_sr_defender } from "./SRDefender";

const CREEP_CHECK_DURATION = 1000;

function error(message: string, throwError: boolean = false) {
  err(`\<CONSTRUCTOR\> ${message}`, throwError);
}

export const CreepController = function (context: CreepControllerContext) {
  const prerun = function (): void {
    checkCreepMemory(context.room, context.spawnFunc);
  };

  const run = function (): void {
    const room = context.room;

    // check creep num
    let destroyedNames: string[] = [];
    if (room.memory.creepConfigUpdate || room.memory.lastCreepCheck > CREEP_CHECK_DURATION) {
      checkCreepNum(room, names => {
        destroyedNames = names;
      });
      room.memory.creepConfigUpdate = false;
      room.memory.lastCreepCheck = 0;
    }
    // get maintenancer queue
    for (let [name, creep] of Object.entries(Game.creeps)) {
      let destroy = destroyedNames.includes(name);
      // use name to identify the creep's type
      const config = CreepAPI.getCreepConfig(name, { getCreepType: true });
      switch (config.creepType) {
        case CreepType.HARVESTER:
          Creep_harvester.run(creep);
          break;
        case CreepType.CCARRIER:
          Creep_center_carrier.run(creep, room);
          if (destroy) Creep_center_carrier.destroy(creep, room);
          break;
        case CreepType.CARRIER:
          Creep_carrier.run(creep, room, context.fetchCarryTask, context.returnCarryTask, context.finishCarryTask);
          if (destroy) Creep_carrier.destroy(creep, room, context.returnCarryTask);
          break;
        case CreepType.REPAIRER:
          Creep_repairer.run(creep, room, context.fetchRepairTask, context.returnRepairTask, context.finishRepairTask);
          if (destroy) Creep_repairer.destroy(creep, room, context.returnRepairTask);
          break;
        case CreepType.UPGRADER:
          Creep_upgrader.run(creep);
          if (destroy) Creep_upgrader.destroy(creep, room);
          break;
        case CreepType.CONSTRUCTOR:
          Creep_constructor.run(creep, room);
          if (destroy) Creep_constructor.destroy(creep, room);
          break;
        case CreepType.RESERVER:
          Creep_reserver.run(creep, room);
          break;
        case CreepType.SRHARVESTER:
          Creep_sr_harvester.run(creep, room);
          break;
        case CreepType.SRCARRIER:
          Creep_sr_carrier.run(creep, room);
          break;
        case CreepType.SRDEFENDER:
          Creep_sr_defender.run(creep, room);
          break;
        default:
          error(`Unhandled creep type: ${name}`);
      }
    }
    room.memory.lastCreepCheck += 1;
  };

  const getHostileCreeps = function(): Creep[] {
    return context.room.find(FIND_HOSTILE_CREEPS);
  }

  const getHostilePowerCreeps = function(): PowerCreep[] {
    return context.room.find(FIND_HOSTILE_POWER_CREEPS);
  }

  return { prerun, run, getHostileCreeps, getHostilePowerCreeps };
};

interface CreepControllerContext {
  spawnFunc(name: string): void;
  room: Room;
  fetchCarryTask(): CarryTask | null;
  fetchRepairTask(): RepairTask | null;
  returnCarryTask(task: CarryTask): void;
  returnRepairTask(task: RepairTask): void;
  finishCarryTask(task: CarryTask): void;
  finishRepairTask(task: RepairTask): void;
}
