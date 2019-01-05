/**
 * Contains all functions for initializing and updating room memory
 */
export class MemoryHelper_Room {
    /**
     * Find all hostile creeps in room
     * [Cached] Room.memory.hostiles
     * @param room The room to update
     */
    public static updateHostileCreeps(room: Room): void {
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        Memory.rooms[room.name].hostiles = _.map(enemies, (creep: Creep) => creep.id);
    }

    /**
     * Find all owned creeps in room
     * [Cached] Room.memory.creeps
     * @param room the room we are checking in
     */
    public static updateMyCreeps(room: Room): void {
        const creeps = room.find(FIND_MY_CREEPS);
        Memory.rooms[room.name].creeps = _.map(creeps, (creep: Creep) => creep.id);
    }
    
    /**
     * Find all construction sites in room
     * [Cached] Room.memory.constructionSites
     * @param room the room we are checking in
     */
    public static updateConstructionSites(room: Room): void {
        const constructionSites: ConstructionSite[] = room.find(FIND_MY_CONSTRUCTION_SITES);
        Memory.rooms[room.name].constructionSites = _.map(constructionSites, (c: ConstructionSite) => c.id);
    }

    /**
     * Find all structures in room
     * [Cached] Room.memory.structures
     * @param room the room we are checking in
     */
    public static updateStructures(room: Room): void {
        Memory.rooms[room.name].structures = {};

        const structureTypes: StructureConstant[] = [
            STRUCTURE_EXTENSION,
            STRUCTURE_RAMPART,
            STRUCTURE_ROAD,
            STRUCTURE_SPAWN,
            STRUCTURE_LINK,
            STRUCTURE_WALL,
            STRUCTURE_STORAGE,
            STRUCTURE_TOWER,
            STRUCTURE_OBSERVER,
            STRUCTURE_POWER_SPAWN,
            STRUCTURE_EXTRACTOR,
            STRUCTURE_LAB,
            STRUCTURE_TERMINAL,
            STRUCTURE_CONTAINER,
            STRUCTURE_NUKER,
            STRUCTURE_KEEPER_LAIR,
            STRUCTURE_CONTROLLER,
            STRUCTURE_POWER_BANK,
            STRUCTURE_PORTAL
        ];

        const allStructures: Structure[] = room.find(FIND_STRUCTURES);

        // For each structureType, remove the structures from allStructures and map them to ids in the memory object.
        _.forEach(structureTypes, (type: StructureConstant) => {
            Memory.rooms[room.name].structures[type] = _.map(
                _.remove(allStructures, (struct: Structure) => struct.structureType === type),
                (struct: Structure) => struct.id
            );
        });
    }

}
