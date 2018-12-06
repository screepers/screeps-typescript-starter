export default {
  name: 'transferToExtension',
  validate: function (creep: Creep) {

    if (!creep.carry.energy) return false

    const extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: s => ((s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity))
    });
    if (!extension) return false;

    creep.memory.job = this.name
    creep.memory.extension_id = extension.id
    return true;
  },
  perform: function (creep: Creep) {
    creep.say("ë→Ē")

    if (!creep.memory.extension_id) {
      creep.memory.job = null;
      console.log("ERROR: missing extension", creep.memory.extension_id)
      return
    }

    // move toward it, or...
    let extension: StructureExtension | null = Game.getObjectById(creep.memory.extension_id)
    if (!extension) throw "Missing extension"

    if (extension.energy == extension.energyCapacity) {
      console.log(creep.name, "Extension filled up while en-route", creep.memory.extension_id)
      creep.memory.job = null;
      return
    }

    creep.moveTo(extension)
    creep.transfer(extension, RESOURCE_ENERGY)

    if (!creep.carry.energy)
      creep.memory.job = null;
  }
}
