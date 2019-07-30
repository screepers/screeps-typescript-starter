import MemoryApi from "Api/Memory.Api";
import EventApi from "Api/Event.Api";

export default class EventManager {

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
