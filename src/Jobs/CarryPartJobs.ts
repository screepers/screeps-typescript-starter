import RoomApi from "Api/Room.Api";
import MemoryApi from "Api/Memory.Api";

export default class CarryPartJobs {
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
