// Accessing Memory Helpers
export default class MemoryHelper {

    /**
     * Get structures of a single type in a room, updating if necessary
     *
     * [Cached] Memory.rooms[room.name].structures
     * @param room
     * @param filterFunction
     * @param forceUpdate
     * @returns Structure[] An array of structures of a single type
     */
    public static getStructureOfType(room: Room, type: StructureConstant, forceUpdate?: boolean): Array<Structure | null> {
        if (
            forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.data[type] === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL
        ) {
            MemoryHelper_Room.updateStructures(room);
        }

        const structures: Array<Structure | null> = _.map(Memory.rooms[room.name].structures.data[type], (id: string) => Game.getObjectById(id));
        return structures;
    }

    /**
     * clear the memory structure for the creep
     * @param creep the creep we want to clear the memory of
     */
    public static clearCreepMemory(creep: Creep) {

        // check if the memory object exists and delete it
        if (Memory.creeps[creep.name]) { delete creep.memory; }
    }

    /**
     * clear the memory for a room
     * @param room the room we want to clear the memory for
     */
    public static clearRoomMemory(room: Room) {

        // check if the memory structures exists and delete it
        if (Memory.rooms[room.name]) { delete room.memory; }
    }
}
