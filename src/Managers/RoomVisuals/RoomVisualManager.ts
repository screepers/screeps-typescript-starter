import MemoryApi from "../../Api/Memory.Api";
import RoomVisualApi from "./RoomVisual.Api";

// Manager for room visuals
export default class RoomVisualManager {

    /**
     * run the manager for each room
     */
    public static runRoomVisualManager(): void {

        const ownedRooms = MemoryApi.getOwnedRooms();

        _.forEach(ownedRooms,
            (room: Room) => this.runSingleRoomVisualManager(room)
        );
    }

    /**
     * run the manager for a single room
     * @param room the room we want to run the room visual for
     */
    public static runSingleRoomVisualManager(room: Room): void {

        let endLeftLine: number = 0;

        // Display the Empire box in the top left
        endLeftLine = RoomVisualApi.createEmpireInfoVisual(room, 1, 1);
        endLeftLine = RoomVisualApi.createCreepCountVisual(room, 1, endLeftLine);
        endLeftLine = RoomVisualApi.createRoomInfoVisual(room, 1, endLeftLine);

    }
}
