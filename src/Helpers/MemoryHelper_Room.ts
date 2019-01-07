import { AllStructureTypes } from "utils/Constants";

/**
 * Contains all functions for initializing and updating room memory
 */
export class MemoryHelper_Room {
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
     * Find all hostile creeps in room
     *
     * [Cached] Room.memory.hostiles
     * @param room The Room to update
     */
    public static updateHostileCreeps(room: Room): void {
        Memory.rooms[room.name].hostiles = { data: null, cache: null };

        const enemies = room.find(FIND_HOSTILE_CREEPS);
        // TODO: Sort enemies by type (ranged/melee/healer) AND also add TypeScript types that define types of enemy
        Memory.rooms[room.name].hostiles.data = _.map(enemies, (creep: Creep) => creep.id);
        Memory.rooms[room.name].hostiles.cache = Game.time;
    }

    /**
     * Find all owned creeps in room
     *
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
        _.forEach(AllStructureTypes, (type: StructureConstant) => {
            sortedStructureIDs[type] = _.map(
                _.remove(allStructures, (struct: Structure) => struct.structureType === type),
                (struct: Structure) => struct.id
            );
        });

        Memory.rooms[room.name].structures.data = sortedStructureIDs;
        Memory.rooms[room.name].structures.cache = Game.time;
    }
}
