import {
    MemoryHelper,
    MemoryHelper_Room,
    RoomHelper,
    NO_CACHING_MEMORY,
    PRIORITY_REPAIR_THRESHOLD,
    BACKUP_JOB_CACHE_TTL,
    CONSTR_CACHE_TTL,
    CONTAINER_JOB_CACHE_TTL,
    DROPS_CACHE_TTL,
    FCREEP_CACHE_TTL,
    HCREEP_CACHE_TTL,
    LINK_JOB_CACHE_TTL,
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
    ALL_STRUCTURE_TYPES,
    ERROR_ERROR,
    MINERAL_CACHE_TTL,
    UserException,
    RoomApi
} from "utils/internals";

// the api for the memory class
export class MemoryApi {
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
            if (
                !(roomName in Game.rooms) &&
                !MemoryHelper.dependentRoomExists(roomName) &&
                !_.some(Game.creeps, (creep: Creep) => creep.memory.targetRoom === roomName)
            ) {
                delete Memory.rooms[roomName];
            }
        }

        // Remove all dead flags from memory
        for (const flag in Memory.flags) {
            if (!_.some(Game.flags, (flagLoop: Flag) => flagLoop.name === Memory.flags[flag].flagName)) {
                delete Memory.flags[flag];
            }
        }

        // Remove all dead structures from memory
        for (const struct in Memory.structures) {
            if (!Game.getObjectById(struct)) {
                delete Memory.structures[struct];
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
        const allRemoteRooms: RemoteRoomMemory[] = Memory.rooms[room.name].remoteRooms!;
        const nonNullRemoteRooms: RemoteRoomMemory[] = [];

        _.forEach(allRemoteRooms, (rr: RemoteRoomMemory) => {
            if (rr !== null) {
                nonNullRemoteRooms.push(rr);
            }
        });
        Memory.rooms[room.name].remoteRooms = nonNullRemoteRooms;

        // Re-map Remote Room array to remove null values
        const allClaimRooms: ClaimRoomMemory[] = Memory.rooms[room.name].claimRooms!;
        const nonNullClaimRooms: ClaimRoomMemory[] = [];

        _.forEach(allClaimRooms, (rr: ClaimRoomMemory) => {
            if (rr !== null) {
                nonNullClaimRooms.push(rr);
            }
        });
        Memory.rooms[room.name].claimRooms = nonNullClaimRooms;

        // Re-map Remote Room array to remove null values
        const allAttackRooms: AttackRoomMemory[] = Memory.rooms[room.name].attackRooms!;
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
    public static initRoomMemory(roomName: string, isOwnedRoom: boolean): void {
        // You might think of a better way/place to do this, but if we delete a memory structure as a "reset",
        // We want it to be reformed
        // Make sure jobs exist
        if (Memory.rooms[roomName] && !Memory.rooms[roomName].jobs) {
            Memory.rooms[roomName].jobs = {};
        }

        // Abort if Memory already exists
        if (Memory.rooms[roomName]) {
            return;
        }

        // Initialize Memory - Typescript requires it be done this way
        //                    unless we define a constructor for RoomMemory.
        if (isOwnedRoom) {
            Memory.rooms[roomName] = {
                attackRooms: [],
                claimRooms: [],
                constructionSites: { data: null, cache: null },
                creepLimit: {
                    domesticLimits: {
                        miner: 0,
                        harvester: 0,
                        worker: 0,
                        powerUpgrader: 0,
                        lorry: 0
                    },
                    remoteLimits: {
                        remoteMiner: 0,
                        remoteHarvester: 0,
                        remoteReserver: 0,
                        remoteDefender: 0,
                        remoteColonizer: 0,
                        claimer: 0
                    },
                    militaryLimits: []
                },
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
                upgradeLink: "",
                events: []
            };
        } else {
            Memory.rooms[roomName] = {
                structures: { data: null, cache: null },
                sources: { data: null, cache: null },
                minerals: { data: null, cache: null },
                tombstones: { data: null, cache: null },
                droppedResources: { data: null, cache: null },
                constructionSites: { data: null, cache: null },
                defcon: -1,
                hostiles: { data: null, cache: null },
                events: []
            };
        }

        // Only populate out the memory structure if we have vision of the room
        // Extra saftey provided at each helper function, but make sure only visible rooms are being sent anyway
        if (Game.rooms[roomName]) {
            this.getRoomMemory(Game.rooms[roomName], true);
        }
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
        this.getConstructionSites(room.name, undefined, forceUpdate);
        this.getMyCreeps(room.name, undefined, forceUpdate);
        this.getHostileCreeps(room.name, undefined, forceUpdate);
        this.getSources(room.name, undefined, forceUpdate);
        this.getStructures(room.name, undefined, forceUpdate);
        this.getAllGetEnergyJobs(room, undefined, forceUpdate);
        this.getAllClaimPartJobs(room, undefined, forceUpdate);
        this.getAllWorkPartJobs(room, undefined, forceUpdate);
        this.getBunkerCenter(room, forceUpdate);
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
    public static getMyCreeps(
        roomName: string,
        filterFunction?: (object: Creep) => boolean,
        forceUpdate?: boolean
    ): Creep[] {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[roomName].creeps ||
            Memory.rooms[roomName].creeps!.cache < Game.time - FCREEP_CACHE_TTL
        ) {
            MemoryHelper_Room.updateMyCreeps(roomName);
        }

        const creepIDs: string[] = Memory.rooms[roomName].creeps!.data;

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
        roomName: string,
        filterFunction?: (object: Creep) => boolean,
        forceUpdate?: boolean
    ): Creep[] {
        // If we have no vision of the room, return an empty array
        if (!Game.rooms[roomName]) {
            return [];
        }

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[roomName].hostiles ||
            Memory.rooms[roomName].hostiles!.cache < Game.time - HCREEP_CACHE_TTL
        ) {
            MemoryHelper_Room.updateHostileCreeps(roomName);
        }

        const creepIDs: string[] = [];
        // Basically flattening the object in memory here
        _.forEach(Object.keys(Memory.rooms[roomName].hostiles.data), (hostileType: string) => {
            _.forEach(Memory.rooms[roomName].hostiles.data[hostileType], (enemyID: string) => {
                creepIDs.push(enemyID);
            });
        });

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
        roomName: string,
        filterFunction?: (object: Structure) => boolean,
        forceUpdate?: boolean
    ): Structure[] {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[roomName].structures === undefined ||
            Memory.rooms[roomName].structures.cache < Game.time - STRUCT_CACHE_TTL
        ) {
            MemoryHelper_Room.updateStructures(roomName);
        }

        const structureIDs: string[] = [];
        // Flatten the object into an array of IDs
        for (const type in Memory.rooms[roomName].structures.data) {
            const IDs = Memory.rooms[roomName].structures.data[type];
            for (const singleID of IDs) {
                if (singleID) {
                    structureIDs.push(singleID);
                }
            }
        }

        let structures: Structure[] = MemoryHelper.getOnlyObjectsFromIDs<Structure<StructureConstant>>(structureIDs);

        if (filterFunction !== undefined) {
            structures = _.filter(structures, filterFunction);
        }

        return structures;
    }

    /**
     * Get structures of a single type in a room, updating if necessary
     *
     * [Cached] Memory.rooms[room.name].structures
     * @param roomName The room to check in
     * @param type The type of structure to retrieve
     * @param filterFunction [Optional] A function to filter by
     * @param forceUpdate [Optional] Force structures memory to be updated
     * @returns Structure[] An array of structures of a single type
     */
    public static getStructureOfType(
        roomName: string,
        type: StructureConstant,
        filterFunction?: (object: any) => boolean,
        forceUpdate?: boolean
    ): Structure[] {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[roomName].structures === undefined ||
            Memory.rooms[roomName].structures.data === null ||
            Memory.rooms[roomName].structures.data[type] === undefined ||
            Memory.rooms[roomName].structures.cache < Game.time - STRUCT_CACHE_TTL
        ) {
            MemoryHelper_Room.updateStructures(roomName);
        }

        const structureIDs: string[] = Memory.rooms[roomName].structures.data[type];

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
        roomName: string,
        filterFunction?: (object: ConstructionSite) => boolean,
        forceUpdate?: boolean
    ): ConstructionSite[] {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[roomName].constructionSites ||
            Memory.rooms[roomName].constructionSites.cache < Game.time - CONSTR_CACHE_TTL
        ) {
            MemoryHelper_Room.updateConstructionSites(roomName);
        }

        const constructionSiteIDs: string[] = Memory.rooms[roomName].constructionSites.data;

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

    public static getSourceIds(roomName: string): string[] {
        return _.map(Memory.rooms[roomName].sources.data, (sourceMemory: StringMap) => sourceMemory.id);
    }

    /**
     * get sources in the room
     * @param room the room we want sources from
     * @param filterFunction [Optional] The function to filter all source objects
     * @param forceUpdate [Optional] Invalidate cache by force
     * @returns Source[]  An array of sources, if there are any
     */
    public static getSources(
        roomName: string,
        filterFunction?: (object: Source) => boolean,
        forceUpdate?: boolean
    ): Source[] {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[roomName].sources === undefined ||
            Memory.rooms[roomName].sources.cache < Game.time - SOURCE_CACHE_TTL
        ) {
            MemoryHelper_Room.updateSources(roomName);
        }

        const sourceIDs = this.getSourceIds(roomName);

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
        roomName: string,
        filterFunction?: (object: Source) => boolean,
        forceUpdate?: boolean
    ): Mineral[] {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }

        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            Memory.rooms[roomName].minerals === undefined ||
            Memory.rooms[roomName].minerals.cache < Game.time - MINERAL_CACHE_TTL
        ) {
            MemoryHelper_Room.updateMinerals(roomName);
        }

        const sourceIDs = Memory.rooms[roomName].minerals.data;

        let minerals: Mineral[] = MemoryHelper.getOnlyObjectsFromIDs<Mineral>(sourceIDs);

        if (filterFunction !== undefined) {
            minerals = _.filter(minerals, filterFunction);
        }

        return minerals;
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
        filterFunction?: (object: RemoteRoomMemory) => boolean,
        targetRoom?: string
    ): RemoteRoomMemory[] {
        let remoteRooms: RemoteRoomMemory[];

        if (!Memory.rooms[room.name]) {
            return [];
        }
        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: RemoteRoomMemory) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            remoteRooms = _.filter(
                Memory.rooms[room.name].remoteRooms!,
                (roomMemory: RemoteRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            remoteRooms = _.filter(
                Memory.rooms[room.name].remoteRooms!,
                (roomMemory: RemoteRoomMemory) => filterFunction
            );
        }

        if (remoteRooms.length === 0) {
            return [];
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
        filterFunction?: (object: ClaimRoomMemory) => boolean,
        targetRoom?: string
    ): ClaimRoomMemory[] {
        let claimRooms: ClaimRoomMemory[];

        if (!Memory.rooms[room.name]) {
            return [];
        }
        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: ClaimRoomMemory) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            claimRooms = _.filter(
                Memory.rooms[room.name].claimRooms!,
                (roomMemory: ClaimRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            claimRooms = _.filter(Memory.rooms[room.name].claimRooms!, (roomMemory: ClaimRoomMemory) => filterFunction);
        }

        if (claimRooms.length === 0) {
            return [];
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
    ): AttackRoomMemory[] {
        let attackRooms: AttackRoomMemory[];

        if (!Memory.rooms[room.name]) {
            return [];
        }
        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice: Room) => true;
        }

        // TargetRoom parameter provided
        if (targetRoom) {
            attackRooms = _.filter(
                Memory.rooms[room.name].attackRooms!,
                (roomMemory: AttackRoomMemory) => roomMemory.roomName === targetRoom && filterFunction
            );
        } else {
            // No target room provided, just return them all
            attackRooms = _.filter(
                Memory.rooms[room.name].attackRooms!,
                (roomMemory: AttackRoomMemory) => filterFunction
            );
        }

        if (attackRooms.length === 0) {
            return [];
        }

        return attackRooms;
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

        // Return all creeps in that role, excluding those on deaths door
        return _.filter(MemoryApi.getMyCreeps(room.name, filterFunction), (creep: Creep) => {
            if (creep.ticksToLive) {
                return creep.ticksToLive > creep.body.length * 3;
            }
            return false;
        }).length;
    }

    /**
     * get creep limits
     * @param room the room we want the limits for
     */
    public static getCreepLimits(room: Room): CreepLimits {
        // Make sure everything is defined at the memory level
        if (
            !Memory.rooms[room.name].creepLimit ||
            !Memory.rooms[room.name].creepLimit!.domesticLimits ||
            !Memory.rooms[room.name].creepLimit!.remoteLimits ||
            !Memory.rooms[room.name].creepLimit!.militaryLimits
        ) {
            MemoryApi.initCreepLimits(room);
        }
        const creepLimits: CreepLimits = {
            domesticLimits: Memory.rooms[room.name].creepLimit!.domesticLimits,
            remoteLimits: Memory.rooms[room.name].creepLimit!.remoteLimits,
            militaryLimits: Memory.rooms[room.name].creepLimit!.militaryLimits
        };

        return creepLimits;
    }

    /**
     * initilize creep limits in room memory in the case it is not defined
     * @param room the room we are initing the creep memory for
     */
    public static initCreepLimits(room: Room): void {
        Memory.rooms[room.name].creepLimit = {
            domesticLimits: {
                miner: 0,
                harvester: 0,
                worker: 0,
                powerUpgrader: 0,
                lorry: 0
            },
            remoteLimits: {
                remoteMiner: 0,
                remoteHarvester: 0,
                remoteReserver: 0,
                remoteDefender: 0,
                remoteColonizer: 0,
                claimer: 0
            },
            militaryLimits: []
        };
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
        const allFlags: Flag[] = Object.keys(Game.flags).map(function(flagIndex) {
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
        _.forEach(this.getMineralJobs(room, filterFunction, forceUpdate), job => allGetEnergyJobs.push(job));
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
            !Memory.rooms[room.name].jobs!.getEnergyJobs ||
            !Memory.rooms[room.name].jobs!.getEnergyJobs!.sourceJobs ||
            Memory.rooms[room.name].jobs!.getEnergyJobs!.sourceJobs!.cache < Game.time - SOURCE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_sourceJobs(room);
        }

        let sourceJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs!.getEnergyJobs!.sourceJobs!.data;

        if (filterFunction !== undefined) {
            sourceJobs = _.filter(sourceJobs, filterFunction);
        }

        return sourceJobs;
    }

    /**
     * Get the list of GetEnergyJobs.mineralJobs
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the getEnergyjob list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getMineralJobs(
        room: Room,
        filterFunction?: (object: GetEnergyJob) => boolean,
        forceUpdate?: boolean
    ): GetEnergyJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs!.getEnergyJobs ||
            !Memory.rooms[room.name].jobs!.getEnergyJobs!.mineralJobs ||
            Memory.rooms[room.name].jobs!.getEnergyJobs!.mineralJobs!.cache < Game.time - SOURCE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_mineralJobs(room);
        }

        let mineralJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs!.getEnergyJobs!.mineralJobs!.data;

        if (filterFunction !== undefined) {
            mineralJobs = _.filter(mineralJobs, filterFunction);
        }

        return mineralJobs;
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
            !Memory.rooms[room.name].jobs!.getEnergyJobs ||
            !Memory.rooms[room.name].jobs!.getEnergyJobs!.containerJobs ||
            Memory.rooms[room.name].jobs!.getEnergyJobs!.containerJobs!.cache < Game.time - CONTAINER_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_containerJobs(room);
        }

        let containerJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs!.getEnergyJobs!.containerJobs!.data;

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
            !Memory.rooms[room.name].jobs!.getEnergyJobs ||
            !Memory.rooms[room.name].jobs!.getEnergyJobs!.linkJobs ||
            Memory.rooms[room.name].jobs!.getEnergyJobs!.linkJobs!.cache < Game.time - LINK_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_linkJobs(room);
        }

        let linkJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs!.getEnergyJobs!.sourceJobs!.data;

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
            !Memory.rooms[room.name].jobs!.getEnergyJobs ||
            !Memory.rooms[room.name].jobs!.getEnergyJobs!.backupStructures ||
            Memory.rooms[room.name].jobs!.getEnergyJobs!.backupStructures!.cache < Game.time - BACKUP_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_backupStructuresJobs(room);
        }

        let backupStructureJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs!.getEnergyJobs!.backupStructures!.data;

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
            !Memory.rooms[room.name].jobs!.getEnergyJobs ||
            !Memory.rooms[room.name].jobs!.getEnergyJobs!.pickupJobs ||
            Memory.rooms[room.name].jobs!.getEnergyJobs!.pickupJobs!.cache < Game.time - PICKUP_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateGetEnergy_pickupJobs(room);
        }

        let pickupJobs: GetEnergyJob[] = Memory.rooms[room.name].jobs!.getEnergyJobs!.pickupJobs!.data;

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
            !Memory.rooms[room.name].jobs!.claimPartJobs ||
            !Memory.rooms[room.name].jobs!.claimPartJobs!.claimJobs ||
            Memory.rooms[room.name].jobs!.claimPartJobs!.claimJobs!.cache < Game.time - CLAIM_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_claimJobs(room);
        }

        let claimJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs!.claimPartJobs!.claimJobs!.data;

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
            !Memory.rooms[room.name].jobs!.claimPartJobs ||
            !Memory.rooms[room.name].jobs!.claimPartJobs!.reserveJobs ||
            Memory.rooms[room.name].jobs!.claimPartJobs!.reserveJobs!.cache < Game.time - RESERVE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_reserveJobs(room);
        }

        let claimJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs!.claimPartJobs!.reserveJobs!.data;

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
            !Memory.rooms[room.name].jobs!.claimPartJobs ||
            !Memory.rooms[room.name].jobs!.claimPartJobs!.signJobs ||
            Memory.rooms[room.name].jobs!.claimPartJobs!.signJobs!.cache < Game.time - SIGN_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_signJobs(room);
        }

        let signJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs!.claimPartJobs!.signJobs!.data;

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
            !Memory.rooms[room.name].jobs!.claimPartJobs ||
            !Memory.rooms[room.name].jobs!.claimPartJobs!.attackJobs ||
            Memory.rooms[room.name].jobs!.claimPartJobs!.attackJobs!.cache < Game.time - ATTACK_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateClaimPart_controllerAttackJobs(room);
        }

        let attackJobs: ClaimPartJob[] = Memory.rooms[room.name].jobs!.claimPartJobs!.attackJobs!.data;

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
            !Memory.rooms[room.name].jobs!.workPartJobs ||
            !Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs ||
            Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs!.cache < Game.time - REPAIR_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateWorkPart_repairJobs(room);
        }

        let repairJobs: WorkPartJob[] = Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs!.data;

        if (filterFunction !== undefined) {
            repairJobs = _.filter(repairJobs, filterFunction);
        }

        return repairJobs;
    }

    /**
     * Get the list of WorkPartJobs.repairJobs where hp% < config:PRIORITY_REPAIR_THRESHOLD
     * @param room The room to get the jobs from
     * @param filterFunction [Optional] A function to filter the WorkPartJobs list
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    public static getPriorityRepairJobs(
        room: Room,
        filterFunction?: (object: WorkPartJob) => boolean,
        forceUpdate?: boolean
    ): WorkPartJob[] {
        if (
            NO_CACHING_MEMORY ||
            forceUpdate ||
            !Memory.rooms[room.name].jobs!.workPartJobs ||
            !Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs ||
            Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs!.cache < Game.time - REPAIR_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateWorkPart_repairJobs(room);
        }

        // Get only priority jobs
        let repairJobs: WorkPartJob[] = Memory.rooms[room.name].jobs!.workPartJobs!.repairJobs!.data;
        repairJobs = _.filter(repairJobs, (job: WorkPartJob) => {
            const obj = Game.getObjectById(job.targetID) as Structure<StructureConstant> | null;
            if (obj == null) {
                return false;
            }

            if (obj.structureType !== STRUCTURE_WALL && obj.structureType !== STRUCTURE_RAMPART) {
                return obj.hits < obj.hitsMax * PRIORITY_REPAIR_THRESHOLD;
            } else {
                return obj.hits < RoomApi.getWallHpLimit(room) * PRIORITY_REPAIR_THRESHOLD;
            }
        });

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
            !Memory.rooms[room.name].jobs!.workPartJobs ||
            !Memory.rooms[room.name].jobs!.workPartJobs!.buildJobs ||
            Memory.rooms[room.name].jobs!.workPartJobs!.buildJobs!.cache < Game.time - BUILD_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateWorkPart_buildJobs(room);
        }

        let buildJobs: WorkPartJob[] = Memory.rooms[room.name].jobs!.workPartJobs!.buildJobs!.data;

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
            !Memory.rooms[room.name].jobs!.workPartJobs ||
            !Memory.rooms[room.name].jobs!.workPartJobs!.upgradeJobs ||
            Memory.rooms[room.name].jobs!.workPartJobs!.upgradeJobs!.cache < Game.time - UPGRADE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateWorkPart_upgradeJobs(room);
        }

        let upgradeJobs: WorkPartJob[] = Memory.rooms[room.name].jobs!.workPartJobs!.upgradeJobs!.data;

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
            !Memory.rooms[room.name].jobs!.carryPartJobs ||
            !Memory.rooms[room.name].jobs!.carryPartJobs!.fillJobs ||
            Memory.rooms[room.name].jobs!.carryPartJobs!.fillJobs!.cache < Game.time - FILL_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateCarryPart_fillJobs(room);
        }

        let fillJobs: CarryPartJob[] = Memory.rooms[room.name].jobs!.carryPartJobs!.fillJobs!.data;

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
            !Memory.rooms[room.name].jobs!.carryPartJobs ||
            !Memory.rooms[room.name].jobs!.carryPartJobs!.storeJobs ||
            Memory.rooms[room.name].jobs!.carryPartJobs!.storeJobs!.cache < Game.time - STORE_JOB_CACHE_TTL
        ) {
            MemoryHelper_Room.updateCarryPart_storeJobs(room);
        }

        let storeJobs: CarryPartJob[] = Memory.rooms[room.name].jobs!.carryPartJobs!.storeJobs!.data;

        if (filterFunction !== undefined) {
            storeJobs = _.filter(storeJobs, filterFunction);
        }

        return storeJobs;
    }

    /**
     * get all creeps in a specific squad given the squad uuid
     * @param squadUUID the id for the squad
     */
    public static getCreepsInSquad(roomName: string, squadUUID: number): Creep[] | null {
        return MemoryApi.getMyCreeps(roomName, (creep: Creep) => {
            const currentCreepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
            if (!currentCreepOptions.squadUUID) {
                return false;
            }
            return currentCreepOptions.squadUUID === squadUUID;
        });
    }

    /**
     * Updates the job value in memory to deprecate resources or mark the job as taken
     */
    public static updateJobMemory(creep: Creep, room: Room): void {
        // make sure creep has a job
        if (creep.memory.job === undefined) {
            throw new UserException(
                "Error in updateJobMemory",
                "Attempted to updateJobMemory using a creep with no job.",
                ERROR_ERROR
            );
        }
        // make sure room has a jobs property
        if (room.memory.jobs === undefined) {
            throw new UserException(
                "Error in updateJobMemory",
                "The room memory to update does not have a jobs property",
                ERROR_ERROR
            );
        }

        const creepJob: BaseJob = creep.memory.job!;
        let roomJob: BaseJob | undefined;

        // Assign room job to the room in memory
        switch (creepJob!.jobType) {
            case "carryPartJob":
                roomJob = this.searchCarryPartJobs(creepJob as CarryPartJob, room);
                break;
            case "claimPartJob":
                roomJob = this.searchClaimPartJobs(creepJob as ClaimPartJob, room);
                break;
            case "getEnergyJob":
                roomJob = this.searchGetEnergyJobs(creepJob as GetEnergyJob, room);
                break;
            case "workPartJob":
                roomJob = this.searchWorkPartJobs(creepJob as WorkPartJob, room);
                break;
            case "movePartJob":
                // We don't need to do anything with movePartJobs, so return early
                return;
            default:
                throw new UserException(
                    "Error in updateJobMemory",
                    "Creep has a job with an undefined jobType",
                    ERROR_ERROR
                );
        }

        if (roomJob === undefined) {
            throw new UserException(
                "Error in updateJobMemory",
                "Could not find the job in room memory to update." +
                    "\nCreep: " +
                    creep.name +
                    "\nJob: " +
                    JSON.stringify(creep.memory.job),
                ERROR_ERROR
            );
        }

        // We have the roomJob location in memory
        // now we just need to update the value based on the type of job

        switch (creepJob!.jobType) {
            case "carryPartJob":
                this.updateCarryPartJob(roomJob as CarryPartJob, creep);
                break;
            case "claimPartJob":
                this.updateClaimPartJob(roomJob as ClaimPartJob, creep);
                break;
            case "getEnergyJob":
                this.updateGetEnergyJob(roomJob as GetEnergyJob, creep);
                break;
            case "workPartJob":
                this.updateWorkPartJob(roomJob as WorkPartJob, creep);
                break;
            default:
                throw new UserException(
                    "Error in updateJobMemory",
                    "Creep has a job with an undefined jobType",
                    ERROR_ERROR
                );
        }
    }

    /**
     * Searches through claimPartJobs to find a specified job
     * @param job THe job to serach for
     * @param room The room to search in
     */
    public static searchClaimPartJobs(job: ClaimPartJob, room: Room): ClaimPartJob | undefined {
        if (room.memory.jobs!.claimPartJobs === undefined) {
            throw new UserException(
                "Error in searchClaimPartJobs",
                "The room memory does not have a claimPartJobs property",
                ERROR_ERROR
            );
        }

        const jobListing = room.memory.jobs!.claimPartJobs!;

        let roomJob: ClaimPartJob | undefined;

        if (jobListing.claimJobs) {
            roomJob = _.find(jobListing.claimJobs.data, (claimJob: ClaimPartJob) => job.targetID === claimJob.targetID);
        }

        if (roomJob === undefined && jobListing.reserveJobs) {
            roomJob = _.find(
                jobListing.reserveJobs.data,
                (reserveJob: ClaimPartJob) => job.targetID === reserveJob.targetID
            );
        }

        if (roomJob === undefined && jobListing.signJobs) {
            roomJob = _.find(jobListing.signJobs.data, (signJob: ClaimPartJob) => job.targetID === signJob.targetID);
        }

        return roomJob;
    }

    /**
     * Searches through carryPartJobs to find a specified job
     * @param job The job to search for
     * @param room The room to search in
     */
    public static searchCarryPartJobs(job: CarryPartJob, room: Room): CarryPartJob | undefined {
        if (room.memory.jobs!.carryPartJobs === undefined) {
            throw new UserException(
                "Error in searchCarryPartJobs",
                "The room memory does not have a carryPartJobs property",
                ERROR_ERROR
            );
        }

        const jobListing = room.memory.jobs!.carryPartJobs!;

        let roomJob: CarryPartJob | undefined;

        if (jobListing.fillJobs) {
            roomJob = _.find(jobListing.fillJobs.data, (fillJob: CarryPartJob) => job.targetID === fillJob.targetID);
        }

        if (roomJob === undefined && jobListing.storeJobs) {
            roomJob = _.find(jobListing.storeJobs.data, (storeJob: CarryPartJob) => job.targetID === storeJob.targetID);
        }

        return roomJob;
    }

    /**
     * Searches through workPartJobs to find a specified job
     * @param job The job to search for
     * @param room The room to search in
     */
    public static searchWorkPartJobs(job: WorkPartJob, room: Room): WorkPartJob | undefined {
        if (room.memory.jobs!.workPartJobs === undefined) {
            throw new UserException(
                "Error in workPartJobs",
                "THe room memory does not have a workPartJobs property",
                ERROR_ERROR
            );
        }

        const jobListing = room.memory.jobs!.workPartJobs!;

        let roomJob: WorkPartJob | undefined;

        if (jobListing.upgradeJobs) {
            roomJob = _.find(jobListing.upgradeJobs.data, (uJob: WorkPartJob) => job.targetID === uJob.targetID);
        }

        if (roomJob === undefined && jobListing.buildJobs) {
            roomJob = _.find(jobListing.buildJobs.data, (buildJob: WorkPartJob) => job.targetID === buildJob.targetID);
        }

        if (roomJob === undefined && jobListing.repairJobs) {
            roomJob = _.find(jobListing.repairJobs.data, (rJob: WorkPartJob) => job.targetID === rJob.targetID);
        }

        return roomJob;
    }

    /**
     * Searches through getEnergyJobs to find a specified job
     * @param job THe job to search for
     * @param room THe room to search in
     */
    public static searchGetEnergyJobs(job: GetEnergyJob, room: Room): GetEnergyJob | undefined {
        if (room.memory.jobs!.getEnergyJobs === undefined) {
            throw new UserException(
                "Error in searchGetEnergyJobs",
                "The room memory does not have a getEnergyJobs property",
                ERROR_ERROR
            );
        }

        const jobListing = room.memory.jobs!.getEnergyJobs!;

        let roomJob: GetEnergyJob | undefined;

        if (jobListing.containerJobs) {
            roomJob = _.find(jobListing.containerJobs.data, (cJob: GetEnergyJob) => cJob.targetID === job.targetID);
        }

        if (roomJob === undefined && jobListing.sourceJobs) {
            roomJob = _.find(jobListing.sourceJobs!.data, (sJob: GetEnergyJob) => sJob.targetID === job.targetID);
        }

        if (roomJob === undefined && jobListing.pickupJobs) {
            roomJob = _.find(jobListing.pickupJobs!.data, (pJob: GetEnergyJob) => pJob.targetID === job.targetID);
        }

        if (roomJob === undefined && jobListing.backupStructures) {
            roomJob = _.find(jobListing.backupStructures!.data, (sJob: GetEnergyJob) => sJob.targetID === job.targetID);
        }

        if (roomJob === undefined && jobListing.linkJobs) {
            roomJob = _.find(jobListing.linkJobs!.data, (lJob: GetEnergyJob) => lJob.targetID === job.targetID);
        }

        if (roomJob === undefined && jobListing.tombstoneJobs) {
            roomJob = _.find(jobListing.tombstoneJobs!.data, (tJob: GetEnergyJob) => tJob.targetID === job.targetID);
        }

        return roomJob;
    }

    /**
     * Updates the CarryPartJob
     * @param job The Job to update
     */
    public static updateCarryPartJob(job: CarryPartJob, creep: Creep): void {
        if (job.actionType === "transfer") {
            job.remaining -= creep.carry.energy;

            if (job.remaining <= 0) {
                job.isTaken = true;
            }
        }

        return;
    }

    /**
     * Updates the ClaimPartJob
     * @param job The Job to update
     */
    public static updateClaimPartJob(job: ClaimPartJob, creep: Creep): void {
        if (job.targetType === STRUCTURE_CONTROLLER) {
            job.isTaken = true;
            return;
        }

        if (job.targetType === "roomName") {
            job.isTaken = true;
            return;
        }
    }
    /**
     * Updates the getEnergyJob
     * @param job The Job to update
     */
    public static updateGetEnergyJob(job: GetEnergyJob, creep: Creep): void {
        if (job.targetType === "source") {
            // Subtract creep effective mining capacity from resources
            job.resources.energy -= creep.getActiveBodyparts(WORK) * 2 * 300;

            if (job.resources.energy <= 0) {
                job.isTaken = true;
            }

            return;
        }

        if (
            job.targetType === "droppedResource" ||
            job.targetType === "link" ||
            job.targetType === "container" ||
            job.targetType === "storage" ||
            job.targetType === "terminal"
        ) {
            // Subtract creep carry from resources
            job.resources.energy -= creep.carryCapacity;

            if (job.resources.energy <= 0) {
                job.isTaken = true;
            }

            return;
        }
    }

    /**
     * Updates the workPartJob
     * @param job The job to update
     */
    public static updateWorkPartJob(job: WorkPartJob, creep: Creep): void {
        if (job.targetType === "constructionSite") {
            // Creep builds 5 points/part/tick at 1 energy/point
            job.remaining -= creep.carry.energy; // 1 to 1 ratio of energy to points built

            if (job.remaining <= 0) {
                job.isTaken = true;
            }

            return;
        }

        if (job.targetType === STRUCTURE_CONTROLLER) {
            // Upgrade at a 1 to 1 ratio
            job.remaining -= creep.carry.energy;
            // * Do nothing really - Job will never be taken
            // Could optionally mark something on the job to show that we have 1 worker upgrading already
            return;
        }

        if (job.targetType in ALL_STRUCTURE_TYPES) {
            // Repair 20 hits/part/tick at .1 energy/hit rounded up to nearest whole number
            job.remaining -= Math.ceil(creep.carry.energy * 0.1);

            if (job.remaining <= 0) {
                job.isTaken = true;
            }

            return;
        }
    }

    /**
     * get all visible dependent rooms
     */
    public static getVisibleDependentRooms(): Room[] {
        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();
        const roomNames: string[] = [];
        _.forEach(ownedRooms, (room: Room) => {
            // Collect the room names for dependent rooms
            _.forEach(MemoryApi.getRemoteRooms(room), (rr: RemoteRoomMemory) => roomNames.push(rr.roomName));

            _.forEach(MemoryApi.getClaimRooms(room), (rr: ClaimRoomMemory) => roomNames.push(rr.roomName));
        });

        // Return all visible rooms which appear in roomNames array
        return _.filter(Game.rooms, (room: Room) => roomNames.includes(room.name));
    }

    /**
     * create a message node to display as an alert
     * @param message the message you want displayed
     * @param expirationLimit the time you want it to be displayed for
     */
    public static createEmpireAlertNode(displayMessage: string, limit: number): void {
        if (!Memory.empire.alertMessages) {
            Memory.empire.alertMessages = [];
        }
        const messageNode: AlertMessageNode = {
            message: displayMessage,
            tickCreated: Game.time,
            expirationLimit: limit
        };
        Memory.empire.alertMessages.push(messageNode);
    }

    /**
     * scan over all creeps in the room and verify their jobs.
     * Remove any unverified jobs
     * @param roomName the room we are scanning for
     */
    public static cleanCreepDeadJobsMemory(roomName: string): void {
        const creepsInRoomWhoAreHustling: Creep[] = this.getMyCreeps(
            roomName,
            (creep: Creep) => creep.memory.job !== undefined
        );

        for (const hustler of creepsInRoomWhoAreHustling) {
            const job: BaseJob = hustler.memory.job!;
            if (!RoomHelper.verifyObjectByID(job.targetID)) {
                delete hustler.memory.job;
            }
        }
    }

    /**
     * Get all attack flag memory objects associated with the host room
     * @param hostRoomName the host room we are getting the memory from
     * @returns an array of attack flag memory
     */
    public static getAllAttackFlagMemoryForHost(hostRoomName: string): AttackFlagMemory[] {
        const hostRoom: Room = Game.rooms[hostRoomName];
        const attackRooms: AttackRoomMemory[] = this.getAttackRooms(hostRoom);
        const attackRoomFlags: AttackFlagMemory[] = [];
        for (const attackRoom of attackRooms) {
            if (!attackRoom) {
                continue;
            }
            for (const attackFlag of attackRoom.flags) {
                if (attackFlag) {
                    attackRoomFlags.push(attackFlag as AttackFlagMemory);
                }
            }
        }
        return attackRoomFlags;
    }

    /**
     * Get the center of the bunker
     * @param room the room we are in
     * @param forceUpdate boolean representing if we need to update this
     * @returns the room position of the center of the room
     */
    public static getBunkerCenter(room: Room, forceUpdate?: boolean): RoomPosition {
        if (forceUpdate || !room.memory.bunkerCenter) {
            MemoryHelper_Room.updateBunkerCenter(room);
        }

        return room.memory.bunkerCenter!;
    }

    /**
     * Get the creep count split up by role : count pairs
     * @param room the room we are in
     */
    public static getAllCreepCount(room: Room): AllCreepCount {
        const creepsInRoom: Creep[] = this.getMyCreeps(room.name);
        const allCreepCount: AllCreepCount = MemoryHelper.generateDefaultAllCreepCountObject();

        // sum up the number of each role we come across
        for (const creep of creepsInRoom) {
            allCreepCount[creep.memory.role] = allCreepCount[creep.memory.role] + 1;
        }
        return allCreepCount;
    }
}
