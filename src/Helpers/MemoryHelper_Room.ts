import { ALL_STRUCTURE_TYPES } from "utils/Constants";

/**
 * Contains all functions for initializing and updating room memory
 */
export default class MemoryHelper_Room {
    /**
     * Calls all the helper functions to update room.memory
     * @param room The room to update the memory of
     */
    public static updateRoomMemory(room: Room): void {
        // Update All Creeps
        this.updateHostileCreeps(room);
        this.updateMyCreeps(room);
        //
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

        const creeps = room.find(FIND_MY_CREEPS);

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
        Memory.rooms[room.name].sources.cache = Infinity;
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
     * update creep limits for domestic creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateDomesticLimits(room: Room, newLimits: DomesticCreepLimits): void {
        Memory.rooms[room.name].creepLimit["domesticLimits"] = newLimits;
    }

    /**
     * update creep limits for remote creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateRemoteLimits(room: Room, newLimits: RemoteCreepLimits): void {
        Memory.rooms[room.name].creepLimit["remoteLimits"] = newLimits;
    }

    /**
     * update creep limits for military creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    public static updateMilitaryLimits(room: Room, newLimits: MilitaryCreepLimits): void {
        Memory.rooms[room.name].creepLimit["militaryLimits"] = newLimits;
    }
}
