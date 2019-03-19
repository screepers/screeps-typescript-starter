import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import { ERROR_WARN } from "utils/constants";

// Manager for the miner creep role
export default class WorkerCreepManager {
    /**
     * run the worker creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {
        if (creep.spawning) {
            return;
        }

        const homeRoom = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            this.getNewJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return;
            }

            this.handleNewJob(creep, homeRoom);
        }

        if (creep.memory.working) {
            CreepApi.doWork(creep, creep.memory.job);
        }

        CreepApi.travelTo(creep, creep.memory.job);
    }

    /**
     * Gets a new job for the worker creep
     */
    public static getNewJob(creep: Creep, room: Room): BaseJob | undefined {
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        } else {
            let job: BaseJob | undefined = this.newWorkPartJob(creep, room);
            if (job === undefined) {
                job = this.newCarryPartJob(creep, room);
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
                return backupStructures[0];
            }

            return undefined;
        }

        return undefined;
    }

    /**
     * Gets a new WorkPartJob for worker
     */
    public static newWorkPartJob(creep: Creep, room: Room): WorkPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.build) {
            const buildJobs = MemoryApi.getBuildJobs(room, (job: WorkPartJob) => !job.isTaken);
            if (buildJobs.length > 0) {
                return buildJobs[0];
            }

        }

        if (creepOptions.repair) {
            const repairJobs = MemoryApi.getRepairJobs(room, (job: WorkPartJob) => !job.isTaken);
            if (repairJobs.length > 0) {
                return repairJobs[0];
            }
        }

        if (creepOptions.upgrade) {
            const upgradeJobs = MemoryApi.getUpgradeJobs(room, (job: WorkPartJob) => !job.isTaken);
            if (upgradeJobs.length > 0) {
                return upgradeJobs[0];
            }
        }

        return undefined;
    }

    /**
     * Get a CarryPartJob for the worker
     */
    public static newCarryPartJob(creep: Creep, room: Room): CarryPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.fillSpawn || creepOptions.fillTower) {
            const fillJobs = MemoryApi.getFillJobs(room, (fJob: CarryPartJob) => !fJob.isTaken);

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
    public static handleNewJob(creep: Creep, room: Room) {
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
