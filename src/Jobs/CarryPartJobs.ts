import RoomApi from "Api/Room.Api";
import RoomHelper from "Helpers/RoomHelper";
import MemoryApi from "Api/Memory.Api";

export default class CarryPartJobs {
    /**
     * Gets a list of fill jobs for the room
     * @param room The room to get the jobs for
     */
    public static createFillJobs(room: Room): CarryPartJob[] {
        const lowSpawnsAndExtensions = RoomApi.getLowSpawnAndExtensions(room);
        const lowTowers = RoomApi.getTowersNeedFilled(room);

        if (lowSpawnsAndExtensions.length === 0 && lowTowers.length === 0) {
            return [];
        }

        const fillJobs: CarryPartJob[] = [];

        _.forEach(lowSpawnsAndExtensions, (structure: StructureSpawn | StructureExtension) => {
            const fillJob: CarryPartJob = {
                jobType: "carryPartJob",
                targetID: structure.id,
                targetType: structure.structureType,
                remaining: structure.energyCapacity - structure.energy,
                actionType: "transfer",
                isTaken: false
            };

            fillJobs.push(fillJob);
        });
        _.forEach(lowTowers, (structure: StructureTower) => {
            const fillJob: CarryPartJob = {
                jobType: "carryPartJob",
                targetID: structure.id,
                targetType: structure.structureType,
                remaining: structure.energyCapacity - structure.energy,
                actionType: "transfer",
                isTaken: false
            };

            fillJobs.push(fillJob);
        });

        return fillJobs;
    }

    /**
     * Gets a list of store jobs for the room
     * @param room The room to get the jobs for
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
                room,
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
