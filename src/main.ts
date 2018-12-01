import { ErrorMapper } from "utils/ErrorMapper";
import { Jobs } from "jobs";
import Names from "names";

console.log("Booting up...");

let prioritizedJobList: any[] = []

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`)

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name]
    }
  }

  // Mess with the Prioritized Jobs List
  if (prioritizedJobList.length == 0) {
    console.log("Adding jobs to the list")
    prioritizedJobList = prioritizedJobList.concat(Jobs)
  }

  // For each creep, go down the list from high to low priority trying to assign a job
  const idle_creeps = _.reject(Game.creeps, c => c.memory.job)
  _.each(idle_creeps, creep => {
    let jobList = _.shuffle(prioritizedJobList) // someday you should use priorities here
    let job = jobList[0]
    if (job.validate(creep)) {
      console.log(creep.name, "assigned", job.name)
    } else {
      console.log(creep.name, "can't do", job.name)
    }
  })

  // For each creep with a job, do the work
  _.each(Game.creeps, creep => {
    const job = _.find(Jobs, j => j.name == creep.memory.job)
    if (job) job.perform(creep)
    else creep.memory.job = null
  })


  _.each(Game.spawns, function (spawn) {
    console.log(spawn.name)
    if (spawn.canCreateCreep) {
      spawn.spawnCreep([CARRY, CARRY, WORK, WORK, MOVE, MOVE], _.shuffle(Names)[0])
      spawn.spawnCreep([CARRY, WORK, MOVE], _.shuffle(Names)[0])
    }
  })

  // _.each(Game.rooms, function (room) {
  //   const sources = room.find(FIND_SOURCES)
  //   _.each(sources, function (source) {
  //     console.log(source)
  //   })
  // })

});
