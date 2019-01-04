// the api for the memory class
export class MemoryApi {
    /**
     * clear out all dead memory
     */
    public static garbageCollection(): void {
        // Remove all dead creeps from memory
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }

        // Remove all dead rooms from memory
        for (const roomName in Memory.rooms) {
            if (!(roomName in Game.rooms)) {
                delete Memory.rooms[roomName];
            } else {
                // re-initialize stale memory in that room
                // Used to do:
                // Memory.rooms[roomName].jobQueues = {};
                // Memory.rooms[roomName].creepCounts = {};
            }
        }

        // dead flags
        /** This will be a complex method depending on implementation of flags */
    }

    /**
     * Initialize the Memory object for a new room, and perform all one-time updates
     * @param room The room to initialize the memory of.
     */
    public static initialize_room_memories(): void {
        _.forEach(Game.rooms, (room: Room) => {
            // Abort if Memory already exists
            if (Memory.rooms[room.name]) {
                // delete Memory.rooms[room.name];
                return;
            }

            console.log("Working on: ", JSON.stringify(Memory.rooms[room.name]))
            // Initialize Memory - Typescript requires it be done this way
            //                    unless we define a constructor for RoomMemory.
            Memory.rooms[room.name] = {
                creepLimit: {},
                creeps: [],
                defcon: 0,
                hostiles: [],
                roomState: ROOM_STATE_INTRO,
                sources: room.find(FIND_SOURCES),
                structures: {}
            };
        });
    }

    /**
     * Calls all the helper functions to update room.memory
     * @param room The room to update the memory of
     */
    public static update_room_memory(room: Room): void {
        // Update all memory that will be stored in Room.memory
    }
}
