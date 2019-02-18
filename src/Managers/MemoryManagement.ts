// @ts-ignore
import MemoryApi from "Api/Memory.Api";

// manager for the memory of the empire
export default class MemoryManager {
    /**
     * run the memory for the AI
     */
    public static runMemoryManager(): void {

        MemoryApi.garbageCollection();

        // Should we check for owned rooms here so we don't run memory on rooms we are just passing through?
        // Example code provided
        /*
            const ownedRooms = _.filter(Game.rooms, (room: Room) => RoomHelper.isOwnedRoom(room));

            _.forEach(ownedRooms, (room: Room) => {
                MemoryApi.initRoomMemory(room);
            });
        */
        _.forEach(Game.rooms, (room: Room) => {
            MemoryApi.initRoomMemory(room);
        });
    }
}
