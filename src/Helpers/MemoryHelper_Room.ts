/**
 * Contains all functions for initializing and updating room memory
 */
export class MemoryHelper_Room {

    /**
     * get all hostiles creeps in the room
     * @param room the room we are checking in
     */
    public static updateHostileCreeps(room: Room): void {

        // find hostile creeps in the room and save them to the rooms memory
        Memory.rooms[room.name].hostiles = room.find(FIND_HOSTILE_CREEPS);
    }

    /**
     * get all friendly creeps in the room
     * @param room the room we are checking in
     */
    public static updateMyCreeps(room: Room): void {

        // find friendly creeps in the room and save them to the rooms memory
        Memory.rooms[room.name].creeps = room.find(FIND_MY_CREEPS);
    }

    /**
     * get all my structures in the room
     * @param room the room we are checking in
     */
    public static updateMyStructures(room: Room): void {

        const allStructures: StringMap = room.find(FIND_MY_STRUCTURES);

        // save each one of these into their spot in the memory
        let structureMemory: StringMap = Memory.rooms[room.name].structures;

        structureMemory[STRUCTURE_EXTENSION] = allStructures[STRUCTURE_EXTENSION];
        structureMemory[STRUCTURE_EXTRACTOR] = allStructures[STRUCTURE_EXTRACTOR];
        structureMemory[STRUCTURE_LAB] = allStructures[STRUCTURE_LAB];
        structureMemory[STRUCTURE_LINK] = allStructures[STRUCTURE_LINK];
        structureMemory[STRUCTURE_NUKER] = allStructures[STRUCTURE_NUKER];
        structureMemory[STRUCTURE_OBSERVER] = allStructures[STRUCTURE_OBSERVER];
        structureMemory[STRUCTURE_RAMPART] = allStructures[STRUCTURE_RAMPART];
        structureMemory[STRUCTURE_SPAWN] = allStructures[STRUCTURE_SPAWN];
        structureMemory[STRUCTURE_TOWER] = allStructures[STRUCTURE_TOWER];
    }


    /**
     * get all neutral structures in the room
     * @param room the room we are checking in
     */
    public static updateNeutralStructures(room: Room): void {

        const allStructures: StringMap = room.find(FIND_STRUCTURES);

        // save each one of these into their spot in the memory
        let structureMemory: StringMap = Memory.rooms[room.name].structures;

        structureMemory[STRUCTURE_ROAD] = allStructures[STRUCTURE_ROAD];
        structureMemory[STRUCTURE_CONTAINER] = allStructures[STRUCTURE_CONTAINER];
        structureMemory[STRUCTURE_WALL] = allStructures[STRUCTURE_WALL];
    }

    /**
     * get all construction sites in the room
     * @param room the room we are checking in
     */
    public static updateConstructionSites(room: Room): void {

        // find construction sites and save into the memory
        Memory.rooms[room.name].constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    }
}
