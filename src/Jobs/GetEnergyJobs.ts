import {
    CreepHelper,
    CreepApi,
    PathfindingApi,
    RoomApi,
    MemoryApi,
    CONTAINER_MINIMUM_ENERGY,
    ROLE_MINER,
    ROLE_REMOTE_MINER
} from "utils/internals";

export class GetEnergyJobs implements IJobTypeHelper {
    public jobType: Valid_JobTypes = "getEnergyJob";

    constructor() {
        const self = this;
        self.doWork = self.doWork.bind(self);
        self.travelTo = self.travelTo.bind(this);
    }
    /**
     * Do work on the target provided by a getEnergyJob
     */
    public doWork(creep: Creep, job: BaseJob) {
        const target: any = Game.getObjectById(job.targetID);

        CreepApi.nullCheck_target(creep, target);

        let returnCode: number;

        if (job.actionType === "harvest" && target instanceof Source) {
            returnCode = creep.harvest(target);
        } else if (job.actionType === "harvest" && target instanceof Mineral) {
            const extractor: StructureExtractor = _.find(
                target.pos.lookFor(LOOK_STRUCTURES),
                (s: Structure) => s.structureType === STRUCTURE_EXTRACTOR
            ) as StructureExtractor;
            returnCode = extractor.cooldown > 0 ? ERR_TIRED : creep.harvest(target);
        } else if (job.actionType === "pickup" && target instanceof Resource) {
            returnCode = creep.pickup(target);
        } else if (job.actionType === "withdraw" && target instanceof Structure) {
            returnCode = creep.withdraw(target, RESOURCE_ENERGY);
        } else {
            throw CreepApi.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                if (job.actionType !== "harvest") {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            case ERR_FULL:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                break;
        }
    }

    /**
     * Travel to the target provided by GetEnergyJob in creep.memory.job
     */
    public travelTo(creep: Creep, job: BaseJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        CreepApi.nullCheck_target(creep, moveTarget);

        // Move options target
        const moveOpts: MoveToOpts = PathfindingApi.GetDefaultMoveOpts();

        // In this case all actions are complete with a range of 1, but keeping for structure
        if (job.actionType === "harvest" && (moveTarget instanceof Source || moveTarget instanceof Mineral)) {
            moveOpts.range = 1;
        } else if (job.actionType === "harvest" && moveTarget instanceof StructureContainer) {
            moveOpts.range = 0;
        } else if (job.actionType === "withdraw" && (moveTarget instanceof Structure || moveTarget instanceof Creep)) {
            moveOpts.range = 1;
        } else if (job.actionType === "pickup" && moveTarget instanceof Resource) {
            moveOpts.range = 1;
        }

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return; // If we are in range to the target, then we do not need to move again, and next tick we will begin work
        }

        creep.moveTo(moveTarget!, moveOpts);
    }

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
            const miners = _.filter(Game.creeps, (creep: Creep) => {
                if (
                    creep.my &&
                    (creep.memory.role === ROLE_MINER || creep.memory.role === ROLE_REMOTE_MINER) &&
                    creep.memory.job &&
                    creep.memory.job.targetID === source.id
                ) {
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
     * Get a list of the getenergyjobs for minerals in the room
     * @param room the room we are creating the job list for
     */
    public static createMineralJobs(room: Room): GetEnergyJob[] {
        // List of all sources that are under optimal work capacity
        const openMinerals = MemoryApi.getMinerals(room.name);

        if (openMinerals.length === 0) {
            return [];
        }

        const mineralJobList: GetEnergyJob[] = [];

        _.forEach(openMinerals, (mineral: Mineral) => {
            const mineralEnergyRemaining = mineral.mineralAmount;

            // Create the StoreDefinition for the source
            const mineralResources: StoreDefinition = { energy: mineralEnergyRemaining };

            // Create the GetEnergyJob object for the source
            const sourceJob: GetEnergyJob = {
                jobType: "getEnergyJob",
                targetID: mineral.id,
                targetType: "mineral",
                actionType: "harvest",
                resources: mineralResources,
                isTaken: mineralEnergyRemaining <= 0 // Taken if no energy remaining
            };

            // Append the GetEnergyJob to the main array
            mineralJobList.push(sourceJob);
        });

        return mineralJobList;
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
     * [No-Restore] Uses a new job every time
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
