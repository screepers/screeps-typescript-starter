import MemoryApi from "../../Api/Memory.Api";
import CreepApi from "Api/Creep.Api";
import MemoryHelper from "Helpers/MemoryHelper";

// Manager for the miner creep role
export default class RemoteHarvesterCreepManager {
    /**
     * run the remote harvester creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {
        if (creep.spawning) {
            return;
        }

        const homeRoom = Game.rooms[creep.memory.homeRoom];

        if (creep.room.memory.defcon > 0) {
            CreepApi.fleeRemoteRoom(creep, homeRoom);
        }

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return;
            }

            this.handleNewJob(creep, homeRoom);
        }

        if (creep.memory.working) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }

        CreepApi.travelTo(creep, creep.memory.job);
    }

    /**
     * Decides which kind of job to get and calls the appropriate function
     */
    public static getNewJob(creep: Creep, room: Room): BaseJob | undefined {
        if (creep.carry.energy === 0 && creep.room.name === creep.memory.targetRoom) {
            // If creep is empty and in targetRoom - get energy
            const targetRoom = Game.rooms[creep.memory.targetRoom];
            return CreepApi.newGetEnergyJob(creep, targetRoom);
        } else if (creep.carry.energy === 0 && creep.room.name !== creep.memory.targetRoom) {
            // If creep is empty and not in targetRoom - Go to targetRoom
            return CreepApi.newMovePartJob(creep, creep.memory.targetRoom);
        } else if (creep.carry.energy === creep.carryCapacity && creep.room.name === creep.memory.targetRoom) {
            // If creep is full and in targetRoom - Get workpartJob
            const targetRoom = Game.rooms[creep.memory.targetRoom];
            let job = CreepApi.newWorkPartJob(creep, targetRoom) as BaseJob;
            // if no work part job - Go to homeRoom
            if (job === undefined) {
                job = CreepApi.newMovePartJob(creep, creep.memory.homeRoom) as BaseJob;
            }

            return job;
        } else if (creep.carry.energy > 0 && creep.room.name === creep.memory.homeRoom) {
            // If creep has energy and is in homeRoom - Get a carry job to use energy
            let job: BaseJob | undefined = this.newCarryPartJob(creep, room);

            if (job === undefined) {
                job = this.newWorkPartJob(creep, room);
            }

            return job;
        }

        return undefined;
    }

    /**
     * Get a CarryPartJob for the harvester
     */
    public static newCarryPartJob(creep: Creep, room: Room): CarryPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.fillLink) {
            const linkJobs = MemoryApi.getFillJobs(
                room,
                (job: CarryPartJob) =>
                    !job.isTaken && job.targetType === STRUCTURE_LINK && job.remaining >= creep.carryCapacity
            );

            if (linkJobs.length > 0) {
                const jobObjects: Structure[] = MemoryHelper.getOnlyObjectsFromIDs(
                    _.map(linkJobs, job => job.targetID)
                );

                const closestTarget = creep.pos.findClosestByRange(jobObjects);

                let closestJob;

                if (closestTarget !== null) {
                    closestJob = _.find(linkJobs, (job: CarryPartJob) => job.targetID === closestTarget.id);
                } else {
                    closestJob = linkJobs[0];
                }

                return closestJob;
            }
        }

        if (creepOptions.fillStorage || creepOptions.fillTerminal) {
            const storeJobs = MemoryApi.getStoreJobs(
                room,
                (bsJob: CarryPartJob) => !bsJob.isTaken && bsJob.remaining >= creep.carryCapacity
            );

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

        if (creepOptions.repair) {
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
        if (creep.memory.job!.jobType === "movePartJob") {
            // Avoid error due to movePartJobs not residing in memory
            return;
        }

        if (creep.memory.job!.jobType === "getEnergyJob" || creep.memory.job!.jobType === "workPartJob") {
            const targetRoom = Game.rooms[creep.memory.targetRoom];
            MemoryApi.updateJobMemory(creep, targetRoom);
        } else {
            MemoryApi.updateJobMemory(creep, room);
        }
    }
}
