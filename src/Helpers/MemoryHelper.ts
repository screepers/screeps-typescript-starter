// Accessing Memory Helpers
export class MemoryHelper {

    /**
     * get number of creeps in room (can pass a filter function)
     * @param room room we want the creeps from
     * @param creepConst [optional] creep role we want
     * @param filterFunction [optional] the function we want to filter by
     */
    /*
    public static getNumCreepsInRoomBy(room: Room, creepConst?: any, filterFunction?: (c: any) => boolean): number {

        let allCreeps: StringMap;

        // if no role was specified, get all of the creeps
        if (!creepConst) {
            allCreeps = this.getCreepsInRoom(room);
        } else {
            // if role specified, get by that
            allCreeps = this.getCreepsInRoom(room, creepConst);
        }

        // if no filter function provdied
        if (!filterFunction) {
            return allCreeps.length;
        }
        // if filter function is provided, apply it
        return _.filter(allCreeps, filterFunction).length;
    }
    */

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
