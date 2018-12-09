import { isNull } from "util";

export default {
  name: 'transferToExtension',
  validate: function (creep: Creep) {

    if (!creep.carry.energy) return false

    const extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: s => ((s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity))
    });
    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
      filter: s => (s.structureType == STRUCTURE_SPAWN) && (s.energy < s.energyCapacity)
    });

    if (extension) {
      creep.memory.job = this.name
      delete creep.memory.spawn_id
      creep.memory.extension_id = extension.id
      return true;
    }
    if (spawn) {
      creep.memory.job = this.name
      delete creep.memory.extension_id
      creep.memory.spawn_id = spawn.id
      return true;
    }

    return false;
  },
  perform: function (creep: Creep) {
    creep.say("ë→Ē")

    let target: StructureExtension | StructureSpawn | null = null

    if (creep.memory.extension_id) {
      target = Game.getObjectById(creep.memory.extension_id)
    }
    else if (creep.memory.spawn_id) {
      target = Game.getObjectById(creep.memory.spawn_id)
    }
    if (!target) {
      console.log("[!] Target was destroyed", this.name)
      creep.memory.job = null
      return
    }

    if (target.energy == target.energyCapacity) {
      console.log(creep.name, "[!] Target filled up while en-route")
      creep.memory.job = null;
      return
    }

    creep.moveTo(target)
    creep.transfer(target, RESOURCE_ENERGY)

    if (!creep.carry.energy)
      creep.memory.job = null;
  }
}
