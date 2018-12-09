export default {
  name: 'getEnergy',
  validate: function (creep: Creep) {
    // Have room?
    if (_.sum(creep.carry) >= creep.carryCapacity) return false;

    const sources = creep.room.find(FIND_SOURCES_ACTIVE)
    if (!sources || sources.length == 0) return false;

    // TODO make sure you have work body part lol...

    creep.memory.job = 'getEnergy'
    if (!creep.memory.source_id)
      creep.memory.source_id = _.shuffle(sources)[0].id
    return true;
  },
  perform: function (creep: Creep) {
    // creep.say("ë")

    if (!creep.memory.source_id) throw "Missing source"

    // move toward it, or...
    let source: Source | null = Game.getObjectById(creep.memory.source_id)
    if (!source) {
      console.log("[!] can't find source for some reason")
      delete creep.memory.source_id;
      creep.memory.job = null;
      return
    }

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
