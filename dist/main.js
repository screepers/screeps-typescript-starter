'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// empire-wide manager
class EmpireManager {
    /**
     * run the empire for the AI
     */
    static runEmpireManager() {
        console.log("running empire");
    }
}
//# sourceMappingURL=EmpireManager.js.map

// Room State Constants
const ROOM_STATE_INTRO = 0;
const ROOM_STATE_BEGINNER = 1;
const ROOM_STATE_INTER = 2;
const ROOM_STATE_ADVANCED = 3;
const ROOM_STATE_UPGRADER = 4;
const ROOM_STATE_SEIGE = 5;
const ROOM_STATE_STIMULATE = 6;
// Role Constants
const ROLE_MINER = "miner";
const ROLE_HARVESTER = "harvester";
const ROLE_WORKER = "worker";
const ROLE_POWER_UPGRADER = "powerUpgrader";
const ROLE_LORRY = "lorry";
const ROLE_REMOTE_MINER = "remoteMiner";
const ROLE_REMOTE_HARVESTER = "remoteHarvester";
const ROLE_REMOTE_RESERVER = "remoteReserver";
const ROLE_REMOTE_DEFENDER = "remoteDefender";
const ROLE_COLONIZER = "remoteColonizer";
const ROLE_ZEALOT = "zealot";
const ROLE_STALKER = "stalker";
const ROLE_MEDIC = "medic";
// Tier Constants
const TIER_1 = 300;
const TIER_2 = 550;
const TIER_3 = 800;
const TIER_4 = 1300;
const TIER_5 = 1800;
const TIER_6 = 2300;
const TIER_7 = 5300;
const TIER_8 = 12300;
// Creep Body Layout Constants
const GROUPED = "grouped";
const COLLATED = "collated";
// Role Priority List
// * Keep this list ordered by spawn priority
const domesticRolePriority = [
    ROLE_MINER,
    ROLE_HARVESTER,
    ROLE_WORKER,
    ROLE_POWER_UPGRADER,
    ROLE_LORRY
];
// * Keep this list ordered by spawn priority
const remoteRolePriority = [
    ROLE_REMOTE_RESERVER,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_HARVESTER,
    ROLE_REMOTE_DEFENDER,
    ROLE_COLONIZER
];
// * Keep this list ordered by spawn priority
const militaryRolePriority = [ROLE_MEDIC, ROLE_STALKER, ROLE_ZEALOT];
// List of every structure in the game
const ALL_STRUCTURE_TYPES = [
    STRUCTURE_EXTENSION,
    STRUCTURE_RAMPART,
    STRUCTURE_ROAD,
    STRUCTURE_SPAWN,
    STRUCTURE_LINK,
    STRUCTURE_WALL,
    STRUCTURE_STORAGE,
    STRUCTURE_TOWER,
    STRUCTURE_OBSERVER,
    STRUCTURE_POWER_SPAWN,
    STRUCTURE_EXTRACTOR,
    STRUCTURE_LAB,
    STRUCTURE_TERMINAL,
    STRUCTURE_CONTAINER,
    STRUCTURE_NUKER,
    STRUCTURE_KEEPER_LAIR,
    STRUCTURE_CONTROLLER,
    STRUCTURE_POWER_BANK,
    STRUCTURE_PORTAL
];
// The Wall/Rampart HP Limit for each Controller level
const WALL_LIMIT = [
    0,
    25000,
    50000,
    100000,
    250000,
    500000,
    1000000,
    1500000,
    5000000 // RCL 8
];
// Cache Tick Limits
const STRUCT_CACHE_TTL = 50; // Structures
const SOURCE_CACHE_TTL = -1; // Sources
const CONSTR_CACHE_TTL = 50; // Construction Sites
const FCREEP_CACHE_TTL = 20; // Friendly Creep
const HCREEP_CACHE_TTL = 1; // Hostile Creep
// ? Should we change DEPNDT to be 3 seperate consts? Attack, Remote, Claim?
const DEPNDT_CACHE_TTL = 50; // Dependent Rooms - Attack, Remote, Claim
//# sourceMappingURL=Constants.js.map

/**
 * Contains all functions for initializing and updating room memory
 */
class MemoryHelper_Room {
    /**
     * Calls all the helper functions (that don't need additional input) to update room.memory.
     * NOTE: This will update the entire memory tree, so use this function sparingly
     * TODO Make sure this updates every aspect of room memory - currently does not
     * @param room The room to update the memory of
     */
    static updateRoomMemory(room) {
        // Update All Creeps
        this.updateHostileCreeps(room);
        this.updateMyCreeps(room);
        // Update structures/construction sites
        this.updateConstructionSites(room);
        this.updateStructures(room);
        // Update sources, minerals, energy, tombstones
        this.updateSources(room);
        this.updateMinerals(room);
        this.updateDroppedEnergy(room);
        this.updateTombstones(room);
        // Update Custom Memory Components
        this.updateDependentRooms(room);
    }
    /**
     * Update room memory for all dependent room types
     * TODO Implement this function - Decide how we plan to do it
     * @param room The room to update the dependencies of
     */
    static updateDependentRooms(room) {
        // Cycle through all flags and check for any claim rooms or remote rooms
        // ? Should we check for the closest main room?
        // ? I have an idea of a system where we plant a remoteFlag/claimFlag
        // ? and then we place a different colored flag in the room that we want
        // ? to assign that remote/claim room to. Once the program detects the assignment flag
        // ? and the room it assigns to, it removes the assignment flag and could optionally remove
        // ? the remoteFlag as well (but I think it would be more clear to leave the flag in the room)
    }
    /**
     * Find all hostile creeps in room
     * TODO Check for boosted creeps
     * [Cached] Room.memory.hostiles
     * @param room The Room to update
     */
    static updateHostileCreeps(room) {
        Memory.rooms[room.name].hostiles = { data: { ranged: [], melee: [], heal: [], boosted: [] }, cache: null };
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        // Sort creeps into categories
        _.forEach(enemies, (enemy) => {
            // * Check for boosted creeps and put them at the front of the if else stack
            if (enemy.getActiveBodyparts(HEAL) > 0) {
                Memory.rooms[room.name].hostiles.data.heal.push(enemy.id);
            }
            else if (enemy.getActiveBodyparts(RANGED_ATTACK) > 0) {
                Memory.rooms[room.name].hostiles.data.ranged.push(enemy.id);
            }
            else if (enemy.getActiveBodyparts(ATTACK) > 0) {
                Memory.rooms[room.name].hostiles.data.melee.push(enemy.id);
            }
        });
        Memory.rooms[room.name].hostiles.cache = Game.time;
    }
    /**
     * Find all owned creeps in room
     * ? Should we filter these by role into memory? E.g. creeps.data.miners
     * [Cached] Room.memory.creeps
     * @param room The Room we are checking in
     */
    static updateMyCreeps(room) {
        Memory.rooms[room.name].creeps = { data: null, cache: null };
        const creeps = room.find(FIND_MY_CREEPS);
        Memory.rooms[room.name].creeps.data = _.map(creeps, (creep) => creep.id);
        Memory.rooms[room.name].creeps.cache = Game.time;
    }
    /**
     * Find all construction sites in room
     *
     * [Cached] Room.memory.constructionSites
     * @param room The Room we are checking in
     */
    static updateConstructionSites(room) {
        Memory.rooms[room.name].constructionSites = { data: null, cache: null };
        const constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        Memory.rooms[room.name].constructionSites.data = _.map(constructionSites, (c) => c.id);
        Memory.rooms[room.name].constructionSites.cache = Game.time;
    }
    /**
     * Find all structures in room
     *
     * [Cached] Room.memory.structures
     * @param room The Room we are checking in
     */
    static updateStructures(room) {
        Memory.rooms[room.name].structures = { data: {}, cache: null };
        const allStructures = room.find(FIND_STRUCTURES);
        const sortedStructureIDs = {};
        // For each structureType, remove the structures from allStructures and map them to ids in the memory object.
        _.forEach(ALL_STRUCTURE_TYPES, (type) => {
            sortedStructureIDs[type] = _.map(_.remove(allStructures, (struct) => struct.structureType === type), (struct) => struct.id);
        });
        Memory.rooms[room.name].structures.data = sortedStructureIDs;
        Memory.rooms[room.name].structures.cache = Game.time;
    }
    /**
     * Find all sources in room
     *
     * [Cached] Room.memory.sources
     * @param room The room to check in
     */
    static updateSources(room) {
        Memory.rooms[room.name].sources = { data: {}, cache: null };
        const sources = room.find(FIND_SOURCES);
        Memory.rooms[room.name].sources.data = _.map(sources, (source) => source.id);
        Memory.rooms[room.name].sources.cache = Infinity;
    }
    /**
     * Find all sources in room
     *
     * [Cached] Room.memory.sources
     * @param room The room to check in
     */
    static updateMinerals(room) {
        // TODO Fill this out
    }
    /**
     * Finds all tombstones in room
     *
     * @param room The room to check in
     */
    static updateTombstones(room) {
        // TODO Fill this out
    }
    /**
     * Find all dropped energy in a room
     *
     * @param room The room to check in
     */
    static updateDroppedEnergy(room) {
        // TODO Fill this out
    }
    /**
     * update the room state
     * @param room the room we are updating
     * @param stateConst the state we are applying to the room
     */
    static updateRoomState(room, stateConst) {
        Memory.rooms[room.name].roomState = stateConst;
        return;
    }
    /**
     * update the room defcon
     * @param room the room we are updating
     * @param stateConst the defcon we are applying to the room
     */
    static updateDefcon(room, defconLevel) {
        Memory.rooms[room.name].defcon = defconLevel;
        return;
    }
    /**
     * update creep limits for domestic creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    static updateDomesticLimits(room, newLimits) {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit["domesticLimits"] = newLimits;
    }
    /**
     * update creep limits for remote creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    static updateRemoteLimits(room, newLimits) {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit["remoteLimits"] = newLimits;
    }
    /**
     * update creep limits for military creeps
     * @param room room we are updating limits for
     * @param newLimits new limits we are setting
     */
    static updateMilitaryLimits(room, newLimits) {
        // * Optionally apply a filter or otherwise check the limits before assigning them
        Memory.rooms[room.name].creepLimit["militaryLimits"] = newLimits;
    }
}

