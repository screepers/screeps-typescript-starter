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
        return room;
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
}
