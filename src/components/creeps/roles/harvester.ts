import * as creepActions from "../creepActions";

import { log } from "../../../lib/logger/log";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  if (creepActions.needsRenew(creep)) {
    const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
    creepActions.moveToRenew(creep, spawn);
    return;
  }

  const silo = Game.getObjectById<StructureContainer>(creep.memory.silo);
  const energySource = Game.getObjectById<Source>(creep.memory.energySource);
  if (!silo) {
    log.error(`${creep.name} can't find silo ${creep.memory.silo}`);
    creep.say("no silo");
    return;
  } else if (!energySource) {
    log.error(`${creep.name} can't find energy source ${creep.memory.energySource}`);
    creep.say("no target");
    return;
  }

  // first check to make sure we're next to the energy source and the silo
  if (creep.pos.x != silo.pos.x || creep.pos.y != silo.pos.y) {
    // we're not on the silo, so we need to move there
    creepActions.moveTo(creep, silo.pos);
    return;
  }

   if (_.sum(creep.carry) === creep.carryCapacity) {
    creep.transfer(silo, RESOURCE_ENERGY);
  } else {
    if (creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
      log.error("${creep.name} is on the silo but not in range of energy source");
      creep.say("can't harvest");
    }
  }
}
