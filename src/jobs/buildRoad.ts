export default {
  name: 'buildRoad',
  validate: function (creep: Creep) {
    if (!creep.carry.energy) return false

    let construction = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES)
    if (!construction) return false;

    creep.memory.job = this.name
    creep.memory.construction_id = construction.id
    return true
  },
  perform: function (creep: Creep) {
    creep.say("R↑")

    if (!creep.memory.construction_id) throw "Missing road"

    // move toward it, or...
    let constructionSite: ConstructionSite | null = Game.getObjectById(creep.memory.construction_id)
    if (!constructionSite) {
      console.log("Missing Construction Site")
      creep.memory.job = null
      return
    }

    creep.moveTo(constructionSite, { range: 2 })
    creep.build(constructionSite)

    if (!creep.carry.energy)
      creep.memory.job = null
  }
}
