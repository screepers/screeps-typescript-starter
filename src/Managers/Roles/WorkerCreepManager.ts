import { ROLE_WORKER, MemoryApi, CreepApi } from "utils/internals";

// Manager for the miner creep role
export class WorkerCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_WORKER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the worker creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        const homeRoom = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return;
            }

            this.handleNewJob(creep, homeRoom);
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
     * Gets a new job for the worker creep
     */
    public getNewJob(creep: Creep, room: Room): BaseJob | undefined {
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        } else {
            let job: BaseJob | undefined = CreepApi.newWorkPartJob(creep, room);
            if (job === undefined) {
                job = this.newCarryPartJob(creep, room);
            }

            return job;
        }
    }

    /**
     * Get a GetEnergyJob for the harvester
     */
    public newGetEnergyJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;
        if (creepOptions.getFromContainer) {
            // All container jobs with enough energy to fill creep.carry, and not taken
            const containerJobs = MemoryApi.getContainerJobs(
                room,
                (cJob: GetEnergyJob) => !cJob.isTaken && cJob.resources.energy >= creep.carryCapacity
            );

            if (containerJobs.length > 0) {
                return containerJobs[0];
            }
        }

        if (creepOptions.getDroppedEnergy) {
            // All dropped resources with enough energy to fill creep.carry, and not taken
            const dropJobs = MemoryApi.getPickupJobs(
                room,
                (dJob: GetEnergyJob) => !dJob.isTaken && dJob.resources.energy >= creep.carryCapacity
            );

            if (dropJobs.length > 0) {
                return dropJobs[0];
            }
        }

        if (creepOptions.getFromTerminal || creepOptions.getFromStorage) {
            // All backupStructures with enough energy to fill creep.carry, and not taken
            const backupStructures = MemoryApi.getBackupStructuresJobs(
                room,
                (job: GetEnergyJob) => !job.isTaken && job.resources.energy >= creep.carryCapacity
            );

            if (backupStructures.length > 0) {
                const closestTarget = creep.pos.findClosestByRange(
                    _.map(backupStructures, (job: GetEnergyJob) => Game.getObjectById(job.targetID) as Structure)
                );

                if (closestTarget !== null) {
                    return _.find(backupStructures, (job: GetEnergyJob) => job.targetID === closestTarget!.id);
                } else if (closestTarget == null) {
                    return backupStructures[0];
                }
            }

            return undefined;
        }

        return undefined;
    }

    /**
     * Get a CarryPartJob for the worker
     */
    public newCarryPartJob(creep: Creep, room: Room): CarryPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.fillSpawn || creepOptions.fillTower) {
            const fillJobs = MemoryApi.getFillJobs(
                room,
                (fJob: CarryPartJob) => !fJob.isTaken && fJob.targetType !== "link"
            );

            if (fillJobs.length > 0) {
                return fillJobs[0];
            }
        }

        if (creepOptions.fillStorage || creepOptions.fillTerminal) {
            const storeJobs = MemoryApi.getStoreJobs(room, (bsJob: CarryPartJob) => !bsJob.isTaken);

            if (storeJobs.length > 0) {
                return storeJobs[0];
            }
        }

        return undefined;
    }

    /**
     * Handles new job initializing
     */
    public handleNewJob(creep: Creep, room: Room) {
        MemoryApi.updateJobMemory(creep, room);

        switch (creep.memory.job!.jobType) {
            case "getEnergyJob":
                break;
            case "carryPartJob":
                break;
            case "workPartJob":
                break;
            default:
                break;
        }
    }
}