/**
 * Settings to customize code performance
 */
//# sourceMappingURL=config.js.map

// the api for the memory class
class MemoryApi {
    /**
     * Remove all memory objects that are dead
     */
    static garbageCollection() {
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
    static initRoomMemory(room) {
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
    static getRoomMemory(room, forceUpdate) {
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
    static initCreepMemory(creep, creepRole, creepHomeRoom, creepOptions, creepTargetRoom) {
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
    static getMyCreeps(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].creeps ||
            Memory.rooms[room.name].creeps.cache < Game.time - FCREEP_CACHE_TTL) {
            MemoryHelper_Room.updateMyCreeps(room);
        }
        let creeps = _.map(Memory.rooms[room.name].creeps.data, (id) => Game.getObjectById(id));
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
    static getHostileCreeps(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].hostiles ||
            Memory.rooms[room.name].creeps.cache < Game.time - HCREEP_CACHE_TTL) {
            MemoryHelper_Room.updateHostileCreeps(room);
        }
        let creeps = _.map(Memory.rooms[room.name].hostiles.data, (id) => Game.getObjectById(id));
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
    static getStructures(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL) {
            MemoryHelper_Room.updateStructures(room);
        }
        let structures = [];
        _.forEach(Memory.rooms[room.name].structures.data, (typeArray) => {
            _.forEach(typeArray, (id) => {
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
    static getStructureOfType(room, type, filterFunction, forceUpdate) {
        if (forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.data[type] === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL) {
            MemoryHelper_Room.updateStructures(room);
        }
        let structures = _.map(Memory.rooms[room.name].structures.data[type], (id) => Game.getObjectById(id));
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
    static getConstructionSites(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].constructionSites ||
            Memory.rooms[room.name].constructionSites.cache < Game.time - CONSTR_CACHE_TTL) {
            MemoryHelper_Room.updateConstructionSites(room);
        }
        let constructionSites = _.map(Memory.rooms[room.name].constructionSites.data, (id) => Game.getObjectById(id));
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
    static getTombstones(room, filterFunction, forceUpdate) {
        // TODO Fill this out for Room.Api.CreateEnergyQueue
        return [null];
    }
    /**
     * Returns a list of the energy objects in a room, updating if necessary
     *
     * @param room The room we want to look in
     * @param filterFunction [Optional] The function to filter the energy objects
     * @param forceUpdate [Optional] Invalidate Cache by force
     * @returns Array<RESOURCE_ENERGY | null> An array of dropped energy, if there are any
     */
    static getDroppedEnergy(room, filterFunction, forceUpdate) {
        // TODO Fill this out for Room.Api.CreateEnergyQueue
        return [null];
    }
    /**
     * get sources in the room
     * @param room the room we want sources from
     * @param filterFunction [Optional] The function to filter all source objects
     * @param forceUpdate [Optional] Invalidate cache by force
     * @returns Array<Source | null> An array of sources, if there are any
     */
    static getSources(room, filterFunction, forceUpdate) {
        let sources;
        if (forceUpdate ||
            Memory.rooms[room.name].sources === undefined ||
            Memory.rooms[room.name].sources.cache < Game.time - SOURCE_CACHE_TTL) {
            MemoryHelper_Room.updateSources(room);
        }
        sources = _.map(Memory.rooms[room.name].sources.data, (id) => Game.getObjectById(id));
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
    static getMinerals(room, filterFunction, forceUpdate) {
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
     */
    static getRemoteRooms(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            Memory.rooms[room.name].remoteRooms === undefined ||
            Memory.rooms[room.name].remoteRooms.cache < Game.time - DEPNDT_CACHE_TTL) {
            // ! Not implemented yet - Empty function
            MemoryHelper_Room.updateDependentRooms(room);
        }
        const remoteRooms = _.map(Memory.rooms[room.name].remoteRooms.data, (name) => Game.rooms[name]);
        return remoteRooms;
    }
    /**
     * Get the claimRoom objects
     *
     * Updates all dependencies if the cache is invalid
     * @param room The room to check the dependencies of
     * @param filterFunction [Optional] THe function to filter the room objects
     * @param forceUpdate [Optional] Forcibly invalidate the cache
     */
    static getClaimRooms(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            Memory.rooms[room.name].remoteRooms === undefined ||
            Memory.rooms[room.name].claimRooms.cache < Game.time - DEPNDT_CACHE_TTL) {
            // ! Not implemented yet - Empty function
            MemoryHelper_Room.updateDependentRooms(room);
        }
        const claimRooms = _.map(Memory.rooms[room.name].claimRooms.data, (name) => Game.rooms[name]);
        return claimRooms;
    }
    static getAttackRooms(room, filterFUnction, forceUpdate) {
        if (forceUpdate ||
            Memory.rooms[room.name].attackRooms === undefined ||
            Memory.rooms[room.name].attackRooms.cache < Game.time - DEPNDT_CACHE_TTL) {
            // ! Not implemented yet - Empty Function
            MemoryHelper_Room.updateDependentRooms(room);
        }
        const attackRooms = _.map(Memory.rooms[room.name].attackRooms.data, (name) => Game.rooms[name]);
        return attackRooms;
    }
}
//# sourceMappingURL=Memory.Api.js.map

// @ts-ignore
// manager for the memory of the empire
class MemoryManager {
    /**
     * run the memory for the AI
     */
    static runMemoryManager() {
        MemoryApi.garbageCollection();
        // Should we check for owned rooms here so we don't run memory on rooms we are just passing through?
        // Example code provided
        /*
            const ownedRooms = _.filter(Game.rooms, (room: Room) => RoomHelper.isOwnedRoom(room));

            _.forEach(ownedRooms, (room: Room) => {
                MemoryApi.initRoomMemory(room);
            });
        */
        _.forEach(Game.rooms, (room) => {
            MemoryApi.initRoomMemory(room);
        });
    }
}
//# sourceMappingURL=MemoryManagement.js.map

// room-wide manager
class RoomManager {
    /**
     * run the spawning for the AI
     */
    static runRoomManager() {
        console.log("running rooms");
    }
}
//# sourceMappingURL=RoomManager.js.map

// Room State Constants
// Cache Tick Limits
const STRUCT_CACHE_TTL$1 = 50; // Structures
// Error Severity Constants
const ERROR_FATAL$1 = 3; // Very severe error - Game ruining
const ERROR_ERROR$2 = 2; // Regular error - Creep/Room ruining
const ERROR_WARN$2 = 1; // Small error - Something went wrong, but doesn't ruin anything
const ERROR_INFO$1 = 0; // Non-error - Used to log when something happens (e.g. memory is updated)
// Color Constants
const COLORS$1 = {};
COLORS$1[ERROR_FATAL$1] = "#FF0000";
COLORS$1[ERROR_ERROR$2] = "#E300FF";
COLORS$1[ERROR_WARN$2] = "#F0FF00";
COLORS$1[ERROR_INFO$1] = "#0045FF";
//# sourceMappingURL=Constants.js.map

/**
 * Custom error class
 */
class UserException extends Error {
    constructor(title, body, severity, useTitleColor, useBodyColor) {
        super();
        Object.setPrototypeOf(this, UserException.prototype);
        this.title = title;
        this.body = body;
        this.severity = severity;
        // Custom color option
        this.titleColor = useTitleColor !== undefined ? useTitleColor : COLORS$1[severity];
        this.bodyColor = useBodyColor !== undefined ? useBodyColor : "#ff1113";
    }
}
//# sourceMappingURL=UserException.js.map

// helper functions for rooms
class RoomHelper {
    /**
     * check if a specified room is owned by you
     * @param room the room we want to check
     */
    static isOwnedRoom(room) {
        if (room.controller !== undefined) {
            return room.controller.my;
        }
        else {
            return false;
        }
    }
    /**
     * check if a specified room is an ally room
     * @param room the room we want to check
     */
    static isAllyRoom(room) {
        // returns true if a room has one of our names but is not owned by us
        if (room.controller === undefined) {
            return false;
        }
        else {
            return (!this.isOwnedRoom(room) &&
                (room.controller.owner.username === "UhmBrock" || room.controller.owner.username === "Jakesboy2"));
        }
    }
    /**
     * check if a room is a source keeper room
     * @param room the room we want to check
     */
    static isSourceKeeperRoom(room) {
        // Contains x pos in [1], y pos in [2]
        const parsedName = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(room.name);
        const xOffset = parsedName[1] % 10;
        const yOffset = parsedName[2] % 10;
        // If x & y === 5 it's not SK, but both must be between 4 and 6
        const isSK = !(xOffset === 5 && xOffset === 5) && (xOffset >= 4 && xOffset <= 6) && (yOffset >= 4 && yOffset <= 6);
        return isSK;
    }
    /**
     * check if a room is a highway room
     * @param room the room we want to check
     */
    static isHighwayRoom(room) {
        // Contains x pos in [1], y pos in [2]
        const parsedName = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(room.name);
        // If x || y is divisible by 10, it's a highway
        if (parsedName[1] % 10 === 0 || parsedName[2] % 10 === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * check if a room is close enough to send a creep to
     * ? What are we doing with this? Checking if room is within roomdistance * 50 tiles - CreepTTL?
     * TODO Complete this
     * @param room the room we want to check
     */
    static inTravelRange(room) {
        return false;
    }
    /**
     * check if the object exists within a room
     * @param room the room we want to check
     * @param objectConst the object we want to check for
     */
    static isExistInRoom(room, objectConst) {
        return MemoryApi.getStructures(room, s => s.structureType === objectConst).length > 0;
    }
    /**
     * get the stored amount from the target
     * @param target the target we want to check the storage of
     * @param resourceType the resource we want to check the storage for
     */
    static getStoredAmount(target, resourceType) {
        if (target instanceof Creep) {
            return target.carry[resourceType];
        }
        else if (target.hasOwnProperty("store")) {
            return target.store[resourceType];
        }
        else if (resourceType === RESOURCE_ENERGY && target.hasOwnProperty("energy")) {
            return target.energy;
        }
        // Throw an error to identify when this fail condition is met
        throw new UserException("Failed to getStoredAmount of a target", "ID: " + target.id + "\n" + JSON.stringify(target), ERROR_ERROR);
    }
    /**
     * get the capacity from the target
     * @param target the target we want to check the capacity of
     */
    static getStoredCapacity(target) {
        if (target instanceof Creep) {
            return target.carryCapacity;
        }
        else if (target.hasOwnProperty("store")) {
            return target.storeCapacity;
        }
        else if (target.hasOwnProperty("energyCapacity")) {
            return target.energyCapacity;
        }
        return -1;
    }
    /**
     * get the amount of damage a tower will do at this distance
     * @param range the distance the target is from the tower
     */
    static getTowerDamageAtRange(range) {
        if (range <= TOWER_OPTIMAL_RANGE) {
            return TOWER_POWER_ATTACK;
        }
        if (range >= TOWER_FALLOFF_RANGE) {
            range = TOWER_FALLOFF_RANGE;
        }
        return (TOWER_POWER_ATTACK -
            (TOWER_POWER_ATTACK * TOWER_FALLOFF * (range - TOWER_OPTIMAL_RANGE)) /
                (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE));
    }
    /**
     * only returns true every ${parameter} number of ticks
     * @param ticks the number of ticks you want between executions
     */
    static excecuteEveryTicks(ticks) {
        return Game.time % ticks === 0;
    }
    /**
     * check if container mining is active in a room
     * @param room the room we are checking
     * @param sources the sources we are checking
     * @param containers the containers we are checking
     */
    static isContainerMining(room, sources, containers) {
        return false;
    }
    /**
     * check if container mining is active in a room
     * TODO Complete this
     * @param room the room we are checking
     * @param sources the sources we are checking
     * @param containers the containers we are checking
     */
    static isUpgraderLink(room, links) {
        return false;
    }
    /**
     * choose an ideal target for the towers to attack
     * TODO actually choose an ideal target not just the first one lol
     * @param room the room we are in
     */
    static chooseTowerTarget(room) {
        // get the creep we will do the most damage to
        const hostileCreeps = MemoryApi.getHostileCreeps(room);
        // temp, in future get one we do most dmg to
        return hostileCreeps[0];
    }
    /**
     * Get the difference in Wall/Rampart HP between the current and previous RCL
     * @param controllerLevel the level of the controller in the room
     */
    static getWallLevelDifference(controllerLevel) {
        return WALL_LIMIT[controllerLevel] - WALL_LIMIT[controllerLevel - 1];
    }
    /**
     * Returns the number of hostile creeps recorded in the room
     * @param room The room to check
     */
    static numHostileCreeps(room) {
        const hostiles = MemoryApi.getHostileCreeps(room);
        return hostiles.length;
    }
    /**
     * Return the number of remote rooms associated with the given room
     * @param room
     */
    static numRemoteRooms(room) {
        const remoteRooms = MemoryApi.getRemoteRooms(room);
        return remoteRooms.length;
    }
    /**
     * get number of associated claim rooms
     * @param room
     */
    static numClaimRooms(room) {
        const claimRooms = MemoryApi.getClaimRooms(room);
        return claimRooms.length;
    }
    /**
     * get number of associated attack rooms
     * @param room
     */
    static numAttackRooms(room) {
        const attackRooms = MemoryApi.getAttackRooms(room);
        return attackRooms.length;
    }
    /**
     * Returns the number of sources in a room
     * @param room The room to check
     */
    static numSources(room) {
        return Memory.rooms[room.name].sources.data.length;
    }
    /**
     * Returns the number of sources in all remoteRooms connected to room
     * @param room The room to check the remoteRooms of
     */
    static numRemoteSources(room) {
        const remoteRoomNames = Memory.rooms[room.name].remoteRooms.data;
        let numSources = 0;
        _.forEach(remoteRoomNames, (name) => {
            const remoteRoom = Game.rooms[name];
            numSources += RoomHelper.numSources(remoteRoom);
        });
        return numSources;
    }
    /**
     * get number of remote defenders we need
     * @param room The room to check the dependencies of
     */
    static numRemoteDefenders(room) {
        const remoteRoomNames = Memory.rooms[room.name].remoteRooms.data;
        let numRemoteDefenders = 0;
        _.forEach(remoteRoomNames, (name) => {
            const remoteRoom = Game.rooms[name];
            // If there are any hostile creeps, add one to remoteDefenderCount
            if (this.numHostileCreeps(remoteRoom) > 0) {
                numRemoteDefenders++;
            }
        });
        return numRemoteDefenders;
    }
}
//# sourceMappingURL=RoomHelper.js.map

/**
 * Functions to help keep Spawn.Api clean go here
 */
class SpawnHelper {
    /**
     * Returns a boolean indicating if the object is a valid creepBody descriptor
     * @param bodyObject The description of the creep body to verify
     */
    static verifyDescriptor(bodyObject) {
        const partNames = Object.keys(bodyObject);
        let valid = true;
        // Check that no body parts have a definition of 0 or negative
        for (const part in partNames) {
            if (bodyObject[part] <= 0) {
                valid = false;
            }
            // if (!(part in BODYPARTS_ALL)) {
            // * Technically invalid for testing atm - Need to fix
            //     valid = false;
            // }
        }
        return valid;
    }
    /**
     * Helper function - Returns an array containing @numParts of @part
     * @part The part to create
     * @numParts The number of parts to create
     */
    static generateParts(part, numParts) {
        const returnArray = [];
        for (let i = 0; i < numParts; i++) {
            returnArray.push(part);
        }
        return returnArray;
    }
    /**
     * Groups the body parts -- e.g. WORK, WORK, CARRY, CARRY, MOVE, MOVE
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    static getBody_Grouped(descriptor) {
        const creepBody = [];
        _.forEach(Object.keys(descriptor), (part) => {
            // Having ! after property removes 'null' and 'undefined'
            for (let i = 0; i < descriptor[part]; i++) {
                creepBody.push(part);
            }
        });
        return creepBody;
    }
    /**
     * Collates the body parts -- e.g. WORK, CARRY, MOVE, WORK, CARRY, ...
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    static getBody_Collated(descriptor) {
        const returnParts = [];
        const numParts = _.sum(_.values(descriptor));
        const partNames = Object.keys(descriptor);
        let i = 0;
        while (i < numParts) {
            for (let j = 0; j < partNames.length; j++) {
                const currPart = partNames[j];
                if (descriptor[currPart] >= 1) {
                    returnParts.push(currPart);
                    descriptor[currPart]--;
                    i++;
                }
            }
        }
        return returnParts;
    }
    /**
     * Generates a creep name in the format role_tier_uniqueID
     * @param role The role of the creep being generated
     * @param tier The tier of the creep being generated
     */
    static generateCreepName(role, tier, room) {
        const modifier = Game.time.toString().slice(-4);
        const name = role + "_" + tier + "_" + room.name + "_" + modifier;
        return name;
    }
    // Domestic ----
    /**
     * Generate body for miner creep
     * @param tier The tier of the room
     */
    static generateMinerBody(tier) {
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 2 Work, 2 Move - Total Cost: 300
                body = { work: 2, move: 2 };
                opts.mixType = COLLATED; // Just as an example of how we could change opts by tier as well
                break;
            case TIER_2: // 5 Work, 1 Move - Total Cost: 550
                body = { work: 5, move: 1 };
                break;
            case TIER_3: // 5 Work, 2 Move - Total Cost: 600
                body = { work: 5, move: 2 };
                break;
        }
        // Generate the creep body based on the body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for miner creep
     * @param roomState the room state of the room
     */
    static generateMinerOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: true,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: false,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for Harvester creep
     * @param tier the tier of the room
     */
    static generateHarvesterBody(tier) {
        // Default Values for harvester
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;
            case TIER_2: // 2 Work, 5 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 5, move: 3 };
                break;
            case TIER_3: // 2 Work, 6 Carry, 6 Move - Total Cost: 800
                body = { work: 2, carry: 6, move: 6 };
                break;
            case TIER_4: // 2 Work, 11 Carry, 11 Move - Total Cost: 1300
                body = { work: 2, carry: 11, move: 11 };
                break;
            case TIER_5: // 2 Work, 16 Carry, 16 Move - Total Cost: 1800
                body = { work: 2, carry: 16, move: 16 };
                break;
            case TIER_6: // 2 Work, 20 Carry, 20 Move - Total Cost: 2200
                body = { work: 2, carry: 20, move: 20 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for harvester creep
     * @param roomState the room state of the room
     */
    static generateHarvesterOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
            case ROOM_STATE_INTER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: true,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: true //
                };
                break;
            case ROOM_STATE_UPGRADER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: false,
                    upgrade: false,
                    repair: true,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: true,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,
                    getFromContainer: false,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: true //
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for worker creep
     * @param tier the tier of the room
     */
    static generateWorkerBody(tier) {
        // Default Values for Worker
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;
            case TIER_2: // 2 Work, 5 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 5, move: 3 };
                break;
            case TIER_3: // 4 Work, 4 Carry, 4 Move - Total Cost: 800
                body = { work: 4, carry: 4, move: 4 };
                break;
            case TIER_4: // 7 Work, 6 Carry, 6 Move - Total Cost: 1300
                body = { work: 7, carry: 6, move: 6 };
                break;
            case TIER_5: // 10 Work, 8 Carry, 8 Move - Total Cost: 1800
                body = { work: 10, carry: 8, move: 8 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for worker creep
     * @param roomState the room state of the room
     */
    static generateWorkerOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
            case ROOM_STATE_INTER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,
                    getFromContainer: false,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: true //
                };
                break;
            case ROOM_STATE_UPGRADER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    fillStorage: true,
                    fillContainer: false,
                    fillLink: true,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,
                    getFromContainer: false,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: true //
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for lorry creep
     * @param tier the tier of the room
     */
    static generateLorryBody(tier) {
        // Default Values for Lorry
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        // There are currently no plans to use lorry before terminal becomes available
        switch (tier) {
            case TIER_1: // 3 Carry, 3 Move - Total Cost: 300
                body = { carry: 3, move: 3 };
                break;
            case TIER_2: // 6 Carry, 5 Move - Total Cost: 550
                body = { carry: 6, move: 5 };
                break;
            case TIER_3: // 8 Carry, 8 Move - Total Cost: 800
                body = { carry: 8, move: 8 };
                break;
            case TIER_4: // 10 Carry, 10 Move - Total Cost: 1000
                body = { carry: 10, move: 10 };
                break;
            case TIER_6: // 20 Carry, 20 Move - Total Cost: 2000
                body = { carry: 20, move: 20 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for lorry creep
     * @param roomState the room state of the room
     */
    static generateLorryOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: true,
                    fillStorage: true,
                    fillContainer: true,
                    fillLink: true,
                    fillTerminal: true,
                    fillLab: true,
                    getFromStorage: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: true //
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for power upgrader creep
     * @param tier the tier of the room
     */
    static generatePowerUpgraderBody(tier) {
        // Default Values for Power Upgrader
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        // There are currently no plans to use power upgraders before links become available
        // Need to experiment with work parts here and find out whats keeps up with the links
        // Without over draining the storage, but still puts up numbers
        switch (tier) {
            case TIER_6: // 15 Work, 1 Carry, 1 Move - Total Cost: 2300
                body = { work: 18, carry: 8, move: 4 };
                break;
            case TIER_7: // 1 Work, 8 Carry, 4 Move - Total Cost: 2800
                body = { work: 22, carry: 8, move: 4 };
                break;
            case TIER_8: // 1 Work, 8 Carry, 4 Move - Total Cost: 2100
                body = { work: 15, carry: 8, move: 4 }; // RCL 8 you can only do 15 per tick
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for power upgrader creep
     * @param roomState the room state of the room
     */
    static generatePowerUpgraderOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_UPGRADER:
                creepOptions = {
                    build: false,
                    upgrade: true,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: false,
                    getFromLink: true,
                    getFromTerminal: false
                };
                break;
        }
        return creepOptions;
    }
    // ------------
    // Remote -----
    // No need to start building these guys until tier 4, but allow them at tier 3 in case our strategy changes
    /**
     * Generate body for remote miner creep
     * @param tier the tier of the room
     */
    static generateRemoteMinerBody(tier) {
        // Default Values for Remote Miner
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        // Cap the remote miner at 6 work parts (6 so they finish mining early and can build/repair their container)
        switch (tier) {
            case TIER_3: // 6 Work, 1 Carry, 3 Move - Total Cost: 800
                body = { work: 6, carry: 1, move: 3 };
                break;
            case TIER_4: // 6 Work, 1 Carry, 4 Move - Total Cost: 850
                body = { work: 6, carry: 1, move: 4 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for remote miner creep
     * @param roomState the room state of the room
     */
    static generateRemoteMinerOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    build: true,
                    upgrade: false,
                    repair: true,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: true,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: false,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for remote harvester creep
     * @param tier the tier of the room
     */
    static generateRemoteHarvesterBody(tier) {
        // Default Values for Remote Harvester
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_3: // 8 Carry, 8 Move - Total Cost: 800
                body = { carry: 8, move: 8 };
                break;
            case TIER_4: // 10 Carry, 10 Move- Total Cost: 1000
                body = { carry: 10, move: 10 };
                break;
            case TIER_5: // 16 Carry, 16 Move - Total Cost: 1600
                body = { carry: 16, move: 16 };
                break;
            case TIER_6: // 20 Carry, 20 Move - Total Cost: 2000
                body = { carry: 20, move: 20 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for remote harvester creep
     * @param roomState the room state of the room
     */
    static generateRemoteHarvesterOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: true,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: true,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
            case ROOM_STATE_UPGRADER:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: true,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: true,
                    fillContainer: false,
                    fillLink: true,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for remote reserver creep
     * @param tier the tier of the room
     */
    static generateRemoteReserverBody(tier) {
        // Default Values for Remote Reserver
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_4: // 2 Reserve Carry, 2 Move - Total Cost: 800
                body = { reserve: 2, move: 2 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for remote reserver creep
     * @param roomState the room state of the room
     */
    static generateRemoteReserverOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                // Remote reservers don't really have options perse, so just leave as defaults
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: false,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for remote colonizer creep
     * @param tier the tier of the room
     */
    static generateRemoteColonizerBody(tier) {
        // Default Values for Remote Colonizer
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_4: // 7 Work, 5 Carry, 5 Move - Total Cost: 1300
                body = { work: 7, carry: 5, move: 6 };
                break;
            case TIER_5: // 9 Work, 8 Carry, 10 Move - Total Cost: 1800
                body = { work: 9, carry: 8, move: 10 };
                break;
            case TIER_6: // 12 Work, 10 Carry, 10 Move - Total Cost: 2300
                body = { work: 12, carry: 10, move: 12 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for remote colonizer creep
     * @param tier the tier of the room
     */
    static generateRemoteColonizerOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromLink: false,
                    getFromTerminal: false
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for remote defender creep
     * @param tier the tier of the room
     */
    static generateRemoteDefenderBody(tier) {
        // Default Values for Remote Defender
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_3: // 5 Attack, 5 Move - Total Cost: 550
                body = { attack: 5, move: 5 };
                break;
            case TIER_4: //  6 Ranged Attack, 6 Move, - Total Cost: 1200
                body = { ranged_attack: 6, move: 6 };
                break;
            case TIER_5: // 8 Ranged Attack, 7 Move, 1 Heal - Total Cost: 1800
                body = { ranged_attack: 8, move: 7, heal: 1 };
                break;
            case TIER_6: // 8 Ranged Attack, 10 Move, 2 Heal
                body = { ranged_attack: 8, move: 10, heal: 2 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for remote defender creep
     * @param tier the tier of the room
     */
    static generateRemoteDefenderOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsMili();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    squadSize: 1,
                    squadUUID: null,
                    rallyLocation: null,
                    seige: false,
                    dismantler: false,
                    healer: true,
                    attacker: false,
                    defender: true,
                    flee: false
                };
                break;
        }
        return creepOptions;
    }
    // ----------
    // Military -----
    /**
     * Generate body for zealot creep
     * @param tier the tier of the room
     */
    static generateZealotBody(tier) {
        // Default Values for Zealot
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 2 Attack, 2 Move - Total Cost: 260
                body = { attack: 2, move: 2 };
                break;
            case TIER_2: // 3 Attack, 3 Move  - Total Cost: 390
                body = { attack: 3, move: 3 };
                break;
            case TIER_3: // 5 Attack, 5 Move - Total Cost: 650
                body = { attack: 5, move: 5 };
                break;
            case TIER_4: // 10 Attack, 10 Move - Total Cost: 1300
                body = { attack: 2, move: 2 };
                break;
            case TIER_5: // 15 Attack, 12 Move - Total Cost: 1800
                body = { attack: 15, move: 12 };
                break;
            case TIER_6: // 20 Attack, 14 Move - Total Cost: 2300
                body = { attack: 20, move: 14 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for zealot creep
     * @param roomState the room state of the room
     * @param squadSizeParam the size of the squad associated with the zealot
     * @param squadUUIDParam the squad id that the zealot is a member of
     * @param rallyLocationParam the meeting place for the squad
     */
    static generateZealotOptions(roomState, squadSizeParam, squadUUIDParam, rallyLocationParam) {
        let creepOptions = this.getDefaultCreepOptionsMili();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    squadSize: squadSizeParam,
                    squadUUID: squadUUIDParam,
                    rallyLocation: rallyLocationParam,
                    seige: false,
                    dismantler: false,
                    healer: false,
                    attacker: true,
                    defender: false,
                    flee: false
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for medic creep
     * @param roomState the room state of the room
     * @param squadSizeParam the size of the squad associated with the zealot
     * @param squadUUIDParam the squad id that the zealot is a member of
     * @param rallyLocationParam the meeting place for the squad
     */
    static generateMedicBody(tier) {
        // Default Values for Medic
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 1 Heal, 1 Move - Total Cost: 300
                body = { heal: 1, move: 1 };
                break;
            case TIER_2: // 2 Heal, 1 Move - Total Cost: 550
                body = { heal: 2, move: 1 };
                break;
            case TIER_3: // 2 Heal, 2 Move - Total Cost: 600
                body = { heal: 2, move: 2 };
                break;
            case TIER_4: // 4 Heal, 4 Move - Total Cost: 1200
                body = { heal: 4, move: 4 };
                break;
            case TIER_5: // 6 Heal, 6 Move - Total Cost: 1800
                body = { heal: 6, move: 6 };
                break;
            case TIER_6: // 8 Heal, 6 Move - Total Cost: 2300
                body = { heal: 8, move: 6 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for medic creep
     * @param tier the tier of the room
     */
    static generateMedicOptions(roomState, squadSizeParam, squadUUIDParam, rallyLocationParam) {
        let creepOptions = this.getDefaultCreepOptionsMili();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    squadSize: squadSizeParam,
                    squadUUID: squadUUIDParam,
                    rallyLocation: rallyLocationParam,
                    seige: false,
                    dismantler: false,
                    healer: true,
                    attacker: false,
                    defender: false,
                    flee: true
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for stalker creep
     * @param tier the tier of the room
     */
    static generateStalkerBody(tier) {
        // Default Values for Stalker
        let body = { work: 0, move: 0 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 1 Ranged Attack, 2 Move - Total Cost: 200
                body = { ranged_attack: 1, move: 1 };
                break;
            case TIER_2: // 3 Ranged Attack, 2 Move - Total Cost: 550
                body = { ranged_attack: 3, move: 2 };
                break;
            case TIER_3: // 4 Ranged Attack, 4 Move - Total Cost: 800
                body = { ranged_attack: 4, move: 4 };
                break;
            case TIER_4: // 6 Ranged Attack, 6 Move - Total Cost: 1200
                body = { ranged_attack: 6, move: 6 };
                break;
            case TIER_5: // 8 Ranged Attack, 8 Move - Total Cost: 1600
                body = { carranged_attackry: 8, move: 8 };
                break;
            case TIER_6: // 12 Ranged Attack, 10 Move - Total Cost: 2300
                body = { ranged_attack: 12, move: 10 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate options for stalker creep
     * @param roomState the room state of the room
     * @param squadSizeParam the size of the squad associated with the zealot
     * @param squadUUIDParam the squad id that the zealot is a member of
     * @param rallyLocationParam the meeting place for the squad
     */
    static generateStalkerOptions(roomState, squadSizeParam, squadUUIDParam, rallyLocationParam) {
        let creepOptions = this.getDefaultCreepOptionsMili();
        switch (roomState) {
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    squadSize: squadSizeParam,
                    squadUUID: squadUUIDParam,
                    rallyLocation: rallyLocationParam,
                    seige: false,
                    dismantler: false,
                    healer: false,
                    attacker: false,
                    defender: false,
                    flee: false
                };
                break;
        }
        return creepOptions;
    }
    // --------------
    /**
     * returns a set of creep options with all default values
     */
    static getDefaultCreepOptionsCiv() {
        return {
            build: false,
            upgrade: false,
            repair: false,
            wallRepair: false,
            fillTower: false,
            fillStorage: false,
            fillContainer: false,
            fillLink: false,
            fillTerminal: false,
            fillLab: false,
            getFromStorage: false,
            getFromContainer: false,
            getDroppedEnergy: false,
            getFromLink: false,
            getFromTerminal: false
        };
    }
    /**
     * returns set of mili creep options with all default values
     */
    static getDefaultCreepOptionsMili() {
        return {
            squadSize: 0,
            squadUUID: null,
            rallyLocation: null,
            seige: false,
            dismantler: false,
            healer: false,
            attacker: false,
            defender: false,
            flee: false
        };
    }
    /**
     * generates a creep memory to give to a creep being spawned
     */
    static generateDefaultCreepMemory(roleConst, homeRoomNameParam, targetRoomParam, creepOptions) {
        return {
            role: roleConst,
            homeRoom: homeRoomNameParam,
            targetRoom: targetRoomParam,
            workTarget: null,
            options: creepOptions,
            working: false
        };
    }
}
//# sourceMappingURL=SpawnHelper.js.map

// Accessing Memory Helpers
class MemoryHelper {
    /**
     * Get structures of a single type in a room, updating if necessary
     *
     * [Cached] Memory.rooms[room.name].structures
     * @param room
     * @param filterFunction
     * @param forceUpdate
     * @returns Structure[] An array of structures of a single type
     */
    static getStructureOfType(room, type, forceUpdate) {
        if (forceUpdate ||
            Memory.rooms[room.name].structures === undefined ||
            Memory.rooms[room.name].structures.data[type] === undefined ||
            Memory.rooms[room.name].structures.cache < Game.time - STRUCT_CACHE_TTL$1) {
            MemoryHelper_Room.updateStructures(room);
        }
        const structures = _.map(Memory.rooms[room.name].structures.data[type], (id) => Game.getObjectById(id));
        return structures;
    }
    /**
     * Returns an array of creeps of a role
     * @param role The role to check for
     */
    static getCreepOfRole(room, role, forceUpdate) {
        const filterByRole = (creep) => {
            return creep.memory.role === role;
        };
        const creepsOfRole = MemoryApi.getMyCreeps(room, filterByRole);
        return creepsOfRole;
    }
    /**
     * clear the memory structure for the creep
     * @param creep the creep we want to clear the memory of
     */
    static clearCreepMemory(creep) {
        // check if the memory object exists and delete it
        if (Memory.creeps[creep.name]) {
            delete creep.memory;
        }
    }
    /**
     * clear the memory for a room
     * @param room the room we want to clear the memory for
     */
    static clearRoomMemory(room) {
        // check if the memory structures exists and delete it
        if (Memory.rooms[room.name]) {
            delete room.memory;
        }
    }
}
//# sourceMappingURL=MemoryHelper.js.map

/**
 * The API used by the spawn manager
 */
class SpawnApi {
    /**
     * Get count of all creeps, or of one if creepConst is specified
     * @param room the room we are getting the count for
     * @param creepConst [Optional] Count only one role
     */
    static getCreepCount(room, creepConst) {
        const filterFunction = creepConst === undefined ? undefined : (c) => c.memory.role === creepConst;
        return MemoryApi.getMyCreeps(room, filterFunction).length;
    }
    /**
     * get creep limits
     * @param room the room we want the limits for
     */
    static getCreepLimits(room) {
        const creepLimits = {
            domesticLimits: Memory.rooms[room.name].creepLimit["domesticLimits"],
            remoteLimits: Memory.rooms[room.name].creepLimit["remoteLimits"],
            militaryLimits: Memory.rooms[room.name].creepLimit["militaryLimits"]
        };
        return creepLimits;
    }
    /**
     * set domestic creep limits
     * @param room the room we want limits for
     */
    static generateDomesticCreepLimits(room) {
        const domesticLimits = {
            miner: 0,
            harvester: 0,
            worker: 0,
            powerUpgrader: 0,
            lorry: 0
        };
        // check what room state we are in
        switch (room.memory.roomState) {
            // Intro
            case ROOM_STATE_INTRO:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 1;
                domesticLimits[ROLE_HARVESTER] = 1;
                domesticLimits[ROLE_WORKER] = 1;
                break;
            // Beginner
            case ROOM_STATE_BEGINNER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 4;
                domesticLimits[ROLE_HARVESTER] = 4;
                domesticLimits[ROLE_WORKER] = 4;
                break;
            // Intermediate
            case ROOM_STATE_INTER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 5;
                break;
            // Advanced
            case ROOM_STATE_ADVANCED:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 4;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 0;
                break;
            // Upgrader
            case ROOM_STATE_UPGRADER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_POWER_UPGRADER] = 1;
                break;
            // Stimulate
            case ROOM_STATE_STIMULATE:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 3;
                domesticLimits[ROLE_POWER_UPGRADER] = 2;
                domesticLimits[ROLE_LORRY] = 2;
                break;
            // Seige
            case ROOM_STATE_SEIGE:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_LORRY] = 1;
                break;
        }
        // Return the limits
        return domesticLimits;
    }
    /**
     * set remote creep limits
     * (we got shooters on deck)
     * @param room the room we want limits for
     */
    static generateRemoteCreepLimits(room) {
        const remoteLimits = {
            remoteMiner: 0,
            remoteHarvester: 0,
            remoteReserver: 0,
            remoteColonizer: 0,
            remoteDefender: 0
        };
        const numRemoteRooms = RoomHelper.numRemoteRooms(room);
        const numClaimRooms = RoomHelper.numClaimRooms(room);
        // If we do not have any remote rooms, return the initial remote limits (Empty)
        if (numRemoteRooms <= 0 && numClaimRooms <= 0) {
            return remoteLimits;
        }
        // Gather the rest of the data only if we have a remote room or a claim room
        const numRemoteDefenders = RoomHelper.numRemoteDefenders(room);
        const numRemoteSources = RoomHelper.numRemoteSources(room);
        // check what room state we are in
        switch (room.memory.roomState) {
            // Advanced
            case ROOM_STATE_ADVANCED:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;
                break;
            // Upgrader
            case ROOM_STATE_UPGRADER:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;
                break;
            // Stimulate
            case ROOM_STATE_STIMULATE:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;
                break;
        }
        // Return the limits
        return remoteLimits;
    }
    /**
     * set military creep limits
     * @param room the room we want limits for
     */
    static generateMilitaryCreepLimits(room) {
        const militaryLimits = {
            zealot: 0,
            stalker: 0,
            medic: 0
        };
        // Check for attack flags and adjust accordingly
        // Check if we need defenders and adjust accordingly
        // Return the limits
        return militaryLimits;
    }
    /**
     * set creep limits for the room
     * @param room the room we are setting limits for
     */
    static setCreepLimits(room) {
        // Set Domestic Limits to Memory
        MemoryHelper_Room.updateDomesticLimits(room, this.generateDomesticCreepLimits(room));
        // Set Remote Limits to Memory
        MemoryHelper_Room.updateRemoteLimits(room, this.generateRemoteCreepLimits(room));
        // Set Military Limits to Memory
        MemoryHelper_Room.updateMilitaryLimits(room, this.generateMilitaryCreepLimits(room));
    }
    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    static getOpenSpawn(room) {
        // Get all openSpawns, and return the first
        const openSpawns = MemoryApi.getStructureOfType(room, STRUCTURE_SPAWN, (spawn) => !spawn.spawning);
        if (openSpawns.length === 0) {
            return null;
        }
        return _.first(openSpawns);
    }
    /**
     * get next creep to spawn
     * @param room the room we want to spawn them in
     */
    static getNextCreep(room) {
        // Get Limits for each creep department
        const creepLimits = this.getCreepLimits(room);
        // Check if we need a domestic creep -- Return role if one is found
        for (const role of domesticRolePriority) {
            if (this.getCreepCount(room, role) < creepLimits.domesticLimits[role]) {
                return role;
            }
        }
        // Check if we need a military creep -- Return role if one is found
        for (const role of militaryRolePriority) {
            if (this.getCreepCount(room, role) < creepLimits.militaryLimits[role]) {
                return role;
            }
        }
        // Check if we need a remote creep -- Return role if one is found
        for (const role of remoteRolePriority) {
            if (this.getCreepCount(room, role) < creepLimits.remoteLimits[role]) {
                return role;
            }
        }
        // Return null if we don't need to spawn anything
        return null;
    }
    /**
     * spawn the next creep
     * TODO Complete this
     * @param room the room we want to spawn them in
     * @param body BodyPartConstant[] the body array of the creep
     * @param creepOptions creep options we want to give to it
     * @param role RoleConstant the role of the creep
     * @param spawn spawn we are going to use to spawn the creep
     */
    static spawnNextCreep(room, body, creepOptions, role, spawn, homeRoom, targetRoom) {
        // Throw error if we don't have enough energy to spawn this creep
        if (this.getEnergyCostOfBody(body) > room.energyAvailable) {
            throw new UserException("Creep failed to spawn.", 'The role "' + role + '" was unable to spawn in room "' + room.name + '": Not enough energy .', ERROR_WARN);
        }
        const name = SpawnHelper.generateCreepName(role, this.getTier(room, role), room);
        const creepMemory = SpawnHelper.generateDefaultCreepMemory(role, homeRoom, targetRoom, creepOptions);
        spawn.spawnCreep(body, name, { memory: creepMemory });
    }
    /**
     * get energy cost of creep body
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    static getEnergyCostOfBody(body) {
        // Create the object with the costs of each body part
        let totalCost = 0;
        const bodyPartCost = {
            work: 100,
            carry: 50,
            move: 50,
            attack: 80,
            ranged_attack: 150,
            heal: 250,
            claim: 600,
            tough: 10
        };
        // Loop over the creep body array summing the total cost of the body parts
        for (let i = 0; i < body.length; ++i) {
            const currBodyPart = body[i];
            totalCost += bodyPartCost[currBodyPart];
        }
        return totalCost;
    }
    /**
     * check what tier of this creep we are spawning
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     */
    static getTier(room, roleConst) {
        const energyAvailable = room.energyAvailable;
        // Check what tier we are in based on the amount of energy the room has
        if (energyAvailable === TIER_8) {
            return TIER_8;
        }
        if (energyAvailable >= TIER_7) {
            return TIER_7;
        }
        if (energyAvailable >= TIER_6) {
            return TIER_6;
        }
        if (energyAvailable >= TIER_5) {
            return TIER_5;
        }
        if (energyAvailable >= TIER_4) {
            return TIER_4;
        }
        if (energyAvailable >= TIER_3) {
            return TIER_3;
        }
        if (energyAvailable >= TIER_2) {
            return TIER_2;
        }
        // If we make it here, we are simply tier 1
        return TIER_1;
    }
    /**
     * get the memory options for this creep
     * @param room the room we are spawning it in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    static generateCreepOptions(room, role, roomState, squadSize, squadUUID, rallyLocation) {
        // Set default values if military options aren't provided
        // If one of these aren't provided, then the entire purpose of them is nix,
        // So we just check if any of them aren't provided and set defaults for all in that case
        if (!squadSize || !squadUUID || !rallyLocation) {
            squadSize = 0;
            squadUUID = null;
            rallyLocation = null;
        }
        // Call the correct helper function based on creep role
        switch (role) {
            case ROLE_MINER:
                return SpawnHelper.generateMinerOptions(roomState);
            case ROLE_HARVESTER:
                return SpawnHelper.generateHarvesterOptions(roomState);
            case ROLE_WORKER:
                return SpawnHelper.generateWorkerOptions(roomState);
            case ROLE_LORRY:
                return SpawnHelper.generateLorryOptions(roomState);
            case ROLE_POWER_UPGRADER:
                return SpawnHelper.generatePowerUpgraderOptions(roomState);
            case ROLE_REMOTE_MINER:
                return SpawnHelper.generateRemoteMinerOptions(roomState);
            case ROLE_REMOTE_HARVESTER:
                return SpawnHelper.generateRemoteHarvesterOptions(roomState);
            case ROLE_COLONIZER:
                return SpawnHelper.generateRemoteColonizerOptions(roomState);
            case ROLE_REMOTE_DEFENDER:
                return SpawnHelper.generateRemoteDefenderOptions(roomState);
            case ROLE_REMOTE_RESERVER:
                return SpawnHelper.generateRemoteReserverOptions(roomState);
            case ROLE_ZEALOT:
                return SpawnHelper.generateZealotOptions(roomState, squadSize, squadUUID, rallyLocation);
            case ROLE_MEDIC:
                return SpawnHelper.generateMedicOptions(roomState, squadSize, squadUUID, rallyLocation);
            case ROLE_STALKER:
                return SpawnHelper.generateStalkerOptions(roomState, squadSize, squadUUID, rallyLocation);
            default:
                throw new UserException("Creep body failed generating.", 'The role "' + role + '" was invalid for generating the creep body.', ERROR_ERROR);
        }
    }
    /**
     * Generate the body for the creep based on the tier and role
     * @param tier the tier our room is at
     * @param role the role of the creep we want
     */
    static generateCreepBody(tier, role) {
        // Call the correct helper function based on creep role
        switch (role) {
            case ROLE_MINER:
                return SpawnHelper.generateMinerBody(tier);
            case ROLE_HARVESTER:
                return SpawnHelper.generateHarvesterBody(tier);
            case ROLE_WORKER:
                return SpawnHelper.generateWorkerBody(tier);
            case ROLE_LORRY:
                return SpawnHelper.generateLorryBody(tier);
            case ROLE_POWER_UPGRADER:
                return SpawnHelper.generatePowerUpgraderBody(tier);
            case ROLE_REMOTE_MINER:
                return SpawnHelper.generateRemoteMinerBody(tier);
            case ROLE_REMOTE_HARVESTER:
                return SpawnHelper.generateRemoteHarvesterBody(tier);
            case ROLE_COLONIZER:
                return SpawnHelper.generateRemoteColonizerBody(tier);
            case ROLE_REMOTE_DEFENDER:
                return SpawnHelper.generateRemoteDefenderBody(tier);
            case ROLE_REMOTE_RESERVER:
                return SpawnHelper.generateRemoteReserverBody(tier);
            case ROLE_ZEALOT:
                return SpawnHelper.generateZealotBody(tier);
            case ROLE_MEDIC:
                return SpawnHelper.generateMedicBody(tier);
            case ROLE_STALKER:
                return SpawnHelper.generateStalkerBody(tier);
            default:
                throw new UserException("Creep body failed generating.", 'The role "' + role + '" was invalid for generating the creep body.', ERROR_ERROR);
        }
    }
    /**
     * Returns a creep body part array, or null if invalid parameters were passed in
     * @param bodyObject The object that describes the creep's body parts
     * @param opts The options for generating the creep body from the descriptor
     */
    static getCreepBody(bodyObject, opts) {
        let creepBody = [];
        let numHealParts = 0;
        /**
         * If opts is undefined, use default options
         */
        if (opts === undefined) {
            opts = { mixType: GROUPED, toughFirst: false, healLast: false };
        }
        /**
         * Verify bodyObject - Return null if invalid
         */
        if (SpawnHelper.verifyDescriptor(bodyObject) === false) {
            throw new UserException("Invalid Creep Body Descriptor", "Ensure that the object being passed to getCreepBody is in the format { BodyPartConstant: NumberParts } and that NumberParts is > 0.", ERROR_ERROR);
        }
        /**
         * Append tough parts on creepBody first - Delete tough property from bodyObject
         */
        if (opts.toughFirst && bodyObject.tough) {
            creepBody = SpawnHelper.generateParts("tough", bodyObject.tough);
            delete bodyObject.tough;
        }
        /**
         * Retain Heal Information to append on the end of creepBody - Delete heal property from bodyObject
         */
        if (opts.healLast && bodyObject.heal) {
            numHealParts = bodyObject.heal;
            delete bodyObject.heal;
        }
        /**
         * If mixType is grouped, add onto creepBody
         */
        if (opts.mixType === GROUPED) {
            const bodyParts = SpawnHelper.getBody_Grouped(bodyObject);
            for (let i = 0; i < bodyParts.length; i++) {
                creepBody.push(bodyParts[i]);
            }
        }
        /**
         * If mixType is collated, add onto creepBody
         */
        if (opts.mixType === COLLATED) {
            const bodyParts = SpawnHelper.getBody_Collated(bodyObject);
            for (let i = 0; i < bodyParts.length; i++) {
                creepBody.push(bodyParts[i]);
            }
        }
        /**
         * Append Heal Information that was retained at the beginning of the function
         */
        if (opts.healLast) {
            for (let i = 0; i < numHealParts; i++) {
                creepBody.push("heal");
            }
        }
        // If creepBody is empty, return undefined
        if (creepBody.length === 0) {
            return [];
        }
        else {
            return creepBody;
        }
    }
    /**
     * Returns the number of miners that are not spawning, and have > 50 ticksToLive
     * @param room the room we are checking in
     */
    static getActiveMiners(room) {
        let miners = MemoryHelper.getCreepOfRole(room, ROLE_MINER);
        miners = _.filter(miners, (creep) => {
            // False if miner is spawning or has less than 50 ticks to live
            return !creep.spawning && creep.ticksToLive > 50;
        });
        return miners.length;
    }
    /**
     * generates a UUID for a squad
     */
    static generateSquadUUID(seed) {
        return Math.random() * 10000000;
    }
    /**
     * generates options for spawning a squad based on the attack room's specifications
     * @param room the room we are spawning the squad in
     */
    static generateSquadOptions(room) {
        const squadOptions = {
            squadSize: 0,
            squadUUID: null,
            rallyLocation: null
        };
        // use the attack room memory to get the actual values of the options
        return squadOptions;
    }
    /**
     * get the target room for the creep
     * TODO
     * @param room the room we are spawning the squad in
     */
    static getCreepTargetRoom(room) {
        return "";
    }
    /**
     * get the home room for the creep
     * @param room the room the creep is spawning in
     */
    static getCreepHomeRoom(room) {
        // incomplete for now, need to handle special case (only reason this is in a function really)
        // for colonizers. We just wanna set their home room to their target room basically so they automatically will go there
        // handle their budniss. Another potential use case of this would be sending creeps to other rooms
        // the easiest way to do that is just changing their home room in memory, so we could add something to detect
        // if a creep being born is meant for another room and handle that accordingly here (ez pz)
        return room.name;
    }
}
//# sourceMappingURL=Spawn.Api.js.map

// handles spawning for every room
class SpawnManager {
    /**
     * run the spawning for the AI for each room
     */
    static runSpawnManager() {
        const ownedRooms = _.filter(Game.rooms, (room) => RoomHelper.isOwnedRoom(room));
        // Loop over all rooms and run the spawn for each one
        for (const room of ownedRooms) {
            this.runSpawnForRoom(room);
        }
    }
    /**
     * run spawn ai for a specific room
     * @param room the room we are running spawn for
     */
    static runSpawnForRoom(room) {
        const openSpawn = SpawnApi.getOpenSpawn(room);
        // get tier
        // if we don't have an open spawn, return early
        if (openSpawn === null) {
            return;
        }
        // If we have a spawn, generate creep limits for the room
        SpawnApi.setCreepLimits(room);
        // add method to generate the over ride values from flags for the military creeps
        const nextCreepRole = SpawnApi.getNextCreep(room);
        // If we are spawning a creep this tick, continue from here
        if (nextCreepRole) {
            const energyAvailable = room.energyAvailable;
            const roomTier = SpawnApi.getTier(room, nextCreepRole);
            const creepBody = SpawnApi.generateCreepBody(roomTier, nextCreepRole);
            const bodyEnergyCost = SpawnApi.getEnergyCostOfBody(creepBody);
            // Check if we even have enough energy to even spawn this potential monstrosity
            if (energyAvailable >= bodyEnergyCost) {
                // Get all the information we will need to spawn the next creep
                const roomState = room.memory.roomState;
                const militarySquadOptions = SpawnApi.generateSquadOptions(room);
                const targetRoom = SpawnApi.getCreepTargetRoom(room);
                const homeRoom = SpawnApi.getCreepHomeRoom(room);
                const creepOptions = SpawnApi.generateCreepOptions(room, nextCreepRole, roomState, militarySquadOptions["squadSize"], militarySquadOptions["squadUUID"], militarySquadOptions["rallyLocation"]);
                // Spawn the creep
                SpawnApi.spawnNextCreep(room, creepBody, creepOptions, nextCreepRole, openSpawn, homeRoom, targetRoom);
            }
        }
    }
}
// Current todo to finish Spawning ------
/*
            getCreepTargetRoom()
            We need to come up with a way to figure out what room a remote/military creep
            needs to go to.
            My idea for this is to create a function in SpawnApi that does precisely this.
            Using remote room for example let say we have 2 remote rooms and want to spawn a remote miner:
            The function will get both remote rooms and add their names to an array
            We will get every living creep that is a remote miner and loop over them
            we get the remtoe room that has the least amount of remote miners that consider them a target room
            we return this room as the creeps target room
            If they are all the same value, we just select the closeset one potentially

            fill out generateSquadOptions
            This one is a little simpler as it will just find the attackRoom in the spawning room's memory
            (this will be the same room found in the previous function btw, so this will have to come second)
            Then it just scrapes the values from the memory object.. easy enough

            complete getCreepHomeRoom to handle colonizers (it might be literally as easy as calling the getCreepTargetRoom
            function from that method if its a remote colonizer)
            When we start handling empire level stuff like inter-room assistance then we can add to it then

            Thats all I can think of, add to this if you think of anything. But I believe once the above cases
            are handled that spawn is completely functional. We will obviously be tweaking numbers later once we are
            implementing the code base in game. biggest one i can think of is when we need lorries to spawn. Like we will
            def have to go back and decide for cases for lorries/more workers/etc to spawn later and we can add it into
            spawn api on like get limits (so we avoid directly changing the limits from wherever we are working out of)
            We will probably just have like a getLorryLimit function that it calls to decide all of this stuff, similar to
            how remoteDefenders are handled since they are also a special case
        */
//# sourceMappingURL=SpawnManager.js.map

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

var base64 = {
	encode: encode,
	decode: decode
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode$1 = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode$1 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var base64Vlq = {
	encode: encode$1,
	decode: decode$1
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var util = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;
});
var util_1 = util.getArg;
var util_2 = util.urlParse;
var util_3 = util.urlGenerate;
var util_4 = util.normalize;
var util_5 = util.join;
var util_6 = util.isAbsolute;
var util_7 = util.relative;
var util_8 = util.toSetString;
var util_9 = util.fromSetString;
var util_10 = util.compareByOriginalPositions;
var util_11 = util.compareByGeneratedPositionsDeflated;
var util_12 = util.compareByGeneratedPositionsInflated;
var util_13 = util.parseSourceMapInput;
var util_14 = util.computeSourceURL;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */


var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = ArraySet;

var arraySet = {
	ArraySet: ArraySet_1
};

var binarySearch = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
});
var binarySearch_1 = binarySearch.GREATEST_LOWER_BOUND;
var binarySearch_2 = binarySearch.LEAST_UPPER_BOUND;
var binarySearch_3 = binarySearch.search;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

var quickSort = {
	quickSort: quickSort_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$2 = arraySet.ArraySet;

var quickSort$1 = quickSort.quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet$2.fromArray(names.map(String), true);
  this._sources = ArraySet$2.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet$2.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet$2.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort$1(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64Vlq.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort$1(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort$1(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

var BasicSourceMapConsumer_1 = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet$2();
  this._names = new ArraySet$2();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort$1(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort$1(this.__originalMappings, util.compareByOriginalPositions);
  };

var IndexedSourceMapConsumer_1 = IndexedSourceMapConsumer;

var sourceMapConsumer = {
	SourceMapConsumer: SourceMapConsumer_1,
	BasicSourceMapConsumer: BasicSourceMapConsumer_1,
	IndexedSourceMapConsumer: IndexedSourceMapConsumer_1
};

var SourceMapConsumer$1 = sourceMapConsumer.SourceMapConsumer;

// tslint:disable:no-conditional-assignment
class ErrorMapper {
    static get consumer() {
        if (this._consumer == null) {
            this._consumer = new SourceMapConsumer$1(require("main.js.map"));
        }
        return this._consumer;
    }
    /**
     * Generates a stack trace using a source map generate original symbol names.
     *
     * WARNING - EXTREMELY high CPU cost for first call after reset - >30 CPU! Use sparingly!
     * (Consecutive calls after a reset are more reasonable, ~0.1 CPU/ea)
     *
     * @param {Error | string} error The error or original stack trace
     * @returns {string} The source-mapped stack trace
     */
    static sourceMappedStackTrace(error) {
        const stack = error instanceof Error ? error.stack : error;
        if (this.cache.hasOwnProperty(stack)) {
            return this.cache[stack];
        }
        const re = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm;
        let match;
        let outStack = error.toString();
        while ((match = re.exec(stack))) {
            if (match[2] === "main") {
                const pos = this.consumer.originalPositionFor({
                    column: parseInt(match[4], 10),
                    line: parseInt(match[3], 10)
                });
                if (pos.line != null) {
                    if (pos.name) {
                        outStack += `\n    at ${pos.name} (${pos.source}:${pos.line}:${pos.column})`;
                    }
                    else {
                        if (match[1]) {
                            // no original source file name known - use file name from given trace
                            outStack += `\n    at ${match[1]} (${pos.source}:${pos.line}:${pos.column})`;
                        }
                        else {
                            // no original source file name known or in given trace - omit name
                            outStack += `\n    at ${pos.source}:${pos.line}:${pos.column}`;
                        }
                    }
                }
                else {
                    // no known position
                    break;
                }
            }
            else {
                // no more parseable lines
                break;
            }
        }
        this.cache[stack] = outStack;
        return outStack;
    }
    static wrapLoop(loop) {
        return () => {
            try {
                loop();
            }
            catch (e) {
                if (e instanceof Error) {
                    if ("sim" in Game.rooms) {
                        const message = `Source maps don't work in the simulator - displaying original error`;
                        console.log(`<span style='color:red'>${message}<br>${_.escape(e.stack)}</span>`);
                    }
                    else {
                        console.log(`<span style='color:red'>${_.escape(this.sourceMappedStackTrace(e))}</span>`);
                    }
                }
                else {
                    // can't handle it
                    throw e;
                }
            }
        };
    }
}
// Cache previously mapped traces to improve performance
ErrorMapper.cache = {};
//# sourceMappingURL=ErrorMapper.js.map

class UtilHelper {
    /**
     * Display an error to the console
     * @param e Either a UserException or an Error
     */
    static printError(e) {
        if (e instanceof UserException) {
            console.log('<font color="' + e.titleColor + '">' + e.title + "</font>");
            console.log('<font color="' + e.bodyColor + '">' + e.body + "</font>");
        }
        else {
            console.log("Unexpected error, see the details below: ");
            console.log(e.stack);
        }
    }
}
//# sourceMappingURL=UtilHelper.js.map

/*
  Kung Fu Klan's Screeps Code
  Written and maintained by -
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/
const loop = ErrorMapper.wrapLoop(() => {
    try {
        // clean up memory first
        MemoryManager.runMemoryManager();
        // run the empire and get all relevant info from that into memory
        EmpireManager.runEmpireManager();
        // run rooms
        RoomManager.runRoomManager();
        // run spawning
        SpawnManager.runSpawnManager();
    }
    catch (e) {
        UtilHelper.printError(e);
    }
    // -------- end managers --------
});
//# sourceMappingURL=main.js.map

exports.loop = loop;
//# sourceMappingURL=main.js.map
