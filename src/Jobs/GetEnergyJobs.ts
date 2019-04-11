import RoomApi from "Api/Room.Api";
import { CONTAINER_MINIMUM_ENERGY } from "utils/config";
import MemoryApi from "Api/Memory.Api";
import CreepHelper from "Helpers/CreepHelper";
import MemoryHelper_Room from "Helpers/MemoryHelper_Room";
import SpawnApi from "Api/Spawn.Api";
import { ROLE_MINER } from "utils/Constants";

// TODO Create jobs for tombstones and dropped resources if wanted
export default class GetEnergyJobs {
    /**
     * Gets a list of GetEnergyJobs for the sources of a room
     * @param room The room to create the job list for
     * [Accurate-Restore] Adjusts for creeps targeting it
     */
    public static createSourceJobs(room: Room): GetEnergyJob[] {
        // List of all sources that are under optimal work capacity
        const openSources = RoomApi.getOpenSources(room);

        if (openSources.length === 0) {
            return [];
        }

        const sourceJobList: GetEnergyJob[] = [];

        _.forEach(openSources, (source: Source) => {
            // Get all miners that are targeting this source
            const miners = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                if (creep.memory.role === ROLE_MINER && creep.memory.job && creep.memory.job.targetID === source.id) {
                    // * Can optionally add another statement here that checks if creep has enough life to be considered part of the job
                    return true;
                }

                return false;
            });

            // The Number of work parts those miners have
            const numWorkParts = _.sum(miners, (creep: Creep) => creep.getActiveBodyparts(WORK));

            // 2 energy per part per tick * 300 ticks to regen a source = effective mining capacity
            const sourceEnergyRemaining = source.energyCapacity - 2 * numWorkParts * 300;

            // Create the StoreDefinition for the source
            const sourceResources: StoreDefinition = { energy: sourceEnergyRemaining };

            // Create the GetEnergyJob object for the source
            const sourceJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: source.id,
                targetType: "source",
                actionType: "harvest",
                resources: sourceResources,
                isTaken: sourceEnergyRemaining <= 0 // Taken if no energy remaining
            };

            // Append the GetEnergyJob to the main array
            sourceJobList.push(sourceJob);
        });

        return sourceJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the containers of a room
     * @param room The room to create the job list for
     * [Accurate-Restore] Adjusts for creeps currently targeting it
     */
    public static createContainerJobs(room: Room): GetEnergyJob[] {
        // List of all containers with >= CONTAINER_MINIMUM_ENERGY (from config.ts)
        const containers = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_CONTAINER,
            (container: StructureContainer) => container.store.energy > CONTAINER_MINIMUM_ENERGY
        );

        if (containers.length === 0) {
            return [];
        }

        const containerJobList: GetEnergyJob[] = [];

        _.forEach(containers, (container: StructureContainer) => {
            // Get all creeps that are targeting this container to withdraw from it
            const creepsUsingContainer = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                if (
                    creep.memory.job &&
                    creep.memory.job.targetID === container.id &&
                    creep.memory.job.actionType === "withdraw"
                ) {
                    return true;
                }
                return false;
            });

            // The container.store we will use instead of the true value
            const adjustedContainerStore: StoreDefinition = container.store;

            // Subtract the empty carry of creeps targeting this container to withdraw
            _.forEach(creepsUsingContainer, (creep: Creep) => {
                adjustedContainerStore.energy -= creep.carryCapacity - creep.carry.energy;
            });

            // Create the containerJob
            const containerJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: container.id,
                targetType: STRUCTURE_CONTAINER,
                actionType: "withdraw",
                resources: adjustedContainerStore,
                isTaken: _.sum(adjustedContainerStore) <= 0 // Taken if empty
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
     * @param room  The room to create the job list
     * [Estimate-Restore] Uses the worst-case of old and new values to estimate storage
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

            const oldJob = MemoryApi.searchGetEnergyJobs(storageJob, room);

            // Choose the lowest of oldJob vs storageJob for each resource
            if (oldJob !== undefined) {
                _.forEach(Object.keys(storageJob.resources), (type: ResourceConstant) => {
                    const oldValue = oldJob.resources[type] === undefined ? 0 : oldJob.resources[type];
                    const newValue = storageJob.resources[type] === undefined ? 0 : storageJob.resources[type];
                    storageJob.resources[type] = oldValue! > newValue! ? newValue : oldValue;
                });

                storageJob.isTaken = _.sum(storageJob.resources) <= 0;
            }

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

            const oldJob = MemoryApi.searchGetEnergyJobs(terminalJob, room);

            // Choose the lowest of oldJob vs storageJob for each resource
            if (oldJob !== undefined) {
                _.forEach(Object.keys(terminalJob.resources), (type: ResourceConstant) => {
                    const oldValue = oldJob.resources[type] === undefined ? 0 : oldJob.resources[type];
                    const newValue = terminalJob.resources[type] === undefined ? 0 : terminalJob.resources[type];
                    terminalJob.resources[type] = oldValue! > newValue! ? newValue : oldValue;
                });

                terminalJob.isTaken = _.sum(terminalJob.resources) <= 0;
            }

            backupJobList.push(terminalJob);
        }

        return backupJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the dropped resources of a room
     * @param room The room to create the job for
     * [Accurate-Restore] Adjusts for creeps targeting it
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

            const creepsUsingDrop = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                if (
                    creep.memory.job &&
                    creep.memory.job.targetID === drop.id &&
                    creep.memory.job.actionType === "pickup"
                ) {
                    return true;
                }
                return false;
            });

            // Subtract creep's carryspace from drop amount
            dropStore[drop.resourceType]! -= _.sum(creepsUsingDrop, creep => creep.carryCapacity - _.sum(creep.carry));

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
