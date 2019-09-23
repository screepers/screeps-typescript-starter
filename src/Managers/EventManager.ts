import { MemoryApi, EventApi } from "utils/internals";

export class EventManager {
    /**
     * run the event manager, process all events for every room
     */
    public static runEventManager(): void {
        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();

        // Process Events for all owned rooms
        _.forEach(ownedRooms, (room: Room) => {
            EventApi.scanForNewEvents(room);
            EventApi.processRoomEvents(room);
            EventApi.removeProcessedEvents(room);
        });
    }
}
