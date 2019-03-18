import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN
} from "utils/constants";

// Manager for the miner creep role
export default class PowerUpgraderCreepManager {

    /**
     * run the power upgrader creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {

        if (creep.spawning) {
            return; // don't do anything until spawned
        }

        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);

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
            return this.newUpgradeJob(creep, room);
        }
    }

    /**
     * get an upgrading job
     */
    public static newUpgradeJob(creep: Creep, room: Room): WorkPartJob | undefined {
        // All link jobs with enough energy to fill creep.carry, and not taken
        const upgraderJob = MemoryApi.getAllWorkPartJobs(room,
            (job: WorkPartJob) => !job.isTaken && job.targetType === STRUCTURE_CONTROLLER);

        if (upgraderJob.length > 0) {
            return upgraderJob[0];
        }

        return undefined;
    }

    /**
     * Get a GetEnergyJob for the harvester
     */
    public static newGetEnergyJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        // All link jobs with enough energy to fill creep.carry, and not taken
        const linkJobs = MemoryApi.getAllGetEnergyJobs(room,
            (job: GetEnergyJob) => !job.isTaken && job.targetType === STRUCTURE_LINK);

        if (linkJobs.length > 0) {
            return linkJobs[0];
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
        else if (creep.memory.job!.jobType === "workPartJob") {
            // TODO Mark the job we chose as taken
            return;
        }
    }
}
