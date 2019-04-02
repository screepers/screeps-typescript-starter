// @ts-ignore
import MemoryApi from "Api/Memory.Api";

// manager for the memory of the empire
export default class MemoryManager {
    /**
     * run the memory for the AI
     */
    public static runMemoryManager(): void {
        this.initMainMemory();

        MemoryApi.garbageCollection();

        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();

        _.forEach(ownedRooms, (room: Room) => {
            const isOwnedRoom: boolean = true;
            MemoryApi.initRoomMemory(room.name, isOwnedRoom);
            MemoryApi.cleanDependentRoomMemory(room);
        });
    }

    /**
     * Ensures the initial Memory object is defined properly
     */
    public static initMainMemory() {
        if (!Memory.rooms) {
            Memory.rooms = {};
        }

        if (!Memory.flags) {
            Memory.flags = {};
        }

        if (!Memory.creeps) {
            Memory.creeps = {};
        }
    }
}
