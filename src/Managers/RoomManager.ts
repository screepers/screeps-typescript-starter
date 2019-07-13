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
    RUN_RESERVE_TTL_TIMER,
    RUN_RAMPART_STATUS_UPDATE,
} from "utils/config";
import EventApi from "Api/Event.Api";

// room-wide manager
export default class RoomManager {

    /**
     * run the room for every room
     */
    public static runRoomManager(): void {

        // Run all owned rooms
        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();
        _.forEach(ownedRooms, (room: Room) => {
            this.runSingleRoom(room);
        });

        // Run all dependent rooms we have visiblity in
        const dependentRooms: Room[] = MemoryApi.getVisibleDependentRooms();
        _.forEach(dependentRooms, (room: Room) => {
            this.runSingleDependentRoom(room);
        })

    }

    /**
     * run the room for a single owned room
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

        // Set Rampart access status
        if (RoomHelper.isExistInRoom(room, STRUCTURE_RAMPART) &&
            RoomHelper.excecuteEveryTicks(RUN_RAMPART_STATUS_UPDATE)) {
            RoomApi.runSetRampartStatus(room);
        }

        // Run accessory functions for dependent rooms ----
        // Update reserve timer for remote rooms
        if (RoomHelper.excecuteEveryTicks(RUN_RESERVE_TTL_TIMER)) {
            RoomApi.simulateReserveTTL(room);
        }

    }

    /**
     * run the room for an unowned room
     * @param room the room we are running
     */
    public static runSingleDependentRoom(room: Room): void {

        // Set Defcon for the dependent room
        if (RoomHelper.excecuteEveryTicks(RUN_ROOM_STATE_TIMER)) {
            RoomApi.setDefconLevel(room);
        }
    }
}
