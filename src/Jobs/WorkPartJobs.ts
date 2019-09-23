import { RoomApi, MemoryApi, CreepApi, CreepHelper, PathfindingApi } from "utils/internals";

export class WorkPartJobs implements IJobTypeHelper {
    public jobType: Valid_JobTypes = "workPartJob";

    constructor() {
        const self = this;
        self.doWork = self.doWork.bind(self);
        self.travelTo = self.travelTo.bind(this);
    }
    /**
     * Do work on the target provided by workPartJob
     */
    public doWork(creep: Creep, job: BaseJob) {
        const target: any = Game.getObjectById(job.targetID);

        CreepApi.nullCheck_target(creep, target);

        let returnCode: number;
        let deleteOnSuccess: boolean = false;

        if (job.actionType === "build" && target instanceof ConstructionSite) {
            returnCode = creep.build(target);
            if (!target || creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        } else if (job.actionType === "repair" && target instanceof Structure) {
            returnCode = creep.repair(target);
            if (target.hits === target.hitsMax || creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        } else if (job.actionType === "upgrade" && target instanceof StructureController) {
            returnCode = creep.upgradeController(target);
            if (creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        } else {
            throw CreepApi.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful and creep is empty, delete the job from creep memory
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
        }
    }

    /**
     * Travel to the target provided by WorkPartJob in creep.memory.job
     */
    public travelTo(creep: Creep, job: BaseJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        CreepApi.nullCheck_target(creep, moveTarget);

        // Move options for target
        const moveOpts = PathfindingApi.GetDefaultMoveOpts();

        if (job.actionType === "build" && moveTarget instanceof ConstructionSite) {
            moveOpts.range = 3;
        } else if (job.actionType === "repair" && moveTarget instanceof Structure) {
            moveOpts.range = 3;
        } else if (job.actionType === "upgrade" && moveTarget instanceof StructureController) {
            moveOpts.range = 3;
        }

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return;
        }

        creep.moveTo(moveTarget!, moveOpts);
        return;
    }

    /**
     * Gets a list of repairJobs for the room
     * @param room The room to get jobs for
     * [Accurate-Restore] Chooses the lower of two values
     */
    public static createRepairJobs(room: Room): WorkPartJob[] {
        const repairTargets = RoomApi.getRepairTargets(room);

        if (repairTargets.length === 0) {
            return [];
        }

        const repairJobs: WorkPartJob[] = [];

        _.forEach(repairTargets, (structure: Structure) => {
            const repairJob: WorkPartJob = {
                jobType: "workPartJob",
                targetID: structure.id,
                targetType: <BuildableStructureConstant>structure.structureType,
                actionType: "repair",
                remaining: structure.hitsMax - structure.hits,
                isTaken: false
            };

            const creepTargeting = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                return (
                    creep.memory.job !== undefined &&
                    creep.memory.job.targetID === structure.id &&
                    creep.memory.job.actionType === "repair"
                );
            });

            // Repair 20 hits/part/tick at .1 energy/hit rounded up to nearest whole number
            _.forEach(creepTargeting, (creep: Creep) => {
                repairJob.remaining -= Math.ceil(creep.carry.energy * 0.1);
            });

            if (repairJob.remaining <= 0) {
                repairJob.isTaken = true;
            }

            repairJobs.push(repairJob);
        });

        return repairJobs;
    }

    /**
     * Gets a list of buildJobs for the room
     * @param room The room to get jobs for
     * [Accurate-Restore] Chooses the lower of two values
     */
    public static createBuildJobs(room: Room): WorkPartJob[] {
        const constructionSites = MemoryApi.getConstructionSites(room.name);

        if (constructionSites.length === 0) {
            return [];
        }

        const buildJobs: WorkPartJob[] = [];

        _.forEach(constructionSites, (cs: ConstructionSite) => {
            const buildJob: WorkPartJob = {
                jobType: "workPartJob",
                targetID: cs.id,
                targetType: "constructionSite",
                actionType: "build",
                remaining: cs.progressTotal - cs.progress,
                isTaken: false
            };

            const creepsTargeting = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                return creep.memory.job !== undefined && creep.memory.job.targetID === cs.id;
            });

            // 1 to 1 ratio energy to points built
            _.forEach(creepsTargeting, (creep: Creep) => (buildJob.remaining -= creep.carry.energy));

            if (buildJob.remaining <= 0) {
                buildJob.isTaken = true;
            }

            buildJobs.push(buildJob);
        });

        return buildJobs;
    }

    /**
     * Gets a list of upgradeJobs for the room
     * @param room The room to get jobs
     * [No-Restore] Create a fresh job every time
     */
    public static createUpgradeJobs(room: Room): WorkPartJob[] {
        // Just returning a single upgrade controller job for now
        // ? Should we generate multiple jobs based on how many we expect to be upgrading/ how many power upgraders there are?

        const upgradeJobs: WorkPartJob[] = [];

        if (room.controller !== undefined) {
            const controllerJob: WorkPartJob = {
                jobType: "workPartJob",
                targetID: room.controller.id,
                targetType: "controller",
                actionType: "upgrade",
                remaining: room.controller.progressTotal - room.controller.progress,
                isTaken: false
            };
            upgradeJobs.push(controllerJob);
        }

        return upgradeJobs;
    }
}
