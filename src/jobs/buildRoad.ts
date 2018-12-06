export default {
  name: 'buildRoad',
  validate: function (creep: Creep) {
    if (!creep.carry.energy) return false

    //let roads = _.filter(Game.constructionSites, s => s.structureType == STRUCTURE_ROAD)
    let roads = _.filter(Game.constructionSites, s => true) // temp hack
    if (roads.length == 0) return false;
    let construction = roads[0]

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
