import MemoryHelper_Room from "Helpers/MemoryHelper_Room";
import {
    ROOM_STATE_INTRO,
    SOURCE_CACHE_TTL,
    STRUCT_CACHE_TTL,
    CONSTR_CACHE_TTL,
    HCREEP_CACHE_TTL,
    FCREEP_CACHE_TTL,
    DEPNDT_CACHE_TTL,
    TOMBSTONE_CACHE_TTL,
    DROPS_CACHE_TTL,
    JOBS_CACHE_TTL
} from "utils/Constants";
import { NO_CACHING_MEMORY } from "utils/config";
import MemoryHelper from "Helpers/MemoryHelper";

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
            }
        }

        // dead flags
        // TODO Complete a method to remove flag effects
        for (const flagName in Memory.flags) {
            if (!(flagName in Game.flags)) {
                // * Call a function to handle removing the effects of a flag removal here
                // RoomHelper/MemoryHelper.unassignFlag()
                delete Memory.flags[flagName];
            }
        }
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
            minerals: { data: null, cache: null },
            tombstones: { data: null, cache: null },
            droppedResources: { data: null, cache: null },
            getEnergyJobs: { data: null, cache: null },
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
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].creeps ||
            Memory.rooms[room.name].creeps.cache < Game.time - FCREEP_CACHE_TTL
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
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].hostiles ||
            Memory.rooms[room.name].creeps.cache < Game.time - HCREEP_CACHE_TTL
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
            NO_CACHING_MEMORY ||
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
    public static getStructureOfType(
        room: Room,
        type: StructureConstant,
        filterFunction?: (object: any) => boolean,
        forceUpdate?: boolean
    ): Array<Structure | null> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.data[type] === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL
        ) {
            MemoryHelper_Room.updateStructures(room);
        }

        let structures: Array<Structure | null> = _.map(Memory.rooms[room.name].structures.data[type], (id: string) =>
            Game.getObjectById(id)
        );

        if (filterFunction !== undefined) {
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
    ): Array<ConstructionSite | null> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].constructionSites ||
            Memory.rooms[room.name].constructionSites.cache < Game.time - CONSTR_CACHE_TTL
        ) {
            MemoryHelper_Room.updateConstructionSites(room);
        }

        let constructionSites: Array<ConstructionSite | null> = _.map(
            Memory.rooms[room.name].constructionSites.data,
            (id: string) => Game.getObjectById(id)
        );
        if (filterFunction !== undefined) {
            constructionSites = _.filter(constructionSites, filterFunction);
        }

        return constructionSites;
    }

    /**
     * Returns a list of tombstones in the room, updating if necessary
     *
     * @param room The room we want to look in
     * @param filterFunction [Optional] The function to filter the tombstones objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Array<Tombstone | null> An array of tombstones, if there are any
     */
    public static getTombstones(
        room: Room,
        filterFunction?: (object: Tombstone) => boolean,
        forceUpdate?: boolean
    ): Array<Tombstone | null> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].tombstones ||
            Memory.rooms[room.name].tombstones.cache < Game.time - TOMBSTONE_CACHE_TTL
        ) {
            MemoryHelper_Room.updateTombstones(room);
        }

        let tombstones: Array<Tombstone | null> = _.map(Memory.rooms[room.name].tombstones.data, (id: string) =>
            Game.getObjectById(id)
        );
        if (filterFunction !== undefined) {
            tombstones = _.filter(tombstones, filterFunction);
        }

        return tombstones;
    }

    /**
     * Gets the GetEnergyJobs of a room
     * @param room The room to check
     * @param filterFunction [Optional] Function to filter the jobs by
     * @param forceUpdate [Optional] Invalidate the Cache by force
     * @returns Array< GetEnergyJob | null> An array of GetEnergyJobs
     */
    public static getGetEnergyJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): Array<GetEnergyJob | null> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].getEnergyJobs ||
            Memory.rooms[room.name].getEnergyJobs.cache < Game.time - JOBS_CACHE_TTL
        ) {
            // TODO Call the function that updates the jobs in memory here
        }

        let getEnergyJobs = Memory.rooms[room.name].getEnergyJobs.data;
        if (filterFunction !== undefined) {
            getEnergyJobs = _.filter(getEnergyJobs, filterFunction);
        }

        return getEnergyJobs;
    }
    /**
     * Returns a list of the dropped resources in a room, updating if necessary
     *
     * @param room The room we want to look in
     * @param filterFunction [Optional] The function to filter the resource objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Array< Resource | null> An array of dropped resources, if there are any
     */
    public static getDroppedResources(
        room: Room,
        filterFunction?: (object: RESOURCE_ENERGY) => boolean,
        forceUpdate?: boolean
    ): Array<Resource | null> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].droppedResources ||
            Memory.rooms[room.name].droppedResources.cache < Game.time - DROPS_CACHE_TTL
        ) {
            MemoryHelper_Room.updateDroppedResources(room);
        }

        let droppedResources: Array<Resource | null> = _.map(
            Memory.rooms[room.name].droppedResources.data,
            (id: string) => Game.getObjectById(id)
        );
        if (filterFunction !== undefined) {
            droppedResources = _.filter(droppedResources, filterFunction);
        }

        return droppedResources;
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
        let sources: Array<Source | null>;

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].sources === undefined ||
            Memory.rooms[room.name].sources.cache < Game.time - SOURCE_CACHE_TTL
        ) {
            MemoryHelper_Room.updateSources(room);
        }

        sources = _.map(Memory.rooms[room.name].sources.data, (id: string) => Game.getObjectById(id));
        if (filterFunction !== undefined) {
            _.filter(sources, filterFunction);
        }

        return sources;
    }

    /**
     * get minerals in the room
     * @param room the room we want minerals from
     * @param filterFunction [Optional] The function to filter all mineral objects
     * @param forceUpdate [Optional] Invalidate cache by force
     * @returns Array<Mineral | null> An array of minerals, if there are any
     */
    public static getMinerals(
        room: Room,
        filterFunction?: (object: Source) => boolean,
        forceUpdate?: boolean
    ): Array<Mineral | null> {
        //

        // TODO Fill this out

        return [null];
    }

    /**
     * Get the remoteRoom objects
     *
     * Updates all dependencies if the cache is invalid, for efficiency
     * @param room The room to check dependencies of
     * @param filterFunction [Optional] The function to filter the room objects
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     * @param targetRoom [Optional] the name of the room we want to grab if we already know it
     */
    public static getRemoteRooms(
        room: Room,
        filterFunction?: (object: Room) => boolean,
        forceUpdate?: boolean,
        targetRoom?: string
    ): Array<RemoteRoomMemory | undefined> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].remoteRooms === undefined ||
            Memory.rooms[room.name].remoteRooms.cache < Game.time - DEPNDT_CACHE_TTL
        ) {
            // ! Not implemented yet - Empty function
            MemoryHelper_Room.updateDependentRooms(room);
        }

        let remoteRooms: Array<RemoteRoomMemory | undefined>;

        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: Room) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            remoteRooms = _.filter(
                Memory.rooms[room.name].claimRooms.data,
                (roomMemory: RemoteRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            remoteRooms = _.filter(
                Memory.rooms[room.name].claimRooms.data,
                (roomMemory: RemoteRoomMemory) => filterFunction
            );
        }

        return remoteRooms;
    }

    /**
     * Get the claimRoom objects
     *
     * Updates all dependencies if the cache is invalid
     * @param room The room to check the dependencies of
     * @param filterFunction [Optional] THe function to filter the room objects
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     * @param targetRoom the name of the room we want to grab if we already know it
     */
    public static getClaimRooms(
        room: Room,
        filterFunction?: (object: Room) => boolean,
        forceUpdate?: boolean,
        targetRoom?: string
    ): Array<ClaimRoomMemory | undefined> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].remoteRooms === undefined ||
            Memory.rooms[room.name].claimRooms.cache < Game.time - DEPNDT_CACHE_TTL
        ) {
            // ! Not implemented yet - Empty function
            MemoryHelper_Room.updateDependentRooms(room);
        }

        let claimRooms: Array<ClaimRoomMemory | undefined>;

        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: Room) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            claimRooms = _.filter(
                Memory.rooms[room.name].claimRooms.data,
                (roomMemory: ClaimRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            claimRooms = _.filter(
                Memory.rooms[room.name].claimRooms.data,
                (roomMemory: ClaimRoomMemory) => filterFunction
            );
        }

        return claimRooms;
    }

    /**
     * Get the attack room objects
     *
     * Updates all dependencies if the cache is invalid, for efficiency
     * @param room The room to check dependencies of
     * @param filterFunction [Optional] The function to filter the room objects
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     * @param targetRoom [Optional] the name of the specific room we want to grab
     */
    public static getAttackRooms(
        room: Room,
        targetRoom?: string,
        filterFunction?: (object: Room) => boolean,
        forceUpdate?: boolean
    ): Array<AttackRoomMemory | undefined> {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].attackRooms === undefined ||
            Memory.rooms[room.name].attackRooms.cache < Game.time - DEPNDT_CACHE_TTL
        ) {
            // ! Not implemented yet - Empty Function
            MemoryHelper_Room.updateDependentRooms(room);
        }

        let attackRooms: Array<AttackRoomMemory | undefined>;

        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: Room) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            attackRooms = _.filter(
                Memory.rooms[room.name].attackRooms.data,
                (roomMemory: AttackRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            attackRooms = _.filter(
                Memory.rooms[room.name].attackRooms.data,
                (roomMemory: AttackRoomMemory) => filterFunction
            );
        }

        return attackRooms;
    }
}
