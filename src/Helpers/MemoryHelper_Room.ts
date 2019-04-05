import GetEnergyJobs from "Jobs/GetEnergyJobs";
import { ALL_STRUCTURE_TYPES } from "utils/Constants";
import ClaimPartJobs from "Jobs/ClaimPartJobs";
import RoomApi from "Api/Room.Api";
import WorkPartJobs from "Jobs/WorkPartJobs";
import CarryPartJobs from "Jobs/CarryPartJobs";

/**
 * Contains all functions for initializing and updating room memory
 */
export default class MemoryHelper_Room {
    /**
     * Calls all the helper functions (that don't need additional input) to update room.memory.
     * NOTE: This will update the entire memory tree, so use this function sparingly
     * TODO Make sure this updates every aspect of room memory - currently does not
     * @param room The room to update the memory of
     */
    public static updateRoomMemory(room: Room): void {
        // Update All Creeps
        this.updateHostileCreeps(room.name);
        this.updateMyCreeps(room.name);
        // Update structures/construction sites
        this.updateConstructionSites(room.name);
        this.updateStructures(room.name);
        // Update sources, minerals, dropped resources, tombstones
        this.updateSources(room.name);
        this.updateMinerals(room);
        this.updateDroppedResources(room);
        this.updateTombstones(room);
        // Update Custom Memory Components
        this.updateDependentRooms(room);
        // Update Job Lists
        this.updateGetEnergy_allJobs(room);
        this.updateCarryPart_allJobs(room);
        this.updateWorkPart_allJobs(room);
        this.updateClaimPart_allJobs(room);
        // Calling the below function is equivalent to calling all of the above updateGetEnergy_xxxxxJobs functions
        // this.updateGetEnergy_allJobs(room);
    }

    /**
     * Update room memory for all dependent room types
     * TODO Implement this function - Decide how we plan to do it
     * @param room The room to update the dependencies of
     */
    public static updateDependentRooms(room: Room): void {
        // Cycle through all flags and check for any claim rooms or remote rooms
        // ? Should we check for the closest main room?
        // ? I have an idea of a system where we plant a remoteFlag/claimFlag
        // ? and then we place a different colored flag in the room that we want
        // ? to assign that remote/claim room to. Once the program detects the assignment flag
        // ? and the room it assigns to, it removes the assignment flag and could optionally remove
        // ? the remoteFlag as well (but I think it would be more clear to leave the flag in the room)
    }
    /**
     * Find all hostile creeps in room
     * TODO Check for boosted creeps
     * [Cached] Room.memory.hostiles
     * @param room The Room to update
     */
    public static updateHostileCreeps(roomName: string): void {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }

        Memory.rooms[roomName].hostiles = { data: { ranged: [], melee: [], heal: [], boosted: [] }, cache: null };
        const enemies = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

        // Sort creeps into categories
        _.forEach(enemies, (enemy: Creep) => {
            // * Check for boosted creeps and put them at the front of the if else stack
            if (enemy.getActiveBodyparts(HEAL) > 0) {
                Memory.rooms[roomName].hostiles.data.heal.push(enemy.id);
            } else if (enemy.getActiveBodyparts(RANGED_ATTACK) > 0) {
                Memory.rooms[roomName].hostiles.data.ranged.push(enemy.id);
            } else if (enemy.getActiveBodyparts(ATTACK) > 0) {
                Memory.rooms[roomName].hostiles.data.melee.push(enemy.id);
            }
        });

