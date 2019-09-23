import { ROLE_POWER_UPGRADER, MemoryApi, CreepApi } from "utils/internals";

// Manager for the miner creep role
export class PowerUpgraderCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_POWER_UPGRADER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the power upgrader creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return; // idle for a tick
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
     * Decides which kind of job to get and calls the appropriate function
     */
    public getNewJob(creep: Creep, room: Room): BaseJob | undefined {
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
    public newUpgradeJob(creep: Creep, room: Room): WorkPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;
        if (creepOptions.upgrade) {
            // All link jobs with enough energy to fill creep.carry, and not taken
            const upgraderJob = MemoryApi.getUpgradeJobs(room, (job: WorkPartJob) => !job.isTaken);

            if (upgraderJob.length > 0) {
                return upgraderJob[0];
            }

            return undefined;
        }
        return undefined;
    }

    /**
     * Get a GetEnergyJob for the power upgrader
     */
    public newGetEnergyJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        // All link jobs with enough energy to fill creep.carry, and not taken
        const linkJobs = MemoryApi.getLinkJobs(room, (job: GetEnergyJob) => !job.isTaken);

        if (linkJobs.length > 0) {
            return linkJobs[0];
        }

        return undefined;
    }

    /**
     * Handles setup for a new job
     */
    public handleNewJob(creep: Creep, room: Room): void {
        MemoryApi.updateJobMemory(creep, room);
    }
}
