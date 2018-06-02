import * as Config from "../../config/config";

import { State } from "./roles/creepBase";
import * as harvester from "./roles/harvester";
import * as wrk from "./roles/worker";
import * as job from "./jobs";

import { log } from "../../lib/logger/log";

export let creeps: Creep[];
export let creepCount: number = 0;

export let harvesters: Creep[] = [];
export let workers: wrk.Worker[] = [];

function getWorker(name: string) {
  return _.find(workers, (w) => w.name == name);
}

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  _loadCreeps(room);
  _buildMissingCreeps(room);

  // Phase 1 - ensure all energy sources are being harvested
  let sources = room.find(FIND_SOURCES);
  _.each(sources, (s) => _harvestSource(s));

  // Phase 2 - build list of jobs to work
  let jobs = _buildJobs(room);
  log.info(`${jobs.length} job(s) identified`);
  _.each(jobs, (j: job.Job) => log.info(`job: ${job.JobAction[j.action]} --> ${j.target.id} (${(j.target as any).structureType})`));

  // Phase 3 - assign jobs to workers
  log.debug("assigning jobs");
  _assignJobs(jobs);

  _.each(creeps, (creep: Creep) => {
    if (creep.memory.role === "harvester") {
      harvester.run(creep);
    }
  });

  _.each(workers, (w) => {
    w.run();
  })
}

/**
 * Loads and counts all available creeps.
 *
 * @param {Room} room
 */
function _loadCreeps(room: Room) {
  creeps = room.find(FIND_MY_CREEPS);
  creepCount = _.size(creeps);

  // Iterate through each creep and push them into the role array.
  harvesters = _.filter(creeps, (creep) => creep.memory.role === "harvester");
  workers = _.map(_.filter(creeps, (creep) => creep.memory.role === "worker"), (creep) => new wrk.Worker(creep));

  if (Config.ENABLE_DEBUG_MODE) {
    log.info(creepCount + " creeps found in the playground.");
  }
}

/**
 * Ensures that the given energy source has a harvester
 * working it.
 *
 * @param {Source} source
 */
function _harvestSource(source: Source) {
  let sourceData :any = Memory.sources[source.id] || {};
  // log.debug(`${source.id}: sourceData = ${JSON.stringify(sourceData)}`);

  let silo = Game.getObjectById<StructureContainer | ConstructionSite>(sourceData.silo);
  if (!silo) {
    // either no silo is defined, the silo we thought existed can't be found, or the silo has finished construction
    // in the first two cases we need to build one, in the latter we need to find the constructed silo
    // log.debug(`${source.id}: can't find silo, looking for it`);
    let squares = source.room.lookAtArea(source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true) as LookAtResultWithPos[];

    let siloSq = _.find(squares, (sq) => sq.type == 'structure' && (sq.structure as Structure).structureType == STRUCTURE_CONTAINER);
    if (!siloSq || !siloSq.structure) {
      // log.debug(`${source.id}: no silo present, constructing one`);
      squares = _.filter(squares, (sq) => sq.type == 'terrain' && sq.terrain != 'wall');

      source.room.createConstructionSite(squares[0].x, squares[0].y, STRUCTURE_CONTAINER);
      silo = source.room.find(FIND_CONSTRUCTION_SITES, {filter: (s :ConstructionSite) => s.pos.x == squares[0].x && s.pos.y == squares[0].y})[0];
    } else {
      // log.debug(`${source.id}: silo ${silo.id} found`);
      silo = siloSq.structure as StructureContainer;
    }
  }

  // store any changes made to sourceData
  sourceData.silo = silo.id;
  Memory.sources[source.id] = sourceData;

  // we have our silo, but it's either under construction or the actual thing
  if (silo instanceof ConstructionSite) {
    // the construction site will be built by a worker during the job allocation phase
    // log.debug(`${source.id}: waiting for silo to be constructed`);
    return;
  }

  // we have a silo next to this source, make sure someone is harvesting it
  let harvester = Game.creeps[sourceData.harvester];
  if (!harvester) {
    // there is no harvester working this source (or the one we had is gone)
    // make a new one and assign it to it
    // log.debug(`${source.id}: no harvester working this source`);

    // determine what size creep we can make
    let eAvail = source.room.energyCapacityAvailable - BODYPART_COST[MOVE] - BODYPART_COST[CARRY];
    let workParts = Math.floor(eAvail / BODYPART_COST[WORK]);
    let body = [WORK, CARRY, MOVE];
    for (let i=0; i<workParts-1; i++)
      body.unshift(WORK);

    // now make it
    let spawn = source.pos.findClosestByPath(FIND_MY_SPAWNS, {filter: (s: StructureSpawn) => !s.spawning});
    let [name, status] = _spawnCreep(spawn, body, "harvester", {silo: silo.id, energySource: source.id});
    if (status === OK)
      sourceData.harvester = name;

    return;
  }

  // all good, this source has a silo and is being worked
  // log.debug(`${source.id}: has silo and harvester`);
}

