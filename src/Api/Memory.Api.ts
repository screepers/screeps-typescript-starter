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
                this.initialize_room_memory(Game.rooms[roomName]);

                //re-initialize stale memory in that room
                //Used to do:
                //Memory.rooms[roomName].jobQueues = {};
                //Memory.rooms[roomName].creepCounts = {};
            }
        }

        // dead flags
        /** This will be a complex method depending on implementation of flags */
    }

    /**
     * Initialize the Memory object for a new room
     * @param room The room to initialize the memory of.
     */
    public static initialize_room_memory(room: Room): void {
        
        //Abort if Memory already exists
        if (room.memory) return;

        //Initialize Memory - Typescript requires it be done this way
        //                    unless we define a constructor for RoomMemory.
        room.memory = {
            roomState: ROOM_STATE_INTRO,
            structures: {},
            sources: [],
            creeps: [],
            creepLimit: {},
            hostiles: []
        };

    }
}
