// @ts-ignore
import { MemoryApi } from "utils/internals";

// manager for the memory of the empire
export class MemoryManager {
    /**
     * run the memory for the AI
     */
    public static runMemoryManager(): void {
        this.initMainMemory();

        MemoryApi.garbageCollection();

        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();
        // Init memory for all owned rooms
        _.forEach(ownedRooms, (room: Room) => {
            const isOwnedRoom: boolean = true;
            MemoryApi.initRoomMemory(room.name, isOwnedRoom);
            MemoryApi.cleanDependentRoomMemory(room);
        });

        const dependentRooms: Room[] = MemoryApi.getVisibleDependentRooms();
        // Init memory for all visible dependent rooms
        _.forEach(dependentRooms, (room: Room) => {
            const isOwnedRoom: boolean = false;
            MemoryApi.initRoomMemory(room.name, isOwnedRoom);
        });
    }

    /**
     * Ensures the initial Memory object is defined properly
     */
    private static initMainMemory() {
        if (!Memory.rooms) {
            Memory.rooms = {};
        }

        if (!Memory.flags) {
            Memory.flags = {};
        }

        if (!Memory.creeps) {
            Memory.creeps = {};
        }

        if (!Memory.empire) {
            Memory.empire = {};
        }
    }
}
