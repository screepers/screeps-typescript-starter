import { ROOM_STATE_INTRO, STRUCT_CACHE_TTL } from "utils/Constants";
import MemoryHelper_Room from "Helpers/MemoryHelper_Room";

// the api for the memory class
export default class MemoryApi {
    /**
     * Remove all memory objects that are dead
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
                // this.getRoomMemory(Game.rooms[roomName]);
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
            attackRooms: { data: null, cache: null },
            claimRooms: { data: null, cache: null },
            constructionSites: { data: null, cache: null },
            creepLimit: {},
            creeps: { data: null, cache: null },
            defcon: 0,
            hostiles: { data: null, cache: null },
            remoteRooms: { data: null, cache: null },
            roomState: ROOM_STATE_INTRO,
            sources: { data: null, cache: null },
            structures: { data: null, cache: null },
            upgradeLink: ""
        };

        this.getRoomMemory(room, true);
    }

    /**
     * Validates Room Memory and calls update function as needed
     * for the entire room memory.
     *
     * [Cached] Memory.rooms[room.name]
     * @param room The name of the room to get memory for
     * @param forceUpdate [Optional] Force all room memory to update
     */
    public static getRoomMemory(room: Room, forceUpdate?: boolean): void {
        this.getConstructionSites(room, undefined, forceUpdate);
        this.getMyCreeps(room, undefined, forceUpdate);
        this.getHostileCreeps(room, undefined, forceUpdate);
        this.getSources(room, undefined, forceUpdate);
        this.getStructures(room, undefined, forceUpdate);
        // this.getCreepLimits(room, undefined, forceUpdate);
        // this.getDefcon(room, undefined, forceUpdate);
        // this.getRoomState(room, undefined, forceUpdate);
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
        if (
            forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL
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

        return structures;
    }

    /**
     * Get structures of a single type in a room, updating if necessary
     *
     * [Cached] Memory.rooms[room.name].structures
     * @param room The room to check in
     * @param type The type of structure to retrieve
     * @param filterFunction [Optional] A function to filter by
     * @param forceUpdate [Optional] Force structures memory to be updated 
     * @returns Structure[] An array of structures of a single type
     */
    public static getStructureOfType(room: Room, type: StructureConstant, filterFunction?: (object: any) => boolean, forceUpdate?: boolean): Array<Structure | null> {
        if (
            forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.data[type] === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL
        ) {
            MemoryHelper_Room.updateStructures(room);
        }

        let structures: Array<Structure | null> = _.map(Memory.rooms[room.name].structures.data[type], (id: string) => Game.getObjectById(id));
        
        if( filterFunction !== undefined ) {
            structures = _.filter(structures, filterFunction);
        }

        return structures;
    }

    /**
     * Get all construction sites in a room, updating if necessary
     *
     * [Cached] Memory.rooms[room.name].constructionSites
     * @param room The room to retrieve from
     * @param filterFunction [Optional] The function to filter all structure objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Array<ConstructionSite> -- An array of ConstructionSites
     */
    public static getConstructionSites(
        room: Room,
        filterFunction?: (object: ConstructionSite) => boolean,
        forceUpdate?: boolean
    ) {
        const CacheTTL = 50;

        if (
            forceUpdate ||
            !Memory.rooms[room.name].constructionSites ||
            Memory.rooms[room.name].constructionSites.cache < Game.time - CacheTTL
        ) {
            MemoryHelper_Room.updateConstructionSites(room);
        }

        let constructionSites = _.map(Memory.rooms[room.name].constructionSites.data, (id: string) =>
            Game.getObjectById(id)
        );
        if (filterFunction !== undefined) {
            constructionSites = _.filter(constructionSites, filterFunction);
        }

        return constructionSites;
    }

    /**
     * get sources in the room
     * @param room the room we want sources from
     * @param filterFunction [Optional] The function to filter all source objects
     * @param forceUpdate [Optional] Invalidate cache by force
     * @returns Array<Source | null> An array of sources, if there are any
     */
    public static getSources(
        room: Room,
        filterFunction?: (object: Source) => boolean,
        forceUpdate?: boolean
    ): Array<Source | null> {
        const CacheTTL = -1;

        let sources: Array<Source | null>;

        if (
            forceUpdate ||
            Memory.rooms[room.name].sources === undefined ||
            Memory.rooms[room.name].sources.cache < Game.time - CacheTTL
        ) {
            MemoryHelper_Room.updateSources(room);
        }

        sources = _.map(Memory.rooms[room.name].sources.data, (id: string) => Game.getObjectById(id));

        return sources;
    }
}
