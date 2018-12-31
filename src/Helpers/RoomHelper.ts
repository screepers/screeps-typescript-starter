
// helper functions for rooms
export class RoomHelper {

    // returns true if you own the room
    public static isOwnedRoom(room: Room): boolean {

        // check if the room name is the same as any you own
        if(!_.some(Game.rooms, r => r.name === room.name)){
            return false;
        }

        return true;
    }

    // is ally
    public static isAllyRoom(room: any): boolean {

        if(!this.isOwnedRoom(room) && (room.controller.owner.username === "Uhmbrock" || room.controller.owner.username === "Jakesboy2")){
            return true;
        }

        return false;
    }

    // is source keeper -- progress
    public static isSourceKeeperRoom(room: any): boolean {
        return false;
    }

    // is highway -- progress
    public static isHighwayRoom(room: any): boolean {
        return false;
    }

    // is in walking range -- progress
    public static inTravelRange(room: Room): boolean {
        return false;
    }

    // get object in room
    public static getObjectsInRoom(room: Room, objectConst: StructureConstant): StringMap {

        // check if the objects are in memory
        const allObjects: StringMap = room.memory.structures[objectConst];

        if(allObjects !== undefined){
            return allObjects;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for structure ${objectConst} in room ${room.name}.`);
    }

    // get object in room by filter
    public static getObjectsInRoomBy(room: Room, objectConst: StructureConstant, filterFunction: (o) => boolean): StringMap {

        const allObjects: StringMap = room.memory.structures[objectConst];

        return _.filter(allObjects, filterFunction);
    }

    // get creeps in room
    public static getCreepsInRoom(room: Room, creepConst: RoleConstant): StringMap {

        // check if the creeps are in memory
        const allCreeps: StringMap = room.memory.creeps[creepConst];

        if(allCreeps !== undefined){
            return allCreeps;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for structure ${creepConst} in room ${room.name}.`);
    }

    // get creeps in room by filter
    public static getCreepsInRoomBy(room: Room, creepConst: RoleConstant, filterFunction: (c) => boolean): StringMap{

        const allCreeps: StringMap = room.memory.creeps[creepConst];

        return _.filter(allCreeps, filterFunction);
    }
}   