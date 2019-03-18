import RoomApi from "../Api/Room.Api";
import MemoryApi from "../Api/Memory.Api";
import RoomHelper from "Helpers/RoomHelper";
import {
    RUN_TOWER_TIMER,
    RUN_LAB_TIMER,
    RUN_LINKS_TIMER,
    RUN_TERMINAL_TIMER,
    RUN_ROOM_STATE_TIMER,
    RUN_DEFCON_TIMER,
} from "utils/config";

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
        if (RoomHelper.excecuteEveryTicks(RUN_ROOM_STATE_TIMER)) {
            RoomApi.setDefconLevel(room);
        }

        if (RoomHelper.excecuteEveryTicks(RUN_DEFCON_TIMER)) {
            RoomApi.setRoomState(room);
        }

        // Run all structures in the room if they exist
        // Run Towers
        const defcon: number = MemoryApi.getDefconLevel(room);
        if (defcon >= 1 &&
            RoomHelper.excecuteEveryTicks(RUN_TOWER_TIMER)) {
            RoomApi.runTowers(room);
        }

        // Run Labs
        if (RoomHelper.isExistInRoom(room, STRUCTURE_LAB) &&
            RoomHelper.excecuteEveryTicks(RUN_LAB_TIMER)) {
            RoomApi.runLabs(room);
        }

        // Run Links
        if (RoomHelper.isExistInRoom(room, STRUCTURE_LINK) &&
            RoomHelper.excecuteEveryTicks(RUN_LINKS_TIMER)) {
            RoomApi.runLinks(room);
        }

        // Run Terminals
        if (RoomHelper.isExistInRoom(room, STRUCTURE_TERMINAL) &&
            RoomHelper.excecuteEveryTicks(RUN_TERMINAL_TIMER)) {
            RoomApi.runTerminal(room);
        }
    }
}
