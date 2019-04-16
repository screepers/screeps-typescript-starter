import RoomApi from "Api/Room.Api";
import MemoryApi from "Api/Memory.Api";

export default class WorkPartJobs {
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
