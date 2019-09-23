import { C_EVENT_CREEP_SPAWNED, EventHelper, SpawnHelper, UserException, MemoryApi } from "utils/internals";

export class EventApi {
    /**
     * log an event in the room
     * this will not create an event if the subject is undefined
     * @param room the room the event occured in
     * @param id the id of the subject of the event
     * @param eventType the event type custom constant
     */
    public static createCustomEvent(roomNameString: string, id: string, eventType: CustomEventConstant): void {
        if (Game.getObjectById(id) === undefined) {
            return;
        }
        if (!Memory.rooms[roomNameString].events) {
            Memory.rooms[roomNameString].events = [];
        }

        const event: CustomEvent = {
            type: eventType,
            targetId: id,
            roomName: roomNameString,
            processed: false
        };
        Memory.rooms[roomNameString].events.push(event);
    }

    /**
     * check for events occuring in a room
     * @param room the room we are checking events for
     */
    public static scanForNewEvents(room: Room): void {
        // Call the helper functions to scan for and create new events for the room
        // ! [Disclaimer] This is scanning structures and forcing update every tick, watch cpu and we
        // Should individually profile this, it is useful but could turn out to be expensive, we'll see how it goes
        EventHelper.scanForCreepSpawnedEvents(room);
    }

    /**
     * process all of the events for the room
     * @param room the room we are running events for
     */
    public static processRoomEvents(room: Room): void {
        const events: CustomEvent[] = room.memory.events;
        for (const event in events) {
            this.processSingleEvent(room, events[event]);
        }
    }

    /**
     * process the specific event provided by the parameter
     * @param room the room this event occured in
     * @param event the event that occured
     */
    public static processSingleEvent(room: Room, event: CustomEvent): void {
        // Mark the event as processed
        event.processed = true;
        // Handle saftey and early returns
        const subject = Game.getObjectById(event.targetId);
        if (!subject) {
            return;
        }

        // Call the appropriate helper for each event
        switch (event.type) {
            // Handle all creep spawned events
            case C_EVENT_CREEP_SPAWNED:
                this.processCreepSpawnEvent(room, event, subject);
                break;

            default:
                throw new UserException(
                    "Event type unhandled",
                    "eventApi/processEvents/processSingleEvent",
                    ERROR_WARN
                );
        }
    }

    /**
     * process creep spawning event
     * @param room the room the event occured in
     * @param event the event that occured
     */
    public static processCreepSpawnEvent(room: Room, event: CustomEvent, subject: any): void {
        const creep: Creep = subject as Creep;

        // Handle military creep being spawned
        if (SpawnHelper.isMilitaryRole(creep.memory.role)) {
            EventHelper.miltaryCreepSpawnTrigger(room, event, creep);
        }
    }

    /**
     * remove all processed events from the event queue
     * @param room the room we are doing events for
     */
    public static removeProcessedEvents(room: Room): void {
        // ! In theory, all events should be processed every tick, but this allows us to have events that can wait if we choose
        // Get all unprocessed room events and save them into room event memory, overwriting previous
        const unprocessedEvents = _.filter(room.memory.events, (event: CustomEvent) => !event.processed);
        room.memory.events = unprocessedEvents;
    }
}