/**
 * Build a list of jobs in the room that need completing.
 *
 * @param {Room} room
 */
function _buildJobs(room: Room) {
  const jobs: job.Job[] = [];

  // things that need repairing
  let damagedStructs = room.find<Structure>(FIND_STRUCTURES, {filter: (s: Structure) => (s.hits / s.hitsMax) < 0.6 });
  _.each(damagedStructs, (s) => jobs.push(new job.Job(s, job.JobAction.Repair)));

  // things that need building
  let constSites = room.find(FIND_MY_CONSTRUCTION_SITES);
  _.each(constSites, (s) => jobs.push(new job.Job(s, job.JobAction.Build)));

  // things that need energy
  let drained = room.find(FIND_MY_STRUCTURES, {filter: (s) => {
    let es = s as any as {energy: number, energyCapacity: number};
    return es.energyCapacity > 0 && es.energy < es.energyCapacity;
  }});
  _.each(drained, (s) => jobs.push(new job.Job(s, job.JobAction.Transfer)));

  return jobs;
}

function _assignJobs(jobs: job.Job[]) {
  _.each(jobs, (j: job.Job) => {

    // first check to see if we've already assigned this job by checking each worker's jobs
    let workersOnJob = _.filter(workers, (w) => w.job != null && j.equals(w.job));
    let workersNeeded = 3 - workersOnJob.length;

    // if the job isn't assigned, pick someone to do it
    if (workersNeeded > 0) {
      // find some idle workers
      let idleWorkers = _.filter(workers, (w) => w.isIdle);
      if (idleWorkers.length == 0) {
        // log.info(`{${job.JobAction[j.action]} ${j.target.id}} unassigned - no workers available`);
        return;
      } else if (idleWorkers.length < workersNeeded) {
        log.info(`{${job.JobAction[j.action]} ${j.target.id}} will be under assigned - not enough workers available to meet quota`);
        workersNeeded = idleWorkers.length;
      }

      // now we know idleWorkers.length >= workersNeeded
      for (let i=0; i<workersNeeded; i++) {
        idleWorkers[i].assignJob(j);
        log.info(`assigning job {${j.action} ${j.target.id}} to ${idleWorkers[i].name}`);
      }
    } else {
      log.info(`{${job.JobAction[j.action]} ${j.target.id}} is already assigned to ${JSON.stringify(_.map(workersOnJob, (w) => w.name))}`);
    }

    // now our job has a worker, either from previous or just now
  });
}

/**
 * Creates a new creep if we still have enough space.
 *
 * @param {Room} room
 */
function _buildMissingCreeps(room: Room) {
  let bodyParts: BodyPartConstant[];

  const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS, {
    filter: (spawn: StructureSpawn) => {
      return spawn.spawning === null;
    },
  });

  if (Config.ENABLE_DEBUG_MODE) {
    if (spawns[0]) {
      log.info("Spawn: " + spawns[0].name);
    }
  }

  if (workers.length < 10) {
    if (workers.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, WORK, CARRY, MOVE];
    } else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: StructureSpawn) => {
      _spawnCreep(spawn, bodyParts, "worker");
    });
  }
}

/**
 * Spawns a new creep.
 *
 * @param {StructureSpawn} spawn
 * @param {BodyPartConstant[]} bodyParts
 * @param {string} role
 * @returns
 */
function _spawnCreep(spawn: StructureSpawn, bodyParts: BodyPartConstant[], role: string, properties?: {[name: string]: any}) :[string, number] {
  const uuid: number = Memory.uuid;
  let status: number | string = spawn.canCreateCreep(bodyParts, undefined);

  if (properties === undefined)
    properties = {};
  let creepMem: CreepMemory = {
    role: role,
    state: properties.state || State.Idle,
    job: properties.job || "",
    silo: properties.silo || "",
    energySource: properties.energySource || ""
  }

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;
    const creepName: string = spawn.room.name + " - " + role + uuid;

    log.info("Started creating new creep: " + creepName);
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Body: " + bodyParts);
    }

    status = spawn.createCreep(bodyParts, creepName, creepMem);

    return [creepName, _.isString(status) ? OK : status];
  } else {
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Failed creating new creep: " + status);
    }

    return ["", status];
  }
}
