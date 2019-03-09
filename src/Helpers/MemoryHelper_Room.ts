import RoomApi from "Api/Room.Api";
import { ALL_STRUCTURE_TYPES } from "utils/Constants";

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
        this.updateHostileCreeps(room);
        this.updateMyCreeps(room);
        // Update structures/construction sites
        this.updateConstructionSites(room);
        this.updateStructures(room);
        // Update sources, minerals, dropped resources, tombstones
        this.updateSources(room);
        this.updateMinerals(room);
        this.updateDroppedResources(room);
        this.updateTombstones(room);
        // Update Custom Memory Components
        this.updateDependentRooms(room);
        // Update Job Lists

        // ! Working on implementing
        // ! - Should be able to call any one of the sub-JobListings and have it fill in any missing memory structures
        this.updateGetEnergy_sourceJobs(room);

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
    public static updateHostileCreeps(room: Room): void {
        Memory.rooms[room.name].hostiles = { data: { ranged: [], melee: [], heal: [], boosted: [] }, cache: null };

        const enemies = room.find(FIND_HOSTILE_CREEPS);
        // Sort creeps into categories
        _.forEach(enemies, (enemy: Creep) => {
            // * Check for boosted creeps and put them at the front of the if else stack
            if (enemy.getActiveBodyparts(HEAL) > 0) {
                Memory.rooms[room.name].hostiles.data.heal.push(enemy.id);
            } else if (enemy.getActiveBodyparts(RANGED_ATTACK) > 0) {
                Memory.rooms[room.name].hostiles.data.ranged.push(enemy.id);
            } else if (enemy.getActiveBodyparts(ATTACK) > 0) {
                Memory.rooms[room.name].hostiles.data.melee.push(enemy.id);
            }
        });

        Memory.rooms[room.name].hostiles.cache = Game.time;
    }

    /**
     * Find all owned creeps in room
     * ? Should we filter these by role into memory? E.g. creeps.data.miners
     * [Cached] Room.memory.creeps
     * @param room The Room we are checking in
     */
    public static updateMyCreeps(room: Room): void {
        Memory.rooms[room.name].creeps = { data: null, cache: null };

        // Changed this because it wouldn't catch remote squads for example
        // as they aren't actually in the room all the time (had this problem with my last solo code base)
        const creeps = _.filter(Game.creeps, creep => creep.memory.homeRoom === room.name);

        Memory.rooms[room.name].creeps.data = _.map(creeps, (creep: Creep) => creep.id);
        Memory.rooms[room.name].creeps.cache = Game.time;
    }

    /**
     * Find all construction sites in room
     *
     * [Cached] Room.memory.constructionSites
     * @param room The Room we are checking in
     */
    public static updateConstructionSites(room: Room): void {
        Memory.rooms[room.name].constructionSites = { data: null, cache: null };

        const constructionSites: ConstructionSite[] = room.find(FIND_MY_CONSTRUCTION_SITES);

        Memory.rooms[room.name].constructionSites.data = _.map(constructionSites, (c: ConstructionSite) => c.id);
        Memory.rooms[room.name].constructionSites.cache = Game.time;
    }

    /**
     * Find all structures in room
     *
     * [Cached] Room.memory.structures
     * @param room The Room we are checking in
     */
    public static updateStructures(room: Room): void {
        Memory.rooms[room.name].structures = { data: {}, cache: null };

        const allStructures: Structure[] = room.find(FIND_STRUCTURES);
        const sortedStructureIDs: StringMap = {};
        // For each structureType, remove the structures from allStructures and map them to ids in the memory object.
        _.forEach(ALL_STRUCTURE_TYPES, (type: StructureConstant) => {
            sortedStructureIDs[type] = _.map(
                _.remove(allStructures, (struct: Structure) => struct.structureType === type),
                (struct: Structure) => struct.id
            );
        });

        Memory.rooms[room.name].structures.data = sortedStructureIDs;
        Memory.rooms[room.name].structures.cache = Game.time;
    }

    /**
     * Find all sources in room
     *
     * [Cached] Room.memory.sources
     * @param room The room to check in
     */
    public static updateSources(room: Room): void {
        Memory.rooms[room.name].sources = { data: {}, cache: null };

        const sources = room.find(FIND_SOURCES);

        Memory.rooms[room.name].sources.data = _.map(sources, (source: Source) => source.id);
        Memory.rooms[room.name].sources.cache = Game.time;
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
        Memory.rooms[room.name].droppedResources.data = Game.time;
    }

    /**
     * update the room state
     * @param room the room we are updating
     * @param stateConst the state we are applying to the room
     */
    public static updateRoomState(room: Room, stateConst: RoomStateConstant): void {
        Memory.rooms[room.name].roomState = stateConst;
        return;
    }

    /**
     * update the room defcon
     * @param room the room we are updating
     * @param stateConst the defcon we are applying to the room
     */
    public static updateDefcon(room: Room, defconLevel: number): void {
        Memory.rooms[room.name].defcon = defconLevel;
        return;
    }

    /**
     * Update the room's GetEnergyJobListing
     * @param room The room to update the memory of
     * @param jobList The object to store in `Memory.rooms[room.name].jobs.getEnergyJobs`
     */
    public static updateGetEnergy_allJobs(room: Room) {
        // Clean out old job listing
        if (Memory.rooms[room.name].jobs.getEnergyJobs !== undefined) {
            delete Memory.rooms[room.name].jobs.getEnergyJobs;
        }

        this.updateGetEnergy_sourceJobs(room);
        this.updateGetEnergy_containerJobs(room);
        this.updateGetEnergy_linkJobs(room);
        this.updateGetEnergy_backupStructuresJobs(room);
    }

    /**
     * Update the room's GetEnergyJobListing_sourceJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    public static updateGetEnergy_sourceJobs(room: Room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }
        // What to do if the jobs already exist
        // ! Deletes existing jobs
        // ? Should we change it to temporarily store the data for each job, and then restore them onto the newly created Jobs?
        // ? Or should we just set it up so that each time the Job objects are updated they start fresh? (might require mining creep memory for changes to the job status, or accepting inaccuracy)
        if (Memory.rooms[room.name].jobs.getEnergyJobs!.sourceJobs !== undefined) {
            delete Memory.rooms[room.name].jobs.getEnergyJobs!.sourceJobs;
        }

        Memory.rooms[room.name].jobs.getEnergyJobs!.sourceJobs = {
            data: RoomApi.createSourceGetEnergyJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    public static updateGetEnergy_containerJobs(room: Room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }

        if (Memory.rooms[room.name].jobs.getEnergyJobs!.containerJobs !== undefined) {
            delete Memory.rooms[room.name].jobs.getEnergyJobs!.containerJobs;
        }

        Memory.rooms[room.name].jobs.getEnergyJobs!.containerJobs = {
            data: RoomApi.createContainerGetEnergyJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's GetEnergyJobListing_linkJobs
     * @param room The room to update the memory fo
     */
    public static updateGetEnergy_linkJobs(room: Room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }

        if (Memory.rooms[room.name].jobs.getEnergyJobs!.linkJobs !== undefined) {
            delete Memory.rooms[room.name].jobs.getEnergyJobs!.linkJobs;
        }

        Memory.rooms[room.name].jobs.getEnergyJobs!.linkJobs = {
            data: RoomApi.createLinkGetEnergyJobs(room),
            cache: Game.time
        };
    }

    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    public static updateGetEnergy_backupStructuresJobs(room: Room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }

        if (Memory.rooms[room.name].jobs.getEnergyJobs!.backupStructures !== undefined) {
            delete Memory.rooms[room.name].jobs.getEnergyJobs!.backupStructures;
        }

        Memory.rooms[room.name].jobs.getEnergyJobs!.backupStructures = {
            data: RoomApi.createBackupStructuresGetEnergyJobs(room),
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
        Memory.rooms[room.name].creepLimit["domesticLimits"] = newLimits;
    }

    /**
     * update creep limits for remote creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateRemoteLimits(room: Room, newLimits: RemoteCreepLimits): void {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit["remoteLimits"] = newLimits;
    }

    /**
     * update creep limits for military creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateMilitaryLimits(room: Room, newLimits: MilitaryCreepLimits): void {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit["militaryLimits"] = newLimits;
    }
}
