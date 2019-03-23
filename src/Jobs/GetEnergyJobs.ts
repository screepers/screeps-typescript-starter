import RoomApi from "Api/Room.Api";
import { CONTAINER_MINIMUM_ENERGY } from "utils/config";
import MemoryApi from "Api/Memory.Api";

// TODO Create jobs for tombstones and dropped resources if wanted
export default class GetEnergyJobs {
    /**
     * Gets a list of GetEnergyJobs for the sources of a room
     * @param room The room to create the job list for
     */
    public static createSourceJobs(room: Room): GetEnergyJob[] {
        // List of all sources that are under optimal work capacity
        const openSources = RoomApi.getOpenSources(room);

        if (openSources.length === 0) {
            return [];
        }

        const sourceJobList: GetEnergyJob[] = [];

        _.forEach(openSources, (source: Source) => {
            // Create the StoreDefinition for the source
            const sourceResources: StoreDefinition = { energy: source.energy };
            // Create the GetEnergyJob object for the source
            const sourceJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: source.id,
                targetType: "source",
                actionType: "harvest",
                resources: sourceResources,
                isTaken: false
            };
            // Append the GetEnergyJob to the main array
            sourceJobList.push(sourceJob);
        });

        return sourceJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the containers of a room
     * @param room The room to create the job list for
     */
    public static createContainerJobs(room: Room): GetEnergyJob[] {
        // List of all containers with >= CONTAINER_MINIMUM_ENERGY (from config.ts)
        const containers = MemoryApi.getStructureOfType(
            room,
            STRUCTURE_CONTAINER,
            (container: StructureContainer) => container.store.energy > CONTAINER_MINIMUM_ENERGY
        );

        if (containers.length === 0) {
            return [];
        }

        const containerJobList: GetEnergyJob[] = [];

        _.forEach(containers, (container: StructureContainer) => {
            const containerJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: container.id,
                targetType: STRUCTURE_CONTAINER,
                actionType: "withdraw",
                resources: container.store,
                isTaken: false
            };
            // Append to the main array
            containerJobList.push(containerJob);
        });

        return containerJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the links of a room
     * @param room The room to create the job list for
     */
    public static createLinkJobs(room: Room): GetEnergyJob[] {

        const linkJobList: GetEnergyJob[] = [];
        if (linkJobList.length === 0) {
            return [];
        }

        const upgraderLink = MemoryApi.getUpgraderLink(room);
        if (upgraderLink !== undefined && upgraderLink !== null) {
            const linkStore: StoreDefinition = { energy: upgraderLink.energy };
            const linkJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: upgraderLink!.id,
                targetType: STRUCTURE_LINK,
                actionType: "withdraw",
                resources: linkStore,
                isTaken: false
            };
            linkJobList.push(linkJob);
        }
        return linkJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the backup structures of a room (terminal, storage)
     * @param room  The room to create the job list for
     */
    public static createBackupStructuresJobs(room: Room): GetEnergyJob[] {
        const backupJobList: GetEnergyJob[] = [];

        // Create the storage job if active
        if (room.storage !== undefined) {
            const storageJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: room.storage.id,
                targetType: STRUCTURE_STORAGE,
                actionType: "withdraw",
                resources: room.storage.store,
                isTaken: false
            };

            backupJobList.push(storageJob);
        }
        // Create the terminal job if active
        if (room.terminal !== undefined) {
            const terminalJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: room.terminal.id,
                targetType: STRUCTURE_TERMINAL,
                actionType: "withdraw",
                resources: room.terminal.store,
                isTaken: false
            };

            backupJobList.push(terminalJob);
        }

        return backupJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the dropped resources of a room
     * @param room The room to create the job for
     */
    public static createPickupJobs(room: Room): GetEnergyJob[] {
        // All dropped energy in the room
        const drops = MemoryApi.getDroppedResources(room);

        if (drops.length === 0) {
            return [];
        }

        const dropJobList: GetEnergyJob[] = [];

        _.forEach(drops, (drop: Resource) => {
            const dropStore: StoreDefinition = { energy: 0 };
            dropStore[drop.resourceType] = drop.amount;

            const dropJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: drop.id,
                targetType: "droppedResource",
                resources: dropStore,
                actionType: "pickup",
                isTaken: false
            };

            dropJobList.push(dropJob);
        });

        return dropJobList;
    }
}
