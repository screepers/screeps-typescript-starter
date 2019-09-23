import { CreepHelper, CreepApi, PathfindingApi, RoomApi, MemoryApi } from "utils/internals";

export class CarryPartJobs implements IJobTypeHelper {
    public jobType: Valid_JobTypes = "carryPartJob";

    constructor() {
        const self = this;
        self.doWork = self.doWork.bind(self);
        self.travelTo = self.travelTo.bind(this);
    }
    /**
     * Implementation of the doWork for CarryPartJobs
     * @param creep Creep to do the work
     * @param job Job to perform
     */
    public doWork(creep: Creep, job: BaseJob): void {
        let target: any;

        target = Game.getObjectById(job.targetID);

        CreepApi.nullCheck_target(creep, target);

        let returnCode: number;
        let deleteOnSuccess: boolean = false;

        if (job.actionType === "transfer" && (target instanceof Structure || target instanceof Creep)) {
            deleteOnSuccess = true;
            returnCode = creep.transfer(target, RESOURCE_ENERGY);
        } else {
            throw CreepApi.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful, delete the job from creep memory
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            case ERR_NOT_ENOUGH_ENERGY:
            case ERR_FULL:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                break;
        }
    }

    /**
     * Implementation of travelTo for CarryPartJob
     * @param creep
     * @param job
     */
    public travelTo(creep: Creep, job: BaseJob): void {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        CreepApi.nullCheck_target(creep, moveTarget);

        // Move options for target
        const moveOpts = PathfindingApi.GetDefaultMoveOpts();

        if (job.actionType === "transfer" && (moveTarget instanceof Structure || moveTarget instanceof Creep)) {
            moveOpts.range = 1;
        } // else range = 0;

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return;
        }

        creep.moveTo(moveTarget!, moveOpts);
        return;
    }

    /**
     * Gets a list of fill jobs for the room
     * @param room The room to get the jobs for
     * [Accurate-Restore]
     */
    public static createFillJobs(room: Room): CarryPartJob[] {
        const lowSpawnsAndExtensions = RoomApi.getLowSpawnAndExtensions(room);
        const lowTowers = RoomApi.getTowersNeedFilled(room);

        if (lowSpawnsAndExtensions.length === 0 && lowTowers.length === 0) {
            return [];
        }

        const fillJobs: CarryPartJob[] = [];

        _.forEach(lowSpawnsAndExtensions, (structure: StructureSpawn | StructureExtension) => {
            const creepsUsing = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                return (
                    creep.memory.job !== undefined &&
                    creep.memory.job.targetID === structure.id &&
                    creep.memory.job.actionType === "transfer"
                );
            });

            const creepCapacity = _.sum(creepsUsing, (creep: Creep) => creep.carryCapacity - _.sum(creep.carry));

            const storageSpace = structure.energyCapacity - structure.energy - creepCapacity;

            const fillJob: CarryPartJob = {
                jobType: "carryPartJob",
                targetID: structure.id,
                targetType: structure.structureType,
                remaining: storageSpace,
                actionType: "transfer",
                isTaken: storageSpace <= 0
            };

            fillJobs.push(fillJob);
        });
        _.forEach(lowTowers, (structure: StructureTower) => {
            const creepsUsing = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                if (
                    creep.memory.job &&
                    creep.memory.job.targetID === structure.id &&
                    creep.memory.job.actionType === "transfer"
                ) {
                    return true;
                }
                return false;
            });

            const creepCapacity = _.sum(creepsUsing, (creep: Creep) => creep.carryCapacity - _.sum(creep.carry));

            const storageSpace = structure.energyCapacity - structure.energy - creepCapacity;

            const fillJob: CarryPartJob = {
                jobType: "carryPartJob",
                targetID: structure.id,
                targetType: structure.structureType,
                remaining: storageSpace,
                actionType: "transfer",
                isTaken: storageSpace <= 0
            };

            fillJobs.push(fillJob);
        });

        return fillJobs;
    }

    /**
     * Gets a list of store jobs for the room
     * @param room The room to get the jobs for
     * [No-Restore] New job every time
     */
    public static createStoreJobs(room: Room): CarryPartJob[] {
        const storeJobs: CarryPartJob[] = [];

        if (room.storage !== undefined) {
            const storageJob: CarryPartJob = {
                jobType: "carryPartJob",
                targetID: room.storage.id,
                targetType: STRUCTURE_STORAGE,
                remaining: room.storage.storeCapacity - _.sum(room.storage.store),
                actionType: "transfer",
                isTaken: false
            };

            storeJobs.push(storageJob);
        }

        if (room.terminal !== undefined) {
            const terminalJob: CarryPartJob = {
                jobType: "carryPartJob",
                targetID: room.terminal.id,
                targetType: STRUCTURE_TERMINAL,
                remaining: room.terminal.storeCapacity - _.sum(room.terminal.store),
                actionType: "transfer",
                isTaken: false
            };

            storeJobs.push(terminalJob);
        }

        const upgraderLink: StructureLink | null = MemoryApi.getUpgraderLink(room);

        if (upgraderLink) {
            const nonUpgraderLinks: StructureLink[] = MemoryApi.getStructureOfType(
                room.name,
                STRUCTURE_LINK,
                (link: StructureLink) => link.id !== upgraderLink!.id && link.energy < link.energyCapacity
            ) as StructureLink[];

            _.forEach(nonUpgraderLinks, (link: StructureLink) => {
                const fillLinkJob: CarryPartJob = {
                    jobType: "carryPartJob",
                    targetID: link.id,
                    targetType: STRUCTURE_LINK,
                    remaining: link.energyCapacity - link.energy,
                    actionType: "transfer",
                    isTaken: false
                };

                storeJobs.push(fillLinkJob);
            });
        }
        return storeJobs;
    }
}