        Memory.rooms[roomName].hostiles.cache = Game.time;
    }

    /**
     * Find all owned creeps in room
     * ? Should we filter these by role into memory? E.g. creeps.data.miners
     * [Cached] Room.memory.creeps
     * @param room The Room we are checking in
     */
    public static updateMyCreeps(roomName: string): void {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }

        Memory.rooms[roomName].creeps = { data: null, cache: null };

        // Changed this because it wouldn't catch remote squads for example
        // as they aren't actually in the room all the time (had this problem with my last solo code base)
        const creeps = _.filter(Game.creeps, creep => creep.memory.homeRoom === roomName);

        Memory.rooms[roomName].creeps!.data = _.map(creeps, (creep: Creep) => creep.id);
        Memory.rooms[roomName].creeps!.cache = Game.time;
    }

    /**
     * Find all construction sites in room
     *
     * [Cached] Room.memory.constructionSites
     * @param room The Room we are checking in
     */
    public static updateConstructionSites(roomName: string): void {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }

        Memory.rooms[roomName].constructionSites = { data: null, cache: null };

        const constructionSites: ConstructionSite[] = Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES);

        Memory.rooms[roomName].constructionSites.data = _.map(constructionSites, (c: ConstructionSite) => c.id);
        Memory.rooms[roomName].constructionSites.cache = Game.time;
    }

    /**
     * Find all structures in room
     *
     * [Cached] Room.memory.structures
     * @param room The Room we are checking in
     */
    public static updateStructures(roomName: string): void {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }

        Memory.rooms[roomName].structures = { data: {}, cache: null };

        const allStructures: Structure[] = Game.rooms[roomName].find(FIND_STRUCTURES);
        const sortedStructureIDs: StringMap = {};
        // For each structureType, remove the structures from allStructures and map them to ids in the memory object.
        _.forEach(ALL_STRUCTURE_TYPES, (type: StructureConstant) => {
            sortedStructureIDs[type] = _.map(
                _.remove(allStructures, (struct: Structure) => struct.structureType === type),
                (struct: Structure) => struct.id
            );
        });

        Memory.rooms[roomName].structures.data = sortedStructureIDs;
        Memory.rooms[roomName].structures.cache = Game.time;
    }

    /**
     * Find all sources in room
     *
     * [Cached] Room.memory.sources
     * @param room The room to check in
     */
    public static updateSources(roomName: string): void {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }

        Memory.rooms[roomName].sources = { data: {}, cache: null };

        const sources = Game.rooms[roomName].find(FIND_SOURCES);

        Memory.rooms[roomName].sources.data = _.map(sources, (source: Source) => source.id);
        Memory.rooms[roomName].sources.cache = Game.time;
    }

    /**
     * Find all sources in room
     *
     * [Cached] Room.memory.sources
     * @param room The room to check in
     */
    public static updateMinerals(room: Room): void {
        Memory.rooms[room.name].minerals = { data: {}, cache: null };

        const minerals = room.find(FIND_MINERALS);

        Memory.rooms[room.name].minerals.data = _.map(minerals, (mineral: Mineral) => mineral.id);
        Memory.rooms[room.name].minerals.cache = Game.time;
    }

    /**
     * Finds all tombstones in room
     *
     * @param room The room to check in
     */
    public static updateTombstones(room: Room): void {
        Memory.rooms[room.name].tombstones = { data: {}, cache: null };

        const tombstones = room.find(FIND_TOMBSTONES);

        Memory.rooms[room.name].tombstones.data = _.map(tombstones, (tombstone: Tombstone) => tombstone.id);
        Memory.rooms[room.name].tombstones.cache = Game.time;
    }

    /**
     * Find all dropped resources in a room
     *
     * @param room The room to check in
     */
    public static updateDroppedResources(room: Room): void {
        Memory.rooms[room.name].droppedResources = { data: {}, cache: null };

        const droppedResources = room.find(FIND_DROPPED_RESOURCES);

        Memory.rooms[room.name].droppedResources.data = _.map(droppedResources, (resource: Resource) => resource.id);
        Memory.rooms[room.name].droppedResources.cache = Game.time;
    }

    /**
     * update the room state
     * @param room the room we are updating
     * @param stateConst the state we are applying to the room
     */
    public static updateRoomState(room: Room): void {
        RoomApi.setRoomState(room);
        return;
    }

    /**
     * update the room defcon
     * @param room the room we are updating
     * @param stateConst the defcon we are applying to the room
     */
    public static updateDefcon(room: Room): void {
        RoomApi.setDefconLevel(room);
        return;
    }

    /**
     * Update the room's GetEnergyJobListing
     * @param room The room to update the memory of
     * @param jobList The object to store in `Memory.rooms[room.name].jobs.getEnergyJobs`
     */
    public static updateGetEnergy_allJobs(room: Room) {
        // Clean out old job listing
        if (Memory.rooms[room.name].jobs!.getEnergyJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.getEnergyJobs;
        }

        this.updateGetEnergy_sourceJobs(room);
        this.updateGetEnergy_containerJobs(room);
        this.updateGetEnergy_linkJobs(room);
        this.updateGetEnergy_backupStructuresJobs(room);
        this.updateGetEnergy_pickupJobs(room);
    }

    /**
     * Update the room's GetEnergyJobListing_sourceJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateGetEnergy_sourceJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs!.getEnergyJobs = {};
        }

        // What to do if the jobs already exist
        // ! Deletes existing jobs
        // ? Should we change it to temporarily store the data for each job, and then restore them onto the newly created Jobs?
        // ? Or should we just set it up so that each time the Job objects are updated they start fresh? (might require mining creep memory for changes to the job status, or accepting inaccuracy)
        if (Memory.rooms[room.name].jobs!.getEnergyJobs!.sourceJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.getEnergyJobs!.sourceJobs;
        }

        Memory.rooms[room.name].jobs!.getEnergyJobs!.sourceJobs = {
            data: GetEnergyJobs.createSourceJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    public static updateGetEnergy_containerJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs!.getEnergyJobs = {};
        }

        if (Memory.rooms[room.name].jobs!.getEnergyJobs!.containerJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.getEnergyJobs!.containerJobs;
        }

        Memory.rooms[room.name].jobs!.getEnergyJobs!.containerJobs = {
            data: GetEnergyJobs.createContainerJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's GetEnergyJobListing_linkJobs
     * @param room The room to update the memory fo
     */
    public static updateGetEnergy_linkJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs!.getEnergyJobs = {};
        }

        if (Memory.rooms[room.name].jobs!.getEnergyJobs!.linkJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.getEnergyJobs!.linkJobs;
        }

        Memory.rooms[room.name].jobs!.getEnergyJobs!.linkJobs = {
            data: GetEnergyJobs.createLinkJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    public static updateGetEnergy_backupStructuresJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs!.getEnergyJobs = {};
        }

        if (Memory.rooms[room.name].jobs!.getEnergyJobs!.backupStructures !== undefined) {
            delete Memory.rooms[room.name].jobs!.getEnergyJobs!.backupStructures;
        }

        Memory.rooms[room.name].jobs!.getEnergyJobs!.backupStructures = {
            data: GetEnergyJobs.createBackupStructuresJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    public static updateGetEnergy_pickupJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs!.getEnergyJobs = {};
        }

        if (Memory.rooms[room.name].jobs!.getEnergyJobs!.pickupJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.getEnergyJobs!.pickupJobs;
        }

        Memory.rooms[room.name].jobs!.getEnergyJobs!.pickupJobs = {
            data: GetEnergyJobs.createPickupJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's ClaimPartJobListing
     * @param room The room to update the memory of
     * @param jobList The object to store in `Memory.rooms[room.name].jobs.getEnergyJobs`
     */
    public static updateClaimPart_allJobs(room: Room) {
        // Clean out old job listing
        if (Memory.rooms[room.name].jobs!.getEnergyJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.getEnergyJobs;
        }

        this.updateClaimPart_claimJobs(room);
        this.updateClaimPart_reserveJobs(room);
        this.updateClaimPart_signJobs(room);
        this.updateClaimPart_controllerAttackJobs(room);
    }

    /**
     * Update the room's ClaimPartJobListing_claimJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateClaimPart_claimJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.claimPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.claimPartJobs!.claimJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.claimPartJobs!.claimJobs;
        }

        Memory.rooms[room.name].jobs!.claimPartJobs!.claimJobs = {
            data: ClaimPartJobs.createClaimJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's ClaimPartJobListing_reserveJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateClaimPart_reserveJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.claimPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.claimPartJobs!.reserveJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.claimPartJobs!.reserveJobs;
        }

        Memory.rooms[room.name].jobs!.claimPartJobs!.reserveJobs = {
            data: ClaimPartJobs.createReserveJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's ClaimPartJobListing_signJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateClaimPart_signJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.claimPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.claimPartJobs!.signJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.claimPartJobs!.signJobs;
        }

        Memory.rooms[room.name].jobs!.claimPartJobs!.signJobs = {
            data: ClaimPartJobs.createSignJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's ClaimPartJobListing_attackJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateClaimPart_controllerAttackJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.claimPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.claimPartJobs!.attackJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.claimPartJobs!.attackJobs;
        }

        Memory.rooms[room.name].jobs!.claimPartJobs!.attackJobs = {
            data: ClaimPartJobs.createAttackJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's WorkPartJobListing
     * @param room The room to update the memory of
     */
    public static updateWorkPart_allJobs(room: Room) {
        // Clean out old job listing
        if (Memory.rooms[room.name].jobs!.workPartJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.workPartJobs;
        }

        this.updateWorkPart_repairJobs(room);
        this.updateWorkPart_buildJobs(room);
        this.updateWorkPart_upgradeJobs(room);
    }

    /**
     * Update the room's WorkPartJobListing_repairJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateWorkPart_repairJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.workPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.workPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs;
        }

        Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs = {
            data: WorkPartJobs.createRepairJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's WorkPartJobListing_buildJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateWorkPart_buildJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.workPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.workPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.workPartJobs!.buildJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.workPartJobs!.buildJobs;
        }

        Memory.rooms[room.name].jobs!.workPartJobs!.buildJobs = {
            data: WorkPartJobs.createBuildJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's WorkPartJobListing_upgradeJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateWorkPart_upgradeJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.workPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.workPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.workPartJobs!.upgradeJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.workPartJobs!.upgradeJobs;
        }

        Memory.rooms[room.name].jobs!.workPartJobs!.upgradeJobs = {
            data: WorkPartJobs.createUpgradeJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's WorkPartJobListing
     * @param room The room to update the memory of
     */
    public static updateCarryPart_allJobs(room: Room) {
        // Clean out old job listing
        if (Memory.rooms[room.name].jobs!.carryPartJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.carryPartJobs;
        }

        this.updateCarryPart_fillJobs(room);
        this.updateCarryPart_storeJobs(room);
    }

    /**
     * Update the room's CarryPartJobListing_fillJobs
     * @param room  The room to update the memory of
     */
    public static updateCarryPart_fillJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.carryPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.carryPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.carryPartJobs!.fillJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.carryPartJobs!.fillJobs;
        }

        Memory.rooms[room.name].jobs!.carryPartJobs!.fillJobs = {
            data: CarryPartJobs.createFillJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's CarryPartJobListing_fillJobs
     * @param room  The room to update the memory of
     */
    public static updateCarryPart_storeJobs(room: Room) {
        if (Memory.rooms[room.name].jobs!.carryPartJobs === undefined) {
            Memory.rooms[room.name].jobs!.carryPartJobs = {};
        }
        // What to do if the jobs already exist
        if (Memory.rooms[room.name].jobs!.carryPartJobs!.storeJobs !== undefined) {
            delete Memory.rooms[room.name].jobs!.carryPartJobs!.storeJobs;
        }

        Memory.rooms[room.name].jobs!.carryPartJobs!.storeJobs = {
            data: CarryPartJobs.createStoreJobs(room),
            cache: Game.time
        };
    }

    /**
     * update creep limits for domestic creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateDomesticLimits(room: Room, newLimits: DomesticCreepLimits): void {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit!["domesticLimits"] = newLimits;
    }

    /**
     * update creep limits for remote creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateRemoteLimits(room: Room, newLimits: RemoteCreepLimits): void {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit!["remoteLimits"] = newLimits;
    }

    /**
     * update creep limits for military creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateMilitaryLimits(room: Room, newLimits: MilitaryCreepLimits): void {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit!["militaryLimits"] = newLimits;
    }
}
