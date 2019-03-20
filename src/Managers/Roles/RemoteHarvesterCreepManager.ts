import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN
} from "utils/constants";

// Manager for the miner creep role
export default class RemoteHarvesterCreepManager {

    /**
     * run the remote harvester creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {
        if (creep.spawning) {
            return; // don't do anything until spawned
        }

        const targetRoom: Room = Game.rooms[creep.memory.targetRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, targetRoom);

            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }

            this.handleNewJob(creep);
        }

        if (creep.memory.working === true) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }

        CreepApi.travelTo(creep, creep.memory.job);
    }

    /**
     * Decides which kind of job to get and calls the appropriate function
     */
    public static getNewJob(creep: Creep, room: Room): BaseJob | undefined {
        // if creep is empty, get a GetEnergyJob
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        } else {
            // Creep energy > 0
            return this.newCarryPartJob(creep, room);
        }
    }

    /**
     * Get a GetEnergyJob for the harvester
     */
    public static newGetEnergyJob(creep: Creep, room: Room): GetEnergyJob | undefined {

        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.getFromContainer) {
            // All container jobs with enough energy to fill creep.carry, and not taken
            const containerJobs = MemoryApi.getContainerJobs(
                room,
                (cJob: GetEnergyJob) => !cJob.isTaken && cJob.resources!.energy >= creep.carryCapacity
            );

            if (containerJobs.length > 0) {
                return containerJobs[0];
            }
        }

        if (creepOptions.getDroppedEnergy) {
            // All dropped resources with enough energy to fill creep.carry, and not taken
            const dropJobs = MemoryApi.getPickupJobs(
                room,
                (dJob: GetEnergyJob) => !dJob.isTaken && dJob.resources!.energy >= creep.carryCapacity
            );

            if (dropJobs.length > 0) {
                return dropJobs[0];
            }
        }
        return undefined;
    }

    /**
     * Get a CarryPartJob for the harvester
     */
    public static newCarryPartJob(creep: Creep, room: Room): CarryPartJob | undefined {

        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.fillLink) {
            const linkJobs = MemoryApi.getFillJobs(room, (fJob: CarryPartJob) => !fJob.isTaken && fJob.targetType === 'link');
        }
        if (creepOptions.fillSpawn) {
            const fillJobs = MemoryApi.getFillJobs(room, (fJob: CarryPartJob) => !fJob.isTaken && fJob.targetType !== 'link');

            if (fillJobs.length > 0) {
                return fillJobs[0];
            }
        }

        const storeJobs = MemoryApi.getStoreJobs(room, (bsJob: CarryPartJob) => !bsJob.isTaken);

        if (storeJobs.length > 0) {
            const storageJob: CarryPartJob | undefined = _.find(storeJobs, (storeJob: CarryPartJob) =>
                !storeJob.isTaken && storeJob.targetType === STRUCTURE_STORAGE
            );

            if (storageJob) {
                return storageJob;
            }
        }

        return undefined;
    }

    /**
     * Handles setup for a new job
     */
    public static handleNewJob(creep: Creep): void {
        if (creep.memory.job!.jobType === "getEnergyJob") {
            // TODO Decrement the energy available in room.memory.job.xxx.yyy by creep.carryCapacity
            return;
        }
        else if (creep.memory.job!.jobType === "carryPartJob") {
            // TODO Mark the job we chose as taken
            return;
        }
    }
}
