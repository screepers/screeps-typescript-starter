import MemoryApi from "../../Api/Memory.Api";
import CreepApi from "Api/Creep.Api";
import UtilHelper from "Helpers/UtilHelper";
import RoomHelper from "Helpers/RoomHelper";
import MemoryHelper from "Helpers/MemoryHelper";
import { close } from "fs";
import { formatWithOptions } from "util";

// Manager for the miner creep role
export default class HarvesterCreepManager {
    /**
     * run the harvester creep
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

            this.handleNewJob(creep, homeRoom);
        }

        if (!creep.memory.working) {
            CreepApi.travelTo(creep, creep.memory.job);
        }

        if (creep.memory.working) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }
    }

    /**
     * Decides which kind of job to get and calls the appropriate function
     */
    public static getNewJob(creep: Creep, room: Room): BaseJob | undefined {
        // if creep is empty, get a GetEnergyJob
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        } else {
            let job: BaseJob | undefined = this.newCarryPartJob(creep, room);
            
            if (job === undefined) {
                job = this.newWorkPartJob(creep, room);
            }

            if (job !== undefined) {
                // Reset creep options if a job is found
                // * This prevents a creep from getting a storageFill job after getting a getFromStorage job
                const options = creep.memory.options as CreepOptionsCiv;
                options.fillStorage = true;
                options.fillTerminal = true;
            } 
            else if(room.memory.jobs && room.memory.jobs.getEnergyJobs){
                // Reset creep options if storage is not full and there are getEnergyJobs
                // * This prevents a creep from idling after getting storage if storage is not full and there are now other sources of energy in the room
                let numberOfGetEnergyJobs = 0;
                // Add up the number of jobs available for this creep (>= creepCapacity)
                if(room.memory.jobs.getEnergyJobs.containerJobs){
                    // add the number of jobs that meet criteria
                    numberOfGetEnergyJobs += _.filter(room.memory.jobs.getEnergyJobs.containerJobs.data, (job: GetEnergyJob) => job.resources.energy >= creep.carryCapacity).length;
                }

                if(room.memory.jobs.getEnergyJobs.pickupJobs){
                    // add the number of jobs that meet criteria
                    numberOfGetEnergyJobs += _.filter(room.memory.jobs.getEnergyJobs.pickupJobs.data, (job: GetEnergyJob) => job.resources.energy >= creep.carryCapacity).length;
                }
 
                if(numberOfGetEnergyJobs > 0){
                    const options = creep.memory.options as CreepOptionsCiv;
                    options.fillStorage = true;
                    options.fillTerminal = true;
                }
            }

            return job;
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

        if(creepOptions.getFromStorage || creepOptions.getFromTerminal) {
            // All backupStructures with enough energy to fill creep.carry, and not taken
            const backupStructures = MemoryApi.getBackupStructuresJobs(
                room,
                (job: GetEnergyJob) => !job.isTaken && job.resources!.energy >= creep.carryCapacity
            );

            if (backupStructures.length > 0) {
                // Turn off access to storage until creep gets a work/carry job
                const options = creep.memory.options as CreepOptionsCiv;
                options.fillStorage = false;
                options.fillTerminal = false;
                return backupStructures[0];
            }

            return undefined;
        }

        return undefined;
    }

    /**
     * Get a CarryPartJob for the harvester
     */
    public static newCarryPartJob(creep: Creep, room: Room): CarryPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.fillTower || creepOptions.fillSpawn) {
            const fillJobs = MemoryApi.getFillJobs(
                room,
                (fJob: CarryPartJob) => !fJob.isTaken && fJob.targetType !== "link",
                true
            );

            if (fillJobs.length > 0) {
                return fillJobs[0];
            }
        }

        if (creepOptions.fillStorage || creepOptions.fillTerminal) {
            const storeJobs = MemoryApi.getStoreJobs(room, (bsJob: CarryPartJob) => !bsJob.isTaken);

            if (storeJobs.length > 0) {
                const jobObjects: Structure[] = MemoryHelper.getOnlyObjectsFromIDs(
                    _.map(storeJobs, job => job.targetID)
                );

                const closestTarget = creep.pos.findClosestByRange(jobObjects);

                let closestJob;

                if (closestTarget !== null) {
                    closestJob = _.find(storeJobs, (job: CarryPartJob) => job.targetID === closestTarget.id);
                } else {
                    // if findCLosest nulls out, just choose first
                    closestJob = storeJobs[0];
                }
                return closestJob;
            }

            return undefined;
        }

        return undefined;
    }

    /**
     * Gets a new WorkPartJob for harvester
     */
    public static newWorkPartJob(creep: Creep, room: Room): WorkPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;
        const upgradeJobs = MemoryApi.getUpgradeJobs(room, (job: WorkPartJob) => !job.isTaken);

        if (creepOptions.upgrade) {
            if (upgradeJobs.length > 0) {
                return upgradeJobs[0];
            }
        }

        if (creepOptions.build) {
            const buildJobs = MemoryApi.getBuildJobs(room, (job: WorkPartJob) => !job.isTaken);
            if (buildJobs.length > 0) {
                return buildJobs[0];
            }
        }
        
        if (creepOptions.repair){
            const priorityRepairJobs = MemoryApi.getPriorityRepairJobs(room);
            if (priorityRepairJobs.length > 0) {
                return priorityRepairJobs[0];
            }
        }
        
        return undefined;
    }

    /**
     * Handles setup for a new job
     */
    public static handleNewJob(creep: Creep, room: Room): void {
        MemoryApi.updateJobMemory(creep, room);
    }
}
