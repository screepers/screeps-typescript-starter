import { ErrorMapper } from "utils/ErrorMapper";
import { Jobs } from "jobs";
import Traffic from "traffic"
import Names from "names";

console.log("Booting up...");

const drawTraffic = function () {
  _.each(Memory.traffic, (traffic, pos) => {
    if (!pos) return
    const [room, x, y] = pos.split(",")
    Game.rooms[room].visual.text(traffic, parseInt(x), parseInt(y))
  })
}

// console.log("Clean up all construction sites...")
// _.each(Game.constructionSites, c => c.remove())

if (!Memory.traffic) Memory.traffic = {}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name]
    }
  }

  // Are we getting fucking wrecked?

  // TODO try to flip on its head -- generate list of jobs, THEN looks for screeps who can do it.

  // Pick priorities...
  // Only build one thing at a time for now
  // if (!_.keys(Game.constructionSites).length)
  //   Traffic.buildRoads()

  // For each creep, go down the list from high to low priority trying to assign a job
  const idle_creeps = _.reject(Game.creeps, c => c.memory.job)
  _.each(idle_creeps, creep => {
    const allJobs = _.shuffle(Jobs)
    _.find(allJobs, job => {
      if (job.validate(creep)) {
        console.log(creep.name, "assigned", job.name)
        return true
      }
      else {
        return false
      }
    })
  })

  // For each creep with a job, do the work
  _.each(Game.creeps, creep => {
    const job = _.find(Jobs, j => j.name == creep.memory.job)
    if (job)
      job.perform(creep)
    else
      creep.memory.job = null // cleanup if a jobfile gets deleted for some reason
  })

  _.each(Game.spawns, function (spawn) {
    // Are we getting wrecked?
    const events = <any[]>spawn.room.getEventLog()
    const dmg = _.sum(events, e => {
      return (e['event'] == EVENT_ATTACK ? e['event']['data']['damage'] : 0)
    })
    if (dmg > 0 && spawn.room.controller) {
      console.log("Turning on safe mode due to", dmg, "damage")
      spawn.room.controller.activateSafeMode()
    }



    const nCreeps = spawn.room.find(FIND_MY_CREEPS).length
    if (nCreeps < 4) { // something has gone wrong... build some n00bs to spin us back up
      spawn.spawnCreep([WORK, MOVE, CARRY], _.shuffle(Names)[0])
      return
    }

    // 1. If you have too many creeps, create an extension somewhere reasonable...
    if (nCreeps >= 12 && spawn.room.controller) { // why 12? Just feels reasonable I guess...
      // Build an extension
      const level = spawn.room.controller.level
      const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level]

      const nExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_EXTENSION
      }).length
      const nConstructions = spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: s => s.structureType == STRUCTURE_EXTENSION
      }).length

      if (nExtensions + nConstructions < maxExtensions) { // should include construction sites too...
        console.log("You need to build extensions!!!")
      } else if (nConstructions) {
        // wait for them to finish building...
      } else {
        console.log("maxed out... build roads or something?")
      }
      return
    }

    // If everything is normal, only build maxed out creeps
    if (spawn.canCreateCreep) {
      const extensions: StructureExtension[] = <StructureExtension[]>spawn.room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_EXTENSION
      })
      const maxEnergy = _.sum(extensions, e => e.energyCapacity) + spawn.energyCapacity
      const maxBodyParts = Math.floor(maxEnergy / 100)
      // let body = _.map( _.range(maxBodyParts), idx => {
      //   if(idx < maxBodyParts/2) return MOVE
      // })
      let body: BodyPartConstant[] = []
      if (maxBodyParts == 3) {
        body = [WORK, CARRY, MOVE]
      }
      while (body.length <= maxBodyParts - 4) {
        body = body.concat([WORK, CARRY, MOVE, MOVE])
      }
      while (body.length <= maxBodyParts - 2) {
        body = body.concat([CARRY, MOVE])
      }
      // not worth adding one more body part, will just slow the creep down and adding a MOVE won't really speed it up.
      // This might not work of course if there isn't enough energy should probably only try every so often...
      spawn.spawnCreep(body, _.shuffle(Names)[0])
    }
  })

});
