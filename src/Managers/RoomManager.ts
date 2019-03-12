import RoomApi from "../Api/Room.Api";
import MemoryApi from "../Api/Memory.Api";
import RoomHelper from "Helpers/RoomHelper";

// room-wide manager
export default class RoomManager {

    /**
     * run the room for every room
     */
    public static runRoomManager(): void {

        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();
        _.forEach(ownedRooms, (room: Room) => {
            this.runSingleRoom(room);
        });
    }

    /**
     * run the room for a single room
     * @param room the room we are running this manager function on
     */
    public static runSingleRoom(room: Room): void {

        // Set Defcon and Room State (roomState relies on defcon being set first)
        RoomApi.setDefconLevel(room);
        RoomApi.setRoomState(room);

        // Run all structures in the room if they exist
        // Run Towers
        const defcon: number = MemoryApi.getDefconLevel(room);
        if (defcon >= 1) {
            RoomApi.runTowers(room);
        }

        // Run Labs
        if (RoomHelper.isExistInRoom(room, STRUCTURE_LAB)) {
            RoomApi.runLabs(room);
        }

        // Run Links
        if (RoomHelper.isExistInRoom(room, STRUCTURE_LINK)) {
            RoomApi.runLinks(room);
        }

        // Run Terminals
        if (RoomHelper.isExistInRoom(room, STRUCTURE_TERMINAL)) {
            RoomApi.runTerminal(room);
        }
    }
}
