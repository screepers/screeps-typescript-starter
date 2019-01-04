// Accessing Memory Helpers
export class MemoryHelper {

    /**
     * return all the objects of a specified type in the room
     * @param room the room we want to get objects from
     * @param objectConst [optional] the structure we want
     * @returns StringMap
     */
    public static getObjectsInRoom(room: Room, objectConst?: StructureConstant): StringMap {
        let allObjectsID: StringMap;

        // if no structure was specified, get all the structures
        if (!objectConst) {
            allObjectsID = room.memory.structures;
        } else {
            // if structure specified, get by that
            allObjectsID = room.memory.structures[objectConst];
        }

        const allObjects: StringMap = _.map(allObjectsID, (o: string) => Game.getObjectById(o));

        if (allObjects !== undefined) {
            return allObjects;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for structure ${objectConst} in room ${room.name}.`);
    }

    /**
     * return all the objects of a specified type in the room by a filter function
     * @param room the room we want to get objects from
     * @param filterFunction the filter for the objects
     * @param objectConst [optional] the structure we want
     */
    public static getObjectsInRoomBy(
        room: Room,
        filterFunction: (o: any) => boolean,
        objectConst?: StructureConstant): StringMap {

        let allObjects: StringMap;

        // if no structure was specified, get all of the structures
        if (!objectConst) {
            allObjects = this.getObjectsInRoom(room);
        } else {
            // if structure was specified, get by that
            allObjects = this.getObjectsInRoom(room, objectConst);
        }

        return _.filter(allObjects, filterFunction);
    }

    /**
     * get all the creeps in the room
     * @param room the room we want to get creeps from
     * @param creepConst [optional] the RoleConstant
     */
    public static getCreepsInRoom(room: Room, creepConst?: RoleConstant | any): StringMap {

        let allCreeps: StringMap;

        // if no role was specified, get all of the creeps
        if (!creepConst) {
            allCreeps = room.memory.creeps;
        } else {
            // if role was specified, get just those roles
            allCreeps = room.memory.creeps[creepConst];
        }

        if (allCreeps !== undefined) {
            return allCreeps;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for creep ${creepConst} in room ${room.name}.`);
    }

    /**
     * get creeps in room by a filter function
     * @param room the room we want to get creeps from
     * @param filterFunction the filter for the creeps
     * @param creepConst [optional] the type of creep you want (RoleConstant)
     */
    public static getCreepsInRoomBy(room: Room, filterFunction: (c: any) => boolean, creepConst?: any): StringMap {

        let allCreeps: StringMap;

        // if no role was specified, get all of the creeps
        if (!creepConst) {
            allCreeps = this.getCreepsInRoom(room);
        } else {
            // if role specified, get by that
            allCreeps = this.getCreepsInRoom(room, creepConst);
        }

        return _.filter(allCreeps, filterFunction);
    }

    /**
     * get number of creeps in room (can pass a filter function)
     * @param room room we want the creeps from
     * @param creepConst [optional] creep role we want
     * @param filterFunction [optional] the function we want to filter by
     */
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

    /**
     * clear the memory structure for the creep
     * @param creep the creep we want to clear the memory of
     */
    public static clearCreepMemory(creep: Creep) {

        // check if the memory object exists and delete it
        if (Memory.creeps[creep.name]) delete creep.memory;
    }

    /**
     * clear the memory for a room
     * @param room the room we want to clear the memory for
     */
    public static clearRoomMemory(room: Room) {

        // check if the memory structures exists and delete it
        if (Memory.rooms[room.name]) delete room.memory;
    }
}
