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
import RoomApi from "./Room.Api";
import { SpawnHelper } from "Helpers/SpawnHelper";
import RoomHelper from "Helpers/RoomHelper";

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

        // Handling flag deletion in EmpireManager since it handles the entire flag system
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
            defcon: -1,
            hostiles: { data: null, cache: null },
            remoteRooms: { data: null, cache: null },
            roomState: ROOM_STATE_INTRO,
            sources: { data: null, cache: null },
            minerals: { data: null, cache: null },
            tombstones: { data: null, cache: null },
            droppedResources: { data: null, cache: null },
            jobs: {},
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
     * @returns Creep[ ] -- An array of owned creeps, empty if there are none
     */
    public static getMyCreeps(room: Room, filterFunction?: (object: Creep) => boolean, forceUpdate?: boolean): Creep[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].creeps ||
            Memory.rooms[room.name].creeps.cache < Game.time - FCREEP_CACHE_TTL
        ) {
            MemoryHelper_Room.updateMyCreeps(room);
        }

        const creepIDs: string[] = Memory.rooms[room.name].creeps.data;

        let creeps: Creep[] = MemoryHelper.getOnlyObjectsFromIDs<Creep>(creepIDs);

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
     * @returns Creep[ ]  -- An array of hostile creeps, empty if none
     */
    public static getHostileCreeps(
        room: Room,
        filterFunction?: (object: Creep) => boolean,
        forceUpdate?: boolean
    ): Creep[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].hostiles ||
            Memory.rooms[room.name].creeps.cache < Game.time - HCREEP_CACHE_TTL
        ) {
            MemoryHelper_Room.updateHostileCreeps(room);
        }

        const creepIDs: string[] = Memory.rooms[room.name].hostiles.data;

        let creeps: Creep[] = MemoryHelper.getOnlyObjectsFromIDs<Creep>(creepIDs);

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
    ): Structure[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL
        ) {
            MemoryHelper_Room.updateStructures(room);
        }

        const structureIDs: string[] = _.flattenDeep(Memory.rooms[room.name].structures.data);

        let structures: Structure[] = MemoryHelper.getOnlyObjectsFromIDs<Structure>(structureIDs);

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
    ): Structure[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.data[type] === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL
        ) {
            MemoryHelper_Room.updateStructures(room);
        }

        const structureIDs: string[] = Memory.rooms[room.name].structures.data[type];

        let structures: Structure[] = MemoryHelper.getOnlyObjectsFromIDs<Structure>(structureIDs);

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
    ): ConstructionSite[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].constructionSites ||
            Memory.rooms[room.name].constructionSites.cache < Game.time - CONSTR_CACHE_TTL
        ) {
            MemoryHelper_Room.updateConstructionSites(room);
        }

        const constructionSiteIDs: string[] = Memory.rooms[room.name].constructionSites.data;

        let constructionSites: ConstructionSite[] = MemoryHelper.getOnlyObjectsFromIDs<ConstructionSite>(
            constructionSiteIDs
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
     * @returns Tombstone[]  An array of tombstones, if there are any
     */
    public static getTombstones(
        room: Room,
        filterFunction?: (object: Tombstone) => boolean,
        forceUpdate?: boolean
    ): Tombstone[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].tombstones ||
            Memory.rooms[room.name].tombstones.cache < Game.time - TOMBSTONE_CACHE_TTL
        ) {
            MemoryHelper_Room.updateTombstones(room);
        }

        const tombstoneIDs: string[] = Memory.rooms[room.name].tombstones.data;

        let tombstones = MemoryHelper.getOnlyObjectsFromIDs<Tombstone>(tombstoneIDs);

        if (filterFunction !== undefined) {
            tombstones = _.filter(tombstones, filterFunction);
        }

        return tombstones;
    }

    /**
     * Returns a list of the dropped resources in a room, updating if necessary
     *
     * @param room The room we want to look in
     * @param filterFunction [Optional] The function to filter the resource objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Resource[]  An array of dropped resources, if there are any
     */
    public static getDroppedResources(
        room: Room,
        filterFunction?: (object: RESOURCE_ENERGY) => boolean,
        forceUpdate?: boolean
    ): Resource[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].droppedResources ||
            Memory.rooms[room.name].droppedResources.cache < Game.time - DROPS_CACHE_TTL
        ) {
            MemoryHelper_Room.updateDroppedResources(room);
        }

        const resourceIDs: string[] = Memory.rooms[room.name].droppedResources.data;

        let droppedResources: Resource[] = MemoryHelper.getOnlyObjectsFromIDs<Resource>(resourceIDs);

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
     * @returns Source[]  An array of sources, if there are any
     */
    public static getSources(
        room: Room,
        filterFunction?: (object: Source) => boolean,
        forceUpdate?: boolean
    ): Source[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[room.name].sources === undefined ||
            Memory.rooms[room.name].sources.cache < Game.time - SOURCE_CACHE_TTL
        ) {
            MemoryHelper_Room.updateSources(room);
        }

        const sourceIDs = Memory.rooms[room.name].sources.data;

        let sources: Source[] = MemoryHelper.getOnlyObjectsFromIDs<Source>(sourceIDs);

        if (filterFunction !== undefined) {
            sources = _.filter(sources, filterFunction);
        }

        return sources;
    }

    /**
     * get minerals in the room
     * @param room the room we want minerals from
     * @param filterFunction [Optional] The function to filter all mineral objects
     * @param forceUpdate [Optional] Invalidate cache by force
     * @returns Mineral[]  An array of minerals, if there are any
     */
    public static getMinerals(
        room: Room,
        filterFunction?: (object: Source) => boolean,
        forceUpdate?: boolean
    ): Mineral[] {
        //

        // TODO Fill this out

        return [];
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

    /**
     * Adjust creep limits given the amount and creep limit you want adjusted
     * @param room the room we are adjusting limits for
     * @param limitType the classification of limit (mili, remote, domestic)
     * @param roleConst the actual role we are adjusting
     * @param delta the change we are applying to the limit
     */
    public static adjustCreepLimitByDelta(room: Room, limitType: string, role: string, delta: number): void {
        Memory.rooms[room.name].creepLimit[limitType][role] += delta;
    }

    /**
     * get the defcon level for the room
     * @param room the room we are checking defcon for
     */
    public static getDefconLevel(room: Room): number {
        return Memory.rooms[room.name].defcon;
    }

    /**
     * Get count of all creeps, or of one if creepConst is specified
     * @param room the room we are getting the count for
     * @param creepConst [Optional] Count only one role
     */
    public static getCreepCount(room: Room, creepConst?: RoleConstant): number {
        const filterFunction = creepConst === undefined ? undefined : (c: Creep) => c.memory.role === creepConst;

        // Use get active mienrs instead specifically for miners to get them out early before they die
        if (creepConst === ROLE_MINER) {
            return SpawnHelper.getActiveMiners(room);
        } else {
            // Otherwise just get the actual count of the creeps
            return MemoryApi.getMyCreeps(room, filterFunction).length;
        }
    }

    /**
     * get creep limits
     * @param room the room we want the limits for
     */
    public static getCreepLimits(room: Room): CreepLimits {
        const creepLimits: CreepLimits = {
            domesticLimits: Memory.rooms[room.name].creepLimit["domesticLimits"],
            remoteLimits: Memory.rooms[room.name].creepLimit["remoteLimits"],
            militaryLimits: Memory.rooms[room.name].creepLimit["militaryLimits"]
        };

        return creepLimits;
    }

    /**
     * get all owned rooms
     * @param filterFunction [Optional] a filter function for the rooms
     * @returns Room[] array of rooms
     */
    public static getOwnedRooms(filterFunction?: (room: Room) => boolean): Room[] {

        if (!filterFunction) {
            return _.filter(Game.rooms, currentRoom => RoomHelper.isOwnedRoom(currentRoom) && filterFunction);
        }
        return _.filter(Game.rooms, currentRoom => RoomHelper.isOwnedRoom(currentRoom));
    }

    /**
     * get all flags as an array
     * @param filterFunction [Optional] a function to filter the flags out
     * @returns Flag[] an array of all flags
     */
    public static getAllFlags(filterFunction?: (flag: Flag) => boolean): Flag[] {

        const allFlags: Flag[] = Object.keys(Game.flags).map(function (flagIndex) {
            return Game.flags[flagIndex];
        });

        // Apply filter function if it exists, otherwise just return all flags
        if (filterFunction) {
            return _.filter(allFlags, filterFunction);
        }
        return allFlags;
    }
}
