import { stringify } from "querystring";
import { ROOM_STATE_INTRO, AllStructureTypes } from "utils/constants";
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
        // Slowly changing this so that each getXXX function will automatically initialize the memory.
        Memory.rooms[room.name] = {
            constructionSites: { data: null, cache: null },
            creepLimit: {},
            creeps: { data: null, cache: null },
            defcon: 0,
            hostiles: { data: null, cache: null },
            roomState: ROOM_STATE_INTRO,
            sources: _.map(room.find(FIND_SOURCES), source => source.id),
            structures: { data: null, cache: null }
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

        // Example usage of the getMethods --- NOT HOW WE WILL USE THIS METHOD REGULARLY
        this.getMyCreeps(room, undefined, true);
        this.getHostileCreeps(room);
        this.getStructures(room, (object: Structure) => object.structureType === "extension" , true);
    }

    /**
     * Gets the owned creeps in a room, updating memory if necessary.
     *
     * [Cached] Memory.rooms[room.name].creeps
     * @param room The room to retrieve from
     * @param filterFunction [Optional] The function to filter all creep objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Creep[ ] | null -- An array of owned creeps or null if there are none
     */
    public static getMyCreeps(
        room: Room,
        filterFunction?: (object: Creep) => boolean,
        forceUpdate?: boolean
    ): Array<Creep | null> {
        const CacheTTL = 50;

        if (
            forceUpdate ||
            !Memory.rooms[room.name].creeps ||
            Memory.rooms[room.name].creeps.cache < Game.time - CacheTTL
        ) {
            MemoryHelper_Room.updateMyCreeps(room);
        }

        let creeps: Array<Creep | null> = _.map(Memory.rooms[room.name].creeps.data, (id: string) =>
            Game.getObjectById(id)
        );

        if (filterFunction !== undefined) {
            creeps = _.filter(creeps, filterFunction);
        }
        
        return creeps;
    }

    /**
     * Get all hostile creeps in a room, updating if necessary
     *
     * [Cached] Memory.rooms[room.name].hostiles
     * @param room The room to retrieve from
     * @param filterFunction [Optional] The function to filter all creep objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Creep[ ] | null -- An array of hostile creeps or null if none
     */
    public static getHostileCreeps(
        room: Room,
        filterFunction?: (object: Creep) => boolean,
        forceUpdate?: boolean
    ): Array<Creep | null> {
        const CacheTTL = 1;

        if (
            forceUpdate ||
            !Memory.rooms[room.name].hostiles ||
            Memory.rooms[room.name].creeps.cache < Game.time - CacheTTL
        ) {
            MemoryHelper_Room.updateHostileCreeps(room);
        }

        let creeps: Array<Creep | null> = _.map(Memory.rooms[room.name].hostiles.data, (id: string) =>
            Game.getObjectById(id)
        );

        if (filterFunction !== undefined) {
            creeps = _.filter(creeps, filterFunction);
        }

        return creeps;
    }

    /**
     * Get structures in a room, updating if necessary
     *
     * [Cached] Memory.rooms[room.name].structures
     * @param room The room to retrieve from
     * @param filterFunction [Optional] The function to filter all structure objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Array<Structure> -- An array of structures
     */
    public static getStructures(
        room: Room,
        filterFunction?: (object: Structure) => boolean,
        forceUpdate?: boolean
    ): Array<Structure | null> {
        const CacheTTL = 50;

        if (
            forceUpdate ||
            !Memory.rooms[room.name].structures ||
            Memory.rooms[room.name].structures.cache < Game.time - CacheTTL
        ) {
            MemoryHelper_Room.updateStructures(room);
        }

        let structures: Array<Structure | null> = [];
        _.forEach(Memory.rooms[room.name].structures.data, (typeArray: string[]) => {
            _.forEach(typeArray, (id: string) => {
                structures.push(Game.getObjectById(id));
            });
        });

        if (filterFunction !== undefined) {
            structures = _.filter(structures, filterFunction);
        }
        console.log(structures);
        return structures;
    }
}
