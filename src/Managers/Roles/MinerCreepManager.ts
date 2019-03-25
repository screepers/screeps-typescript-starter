import MemoryApi from "../../Api/Memory.Api";
import CreepApi from "Api/Creep.Api";
import { ROLE_MINER } from "utils/constants";
import CreepHelper from "Helpers/CreepHelper";

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

    /**
     * Find a job for the creep
     */
    public static getNewSourceJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;
        if (creepOptions.harvestSources) {
            // TODO change this to check creep options to filter jobs -- e.g. If creep.options.harvestSources = true then we can get jobs where actionType = "harvest" and targetType = "source"
            const sourceJobs = MemoryApi.getSourceJobs(room, (sjob: GetEnergyJob) => !sjob.isTaken);
            if (sourceJobs.length > 0) {
                // Select the source with the lowest TTL miner on it (or no miner at all)
                const sources: Array<Source | null> = _.map(sourceJobs, (job: GetEnergyJob) => Game.getObjectById(job.targetID));
                let selectedId: string | undefined;
                for (const source of sources) {
                    if (!source) {
                        continue;
                    }
                    const minersOnSource: Creep[] = source.pos.findInRange(FIND_MY_CREEPS, 1, { filter: (c: Creep) => c.memory.role === ROLE_MINER });
                    // If there is a miner, the one with the lower TTL
                    if (minersOnSource.length === 0) {
                        selectedId = source.id;
                        break;
                    }
                    else {
                        let lowestTTL: number | undefined;
                        for (const miner of minersOnSource) {
                            if (!selectedId || !lowestTTL) {
                                selectedId = source.id;
                                lowestTTL = miner.ticksToLive;
                                continue;
                            }
                            else {
                                if (miner.spawning) {
                                    continue;
                                }
                                if (miner.ticksToLive! < lowestTTL) {
                                    selectedId = source.id;
                                    lowestTTL = miner.ticksToLive;
                                }
                            }
                        }
                    }
                }
                if (selectedId) {
                    return _.find(sourceJobs, (job: GetEnergyJob) => job.targetID === selectedId);
                }
                return sourceJobs[0];
            }
        }
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

        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);

        if (creepsOnContainer.length > 0) {
            if (creepsOnContainer[0].memory.role === ROLE_MINER) {
                return; // If there is already a miner creep on the container, then we don't target it
            }
        }

        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }

        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
