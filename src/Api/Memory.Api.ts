import MemoryHelper from "Helpers/MemoryHelper";
import MemoryHelper_Room from "Helpers/MemoryHelper_Room";
import RoomHelper from "Helpers/RoomHelper";
import { SpawnHelper } from "Helpers/SpawnHelper";
import { NO_CACHING_MEMORY } from "utils/config";
import {
    BACKUP_JOB_CACHE_TTL,
    CONSTR_CACHE_TTL,
    CONTAINER_JOB_CACHE_TTL,
    DROPS_CACHE_TTL,
    FCREEP_CACHE_TTL,
    HCREEP_CACHE_TTL,
    LINK_JOB_CACHE_TTL,
    ROLE_MINER,
    ROOM_STATE_INTRO,
    SOURCE_CACHE_TTL,
    SOURCE_JOB_CACHE_TTL,
    STRUCT_CACHE_TTL,
    TOMBSTONE_CACHE_TTL,
    CLAIM_JOB_CACHE_TTL,
    RESERVE_JOB_CACHE_TTL,
    SIGN_JOB_CACHE_TTL,
    ATTACK_JOB_CACHE_TTL,
    REPAIR_JOB_CACHE_TTL,
    BUILD_JOB_CACHE_TTL,
    UPGRADE_JOB_CACHE_TTL,
    STORE_JOB_CACHE_TTL,
    FILL_JOB_CACHE_TTL,
    PICKUP_JOB_CACHE_TTL,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_SEIGE,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
} from "utils/Constants";

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

        // Remove all dead flags from memory
        for (const flag in Memory.flags) {
            if (!_.some(Game.flags, (flagLoop: Flag) => flagLoop.name === Memory.flags[flag].flagName)) {
                delete Memory.flags[flag];
            }
        }
    }

    /**
     * update the room state for the room
     * @param room the room we are updating the room state for
     * @param roomState the new room state we are saving
     */
    public static updateRoomState(roomState: RoomStateConstant, room: Room): void {
        room.memory.roomState = roomState;
    }

    /**
     * get the upgrader link for the room
     * @param room the room memory we are getting the upgrader link from
     */
    public static getUpgraderLink(room: Room): StructureLink | null {
        return Game.getObjectById(room.memory.upgradeLink);
    }

    /**
     * update the upgrader link for the room
     * @param room the room we are updating it for
     * @param id the id of the link
     */
    public static updateUpgraderLink(room: Room, id: string): void {
        room.memory.upgradeLink = id;
    }

    /**
     * Go through the room's depedent room memory and remove null values
     * @param room the room we are cleaning the memory structure for
     */
    public static cleanDependentRoomMemory(room: Room): void {
        // Re-map Remote Room array to remove null values
        const allRemoteRooms: RemoteRoomMemory[] = Memory.rooms[room.name].remoteRooms;
        const nonNullRemoteRooms: RemoteRoomMemory[] = [];

        _.forEach(allRemoteRooms, (rr: RemoteRoomMemory) => {
            if (rr !== null) {
                nonNullRemoteRooms.push(rr);
            }
        });
        Memory.rooms[room.name].remoteRooms = nonNullRemoteRooms;

        // Re-map Remote Room array to remove null values
        const allClaimRooms: ClaimRoomMemory[] = Memory.rooms[room.name].claimRooms;
        const nonNullClaimRooms: ClaimRoomMemory[] = [];

        _.forEach(allClaimRooms, (rr: ClaimRoomMemory) => {
            if (rr !== null) {
                nonNullClaimRooms.push(rr);
            }
        });
        Memory.rooms[room.name].claimRooms = nonNullClaimRooms;

        // Re-map Remote Room array to remove null values
        const allAttackRooms: AttackRoomMemory[] = Memory.rooms[room.name].attackRooms;
        const nonNullAttackRooms: AttackRoomMemory[] = [];

        _.forEach(allAttackRooms, (rr: AttackRoomMemory) => {
            if (rr !== null) {
                nonNullAttackRooms.push(rr);
            }
        });
        Memory.rooms[room.name].attackRooms = nonNullAttackRooms;
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
            attackRooms: [],
            claimRooms: [],
            constructionSites: { data: null, cache: null },
            creepLimit: {},
            creeps: { data: null, cache: null },
            defcon: -1,
            hostiles: { data: null, cache: null },
            remoteRooms: [],
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
        this.getMyCreeps(room.name, undefined, forceUpdate);
        this.getHostileCreeps(room, undefined, forceUpdate);
        this.getSources(room, undefined, forceUpdate);
        this.getStructures(room, undefined, forceUpdate);
        this.getAllGetEnergyJobs(room, undefined, forceUpdate);
        this.getAllClaimPartJobs(room, undefined, forceUpdate);
        this.getAllWorkPartJobs(room, undefined, forceUpdate);
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
            job: undefined,
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
    public static getMyCreeps(roomName: string, filterFunction?: (object: Creep) => boolean, forceUpdate?: boolean): Creep[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[roomName].creeps ||
            Memory.rooms[roomName].creeps.cache < Game.time - FCREEP_CACHE_TTL
        ) {
            MemoryHelper_Room.updateMyCreeps(roomName);
        }

        const creepIDs: string[] = Memory.rooms[roomName].creeps.data;

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

        const structureIDs: string[] = [];
        // Flatten the object into an array of IDs
        for (const type in Memory.rooms[room.name].structures.data) {
            const IDs = Memory.rooms[room.name].structures.data[type];
            if (IDs.length) {
                structureIDs.push(IDs);
            }
        }

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
     * @param targetRoom [Optional] the name of the room we want to grab if we already know it
     */
    public static getRemoteRooms(
        room: Room,
        filterFunction?: (object: Room) => boolean,
        targetRoom?: string
    ): Array<RemoteRoomMemory | undefined> {
        let remoteRooms: Array<RemoteRoomMemory | undefined>;

        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: Room) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            remoteRooms = _.filter(
                Memory.rooms[room.name].remoteRooms,
                (roomMemory: RemoteRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            remoteRooms = _.filter(
                Memory.rooms[room.name].remoteRooms,
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
     * @param targetRoom the name of the room we want to grab if we already know it
     */
    public static getClaimRooms(
        room: Room,
        filterFunction?: (object: Room) => boolean,
        targetRoom?: string
    ): Array<ClaimRoomMemory | undefined> {
        let claimRooms: Array<ClaimRoomMemory | undefined>;

        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: Room) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            claimRooms = _.filter(
                Memory.rooms[room.name].claimRooms,
                (roomMemory: ClaimRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            claimRooms = _.filter(Memory.rooms[room.name].claimRooms, (roomMemory: ClaimRoomMemory) => filterFunction);
        }

        return claimRooms;
    }

    /**
     * Get the attack room objects
     *
     * Updates all dependencies if the cache is invalid, for efficiency
     * @param room The room to check dependencies of
     * @param filterFunction [Optional] The function to filter the room objects
     * @param targetRoom [Optional] the name of the specific room we want to grab
     */
    public static getAttackRooms(
        room: Room,
        targetRoom?: string,
        filterFunction?: (object: Room) => boolean
    ): Array<AttackRoomMemory | undefined> {
        let attackRooms: Array<AttackRoomMemory | undefined>;

        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: Room) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            attackRooms = _.filter(
                Memory.rooms[room.name].attackRooms,
                (roomMemory: AttackRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            attackRooms = _.filter(
                Memory.rooms[room.name].attackRooms,
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
            return MemoryApi.getMyCreeps(room.name, filterFunction).length;
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
        if (filterFunction) {
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

    /**
     * Get all jobs (in a flatted list) of GetEnergyJobs.xxx
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the GetEnergyJob list
     * @param forceUpdate [Optional] Forcibly invalidate the caches
     */
    public static getAllGetEnergyJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): GetEnergyJob[] {
        const allGetEnergyJobs: GetEnergyJob[] = [];

        _.forEach(this.getSourceJobs(room, filterFunction, forceUpdate), job => allGetEnergyJobs.push(job));
        _.forEach(this.getContainerJobs(room, filterFunction, forceUpdate), job => allGetEnergyJobs.push(job));
        _.forEach(this.getLinkJobs(room, filterFunction, forceUpdate), job => allGetEnergyJobs.push(job));
        _.forEach(this.getBackupStructuresJobs(room, filterFunction, forceUpdate), job => allGetEnergyJobs.push(job));

        return allGetEnergyJobs;
    }
    /**
     * Get the list of GetEnergyJobs.sourceJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the getEnergyjob list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getSourceJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): GetEnergyJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs!.sourceJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs!.sourceJobs!.cache < Game.time - SOURCE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_sourceJobs(room);
        }

        let sourceJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs.getEnergyJobs!.sourceJobs!.data;

        if (filterFunction !== undefined) {
            sourceJobs = _.filter(sourceJobs, filterFunction);
        }

        return sourceJobs;
    }

    /**
     * Get the list of GetEnergyJobs.containerJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the getEnergyjob list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getContainerJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): GetEnergyJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs!.containerJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs!.containerJobs!.cache < Game.time - CONTAINER_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_containerJobs(room);
        }

        let containerJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs.getEnergyJobs!.containerJobs!.data;

        if (filterFunction !== undefined) {
            containerJobs = _.filter(containerJobs, filterFunction);
        }

        return containerJobs;
    }

    /**
     * Get the list of GetEnergyJobs.linkJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the getEnergyjob list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getLinkJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): GetEnergyJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs!.linkJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs!.linkJobs!.cache < Game.time - LINK_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_linkJobs(room);
        }

        let linkJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs.getEnergyJobs!.sourceJobs!.data;

        if (filterFunction !== undefined) {
            linkJobs = _.filter(linkJobs, filterFunction);
        }

        return linkJobs;
    }

    /**
     * Get the list of GetEnergyJobs.sourceJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the getEnergyjob list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getBackupStructuresJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): GetEnergyJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs!.backupStructures ||
            Memory.rooms[room.name].jobs.getEnergyJobs!.backupStructures!.cache < Game.time - BACKUP_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_backupStructuresJobs(room);
        }

        let backupStructureJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs.getEnergyJobs!.backupStructures!.data;

        if (filterFunction !== undefined) {
            backupStructureJobs = _.filter(backupStructureJobs, filterFunction);
        }

        return backupStructureJobs;
    }

    /**
     * Get the list of GetEnergyJobs.pickupJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the getEnergyjob list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getPickupJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): GetEnergyJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs!.pickupJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs!.pickupJobs!.cache < Game.time - PICKUP_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_pickupJobs(room);
        }

        let pickupJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs.getEnergyJobs!.pickupJobs!.data;

        if (filterFunction !== undefined) {
            pickupJobs = _.filter(pickupJobs, filterFunction);
        }

        return pickupJobs;
    }

    /**
     * Get all jobs (in a flatted list) of ClaimPartJobs.xxx
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the ClaimPartJob list
     * @param forceUpdate [Optional] Forcibly invalidate the caches
     */
    public static getAllClaimPartJobs(
        room: Room,
        filterFunction?: (object: ClaimPartJob) => boolean,
        forceUpdate?: boolean
    ): ClaimPartJob[] {
        const allClaimPartJobs: ClaimPartJob[] = [];

        _.forEach(this.getClaimJobs(room, filterFunction, forceUpdate), job => allClaimPartJobs.push(job));
        _.forEach(this.getReserveJobs(room, filterFunction, forceUpdate), job => allClaimPartJobs.push(job));
        _.forEach(this.getSignJobs(room, filterFunction, forceUpdate), job => allClaimPartJobs.push(job));
        _.forEach(this.getControllerAttackJobs(room, filterFunction, forceUpdate), job => allClaimPartJobs.push(job));

        return allClaimPartJobs;
    }

    /**
     * Get the list of ClaimPartJobs.claimJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the ClaimPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getClaimJobs(
        room: Room,
        filterFunction?: (object: ClaimPartJob) => boolean,
        forceUpdate?: boolean
    ): ClaimPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs!.claimJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs!.claimJobs!.cache < Game.time - CLAIM_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_claimJobs(room);
        }

        let claimJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs.claimPartJobs!.claimJobs!.data;

        if (filterFunction !== undefined) {
            claimJobs = _.filter(claimJobs, filterFunction);
        }

        return claimJobs;
    }

    /**
     * Get the list of ClaimPartJobs.reserveJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the ClaimPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getReserveJobs(
        room: Room,
        filterFunction?: (object: ClaimPartJob) => boolean,
        forceUpdate?: boolean
    ): ClaimPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs!.reserveJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs!.reserveJobs!.cache < Game.time - RESERVE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_reserveJobs(room);
        }

        let claimJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs.claimPartJobs!.reserveJobs!.data;

        if (filterFunction !== undefined) {
            claimJobs = _.filter(claimJobs, filterFunction);
        }

        return claimJobs;
    }

    /**
     * Get the list of ClaimPartJobs.signJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the ClaimPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getSignJobs(
        room: Room,
        filterFunction?: (object: ClaimPartJob) => boolean,
        forceUpdate?: boolean
    ): ClaimPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs!.signJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs!.signJobs!.cache < Game.time - SIGN_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_signJobs(room);
        }

        let signJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs.claimPartJobs!.signJobs!.data;

        if (filterFunction !== undefined) {
            signJobs = _.filter(signJobs, filterFunction);
        }

        return signJobs;
    }

    /**
     * Get the list of ClaimPartJobs.attackJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the ClaimPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getControllerAttackJobs(
        room: Room,
        filterFunction?: (object: ClaimPartJob) => boolean,
        forceUpdate?: boolean
    ): ClaimPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs!.attackJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs!.attackJobs!.cache < Game.time - ATTACK_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_controllerAttackJobs(room);
        }

        let attackJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs.claimPartJobs!.attackJobs!.data;

        if (filterFunction !== undefined) {
            attackJobs = _.filter(attackJobs, filterFunction);
        }

        return attackJobs;
    }

    /**
     * Get all jobs (in a flatted list) of WorkPartJobs.xxx
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the WorkPartJob list
     * @param forceUpdate [Optional] Forcibly invalidate the caches
     */
    public static getAllWorkPartJobs(
        room: Room,
        filterFunction?: (object: WorkPartJob) => boolean,
        forceUpdate?: boolean
    ): WorkPartJob[] {
        const allWorkPartJobs: WorkPartJob[] = [];

        _.forEach(this.getRepairJobs(room, filterFunction, forceUpdate), job => allWorkPartJobs.push(job));
        _.forEach(this.getBuildJobs(room, filterFunction, forceUpdate), job => allWorkPartJobs.push(job));
        _.forEach(this.getUpgradeJobs(room, filterFunction, forceUpdate), job => allWorkPartJobs.push(job));

        return allWorkPartJobs;
    }

    /**
     * Get the list of WorkPartJobs.repairJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the WorkPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getRepairJobs(
        room: Room,
        filterFunction?: (object: WorkPartJob) => boolean,
        forceUpdate?: boolean
    ): WorkPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.workPartJobs ||
            !Memory.rooms[room.name].jobs.workPartJobs!.repairJobs ||
            Memory.rooms[room.name].jobs.workPartJobs!.repairJobs!.cache < Game.time - REPAIR_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateWorkPart_repairJobs(room);
        }

        let repairJobs: WorkPartJob[] = Memory.rooms[room.name].jobs.workPartJobs!.repairJobs!.data;

        if (filterFunction !== undefined) {
            repairJobs = _.filter(repairJobs, filterFunction);
        }

        return repairJobs;
    }

    /**
     * Get the list of WorkPartJobs.buildJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the WorkPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getBuildJobs(
        room: Room,
        filterFunction?: (object: WorkPartJob) => boolean,
        forceUpdate?: boolean
    ): WorkPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.workPartJobs ||
            !Memory.rooms[room.name].jobs.workPartJobs!.buildJobs ||
            Memory.rooms[room.name].jobs.workPartJobs!.buildJobs!.cache < Game.time - BUILD_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateWorkPart_buildJobs(room);
        }

        let buildJobs: WorkPartJob[] = Memory.rooms[room.name].jobs.workPartJobs!.buildJobs!.data;

        if (filterFunction !== undefined) {
            buildJobs = _.filter(buildJobs, filterFunction);
        }

        return buildJobs;
    }

    /**
     * Get the list of WorkPartJobs.upgradeJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the WorkPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getUpgradeJobs(
        room: Room,
        filterFunction?: (object: WorkPartJob) => boolean,
        forceUpdate?: boolean
    ): WorkPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.workPartJobs ||
            !Memory.rooms[room.name].jobs.workPartJobs!.upgradeJobs ||
            Memory.rooms[room.name].jobs.workPartJobs!.upgradeJobs!.cache < Game.time - UPGRADE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateWorkPart_upgradeJobs(room);
        }

        let upgradeJobs: WorkPartJob[] = Memory.rooms[room.name].jobs.workPartJobs!.upgradeJobs!.data;

        if (filterFunction !== undefined) {
            upgradeJobs = _.filter(upgradeJobs, filterFunction);
        }

        return upgradeJobs;
    }

    /**
     * Get all jobs (in a flatted list) of CarryPartJob.xxx
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the CarryPartJob list
     * @param forceUpdate [Optional] Forcibly invalidate the caches
     */
    public static getAllCarryPartJobs(
        room: Room,
        filterFunction?: (object: CarryPartJob) => boolean,
        forceUpdate?: boolean
    ): CarryPartJob[] {
        const allCarryPartJobs: CarryPartJob[] = [];

        _.forEach(this.getStoreJobs(room, filterFunction, forceUpdate), job => allCarryPartJobs.push(job));
        _.forEach(this.getFillJobs(room, filterFunction, forceUpdate), job => allCarryPartJobs.push(job));

        return allCarryPartJobs;
    }

    /**
     * Get the list of CarryPartJobs.fillJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the CarryPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getFillJobs(
        room: Room,
        filterFunction?: (object: CarryPartJob) => boolean,
        forceUpdate?: boolean
    ): CarryPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.carryPartJobs ||
            !Memory.rooms[room.name].jobs.carryPartJobs!.fillJobs ||
            Memory.rooms[room.name].jobs.carryPartJobs!.fillJobs!.cache < Game.time - FILL_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateCarryPart_fillJobs(room);
        }

        let fillJobs: CarryPartJob[] = Memory.rooms[room.name].jobs.carryPartJobs!.fillJobs!.data;

        if (filterFunction !== undefined) {
            fillJobs = _.filter(fillJobs, filterFunction);
        }

        return fillJobs;
    }

    /**
     * Get the list of CarryPartJobs.storeJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the CarryPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getStoreJobs(
        room: Room,
        filterFunction?: (object: CarryPartJob) => boolean,
        forceUpdate?: boolean
    ): CarryPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs.carryPartJobs ||
            !Memory.rooms[room.name].jobs.carryPartJobs!.storeJobs ||
            Memory.rooms[room.name].jobs.carryPartJobs!.storeJobs!.cache < Game.time - STORE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateCarryPart_storeJobs(room);
        }

        let storeJobs: CarryPartJob[] = Memory.rooms[room.name].jobs.carryPartJobs!.storeJobs!.data;

        if (filterFunction !== undefined) {
            storeJobs = _.filter(storeJobs, filterFunction);
        }

        return storeJobs;
    }
}
