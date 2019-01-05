import { stringify } from "querystring";
import { MemoryHelper_Room } from "Helpers/MemoryHelper_Room";

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
                this.getRoomMemory(Game.rooms[roomName]);
            }
        }

        // dead flags
        /** This will be a complex method depending on implementation of flags */
    }

    /**
     * Initialize the Memory object for a new room, and perform all one-time updates
     * @param room The room to initialize the memory of.
     */
    public static initRoomMemory(room: Room): void {
        // Abort if Memory already exists
        if (Memory.rooms[room.name]) {
            return;
        }

        // Initialize Memory - Typescript requires it be done this way
        //                    unless we define a constructor for RoomMemory.
        Memory.rooms[room.name] = {
            constructionSites: [],
            creepLimit: {},
            creeps: {data: [], cache: null},
            defcon: 0,
            hostiles: [],
            roomState: ROOM_STATE_INTRO,
            sources: _.map(room.find(FIND_SOURCES), source => source.id),
            structures: {}
        };

        this.getRoomMemory(room);
    }

    /**
     * Initializes the memory of a newly spawned creep
     * @param creep the creep we want to initialize memory for
     */
    public static initCreepMemory(
        creep: Creep,
        creepRole: RoleConstant,
        creepHomeRoom: string,
        creepOptions: CreepOptionsCiv | CreepOptionsMili,
        creepTargetRoom?: string
    ): void {
        // abort if memory already exists
        if (Memory.creeps[creep.name]) {
            return;
        }

        // Initialize Memory
        Memory.creeps[creep.name] = {
            homeRoom: creepHomeRoom,
            options: creepOptions,
            role: creepRole,
            targetRoom: creepTargetRoom || "",
            workTarget: "",
            working: false
        };
    }

    /**
     * Validates Room Memory and calls update function as needed
     * for the entire room memory.
     *
     * [Cached] Memory.rooms[room.name]
     * @param room The name of the room to get memory for
     */
    public static getRoomMemory(room: Room): void {
        // Should validate room memory somehow and return if valid

        MemoryHelper_Room.updateRoomMemory(room);
    }

    /**
     * Gets the owned creeps in a room, updating memory if necessary.
     *
     * [Cached] Memory.rooms[room.name].creeps
     * @param room The room to retrieve from
     * @return Array<Creep | null> An array of owned creeps or null if there are none
     */
    public static getCreeps(room: Room): Array<Creep | null> {
        const CacheTTL = 50;
        if (!Memory.rooms[room.name].creeps || Memory.rooms[room.name].creeps.cache < Game.time - CacheTTL) {
            MemoryHelper_Room.updateMyCreeps(room);
        }

        const creeps: Array<Creep | null> = _.map(Memory.rooms[room.name].creeps.data, (id: string) => Game.getObjectById(id));
        return creeps;
    }
}
