import { Config } from './../../config/config';
import { MemoryManager } from './../../shared/memoryManager';
import { SourceManager } from './../sources/sourceManager';
import { SpawnManager } from './../spawns/spawnManager';
import { Harvester } from './harvester';

export namespace CreepManager {

  export var creeps: { [creepName: string]: Creep };
  export var creepNames: string[] = [];
  export var creepCount: number;

  export function loadCreeps(): void {
    creeps = Game.creeps;
    creepCount = _.size(creeps);

    _loadCreepNames();

    if (Config.VERBOSE) {
      console.log(creepCount + ' creeps found in the playground.');
    }
  }

  export function createHarvester(): number | string {
    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'harvester',
      target_source_id: SourceManager.getFirstSource().id,
      target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
      renew_station_id: SpawnManager.getFirstSpawn().id
    };

    var status: number | string = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
    if (status == OK) {
      status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, properties);

      if (Config.VERBOSE) {
        console.log('Started creating new Harvester');
      }
    }

    return status;
  }

  export function harvestersGoToWork(): void {

    let harvesters: Harvester[] = [];
    _.forEach(this.creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        let harvester = new Harvester();
        harvester.setCreep(creep);
        // Next move for harvester
        harvester.action();

        // Save harvester to collection
        harvesters.push(harvester);
      }
    });

    if (Config.VERBOSE) {
      console.log(harvesters.length + ' harvesters reported on duty today!');
    }

  }

  /**
   * This should have some kind of load balancing. It's not useful to create
   * all the harvesters for all source points at the start.
   */
  export function isHarvesterLimitFull(): boolean {
    return (Config.MAX_HARVESTERS_PER_SOURCE == this.creepCount);
  }

  function _loadCreepNames(): void {
    for (let creepName in creeps) {
      if (creeps.hasOwnProperty(creepName)) {
        creepNames.push(creepName);
      }
    }
  }

}
