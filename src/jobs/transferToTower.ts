export default {
  name: 'transferToExtension',
  validate: function (creep: Creep) {

    if (!creep.carry.energy) return false

    const tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: s => ((s.structureType == STRUCTURE_TOWER) && (s.energy < s.energyCapacity))
    });
    if (!tower) return false;

    creep.memory.job = this.name
    creep.memory.tower_id = tower.id
    return true;
  },
  perform: function (creep: Creep) {
    creep.say("ë→T")

    if (!creep.memory.tower_id) {
      creep.memory.job = null;
      console.log("ERROR: missing tower", creep.memory.tower_id)
      return
    }

    // move toward it, or...
    let tower: StructureTower | null = Game.getObjectById(creep.memory.tower_id)
    if (!tower) throw "Missing tower"

    if (tower.energy == tower.energyCapacity) {
      console.log(creep.name, "tower filled up while en-route", creep.memory.tower_id)
      creep.memory.job = null;
      return
    }

    creep.moveTo(tower)
    creep.transfer(tower, RESOURCE_ENERGY)

    if (!creep.carry.energy)
      creep.memory.job = null;
  }
}
