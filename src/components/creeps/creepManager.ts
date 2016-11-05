import * as Config from "../../config/config";

import * as harvester from "./roles/harvester";

export let creeps: Creep[];
export let creepCount: number = 0;

export let harvesters: Creep[] = [];

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  _loadCreeps(room);
  _buildMissingCreeps(room);

  _.each(creeps, function (creep: Creep) {
    if (creep.memory.role === "harvester") {
      harvester.run(creep);
    }
  });
}

/**
 * Loads and counts all available creeps.
 *
 * @param {Room} room
 */
function _loadCreeps(room: Room) {
  creeps = room.find<Creep>(FIND_MY_CREEPS);
  creepCount = _.size(creeps);

  // Iterate through each creep and push them into the role array.
  harvesters = _.filter(creeps, (creep) => creep.memory.role === "harvester");

  if (Config.ENABLE_DEBUG_MODE) {
    console.log("[CreepManager._loadCreeps] " + creepCount + " creeps found in the playground.");
  }
}

/**
 * Creates a new creep if we still have enough space.
 *
 * @param {Room} room
 */
function _buildMissingCreeps(room: Room) {
  let bodyParts: string[];

  let spawns: Spawn[] = room.find<Spawn>(FIND_MY_SPAWNS, {
    filter: function (spawn: Spawn) {
      return spawn.spawning === null;
    },
  });

  if (Config.ENABLE_DEBUG_MODE) {
    if (spawns[0]) {
      console.log("[CreepManager._buildMissingCreeps] Spawn: " + spawns[0].name);
    }
  }

  if (harvesters.length < 2) {
    if (harvesters.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, WORK, CARRY, MOVE];
    } else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: Spawn) => {
      _spawnCreep(spawn, bodyParts, "harvester");
    });
  }
}

/**
 * Spawns a new creep.
 *
 * @param {Spawn} spawn
 * @param {string[]} bodyParts
 * @param {string} role
 * @returns
 */
function _spawnCreep(spawn: Spawn, bodyParts: string[], role: string) {
  let uuid: number = Memory.uuid;
  let status: number | string = spawn.canCreateCreep(bodyParts, undefined);

  let properties: { [key: string]: any } = {
    role: role,
    room: spawn.room.name,
  };

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;
    let creepName: string = spawn.room.name + " - " + role + uuid;

    console.log("[CreepManager._spawnCreep] Started creating new creep: " + creepName);
    if (Config.ENABLE_DEBUG_MODE) {
      console.log("[CreepManager._spawnCreep] Body: " + bodyParts);
    }

    status = spawn.createCreep(bodyParts, creepName, properties);

    return _.isString(status) ? OK : status;
  } else {
    if (Config.ENABLE_DEBUG_MODE) {
      console.log("[CreepManager._spawnCreep] Failed creating new creep: " + status);
    }

    return status;
  }
}
