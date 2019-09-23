import { ROLE_REMOTE_HARVESTER, MemoryApi, CreepApi, MemoryHelper, PathfindingApi } from "utils/internals";

// Manager for the miner creep role
export class RemoteHarvesterCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_REMOTE_HARVESTER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the remote harvester creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        const homeRoom = Game.rooms[creep.memory.homeRoom];
        const targetRoom = Game.rooms[creep.memory.targetRoom];

        if (CreepApi.creepShouldFlee(creep)) {
            CreepApi.fleeRemoteRoom(creep, homeRoom);
            return;
        }

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom, targetRoom);

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
    public getNewJob(creep: Creep, homeRoom: Room, targetRoom: Room): BaseJob | undefined {
        if (creep.carry.energy === 0 && creep.room.name === creep.memory.targetRoom) {
            // If creep is empty and in targetRoom - get energy
            return CreepApi.newGetEnergyJob(creep, targetRoom);
        } else if (creep.carry.energy === 0 && creep.room.name !== creep.memory.targetRoom) {
            // If creep is empty and not in targetRoom - Go to targetRoom
            return CreepApi.newMovePartJob(creep, creep.memory.targetRoom);
        } else if (creep.carry.energy > 0 && creep.room.name === creep.memory.targetRoom) {
            // If creep has energy and is in targetRoom - Get workpartJob
            let job = CreepApi.newWorkPartJob(creep, targetRoom) as BaseJob;
            // if no work part job - Go to homeRoom
            if (job === undefined) {
                job = CreepApi.newMovePartJob(creep, creep.memory.homeRoom) as BaseJob;
            }

            return job;
        } else if (creep.carry.energy > 0 && creep.room.name === creep.memory.homeRoom) {
            // If creep has energy and is in homeRoom - Get a carry job to use energy
            let job: BaseJob | undefined = this.newCarryPartJob(creep, homeRoom);
            // If no carryJob, get a workPartJob in homeroom
            if (job === undefined) {
                job = CreepApi.newWorkPartJob(creep, homeRoom);
            }

            return job;
        }

        return undefined;
    }

    /**
     * Get a CarryPartJob for the harvester
     */
    public newCarryPartJob(creep: Creep, room: Room): CarryPartJob | undefined {
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
     * Handles setup for a new job
     */
    public handleNewJob(creep: Creep, room: Room): void {
        if (creep.memory.job!.jobType === "movePartJob") {
            // Avoid error due to movePartJobs not residing in memory
            return;
        }

        const currentRoom = creep.room;
        MemoryApi.updateJobMemory(creep, currentRoom);
    }
}
