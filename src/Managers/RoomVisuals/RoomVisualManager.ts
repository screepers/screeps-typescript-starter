import MemoryApi from "../../Api/Memory.Api";
import RoomVisualApi from "./RoomVisual.Api";

// Manager for room visuals
export default class RoomVisualManager {

    /**
     * FUTURE PLANS FOR THIS MANAGER
     *
     * Create progreess bars for all the percentages
     * Place more ideas here --
     */
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

        let endLeftLine: number = 1;
        let endRightLine: number = 1;
        const LEFT_START_X = 1;
        const RIGHT_START_X = 48;

        // Left Side -----
        // Display the Empire box in the top left
        endLeftLine = RoomVisualApi.createEmpireInfoVisual(room, LEFT_START_X, endLeftLine);
        // Display the Creep Info box in middle left
        endLeftLine = RoomVisualApi.createCreepCountVisual(room, LEFT_START_X, endLeftLine);
        // Display the Room Info box in the bottom left
        endLeftLine = RoomVisualApi.createRoomInfoVisual(room, LEFT_START_X, endLeftLine);
        // ------

        // Right Side -----
        // Display Remote Flag box on the top right
        endRightLine = RoomVisualApi.createRemoteFlagVisual(room, RIGHT_START_X, endRightLine);
        // Display Claim Flag Box on the upper middle right
        endRightLine = RoomVisualApi.createClaimFlagVisual(room, RIGHT_START_X, endRightLine);
        // Display Attack Flag Box on the lower middle right
        endRightLine = RoomVisualApi.createAttackFlagVisual(room, RIGHT_START_X, endRightLine);
        // Display Option Flag box on the bottom right
        endRightLine = RoomVisualApi.createOptionFlagVisual(room, RIGHT_START_X, endRightLine);
    }
}
