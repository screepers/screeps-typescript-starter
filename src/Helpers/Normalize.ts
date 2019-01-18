import UtilHelper from "./UtilHelper";

export default class Normalize {
    /**
     * Normalizes to a Room Name
     * @param room The name of a room as a string, or the Room object
     * @returns Room.name The name of the room object
     */
    public static roomName(room: Room | string): string {
        if (room instanceof Room) {
            room = room.name;
        }
        return <string>room;
    }

    /**
     * Normalizes to a Room Object
     * @param room
     * @returns Room The Room Object
     */
    public static roomObject(room: Room | string): Room {
        if (!(room instanceof Room)) {
            room = Game.rooms[<string>room];
        }
        return <Room>room;
    }

    /**
     * Normalizes to a RoomPosition object
     * @param pos A RoomPosition object or an object with a pos property
     */
    public static roomPos(object: RoomPosition | _HasRoomPosition): RoomPosition {
        if (object instanceof RoomPosition) {
            return object;
        }
        return object.pos;
    }

    /**
     * Normalizes to a creep object given an ID or Name
     * @param creep
     */
    public static creepObject(creep: Creep | string): Creep {
        if (creep instanceof Creep) {
            return creep;
        }
        // If passed a name - Tested first since hash keys are faster than the Game.getObjectById function
        let obj: Creep | null = Game.creeps[creep];
        // If passed an ID instead of a name, use the slower getObjectById function
        if (obj === undefined) {
            obj = Game.getObjectById(creep);
        }
        // Risks returning null instead of a creep object, but I think that is outside the scope of a normalize method
        return <Creep>obj;
    }
}
