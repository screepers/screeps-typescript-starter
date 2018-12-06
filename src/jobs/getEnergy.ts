export default {
  name: 'getEnergy',
  validate: function (creep: Creep) {
    // Have room?
    if (_.sum(creep.carry) >= creep.carryCapacity) return false;

    const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (!source) return false;

    creep.memory.job = 'getEnergy'
    creep.memory.source_id = source.id
    return true;
  },
  perform: function (creep: Creep) {
    // creep.say("ë")

    if (!creep.memory.source_id) throw "Missing source"

    // move toward it, or...
    let source: Source | null = Game.getObjectById(creep.memory.source_id)
    if (!source) throw "Missing source"

    creep.moveTo(source)
    creep.harvest(source)

    const structures = creep.pos.lookFor("structure")
    if (!structures.length) {
      Memory.traffic[`${creep.pos.roomName},${creep.pos.x},${creep.pos.y}`] = (Memory.traffic[`${creep.pos.roomName},${creep.pos.x},${creep.pos.y}`] + 1) || 1
    }

    if (_.sum(creep.carry) >= creep.carryCapacity)
      creep.memory.job = null;
  }
}
