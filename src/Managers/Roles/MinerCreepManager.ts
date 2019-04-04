import MemoryApi from "../../Api/Memory.Api";
import CreepApi from "Api/Creep.Api";
import { ROLE_MINER } from "utils/constants";
import CreepHelper from "Helpers/CreepHelper";
import RoomApi from "Api/Room.Api";
import UtilHelper from "Helpers/UtilHelper";
import Normalize from "Helpers/Normalize";
import MemoryHelper from "Helpers/MemoryHelper";
import { MINERS_GET_CLOSEST_SOURCE } from "utils/config";

// Manager for the miner creep role
export default class MinerCreepManager {
    /**
     * Run the miner creep
     * @param creep The creep to run
     */
    public static runCreepRole(creep: Creep): void {
        if (creep.spawning) {
            return; // Don't do anything until you've spawned
        }

        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewSourceJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }

            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep);
        }

        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }

            CreepApi.travelTo(creep, creep.memory.job);
        }
    }

    public static getNewSourceJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        const creepOptions = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.harvestSources) {
            const sourceJobs = MemoryApi.getSourceJobs(room, (sJob: GetEnergyJob) => !sJob.isTaken);

            if (sourceJobs.length > 0) {
                // Filter out jobs that have too little energy -
                // The energy in the StoreDefinition is the amount of energy per 300 ticks left
                const suitableJobs = _.filter(
                    sourceJobs,
                    (sJob: GetEnergyJob) => sJob.resources.energy >= creep.getActiveBodyparts(WORK) * 2 * 300 //  (Workparts * 2 * 300 = effective mining capacity)
                );

                // If config allows getting closest source
                if (MINERS_GET_CLOSEST_SOURCE) {
                    let sourceIDs: string[];

                    // Get sources from suitableJobs if any, else get regular sourceJob instead
                    if (suitableJobs.length > 0) {
                        sourceIDs = MemoryHelper.getOnlyObjectsFromIDs(
                            _.map(suitableJobs, (job: GetEnergyJob) => job.targetID)
                        );
                    } else {
                        sourceIDs = MemoryHelper.getOnlyObjectsFromIDs(
                            _.map(sourceJobs, (job: GetEnergyJob) => job.targetID)
                        );
                    }

                    // Find the closest source
                    const sourceObjects: Source[] = MemoryHelper.getOnlyObjectsFromIDs(sourceIDs);
                    const closestAvailableSource: Source = creep.pos.findClosestByRange(sourceObjects)!; // Force not null since we used MemoryHelper.getOnlyObjectsFromIds;

                    // return the job that corresponds with the closest source
                    return _.find(sourceJobs, (job: GetEnergyJob) => job.targetID === closestAvailableSource.id);
                } else {
                    // Return the first suitableJob if any
                    // if none, return first sourceJob.
                    if (suitableJobs.length > 0) {
                        return suitableJobs[0];
                    } else {
                        return sourceJobs[0];
                    }
                }
            }
        } // End harvestSources option

        // no available jobs
        return undefined;
    }

    /**
     * Handle initalizing a new job
     */
    public static handleNewJob(creep: Creep): void {
        const miningContainer = CreepHelper.getMiningContainer(
            creep.memory.job as GetEnergyJob,
            Game.rooms[creep.memory.homeRoom]
        );

        if (miningContainer === undefined) {
            return; // We don't need to do anything else if the container doesn't exist
        }

        // Check for any creeps on the miningContainer
        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);

        if (creepsOnContainer.length > 0) {
            // If the creep on the container is a miner (and not some random creep that's in the way)
            if (creepsOnContainer[0].memory.role === ROLE_MINER) {
                return; // Don't target it
            }
        }

        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }

        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
