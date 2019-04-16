'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Accessing Memory Helpers
class MemoryHelper {
    /**
     * Returns an array of creeps of a role
     * @param role The role to check for
     */
    static getCreepOfRole(room, role, forceUpdate) {
        const filterByRole = (creep) => {
            return creep.memory.role === role;
        };
        const creepsOfRole = MemoryApi.getMyCreeps(room.name, filterByRole);
        return creepsOfRole;
    }
    /**
     * check if the room name exists as a dependent room
     * @param roomName the name of the room we are cheking for
     */
    static dependentRoomExists(roomName) {
        const ownedRooms = MemoryApi.getOwnedRooms();
        // Loop over d-rooms within each room looking for the parameter room name
        for (const room of ownedRooms) {
            for (const rr of room.memory.remoteRooms) {
                if (rr && roomName === rr.roomName) {
                    return true;
                }
            }
            for (const cr of room.memory.claimRooms) {
                if (cr && roomName === cr.roomName) {
                    return true;
                }
            }
            for (const ar of room.memory.attackRooms) {
                if (ar && roomName === ar.roomName) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Performs the length checks and null checks for all getXXX functions that use IDs to get the objects
     * @param idArray An array of ids to check
     */
    static getOnlyObjectsFromIDs(idArray) {
        if (idArray.length === 0) {
            return [];
        }
        const objects = [];
        _.forEach(idArray, (id) => {
            const object = Game.getObjectById(id);
            if (object !== null) {
                objects.push(object);
            }
        });
        return objects;
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

// Room State Constants
const ROOM_STATE_INTRO = 0;
const ROOM_STATE_BEGINNER = 1;
const ROOM_STATE_INTER = 2;
const ROOM_STATE_ADVANCED = 3;
const ROOM_STATE_UPGRADER = 4;
const ROOM_STATE_STIMULATE = 6;
const ROOM_STATE_NUKE_INBOUND = 7;
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
const ROLE_CLAIMER = "claimer";
const ROLE_COLONIZER = "remoteColonizer";
const ROLE_ZEALOT = "zealot";
const ROLE_STALKER = "stalker";
const ROLE_MEDIC = "medic";
const ROLE_DOMESTIC_DEFENDER = "domesticDefender";
// Tier Constants
const TIER_1 = 300;
const TIER_2 = 550;
const TIER_3 = 800;
const TIER_4 = 1300;
const TIER_5 = 1800;
const TIER_6 = 2300;
const TIER_7 = 5300;
const TIER_8 = 12300;
// Attack Flag Constants
const ZEALOT_SOLO = 1;
const STALKER_SOLO = 2;
const STANDARD_SQUAD = 3;
const CLAIM_FLAG = 4;
const REMOTE_FLAG = 5;
const OVERRIDE_D_ROOM_FLAG = 6;
const STIMULATE_FLAG = 7;
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
const TOMBSTONE_CACHE_TTL = 50; // Tombstones
const DROPS_CACHE_TTL = 50; // Dropped Resources
const FCREEP_CACHE_TTL = 20; // Friendly Creep
const HCREEP_CACHE_TTL = 1; // Hostile Creep
// GetEnergyJob Constants
const SOURCE_JOB_CACHE_TTL = 50; // Source jobs
const CONTAINER_JOB_CACHE_TTL = 50; // Container jobs
const LINK_JOB_CACHE_TTL = 50; // Link Jobs
const BACKUP_JOB_CACHE_TTL = 50; // Backup Jobs
const PICKUP_JOB_CACHE_TTL = 50; // Pickup Jobs
// ClaimPartJob Constants
const CLAIM_JOB_CACHE_TTL = 1; // Claim Jobs
const RESERVE_JOB_CACHE_TTL = 1; // Reserve Jobs
const SIGN_JOB_CACHE_TTL = 50; // Sign Jobs
const ATTACK_JOB_CACHE_TTL = 1; // Attack Jobs
// WorkPartJob Constants
const REPAIR_JOB_CACHE_TTL = 10; // Repair jobs
const BUILD_JOB_CACHE_TTL = 10; // Build Jobs
const UPGRADE_JOB_CACHE_TTL = -1; // Upgrade Jobs
// CarryPartJob Constants
const FILL_JOB_CACHE_TTL = 10; // Fill Jobs
const STORE_JOB_CACHE_TTL = 50; // Store Jobs
const ERROR_ERROR$1 = 2; // Regular error - Creep/Room ruining
const ERROR_WARN$1 = 1; // Small error - Something went wrong, but doesn't ruin anything
//# sourceMappingURL=Constants.js.map

// Room State Constants
const ROOM_STATE_INTRO$1 = 0;
const ROOM_STATE_BEGINNER$1 = 1;
const ROOM_STATE_INTER$1 = 2;
const ROOM_STATE_ADVANCED$1 = 3;
const ROOM_STATE_UPGRADER$1 = 4;
const ROOM_STATE_STIMULATE$1 = 6;
const ROOM_STATE_NUKE_INBOUND$1 = 7;
// Role Constants
const ROLE_MINER$1 = "miner";
const ROLE_HARVESTER$1 = "harvester";
const ROLE_WORKER$1 = "worker";
const ROLE_POWER_UPGRADER$1 = "powerUpgrader";
const ROLE_LORRY$1 = "lorry";
const ROLE_REMOTE_MINER$1 = "remoteMiner";
const ROLE_REMOTE_HARVESTER$1 = "remoteHarvester";
const ROLE_REMOTE_RESERVER$1 = "remoteReserver";
const ROLE_CLAIMER$1 = "claimer";
const ROLE_COLONIZER$1 = "remoteColonizer";
// Attack Flag Constants
const ZEALOT_SOLO$1 = 1;
const STALKER_SOLO$1 = 2;
const STANDARD_SQUAD$1 = 3;
const OVERRIDE_D_ROOM_FLAG$1 = 6;
// The Wall/Rampart HP Limit for each Controller level
const WALL_LIMIT$1 = [
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
// Error Severity Constants
const ERROR_FATAL$2 = 3; // Very severe error - Game ruining
const ERROR_ERROR$2 = 2; // Regular error - Creep/Room ruining
const ERROR_WARN$2 = 1; // Small error - Something went wrong, but doesn't ruin anything
const ERROR_INFO$1 = 0; // Non-error - Used to log when something happens (e.g. memory is updated)
// Color Constants
const COLORS$1 = {};
COLORS$1[ERROR_FATAL$2] = "#FF0000";
COLORS$1[ERROR_ERROR$2] = "#E300FF";
COLORS$1[ERROR_WARN$2] = "#F0FF00";
COLORS$1[ERROR_INFO$1] = "#0045FF";
// Our default moveOpts object. Assign this to a new object and then adjust the values for the situation
const DEFAULT_MOVE_OPTS$1 = {
    heuristicWeight: 1.5,
    range: 0,
    ignoreCreeps: false,
    reusePath: 10,
    // swampCost: 5, // Putting this here as a reminder that we can make bigger creeps that can move on swamps
    visualizePathStyle: {} // Empty object for now, just uses default visualization
};
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
     * @param room the room we want to check
     */
    static inTravelRange(homeRoom, targetRoom) {
        const routeArray = Game.map.findRoute(homeRoom, targetRoom);
        return routeArray.length < 20;
    }
    /**
     * check if the object exists within a room
     * @param room the room we want to check
     * @param objectConst the object we want to check for
     */
    static isExistInRoom(room, objectConst) {
        return MemoryApi.getStructures(room.name, s => s.structureType === objectConst).length > 0;
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
     * check if container mining is active in a room (each source has a container in range)
     * @param room the room we are checking
     * @param sources the sources we are checking
     * @param containers the containers we are checking
     */
    static isContainerMining(room, sources, containers) {
        // Loop over sources and make sure theres at least one container in range to it
        let numMiningContainers = 0;
        _.forEach(sources, (source) => {
            if (_.some(containers, (container) => source.pos.inRangeTo(container.pos, 2))) {
                numMiningContainers++;
            }
        });
        return numMiningContainers === sources.length;
    }
    /**
     * check if the link is an upgrader link
     * TODO Complete this
     * @param room the room we are checking
     * @param sources the sources we are checking
     * @param containers the containers we are checking
     */
    static getUpgraderLink(room) {
        // Throw warning if we do not own this room
        if (!this.isOwnedRoom(room)) {
            throw new UserException("Stimulate flag check on non-owned room", "You attempted to check for a stimulate flag in a room we do not own. Room [" + room.name + "]", ERROR_WARN$1);
        }
        const links = MemoryApi.getStructureOfType(room.name, STRUCTURE_LINK);
        const controller = room.controller;
        // Break early if we don't have 3 links yet
        if (links.length < 3) {
            return null;
        }
        // Make sure theres a controller in the room
        if (!controller) {
            throw new UserException("Tried to getUpgraderLink of a room with no controller", "Get Upgrader Link was called for room [" + room.name + "]" + ", but theres no controller in this room.", ERROR_WARN$1);
        }
        // Find the closest link to the controller, this is our upgrader link
        return controller.pos.findClosestByRange(links);
    }
    /**
     * Check and see if an upgrader link exists
     * @param room the room we are checking for
     */
    static isUpgraderLink(room) {
        // Throw warning if we do not own this room
        if (!this.isOwnedRoom(room)) {
            throw new UserException("Stimulate flag check on non-owned room", "You attempted to check for a stimulate flag in a room we do not own. Room [" + room.name + "]", ERROR_WARN$1);
        }
        return this.getUpgraderLink(room) !== null;
    }
    /**
     * Check if the stimulate flag is present for a room
     * TODO Complete this
     * @param room the room we are checking for
     */
    static isStimulateRoom(room) {
        // Throw warning if we do not own this room
        if (!this.isOwnedRoom(room)) {
            throw new UserException("Stimulate flag check on non-owned room", "You attempted to check for a stimulate flag in a room we do not own. Room [" + room.name + "]", ERROR_WARN$1);
        }
        const terminal = room.terminal;
        // Check if we have a stimulate flag with the same room name as this flag
        return _.some(Memory.flags, (flag) => {
            if (flag.flagType === STIMULATE_FLAG) {
                return (Game.flags[flag.flagName].pos.roomName === room.name) && (terminal !== undefined);
            }
            return false;
        });
    }
    /**
     * choose an ideal target for the towers to attack
     * TODO actually choose an ideal target not just the first one lol
     * @param room the room we are in
     */
    static chooseTowerTarget(room) {
        // get the creep we will do the most damage to
        const hostileCreeps = MemoryApi.getHostileCreeps(room.name);
        const isHealers = _.some(hostileCreeps, (c) => _.some(c.body, (b) => b.type === "heal"));
        const isAttackers = _.some(hostileCreeps, (c) => _.some(c.body, (b) => b.type === "attack" || b.type === "ranged_attack"));
        const isWorkers = _.some(hostileCreeps, (c) => _.some(c.body, (b) => b.type === "work"));
        // If only healers are present, don't waste ammo
        if (isHealers && !isAttackers && !isWorkers) {
            return undefined;
        }
        // If healers are present with attackers, target healers
        if (isHealers && isAttackers && !isWorkers) {
            return _.find(hostileCreeps, (c) => _.some(c.body, (b) => b.type === "heal"));
        }
        // If workers are present, target worker
        if (isWorkers) {
            return _.find(hostileCreeps, (c) => _.some(c.body, (b) => b.type === "work"));
        }
        // If attackers are present, target them
        if (isAttackers) {
            return _.find(hostileCreeps, (c) => _.some(c.body, (b) => b.type === "attack"));
        }
        // If there are no hostile creeps, or we didn't find a valid target, return undefined
        return undefined;
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
        const hostiles = MemoryApi.getHostileCreeps(room.name);
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
        // TODO: Fix this to use remote room name memory which contains the actual source reference
        // TODO: remove sources and structures from the remote room dependent memory itself
        const remoteRooms = Memory.rooms[room.name].remoteRooms;
        let numSources = 0;
        _.forEach(remoteRooms, (rr) => {
            if (!rr) {
                return;
            }
            const sourcesInRoom = rr.sources.data;
            numSources += sourcesInRoom;
        });
        return numSources;
    }
    /**
     * get number of remote defenders we need
     * @param room The room to check the dependencies of
     */
    static numRemoteDefenders(room) {
        const remoteRooms = Memory.rooms[room.name].remoteRooms;
        let numRemoteDefenders = 0;
        _.forEach(remoteRooms, (rr) => {
            if (!rr) {
                return;
            }
            // If there are any hostile creeps, add one to remoteDefenderCount
            // Get hostile creeps in the remote room
            const hostileCreeps = rr.hostiles.data;
            if (hostileCreeps > 0) {
                numRemoteDefenders++;
            }
        });
        return numRemoteDefenders;
    }
    /**
     * get the number of claim rooms that have not yet been claimed
     * @param room the room we are checking for
     */
    static numCurrentlyUnclaimedClaimRooms(room) {
        const allClaimRooms = MemoryApi.getClaimRooms(room);
        const ownedRooms = MemoryApi.getOwnedRooms();
        let sum = 0;
        // No existing claim rooms
        if (allClaimRooms[0] === undefined) {
            return 0;
        }
        for (const claimRoom of allClaimRooms) {
            if (!_.some(ownedRooms, (ownedRoom) => {
                if (claimRoom) {
                    return room.name === claimRoom.roomName;
                }
                return false;
            })) {
                ++sum;
            }
        }
        return sum;
    }
}
//# sourceMappingURL=RoomHelper.js.map

/**
 * Disallow the caching of all memory
 *
 * Turning this setting on will massively reduce performance
 * but will ensure that all memory is as accurate as possible
 */
/**
 * Minimum amount of energy a container must have to be used in a GetEnergyJob
 */
const CONTAINER_MINIMUM_ENERGY = 100;
/**
 * Percentage HP to begin repairing structures (besides Ramparts and Walls)
 */
const REPAIR_THRESHOLD = .75;
/**
 * toggle for the room visual overlay
 */
const ROOM_OVERLAY_ON = true;
/**
 * The text to sign controllers with
 */
const CONTROLLER_SIGNING_TEXT = [
    "home of the dallas cowboys and the oklahoma city thunder",
    "7j2Music on spotify",
    "like taking candy from a baby",
    "terminating process goldenstatewarriors.exe",
    "durant is my aunt",
    "typescript master race",
    "static type gang",
    "resource hogs",
    "PRESCOTT/ELLIOT 2020",
    "WESTBROOK/PAUL GEORGE 2024",
    "KANYE 2024",
    "you just activated my fap card",
    ">be me\n>sign controller",
    "braces go on the same line",
    "camelCaseMasterRace",
    "++i > i++",
    "baker mayfield: american hero",
    "don't be a creep, free-think",
    "down to die for my rooms",
    "blueface baby",
    "dear family, my sanity, go down when my cash grow up",
    ""
];
/**
 * Constants for Tick Timers - Number of ticks between running the specified constant this is deciding
 */
const RUN_TOWER_TIMER = 1;
const RUN_LAB_TIMER = 5;
const RUN_LINKS_TIMER = 2;
const RUN_TERMINAL_TIMER = 5;
const RUN_ROOM_STATE_TIMER = 5;
const RUN_DEFCON_TIMER = 2;
/**
 * bucket limits for manager
 * decides the min the bucket must be to run this manager
 */
const CREEP_MANAGER_BUCKET_LIMIT = 1000;
const SPAWN_MANAGER_BUCKET_LIMIT = 50;
const EMPIRE_MANAGER_BUCKET_LIMIT = 5000;
const ROOM_MANAGER_BUCKET_LIMIT = 500;
const MEMORY_MANAGER_BUCKET_LIMIT = 1;
//# sourceMappingURL=config.js.map

// an api used for functions related to the room
class RoomApi {
    /**
     * check if there are hostile creeps in the room
     * @param room the room we are checking
     */
    static isHostilesInRoom(room) {
        const hostilesInRoom = MemoryApi.getHostileCreeps(room.name);
        return hostilesInRoom.length > 0;
    }
    /**
     * set the room's state
     * Essentially backbone of the room, decides what flow
     * of action will be taken at the beginning of each tick
     * (note: assumes defcon already being found for simplicity sake)
     * @param room the room we are setting state for
     */
    static setRoomState(room) {
        // If theres no controller, throw an error
        if (!room.controller) {
            throw new UserException("Can't set room state for room with no controller!", "You attempted to call setRoomState on room [" + room.name + "]. Theres no controller here.", ERROR_WARN$2);
        }
        // ----------
        // check if we are in nuke inbound room state
        // nuke is coming in and we need to gtfo, but they take like 20k ticks, so only check every 1000 or so
        if (RoomHelper.excecuteEveryTicks(1000)) {
            const incomingNukes = room.find(FIND_NUKES);
            if (incomingNukes.length > 0) {
                MemoryApi.updateRoomState(ROOM_STATE_NUKE_INBOUND$1, room);
                return;
            }
        }
        // ----------
        // check if we are in intro room state
        // 3 or less creeps so we need to (re)start the room
        const creeps = MemoryApi.getMyCreeps(room.name);
        if (creeps.length < 3) {
            MemoryApi.updateRoomState(ROOM_STATE_INTRO$1, room);
            return;
        }
        // ----------
        const storage = room.storage;
        const containers = MemoryApi.getStructureOfType(room.name, STRUCTURE_CONTAINER);
        const sources = MemoryApi.getSources(room.name);
        if (room.controller.level >= 6) {
            // check if we are in upgrader room state
            // container mining and storage set up, and we got links online
            if (RoomHelper.isContainerMining(room, sources, containers) &&
                RoomHelper.isUpgraderLink(room) &&
                storage !== undefined) {
                if (RoomHelper.isStimulateRoom(room)) {
                    MemoryApi.updateRoomState(ROOM_STATE_STIMULATE$1, room);
                    return;
                }
                // otherwise, just upgrader room state
                MemoryApi.updateRoomState(ROOM_STATE_UPGRADER$1, room);
                return;
            }
        }
        // ----------
        if (room.controller.level >= 4) {
            // check if we are in advanced room state
            // container mining and storage set up
            // then check if we are flagged for sitmulate state
            if (RoomHelper.isContainerMining(room, sources, containers) && storage !== undefined) {
                if (RoomHelper.isStimulateRoom(room)) {
                    MemoryApi.updateRoomState(ROOM_STATE_STIMULATE$1, room);
                    return;
                }
                // otherwise, just advanced room state
                MemoryApi.updateRoomState(ROOM_STATE_ADVANCED$1, room);
                return;
            }
        }
        // ----------
        if (room.controller.level >= 3) {
            // check if we are in intermediate room state
            // container mining set up, but no storage
            if (RoomHelper.isContainerMining(room, sources, containers) && storage === undefined) {
                MemoryApi.updateRoomState(ROOM_STATE_INTER$1, room);
                return;
            }
        }
        // ----------
        // check if we are in beginner room state
        // no containers set up at sources so we are just running a bare knuckle room
        if (creeps.length >= 3) {
            MemoryApi.updateRoomState(ROOM_STATE_BEGINNER$1, room);
            return;
        }
        // ----------
    }
    /**
     * run the towers in the room
     * @param room the room we are defending
     */
    static runTowers(room) {
        const towers = MemoryApi.getStructureOfType(room.name, STRUCTURE_TOWER);
        // choose the most ideal target and have every tower attack it
        const idealTarget = RoomHelper.chooseTowerTarget(room);
        // have each tower attack this target
        towers.forEach((t) => {
            if (t) {
                t.attack(idealTarget);
            }
        });
    }
    /**
     * set the rooms defcon level
     * @param room the room we are setting defcon for
     */
    static setDefconLevel(room) {
        const hostileCreeps = MemoryApi.getHostileCreeps(room.name);
        // check level 0 first to reduce cpu drain as it will be the most common scenario
        // level 0 -- no danger
        if (hostileCreeps.length === 0) {
            room.memory.defcon = 0;
            return;
        }
        // now define the variables we will need to check the other cases in the event
        // we are not dealing with a level 0 defcon scenario
        const hostileBodyParts = _.sum(hostileCreeps, (c) => c.body.length);
        const boostedHostileBodyParts = _.filter(_.flatten(_.map(hostileCreeps, "body")), (p) => !!p.boost)
            .length;
        // level 5 -- nuke inbound
        if (room.find(FIND_NUKES).length > 0) {
            room.memory.defcon = 5;
            return;
        }
        // level 4 full seige, 50+ boosted parts
        if (boostedHostileBodyParts >= 50) {
            room.memory.defcon = 4;
            return;
        }
        // level 3 -- 150+ body parts OR any boosted body parts
        if (boostedHostileBodyParts > 0 || hostileBodyParts >= 150) {
            room.memory.defcon = 3;
            return;
        }
        // level 2 -- 50 - 150 body parts
        if (hostileBodyParts < 150 && hostileBodyParts >= 50) {
            room.memory.defcon = 2;
            return;
        }
        // level 1 -- less than 50 body parts
        room.memory.defcon = 1;
        return;
    }
    /**
     * get repair targets for the room (any structure under 75% hp)
     * @param room the room we are checking for repair targets
     */
    static getRepairTargets(room) {
        const repairStructures = MemoryApi.getStructures(room.name, (struct) => {
            if (struct.structureType !== STRUCTURE_RAMPART && struct.structureType !== STRUCTURE_WALL) {
                return struct.hits < (struct.hitsMax * REPAIR_THRESHOLD);
            }
            return false;
        });
        if (repairStructures.length === 0) {
            return MemoryApi.getStructures(room.name, (struct) => {
                if (struct.structureType === STRUCTURE_RAMPART || struct.structureType === STRUCTURE_WALL) {
                    return struct.hits < this.getWallHpLimit(room) * REPAIR_THRESHOLD;
                }
                return false;
            });
        }
        return repairStructures;
    }
    /**
     * get spawn/extensions that need to be filled for the room
     * @param room the room we are getting spawns/extensions to be filled from
     */
    static getLowSpawnAndExtensions(room) {
        const extensionsNeedFilled = MemoryApi.getStructureOfType(room.name, STRUCTURE_EXTENSION, (e) => {
            return e.energy < e.energyCapacity;
        });
        const spawnsNeedFilled = MemoryApi.getStructureOfType(room.name, STRUCTURE_SPAWN, (e) => {
            return e.energy < e.energyCapacity;
        });
        const extensionsAndSpawns = [];
        _.forEach(extensionsNeedFilled, (ext) => extensionsAndSpawns.push(ext));
        _.forEach(spawnsNeedFilled, (ext) => extensionsAndSpawns.push(ext));
        return extensionsAndSpawns;
    }
    /**
     * get towers that need to be filled for the room
     * TODO order by ascending
     * @param room the room we are getting towers that need to be filled from
     */
    static getTowersNeedFilled(room) {
        const TOWER_THRESHOLD = 0.85;
        return MemoryApi.getStructureOfType(room.name, STRUCTURE_TOWER, (t) => {
            return t.energy < t.energyCapacity * TOWER_THRESHOLD;
        });
    }
    /**
     * get ramparts, or ramparts and walls that need to be repaired
     * @param room the room we are getting ramparts/walls that need to be repaired from
     */
    static getWallRepairTargets(room) {
        // returns all walls and ramparts under the current wall/rampart limit
        const hpLimit = this.getWallHpLimit(room);
        const walls = MemoryApi.getStructureOfType(room.name, STRUCTURE_WALL, (s) => s.hits < hpLimit);
        const ramparts = MemoryApi.getStructureOfType(room.name, STRUCTURE_RAMPART, (s) => s.hits < hpLimit);
        return walls.concat(ramparts);
    }
    /**
     * get a list of open sources in the room (not saturated)
     * @param room the room we are checking
     */
    static getOpenSources(room) {
        const sources = MemoryApi.getSources(room.name);
        // ? this assumes that we are only using this for domestic rooms
        // ? if we use it on domestic rooms then I'll need to distinguish between ROLE_REMOTE_MINER
        const miners = MemoryHelper.getCreepOfRole(room, ROLE_MINER$1);
        const lowSources = _.filter(sources, (source) => {
            let totalWorkParts = 0;
            // Count the number of work parts targeting the source
            _.remove(miners, (miner) => {
                if (!miner.memory.job) {
                    return false;
                }
                if (miner.memory.job.targetID === source.id) {
                    const workPartCount = miner.getActiveBodyparts(WORK);
                    totalWorkParts += workPartCount;
                    return true;
                }
                return false;
            });
            // filter out sources where the totalWorkParts < workPartsNeeded ( energyCap / ticksToReset / energyPerPart )
            return totalWorkParts < source.energyCapacity / 300 / 2;
        });
        return lowSources;
    }
    /**
     * gets the drop container next to the source
     * @param room the room we are checking in
     * @param source the source we are considering
     */
    static getMiningContainer(room, source) {
        const containers = MemoryApi.getStructureOfType(room.name, STRUCTURE_CONTAINER);
        return _.find(containers, (c) => Math.abs(c.pos.x - source.pos.x) <= 1 && Math.abs(c.pos.y - source.pos.y) <= 1);
    }
    /**
     * checks if a structure or creep store is full
     * @param target the structure or creep we are checking
     */
    static isFull(target) {
        if (target instanceof Creep) {
            return _.sum(target.carry) === target.carryCapacity;
        }
        else if (target.hasOwnProperty("store")) {
            return _.sum(target.store) === target.storeCapacity;
        }
        // if not one of these two, there was an error
        throw new UserException("Invalid Target", "isFull called on target with no capacity for storage.", ERROR_ERROR$2);
    }
    /**
     * get the current hp limit for walls/ramparts
     * @param room the current room
     */
    static getWallHpLimit(room) {
        // only do so if the room has a controller otherwise we have an exception
        if (room.controller !== undefined) {
            // % of way to next level
            const controllerProgress = room.controller.progress / room.controller.progressTotal;
            // difference between this levels max and last levels max
            const wallLevelHpDiff = RoomHelper.getWallLevelDifference(room.controller.level);
            // Minimum hp chunk to increase limit
            const chunkSize = 10000;
            // The adjusted hp difference for controller progress and chunking
            const numOfChunks = Math.floor((wallLevelHpDiff * controllerProgress) / chunkSize);
            return WALL_LIMIT$1[room.controller.level] + chunkSize * numOfChunks;
        }
        else {
            throw new UserException("Undefined Controller", "Error getting wall limit for room with undefined controller.", ERROR_ERROR$2);
        }
    }
    /**
     * run links for the room
     * @param room the room we want to run links for
     */
    static runLinks(room) {
        // If we don't have an upgrader link, cancel early
        const upgraderLink = MemoryApi.getUpgraderLink(room);
        if (!upgraderLink || upgraderLink.energy <= 400) {
            return;
        }
        // Get non-upgrader links above 100 energy to fill the upgrader link
        const nonUpgraderLinks = MemoryApi.getStructureOfType(room.name, STRUCTURE_LINK, (link) => link.id !== upgraderLink.id && link.energy >= 100);
        for (const link of nonUpgraderLinks) {
            if (link.cooldown > 0) {
                continue;
            }
            // Get the amount of energy we are sending over
            const missingEnergy = upgraderLink.energyCapacity - upgraderLink.energy;
            let amountToTransfer = 0;
            if (missingEnergy > link.energy) {
                amountToTransfer = link.energy;
            }
            else {
                amountToTransfer = missingEnergy;
            }
            link.transferEnergy(upgraderLink, amountToTransfer);
        }
    }
    /**
     * run terminal for the room
     * @param room the room we want to run terminal for
     */
    static runTerminal(room) {
        // here we can do market stuff, send resources from room to room
        // to each other, and make sure we have the ideal ratio of minerals
        // we decide that we want
    }
    /**
     * run labs for the room
     * @param room the room we want to run labs for
     */
    static runLabs(room) {
        // i have no idea yet lol
    }
}
//# sourceMappingURL=Room.Api.js.map

// TODO Create jobs for tombstones and dropped resources if wanted
class GetEnergyJobs {
    /**
     * Gets a list of GetEnergyJobs for the sources of a room
     * @param room The room to create the job list for
     * [Accurate-Restore] Adjusts for creeps targeting it
     */
    static createSourceJobs(room) {
        // List of all sources that are under optimal work capacity
        const openSources = RoomApi.getOpenSources(room);
        if (openSources.length === 0) {
            return [];
        }
        const sourceJobList = [];
        _.forEach(openSources, (source) => {
            // Get all miners that are targeting this source
            const miners = MemoryApi.getMyCreeps(room.name, (creep) => {
                if (creep.memory.role === ROLE_MINER && creep.memory.job && creep.memory.job.targetID === source.id) {
                    // * Can optionally add another statement here that checks if creep has enough life to be considered part of the job
                    return true;
                }
                return false;
            });
            // The Number of work parts those miners have
            const numWorkParts = _.sum(miners, (creep) => creep.getActiveBodyparts(WORK));
            // 2 energy per part per tick * 300 ticks to regen a source = effective mining capacity
            const sourceEnergyRemaining = source.energyCapacity - 2 * numWorkParts * 300;
            // Create the StoreDefinition for the source
            const sourceResources = { energy: sourceEnergyRemaining };
            // Create the GetEnergyJob object for the source
            const sourceJob = {
                jobType: "getEnergyJob",
                targetID: source.id,
                targetType: "source",
                actionType: "harvest",
                resources: sourceResources,
                isTaken: sourceEnergyRemaining <= 0 // Taken if no energy remaining
            };
            // Append the GetEnergyJob to the main array
            sourceJobList.push(sourceJob);
        });
        return sourceJobList;
    }
    /**
     * Gets a list of GetEnergyJobs for the containers of a room
     * @param room The room to create the job list for
     * [Accurate-Restore] Adjusts for creeps currently targeting it
     */
    static createContainerJobs(room) {
        // List of all containers with >= CONTAINER_MINIMUM_ENERGY (from config.ts)
        const containers = MemoryApi.getStructureOfType(room.name, STRUCTURE_CONTAINER, (container) => container.store.energy > CONTAINER_MINIMUM_ENERGY);
        if (containers.length === 0) {
            return [];
        }
        const containerJobList = [];
        _.forEach(containers, (container) => {
            // Get all creeps that are targeting this container to withdraw from it
            const creepsUsingContainer = MemoryApi.getMyCreeps(room.name, (creep) => {
                if (creep.memory.job &&
                    creep.memory.job.targetID === container.id &&
                    creep.memory.job.actionType === "withdraw") {
                    return true;
                }
                return false;
            });
            // The container.store we will use instead of the true value
            const adjustedContainerStore = container.store;
            // Subtract the empty carry of creeps targeting this container to withdraw
            _.forEach(creepsUsingContainer, (creep) => {
                adjustedContainerStore.energy -= creep.carryCapacity - creep.carry.energy;
            });
            // Create the containerJob
            const containerJob = {
                jobType: "getEnergyJob",
                targetID: container.id,
                targetType: STRUCTURE_CONTAINER,
                actionType: "withdraw",
                resources: adjustedContainerStore,
                isTaken: _.sum(adjustedContainerStore) <= 0 // Taken if empty
            };
            // Append to the main array
            containerJobList.push(containerJob);
        });
        return containerJobList;
    }
    /**
     * Gets a list of GetEnergyJobs for the links of a room
     * @param room The room to create the job list for
     */
    static createLinkJobs(room) {
        const linkJobList = [];
        if (linkJobList.length === 0) {
            return [];
        }
        const upgraderLink = MemoryApi.getUpgraderLink(room);
        if (upgraderLink !== undefined && upgraderLink !== null) {
            const linkStore = { energy: upgraderLink.energy };
            const linkJob = {
                jobType: "getEnergyJob",
                targetID: upgraderLink.id,
                targetType: STRUCTURE_LINK,
                actionType: "withdraw",
                resources: linkStore,
                isTaken: false
            };
            linkJobList.push(linkJob);
        }
        return linkJobList;
    }
    /**
     * Gets a list of GetEnergyJobs for the backup structures of a room (terminal, storage)
     * @param room  The room to create the job list
     * [No-Restore] Uses a new job every time
     */
    static createBackupStructuresJobs(room) {
        const backupJobList = [];
        // Create the storage job if active
        if (room.storage !== undefined) {
            const storageJob = {
                jobType: "getEnergyJob",
                targetID: room.storage.id,
                targetType: STRUCTURE_STORAGE,
                actionType: "withdraw",
                resources: room.storage.store,
                isTaken: false
            };
            backupJobList.push(storageJob);
        }
        // Create the terminal job if active
        if (room.terminal !== undefined) {
            const terminalJob = {
                jobType: "getEnergyJob",
                targetID: room.terminal.id,
                targetType: STRUCTURE_TERMINAL,
                actionType: "withdraw",
                resources: room.terminal.store,
                isTaken: false
            };
            backupJobList.push(terminalJob);
        }
        return backupJobList;
    }
    /**
     * Gets a list of GetEnergyJobs for the dropped resources of a room
     * @param room The room to create the job for
     * [Accurate-Restore] Adjusts for creeps targeting it
     */
    static createPickupJobs(room) {
        // All dropped energy in the room
        const drops = MemoryApi.getDroppedResources(room);
        if (drops.length === 0) {
            return [];
        }
        const dropJobList = [];
        _.forEach(drops, (drop) => {
            const dropStore = { energy: 0 };
            dropStore[drop.resourceType] = drop.amount;
            const creepsUsingDrop = MemoryApi.getMyCreeps(room.name, (creep) => {
                if (creep.memory.job &&
                    creep.memory.job.targetID === drop.id &&
                    creep.memory.job.actionType === "pickup") {
                    return true;
                }
                return false;
            });
            // Subtract creep's carryspace from drop amount
            dropStore[drop.resourceType] -= _.sum(creepsUsingDrop, creep => creep.carryCapacity - _.sum(creep.carry));
            const dropJob = {
                jobType: "getEnergyJob",
                targetID: drop.id,
                targetType: "droppedResource",
                resources: dropStore,
                actionType: "pickup",
                isTaken: false
            };
            dropJobList.push(dropJob);
        });
        return dropJobList;
    }
}
//# sourceMappingURL=GetEnergyJobs.js.map

class ClaimPartJobs {
    /**
     * Gets a list of ClaimJobs for the Room
     * @param room The room to get the jobs for
     */
    static createClaimJobs(room) {
        // TODO Get a list of rooms to be claimed somehow
        const roomNames = [];
        if (roomNames.length === 0) {
            return [];
        }
        const claimJobs = [];
        _.forEach(roomNames, (name) => {
            const claimJob = {
                jobType: "claimPartJob",
                targetID: name,
                targetType: "roomName",
                actionType: "claim",
                isTaken: false
            };
            claimJobs.push(claimJob);
        });
        return claimJobs;
    }
    /**
     * Gets a list of ReserveJobs for the room
     * @param room The room to get the jobs for
     */
    static createReserveJobs(room) {
        // TODO Get a list of rooms to be reserved
        const roomNames = [];
        if (roomNames.length === 0) {
            return [];
        }
        const reserveJobs = [];
        _.forEach(roomNames, (name) => {
            const reserveJob = {
                jobType: "claimPartJob",
                targetID: name,
                targetType: "roomName",
                actionType: "reserve",
                isTaken: false
            };
            reserveJobs.push(reserveJob);
        });
        return reserveJobs;
    }
    /**
     * Gets a list of SignJobs for the room (signing the controller)
     * @param room The room to get the jobs for
     */
    static createSignJobs(room) {
        // TODO Get a list of controllers to be signed
        const controllers = [];
        if (controllers.length === 0) {
            return [];
        }
        const signJobs = [];
        _.forEach(controllers, (controller) => {
            const signJob = {
                jobType: "claimPartJob",
                targetID: controller.id,
                targetType: "controller",
                actionType: "sign",
                isTaken: false
            };
            signJobs.push(signJob);
        });
        return signJobs;
    }
    /**
     * Gets a list of AttackJobs for the room (attacking enemy controller)
     * @param room The room to get the jobs for
     */
    static createAttackJobs(room) {
        // TODO Get a list of rooms to attack
        const roomNames = [];
        if (roomNames.length === 0) {
            return [];
        }
        const attackJobs = [];
        _.forEach(roomNames, (name) => {
            const attackJob = {
                jobType: "claimPartJob",
                targetID: name,
                targetType: "roomName",
                actionType: "attack",
                isTaken: false
            };
            attackJobs.push(attackJob);
        });
        return attackJobs;
    }
}
//# sourceMappingURL=ClaimPartJobs.js.map

class WorkPartJobs {
    /**
     * Gets a list of repairJobs for the room
     * @param room The room to get jobs for
     * [Accurate-Restore] Chooses the lower of two values
     */
    static createRepairJobs(room) {
        const repairTargets = RoomApi.getRepairTargets(room);
        if (repairTargets.length === 0) {
            return [];
        }
        const repairJobs = [];
        _.forEach(repairTargets, (structure) => {
            const repairJob = {
                jobType: "workPartJob",
                targetID: structure.id,
                targetType: structure.structureType,
                actionType: "repair",
                remaining: structure.hitsMax - structure.hits,
                isTaken: false
            };
            const creepTargeting = MemoryApi.getMyCreeps(room.name, (creep) => {
                return (creep.memory.job !== undefined &&
                    creep.memory.job.targetID === structure.id &&
                    creep.memory.job.actionType === "repair");
            });
            // Repair 20 hits/part/tick at .1 energy/hit rounded up to nearest whole number
            _.forEach(creepTargeting, (creep) => {
                repairJob.remaining -= Math.ceil(creep.carry.energy * 0.1);
            });
            if (repairJob.remaining <= 0) {
                repairJob.isTaken = true;
            }
            repairJobs.push(repairJob);
        });
        return repairJobs;
    }
    /**
     * Gets a list of buildJobs for the room
     * @param room The room to get jobs for
     * [Accurate-Restore] Chooses the lower of two values
     */
    static createBuildJobs(room) {
        const constructionSites = MemoryApi.getConstructionSites(room.name);
        if (constructionSites.length === 0) {
            return [];
        }
        const buildJobs = [];
        _.forEach(constructionSites, (cs) => {
            const buildJob = {
                jobType: "workPartJob",
                targetID: cs.id,
                targetType: "constructionSite",
                actionType: "build",
                remaining: cs.progressTotal - cs.progress,
                isTaken: false
            };
            const creepsTargeting = MemoryApi.getMyCreeps(room.name, (creep) => {
                return creep.memory.job !== undefined && creep.memory.job.targetID === cs.id;
            });
            // 1 to 1 ratio energy to points built
            _.forEach(creepsTargeting, (creep) => (buildJob.remaining -= creep.carry.energy));
            if (buildJob.remaining <= 0) {
                buildJob.isTaken = true;
            }
            buildJobs.push(buildJob);
        });
        return buildJobs;
    }
    /**
     * Gets a list of upgradeJobs for the room
     * @param room The room to get jobs
     * [No-Restore] Create a fresh job every time
     */
    static createUpgradeJobs(room) {
        // Just returning a single upgrade controller job for now
        // ? Should we generate multiple jobs based on how many we expect to be upgrading/ how many power upgraders there are?
        const upgradeJobs = [];
        if (room.controller !== undefined) {
            const controllerJob = {
                jobType: "workPartJob",
                targetID: room.controller.id,
                targetType: "controller",
                actionType: "upgrade",
                remaining: room.controller.progressTotal - room.controller.progress,
                isTaken: false
            };
            upgradeJobs.push(controllerJob);
        }
        return upgradeJobs;
    }
}
//# sourceMappingURL=WorkPartJobs.js.map

class CarryPartJobs {
    /**
     * Gets a list of fill jobs for the room
     * @param room The room to get the jobs for
     * [Accurate-Restore]
     */
    static createFillJobs(room) {
        const lowSpawnsAndExtensions = RoomApi.getLowSpawnAndExtensions(room);
        const lowTowers = RoomApi.getTowersNeedFilled(room);
        if (lowSpawnsAndExtensions.length === 0 && lowTowers.length === 0) {
            return [];
        }
        const fillJobs = [];
        _.forEach(lowSpawnsAndExtensions, (structure) => {
            const creepsUsing = MemoryApi.getMyCreeps(room.name, (creep) => {
                return (creep.memory.job !== undefined &&
                    creep.memory.job.targetID === structure.id &&
                    creep.memory.job.actionType === "transfer");
            });
            const creepCapacity = _.sum(creepsUsing, (creep) => creep.carryCapacity - _.sum(creep.carry));
            const storageSpace = structure.energyCapacity - structure.energy - creepCapacity;
            const fillJob = {
                jobType: "carryPartJob",
                targetID: structure.id,
                targetType: structure.structureType,
                remaining: storageSpace,
                actionType: "transfer",
                isTaken: storageSpace <= 0
            };
            fillJobs.push(fillJob);
        });
        _.forEach(lowTowers, (structure) => {
            const creepsUsing = MemoryApi.getMyCreeps(room.name, (creep) => {
                if (creep.memory.job &&
                    creep.memory.job.targetID === structure.id &&
                    creep.memory.job.actionType === "transfer") {
                    return true;
                }
                return false;
            });
            const creepCapacity = _.sum(creepsUsing, (creep) => creep.carryCapacity - _.sum(creep.carry));
            const storageSpace = structure.energyCapacity - structure.energy - creepCapacity;
            const fillJob = {
                jobType: "carryPartJob",
                targetID: structure.id,
                targetType: structure.structureType,
                remaining: storageSpace,
                actionType: "transfer",
                isTaken: storageSpace <= 0
            };
            fillJobs.push(fillJob);
        });
        return fillJobs;
    }
    /**
     * Gets a list of store jobs for the room
     * @param room The room to get the jobs for
     * [No-Restore] New job every time
     */
    static createStoreJobs(room) {
        const storeJobs = [];
        if (room.storage !== undefined) {
            const storageJob = {
                jobType: "carryPartJob",
                targetID: room.storage.id,
                targetType: STRUCTURE_STORAGE,
                remaining: room.storage.storeCapacity - _.sum(room.storage.store),
                actionType: "transfer",
                isTaken: false
            };
            storeJobs.push(storageJob);
        }
        if (room.terminal !== undefined) {
            const terminalJob = {
                jobType: "carryPartJob",
                targetID: room.terminal.id,
                targetType: STRUCTURE_TERMINAL,
                remaining: room.terminal.storeCapacity - _.sum(room.terminal.store),
                actionType: "transfer",
                isTaken: false
            };
            storeJobs.push(terminalJob);
        }
        const upgraderLink = MemoryApi.getUpgraderLink(room);
        if (upgraderLink) {
            const nonUpgraderLinks = MemoryApi.getStructureOfType(room.name, STRUCTURE_LINK, (link) => link.id !== upgraderLink.id && link.energy < link.energyCapacity);
            _.forEach(nonUpgraderLinks, (link) => {
                const fillLinkJob = {
                    jobType: "carryPartJob",
                    targetID: link.id,
                    targetType: STRUCTURE_LINK,
                    remaining: link.energyCapacity - link.energy,
                    actionType: "transfer",
                    isTaken: false
                };
                storeJobs.push(fillLinkJob);
            });
        }
        return storeJobs;
    }
}
//# sourceMappingURL=CarryPartJobs.js.map

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
        this.updateHostileCreeps(room.name);
        this.updateMyCreeps(room.name);
        // Update structures/construction sites
        this.updateConstructionSites(room.name);
        this.updateStructures(room.name);
        // Update sources, minerals, dropped resources, tombstones
        this.updateSources(room.name);
        this.updateMinerals(room);
        this.updateDroppedResources(room);
        this.updateTombstones(room);
        // Update Custom Memory Components
        this.updateDependentRooms(room);
        // Update Job Lists
        this.updateGetEnergy_allJobs(room);
        this.updateCarryPart_allJobs(room);
        this.updateWorkPart_allJobs(room);
        this.updateClaimPart_allJobs(room);
        // Calling the below function is equivalent to calling all of the above updateGetEnergy_xxxxxJobs functions
        // this.updateGetEnergy_allJobs(room);
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
    static updateHostileCreeps(roomName) {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }
        Memory.rooms[roomName].hostiles = { data: { ranged: [], melee: [], heal: [], boosted: [] }, cache: null };
        const enemies = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        // Sort creeps into categories
        _.forEach(enemies, (enemy) => {
            // * Check for boosted creeps and put them at the front of the if else stack
            if (enemy.getActiveBodyparts(HEAL) > 0) {
                Memory.rooms[roomName].hostiles.data.heal.push(enemy.id);
            }
            else if (enemy.getActiveBodyparts(RANGED_ATTACK) > 0) {
                Memory.rooms[roomName].hostiles.data.ranged.push(enemy.id);
            }
            else if (enemy.getActiveBodyparts(ATTACK) > 0) {
                Memory.rooms[roomName].hostiles.data.melee.push(enemy.id);
            }
        });
        Memory.rooms[roomName].hostiles.cache = Game.time;
    }
    /**
     * Find all owned creeps in room
     * ? Should we filter these by role into memory? E.g. creeps.data.miners
     * [Cached] Room.memory.creeps
     * @param room The Room we are checking in
     */
    static updateMyCreeps(roomName) {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }
        Memory.rooms[roomName].creeps = { data: null, cache: null };
        // Changed this because it wouldn't catch remote squads for example
        // as they aren't actually in the room all the time (had this problem with my last solo code base)
        const creeps = _.filter(Game.creeps, creep => creep.memory.homeRoom === roomName);
        Memory.rooms[roomName].creeps.data = _.map(creeps, (creep) => creep.id);
        Memory.rooms[roomName].creeps.cache = Game.time;
    }
    /**
     * Find all construction sites in room
     *
     * [Cached] Room.memory.constructionSites
     * @param room The Room we are checking in
     */
    static updateConstructionSites(roomName) {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }
        Memory.rooms[roomName].constructionSites = { data: null, cache: null };
        const constructionSites = Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES);
        Memory.rooms[roomName].constructionSites.data = _.map(constructionSites, (c) => c.id);
        Memory.rooms[roomName].constructionSites.cache = Game.time;
    }
    /**
     * Find all structures in room
     *
     * [Cached] Room.memory.structures
     * @param room The Room we are checking in
     */
    static updateStructures(roomName) {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }
        Memory.rooms[roomName].structures = { data: {}, cache: null };
        const allStructures = Game.rooms[roomName].find(FIND_STRUCTURES);
        const sortedStructureIDs = {};
        // For each structureType, remove the structures from allStructures and map them to ids in the memory object.
        _.forEach(ALL_STRUCTURE_TYPES, (type) => {
            sortedStructureIDs[type] = _.map(_.remove(allStructures, (struct) => struct.structureType === type), (struct) => struct.id);
        });
        Memory.rooms[roomName].structures.data = sortedStructureIDs;
        Memory.rooms[roomName].structures.cache = Game.time;
    }
    /**
     * Find all sources in room
     *
     * [Cached] Room.memory.sources
     * @param room The room to check in
     */
    static updateSources(roomName) {
        // If we have no vision of the room, return
        if (!Memory.rooms[roomName]) {
            return;
        }
        Memory.rooms[roomName].sources = { data: {}, cache: null };
        const sources = Game.rooms[roomName].find(FIND_SOURCES);
        Memory.rooms[roomName].sources.data = _.map(sources, (source) => source.id);
        Memory.rooms[roomName].sources.cache = Game.time;
    }
    /**
     * Find all sources in room
     *
     * [Cached] Room.memory.sources
     * @param room The room to check in
     */
    static updateMinerals(room) {
        Memory.rooms[room.name].minerals = { data: {}, cache: null };
        const minerals = room.find(FIND_MINERALS);
        Memory.rooms[room.name].minerals.data = _.map(minerals, (mineral) => mineral.id);
        Memory.rooms[room.name].minerals.cache = Game.time;
    }
    /**
     * Finds all tombstones in room
     *
     * @param room The room to check in
     */
    static updateTombstones(room) {
        Memory.rooms[room.name].tombstones = { data: {}, cache: null };
        const tombstones = room.find(FIND_TOMBSTONES);
        Memory.rooms[room.name].tombstones.data = _.map(tombstones, (tombstone) => tombstone.id);
        Memory.rooms[room.name].tombstones.cache = Game.time;
    }
    /**
     * Find all dropped resources in a room
     *
     * @param room The room to check in
     */
    static updateDroppedResources(room) {
        Memory.rooms[room.name].droppedResources = { data: {}, cache: null };
        const droppedResources = room.find(FIND_DROPPED_RESOURCES);
        Memory.rooms[room.name].droppedResources.data = _.map(droppedResources, (resource) => resource.id);
        Memory.rooms[room.name].droppedResources.cache = Game.time;
    }
    /**
     * update the room state
     * @param room the room we are updating
     * @param stateConst the state we are applying to the room
     */
    static updateRoomState(room) {
        RoomApi.setRoomState(room);
        return;
    }
    /**
     * update the room defcon
     * @param room the room we are updating
     * @param stateConst the defcon we are applying to the room
     */
    static updateDefcon(room) {
        RoomApi.setDefconLevel(room);
        return;
    }
    /**
     * Update the room's GetEnergyJobListing
     * @param room The room to update the memory of
     * @param jobList The object to store in `Memory.rooms[room.name].jobs.getEnergyJobs`
     */
    static updateGetEnergy_allJobs(room) {
        this.updateGetEnergy_sourceJobs(room);
        this.updateGetEnergy_containerJobs(room);
        this.updateGetEnergy_linkJobs(room);
        this.updateGetEnergy_backupStructuresJobs(room);
        this.updateGetEnergy_pickupJobs(room);
    }
    /**
     * Update the room's GetEnergyJobListing_sourceJobs
     * TODO Change this function to restore old job memory, rather than delete it and refresh it
     * @param room The room to update the memory of
     */
    static updateGetEnergy_sourceJobs(room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }
        Memory.rooms[room.name].jobs.getEnergyJobs.sourceJobs = {
            data: GetEnergyJobs.createSourceJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    static updateGetEnergy_containerJobs(room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }
        Memory.rooms[room.name].jobs.getEnergyJobs.containerJobs = {
            data: GetEnergyJobs.createContainerJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's GetEnergyJobListing_linkJobs
     * @param room The room to update the memory fo
     */
    static updateGetEnergy_linkJobs(room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }
        Memory.rooms[room.name].jobs.getEnergyJobs.linkJobs = {
            data: GetEnergyJobs.createLinkJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    static updateGetEnergy_backupStructuresJobs(room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }
        Memory.rooms[room.name].jobs.getEnergyJobs.backupStructures = {
            data: GetEnergyJobs.createBackupStructuresJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's GetEnergyJobListing_containerJobs
     * @param room The room to update the memory fo
     */
    static updateGetEnergy_pickupJobs(room) {
        if (Memory.rooms[room.name].jobs.getEnergyJobs === undefined) {
            Memory.rooms[room.name].jobs.getEnergyJobs = {};
        }
        Memory.rooms[room.name].jobs.getEnergyJobs.pickupJobs = {
            data: GetEnergyJobs.createPickupJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's ClaimPartJobListing
     * @param room The room to update the memory of
     * @param jobList The object to store in `Memory.rooms[room.name].jobs.getEnergyJobs`
     */
    static updateClaimPart_allJobs(room) {
        this.updateClaimPart_claimJobs(room);
        this.updateClaimPart_reserveJobs(room);
        this.updateClaimPart_signJobs(room);
        this.updateClaimPart_controllerAttackJobs(room);
    }
    /**
     * Update the room's ClaimPartJobListing_claimJobs
     * @param room The room to update the memory of
     */
    static updateClaimPart_claimJobs(room) {
        if (Memory.rooms[room.name].jobs.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs.claimPartJobs = {};
        }
        Memory.rooms[room.name].jobs.claimPartJobs.claimJobs = {
            data: ClaimPartJobs.createClaimJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's ClaimPartJobListing_reserveJobs
     * @param room The room to update the memory of
     */
    static updateClaimPart_reserveJobs(room) {
        if (Memory.rooms[room.name].jobs.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs.claimPartJobs = {};
        }
        Memory.rooms[room.name].jobs.claimPartJobs.reserveJobs = {
            data: ClaimPartJobs.createReserveJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's ClaimPartJobListing_signJobs
     * @param room The room to update the memory of
     */
    static updateClaimPart_signJobs(room) {
        if (Memory.rooms[room.name].jobs.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs.claimPartJobs = {};
        }
        Memory.rooms[room.name].jobs.claimPartJobs.signJobs = {
            data: ClaimPartJobs.createSignJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's ClaimPartJobListing_attackJobs
     * @param room The room to update the memory of
     */
    static updateClaimPart_controllerAttackJobs(room) {
        if (Memory.rooms[room.name].jobs.claimPartJobs === undefined) {
            Memory.rooms[room.name].jobs.claimPartJobs = {};
        }
        Memory.rooms[room.name].jobs.claimPartJobs.attackJobs = {
            data: ClaimPartJobs.createAttackJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's WorkPartJobListing
     * @param room The room to update the memory of
     */
    static updateWorkPart_allJobs(room) {
        this.updateWorkPart_repairJobs(room);
        this.updateWorkPart_buildJobs(room);
        this.updateWorkPart_upgradeJobs(room);
    }
    /**
     * Update the room's WorkPartJobListing_repairJobs
     * @param room The room to update the memory of
     */
    static updateWorkPart_repairJobs(room) {
        if (Memory.rooms[room.name].jobs.workPartJobs === undefined) {
            Memory.rooms[room.name].jobs.workPartJobs = {};
        }
        Memory.rooms[room.name].jobs.workPartJobs.repairJobs = {
            data: WorkPartJobs.createRepairJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's WorkPartJobListing_buildJobs
     * @param room The room to update the memory of
     */
    static updateWorkPart_buildJobs(room) {
        if (Memory.rooms[room.name].jobs.workPartJobs === undefined) {
            Memory.rooms[room.name].jobs.workPartJobs = {};
        }
        Memory.rooms[room.name].jobs.workPartJobs.buildJobs = {
            data: WorkPartJobs.createBuildJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's WorkPartJobListing_upgradeJobs
     * @param room The room to update the memory of
     */
    static updateWorkPart_upgradeJobs(room) {
        if (Memory.rooms[room.name].jobs.workPartJobs === undefined) {
            Memory.rooms[room.name].jobs.workPartJobs = {};
        }
        Memory.rooms[room.name].jobs.workPartJobs.upgradeJobs = {
            data: WorkPartJobs.createUpgradeJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's WorkPartJobListing
     * @param room The room to update the memory of
     */
    static updateCarryPart_allJobs(room) {
        this.updateCarryPart_fillJobs(room);
        this.updateCarryPart_storeJobs(room);
    }
    /**
     * Update the room's CarryPartJobListing_fillJobs
     * @param room  The room to update the memory of
     */
    static updateCarryPart_fillJobs(room) {
        if (Memory.rooms[room.name].jobs.carryPartJobs === undefined) {
            Memory.rooms[room.name].jobs.carryPartJobs = {};
        }
        Memory.rooms[room.name].jobs.carryPartJobs.fillJobs = {
            data: CarryPartJobs.createFillJobs(room),
            cache: Game.time
        };
    }
    /**
     * Update the room's CarryPartJobListing_fillJobs
     * @param room  The room to update the memory of
     */
    static updateCarryPart_storeJobs(room) {
        if (Memory.rooms[room.name].jobs.carryPartJobs === undefined) {
            Memory.rooms[room.name].jobs.carryPartJobs = {};
        }
        Memory.rooms[room.name].jobs.carryPartJobs.storeJobs = {
            data: CarryPartJobs.createStoreJobs(room),
            cache: Game.time
        };
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
//# sourceMappingURL=MemoryHelper_Room.js.map

/**
 * The API used by the spawn manager
 */
class SpawnApi {
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
        const numLorries = SpawnHelper.getLorryLimitForRoom(room, room.memory.roomState);
        let minerLimits = MemoryApi.getSources(room.name).length;
        let numRemoteRooms = RoomHelper.numRemoteRooms(room);
        // To prevent dropping to 2 workers if we don't have remote rooms
        if (numRemoteRooms === 0) {
            numRemoteRooms = 1;
        }
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
                if (room.energyCapacityAvailable < 550) {
                    const numAccessTilesToSource = SpawnHelper.getNumAccessTilesToSources(room);
                    minerLimits = numAccessTilesToSource < 4 ? numAccessTilesToSource : 4;
                }
                domesticLimits[ROLE_MINER] = minerLimits;
                domesticLimits[ROLE_HARVESTER] = 4;
                domesticLimits[ROLE_WORKER] = 4;
                break;
            // Intermediate
            case ROOM_STATE_INTER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = minerLimits;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 5;
                break;
            // Advanced
            case ROOM_STATE_ADVANCED:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = minerLimits;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 3 + (numRemoteRooms - 1);
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = numLorries;
                break;
            // Upgrader
            case ROOM_STATE_UPGRADER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = minerLimits;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_POWER_UPGRADER] = 1;
                domesticLimits[ROLE_LORRY] = numLorries;
                break;
            // Stimulate
            case ROOM_STATE_STIMULATE:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = minerLimits;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 3;
                domesticLimits[ROLE_POWER_UPGRADER] = 2;
                domesticLimits[ROLE_LORRY] = numLorries;
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
            remoteDefender: 0,
            claimer: 0
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
        const numCurrentlyUnclaimedClaimRooms = RoomHelper.numCurrentlyUnclaimedClaimRooms(room);
        // check what room state we are in
        switch (room.memory.roomState) {
            // Advanced, Upgrader, and Stimulate are the only allowed states for remote mining and claiming operations currently
            // Might change for earlier room states to allow claimers and colonizers, up for debate
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = SpawnHelper.getLimitPerRemoteRoomForRolePerSource(ROLE_REMOTE_MINER, numRemoteSources);
                remoteLimits[ROLE_REMOTE_HARVESTER] = SpawnHelper.getLimitPerRemoteRoomForRolePerSource(ROLE_REMOTE_HARVESTER, numRemoteSources);
                remoteLimits[ROLE_REMOTE_RESERVER] =
                    numRemoteRooms * SpawnHelper.getLimitPerRemoteRoomForRolePerSource(ROLE_REMOTE_RESERVER, 1);
                remoteLimits[ROLE_COLONIZER] = numClaimRooms * SpawnHelper.getLimitPerClaimRoomForRole(ROLE_CLAIMER);
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;
                remoteLimits[ROLE_CLAIMER] =
                    numCurrentlyUnclaimedClaimRooms * SpawnHelper.getLimitPerClaimRoomForRole(ROLE_CLAIMER);
                break;
        }
        return remoteLimits;
    }
    /**
     * set military creep limits
     * @param room the room we want limits for
     */
    static generateMilitaryCreepLimits(room) {
        const defaultMilitaryLimits = {
            zealot: 0,
            stalker: 0,
            medic: 0,
            domesticDefender: 0
        };
        // For extra saftey, find first active flag (only 1 should be active at a time)
        const targetRoomMemoryArray = MemoryApi.getAttackRooms(room);
        let activeAttackRoomFlag;
        for (const attackRoom of targetRoomMemoryArray) {
            if (!attackRoom) {
                continue;
            }
            activeAttackRoomFlag = _.find(attackRoom["flags"], flagMem => {
                if (!flagMem) {
                    return false;
                }
                return flagMem.active;
            });
            if (activeAttackRoomFlag) {
                break;
            }
        }
        if (activeAttackRoomFlag) {
            // Set the limits in memory based on the flag type
            this.adjustMilitaryCreepLimits(activeAttackRoomFlag, room);
        }
        else {
            // If we don't have active attack rooms, reset spawn back to 0
            room.memory.creepLimit.militaryLimits = defaultMilitaryLimits;
        }
        // Check if we need domestic defenders and adjust accordingly
        const defcon = MemoryApi.getDefconLevel(room);
        if (defcon >= 2) {
            this.adjustDomesticDefenderCreepLimits(room, defcon);
        }
        else {
            // if we don't need, make sure spawn gets set to 0
            MemoryApi.adjustCreepLimitsByDelta(room, "militaryLimits", ROLE_DOMESTIC_DEFENDER, 0);
        }
    }
    /**
     * raises the military creep limits based on the flag type
     * @param flagMemory the memory associated with the attack flag
     * @param room the room we are raising limits for
     */
    static adjustMilitaryCreepLimits(flagMemory, room) {
        // If flag memory is undefined, don't waste cpu
        if (!flagMemory) {
            return;
        }
        switch (flagMemory.flagType) {
            case ZEALOT_SOLO:
                MemoryApi.adjustCreepLimitsByDelta(room, "militaryLimits", "zealot", 1);
                break;
            case STALKER_SOLO:
                MemoryApi.adjustCreepLimitsByDelta(room, "militaryLimits", "stalker", 1);
                break;
            case STANDARD_SQUAD:
                MemoryApi.adjustCreepLimitsByDelta(room, "militaryLimits", "zealot", 1);
                MemoryApi.adjustCreepLimitsByDelta(room, "militaryLimits", "stalker", 1);
                MemoryApi.adjustCreepLimitsByDelta(room, "militaryLimits", "medic", 1);
                break;
        }
    }
    /**
     * raises the domestic defender limit based on the defcon state of the room
     * @param room the room we are in
     * @param defcon the defcon of said room
     */
    static adjustDomesticDefenderCreepLimits(room, defcon) {
        // For now, just raise by one, later we can decide what certain defcons means for what we want to spawn
        // just wanted it in a function so we have the foundation for that in place
        MemoryApi.adjustCreepLimitsByDelta(room, "militaryLimits", ROLE_DOMESTIC_DEFENDER, 1);
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
        // Set Military Limits to Memory, this handles the memory itself so no need to pass the return into update function
        // This is because different situations can pop up that call for military, we don't want to overwrite the memory every time
        this.generateMilitaryCreepLimits(room);
    }
    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    static getOpenSpawn(room) {
        // Get all openSpawns, and return the first
        const openSpawns = MemoryApi.getStructureOfType(room.name, STRUCTURE_SPAWN, (spawn) => !spawn.spawning);
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
        const creepLimits = MemoryApi.getCreepLimits(room);
        // Check if we need a domestic creep -- Return role if one is found
        for (const role of domesticRolePriority) {
            if (MemoryApi.getCreepCount(room, role) < creepLimits.domesticLimits[role]) {
                return role;
            }
        }
        // Check if we need a military creep -- Return role if one is found
        for (const role of militaryRolePriority) {
            if (MemoryApi.getCreepCount(room, role) < creepLimits.militaryLimits[role]) {
                return role;
            }
        }
        // Check if we need a remote creep -- Return role if one is found
        for (const role of remoteRolePriority) {
            if (MemoryApi.getCreepCount(room, role) < creepLimits.remoteLimits[role]) {
                return role;
            }
        }
        // Return null if we don't need to spawn anything
        return null;
    }
    /**
     * spawn the next creep
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
        const energyAvailable = room.energyCapacityAvailable;
        // Check what tier we are in based on the amount of energy the room has
        if (room.memory.roomState === ROOM_STATE_INTRO) {
            return TIER_1;
        }
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
            case ROLE_CLAIMER:
                return SpawnHelper.generateClaimerOptions(roomState);
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
            case ROLE_DOMESTIC_DEFENDER:
                return SpawnHelper.generateDomesticDefenderOptions(roomState);
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
            case ROLE_CLAIMER:
                return SpawnHelper.generateClaimerBody(tier);
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
            case ROLE_DOMESTIC_DEFENDER:
                return SpawnHelper.generateDomesticDefenderBody(tier);
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
     * generates a UUID for a squad
     */
    static generateSquadUUID(seed) {
        return Math.random() * 10000000;
    }
    /**
     * generates options for spawning a squad based on the attack room's specifications
     * @param room the room we are spawning the squad in
     */
    static generateSquadOptions(room, targetRoom, roleConst) {
        // Set to this for clarity that we aren't expecting any squad options in some cases
        const squadOptions = {
            squadSize: 0,
            squadUUID: null,
            rallyLocation: null
        };
        // Don't actually get anything of value if it isn't a military creep. No point
        if (!SpawnHelper.isMilitaryRole(roleConst)) {
            return squadOptions;
        }
        // Get an appropirate attack flag for the creep
        const targetRoomMemoryArray = MemoryApi.getAttackRooms(room, targetRoom);
        // Only going to be one room returned, but had to be an array, so just grab it
        const roomMemory = _.first(targetRoomMemoryArray);
        // Drop out early if there are no attack rooms
        if (roomMemory === undefined) {
            return squadOptions;
        }
        const flagMemoryArray = roomMemory["flags"];
        let selectedFlagMemory;
        let currentHighestSquadCount = 0;
        let selectedFlagActiveSquadMembers = 0;
        // Loop over the flag memory and attach the creep to the first flag that does not have its squad size fully satisfied
        for (const flagMemory of flagMemoryArray) {
            const numActiveSquadMembers = SpawnHelper.getNumOfActiveSquadMembers(flagMemory, room);
            const numRequestedSquadMembers = flagMemory.squadSize;
            // If we find an active flag that doesn't have its squad requirements met and is currently the flag closest to being met
            if ((numActiveSquadMembers < numRequestedSquadMembers &&
                numActiveSquadMembers > currentHighestSquadCount &&
                flagMemory.active) ||
                numRequestedSquadMembers === 0) {
                selectedFlagMemory = flagMemory;
                currentHighestSquadCount = numActiveSquadMembers;
                selectedFlagActiveSquadMembers = numActiveSquadMembers;
            }
        }
        // If we didn't find a squad based flag return the default squad options
        if (selectedFlagMemory === undefined) {
            return squadOptions;
        }
        else {
            // if this flag has met its requirements, deactivate it
            if (selectedFlagActiveSquadMembers >= selectedFlagMemory.squadSize) {
                selectedFlagMemory.active = false;
                // If its a one time use, complete it as well
                if (Empire.isAttackFlagOneTimeUse(selectedFlagMemory)) {
                    Game.flags[selectedFlagMemory.flagName].memory.complete = true;
                }
            }
            // Set squad options to the flags memory and return it
            squadOptions.squadSize = selectedFlagMemory.squadSize;
            squadOptions.squadUUID = selectedFlagMemory.squadUUID;
            squadOptions.rallyLocation = selectedFlagMemory.rallyLocation;
            return squadOptions;
        }
    }
    /**
     * get the target room for the creep
     * @param room the room we are spawning the creep in
     * @param roleConst the role we are getting room for
     */
    static getCreepTargetRoom(room, roleConst) {
        let roomMemory;
        switch (roleConst) {
            // Colonizing creeps going to their claim rooms
            case ROLE_COLONIZER:
            case ROLE_CLAIMER:
                roomMemory = SpawnHelper.getLowestNumRoleAssignedClaimRoom(room, roleConst);
                if (roomMemory) {
                    return roomMemory.roomName;
                }
                break;
            // Remote creeps going to their remote rooms
            case ROLE_REMOTE_DEFENDER:
            case ROLE_REMOTE_HARVESTER:
            case ROLE_REMOTE_MINER:
            case ROLE_REMOTE_RESERVER:
                roomMemory = SpawnHelper.getLowestNumRoleAssignedRemoteRoom(room, roleConst);
                if (roomMemory) {
                    return roomMemory.roomName;
                }
                break;
            // Military creeps going to their attack rooms
            case ROLE_STALKER:
            case ROLE_MEDIC:
            case ROLE_ZEALOT:
                roomMemory = SpawnHelper.getAttackRoomWithActiveFlag(room);
                if (roomMemory) {
                    return roomMemory.roomName;
                }
                break;
            // Domestic creeps keep their target room as their home room
            // Reason we're using case over default is to increase fail-first paradigm (idk what the word means)
            // If an non-existing role then an error will occur here
            case ROLE_DOMESTIC_DEFENDER:
            case ROLE_MINER:
            case ROLE_HARVESTER:
            case ROLE_WORKER:
            case ROLE_LORRY:
            case ROLE_POWER_UPGRADER:
                return room.name;
        }
        return "";
    }
    /**
     * get the home room for the creep
     * @param room the room the creep is spawning in
     * @param roleConst the role we are getting room for
     */
    static getCreepHomeRoom(room, roleConst, targetRoom) {
        // Okay so this might not even be needed, but I took out colonizer home room setting because
        // That would actually take them out of the creep count for this room, spawning them in an infinite loop
        // We will just set their target room as the claim room and it will have the desired effect
        return room.name;
    }
}
//# sourceMappingURL=Spawn.Api.js.map

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
            if (!(part in BODYPARTS_ALL)) {
                valid = false;
            }
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
        let body = { work: 2, move: 2 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 2 Work, 2 Move - Total Cost: 300
                body = { work: 2, move: 2 };
                opts.mixType = COLLATED; // Just as an example of how we could change opts by tier as well
                break;
            case TIER_2: // 5 Work, 1 Move - Total Cost: 550
                body = { work: 5, move: 1 };
                break;
            case TIER_8:
            case TIER_7:
            case TIER_6:
            case TIER_5:
            case TIER_4:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    harvestSources: true,
                    fillContainer: true,
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
        let body = { work: 1, carry: 2, move: 2 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;
            case TIER_2: // 2 Work, 4 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 4, move: 3 };
                break;
            case TIER_3: // 2 Work, 6 Carry, 6 Move - Total Cost: 800
                body = { work: 2, carry: 6, move: 6 };
                break;
            case TIER_4: // 2 Work, 11 Carry, 11 Move - Total Cost: 1300
                body = { work: 2, carry: 11, move: 11 };
                break;
            case TIER_6:
            case TIER_5: // 2 Work, 16 Carry, 16 Move - Total Cost: 1800
                body = { work: 2, carry: 16, move: 16 };
                break;
            case TIER_8:
            case TIER_7: // 2 Work, 20 Carry, 20 Move - Total Cost: 2200
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    fillSpawn: true,
                    getDroppedEnergy: true,
                };
                break;
            case ROOM_STATE_INTER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    fillSpawn: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                };
                break;
            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    fillStorage: true,
                    fillSpawn: true,
                    getFromStorage: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                    getFromTerminal: true //
                };
                break;
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    repair: true,
                    fillStorage: true,
                    fillSpawn: true,
                    getFromStorage: true,
                    getDroppedEnergy: true,
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
        let body = { work: 1, carry: 2, move: 2 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;
            case TIER_2: // 2 Work, 4 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 4, move: 3 };
                break;
            case TIER_3: // 4 Work, 4 Carry, 4 Move - Total Cost: 800
                body = { work: 4, carry: 4, move: 4 };
                break;
            case TIER_6:
            case TIER_5:
            case TIER_4: // 7 Work, 6 Carry, 6 Move - Total Cost: 1300
                body = { work: 7, carry: 6, move: 6 };
                break;
            case TIER_8:
            case TIER_7:
                // 10 Work, 8 Carry, 8 Move - Total Cost: 1800
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    getDroppedEnergy: true,
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
                    getFromContainer: true,
                    getDroppedEnergy: true,
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
                    getFromStorage: true,
                    getDroppedEnergy: true,
                    getFromTerminal: true //
                };
                break;
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    fillStorage: true,
                    fillLink: true,
                    getFromStorage: true,
                    getDroppedEnergy: true,
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
        let body = { carry: 3, move: 3 };
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
            case TIER_5:
            case TIER_4: // 10 Carry, 10 Move - Total Cost: 1000
                body = { carry: 10, move: 10 };
                break;
            case TIER_8:
            case TIER_7:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    fillTower: true,
                    fillStorage: true,
                    fillContainer: true,
                    fillLink: true,
                    fillTerminal: true,
                    fillLab: true,
                    getFromStorage: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
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
        let body = { work: 18, carry: 8, move: 4 };
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
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    upgrade: true,
                    getFromLink: true,
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
        let body = { work: 6, carry: 1, move: 3 };
        const opts = { mixType: GROUPED };
        // Cap the remote miner at 6 work parts (6 so they finish mining early and can build/repair their container)
        switch (tier) {
            case TIER_3: // 6 Work, 1 Carry, 3 Move - Total Cost: 800
                body = { work: 6, carry: 1, move: 3 };
                break;
            case TIER_8:
            case TIER_7:
            case TIER_6:
            case TIER_5:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
                creepOptions = {
                    build: true,
                    repair: true,
                    fillContainer: true,
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
        let body = { carry: 8, move: 8 };
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
            case TIER_8:
            case TIER_7:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
                creepOptions = {
                    build: true,
                    upgrade: true,
                    repair: true,
                    wallRepair: true,
                    fillTower: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                };
                break;
            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    repair: true,
                    fillStorage: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                };
                break;
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    repair: true,
                    fillStorage: true,
                    fillLink: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
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
        let body = { claim: 2, move: 2 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_8:
            case TIER_7:
            case TIER_6:
            case TIER_5:
            case TIER_4: // 2 Claim, 2 Move - Total Cost: 800
                body = { claim: 2, move: 2 };
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                // Remote reservers don't really have options perse, so just leave as defaults
                creepOptions = {};
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
        let body = { work: 7, carry: 5, move: 6 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_4: // 7 Work, 5 Carry, 5 Move - Total Cost: 1300
                body = { work: 7, carry: 5, move: 6 };
                break;
            case TIER_5: // 9 Work, 8 Carry, 10 Move - Total Cost: 1800
                body = { work: 9, carry: 8, move: 10 };
                break;
            case TIER_8:
            case TIER_7:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    build: true,
                    upgrade: true,
                    repair: true,
                    harvestSources: true,
                    wallRepair: true,
                    getFromContainer: true,
                    getDroppedEnergy: true,
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for claimer creep
     * @param roomState the room state for the room
     */
    static generateClaimerOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsCiv();
        switch (roomState) {
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {};
                break;
        }
        return creepOptions;
    }
    /**
     * Generate options for claimer creep
     * @param tier the tier of the room
     */
    static generateClaimerBody(tier) {
        // Default Values for Claimer
        let body = { claim: 1, move: 2 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_8:
            case TIER_7:
            case TIER_6:
            case TIER_5:
            case TIER_4:
            case TIER_3:
            case TIER_2: // 1 Claim, 2 Move, Total Cost: 400
                body = { claim: 1, move: 2 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * Generate body for remote defender creep
     * @param tier the tier of the room
     */
    static generateRemoteDefenderBody(tier) {
        // Default Values for Remote Defender
        let body = { attack: 5, move: 5 };
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
            case TIER_8:
            case TIER_7:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    squadSize: 1,
                    squadUUID: null,
                    rallyLocation: null,
                    rallyDone: false,
                    healer: true,
                    defender: true,
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
            // case TIER_6: // this is just for quick and dirty purposes, i don't reccomend using it, but replace tier with your current tier and make a custom attack zealot
            //     body = { attack: 1, move: 10, tough: 39 };
            //     break;
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
            case TIER_8:
            case TIER_7:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    squadSize: squadSizeParam,
                    squadUUID: squadUUIDParam,
                    rallyLocation: rallyLocationParam,
                    rallyDone: false,
                    attacker: true,
                };
                break;
        }
        return creepOptions;
    }
    /**
     * Generate body for medic creep
     * @param tier the tier of the room
     */
    static generateMedicBody(tier) {
        // Default Values for Medic
        let body = { heal: 1, move: 1 };
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
            case TIER_8:
            case TIER_7:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    squadSize: squadSizeParam,
                    squadUUID: squadUUIDParam,
                    rallyLocation: rallyLocationParam,
                    rallyDone: false,
                    healer: true,
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
        let body = { ranged_attack: 1, move: 1 };
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
                body = { ranged_attack: 8, move: 8 };
                break;
            case TIER_8:
            case TIER_7:
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
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    squadSize: squadSizeParam,
                    squadUUID: squadUUIDParam,
                    rallyLocation: rallyLocationParam,
                    rallyDone: false,
                };
                break;
        }
        return creepOptions;
    }
    /**
     * generate body for domestic defender creep
     * @param tier the tier of the room
     */
    static generateDomesticDefenderBody(tier) {
        // Default Values for Stalker
        let body = { attack: 2, move: 2 };
        const opts = { mixType: GROUPED };
        switch (tier) {
            case TIER_1: // 2 Attack, 2 Move - Total Cost: 260
                body = { attack: 2, move: 2 };
                break;
            case TIER_2: // 3 Attack, 2 Move - Total Cost: 340
                body = { attack: 3, move: 2 };
                break;
            case TIER_3: // 5 Attack, 5 Move - Total Cost: 650
                body = { attack: 5, move: 5 };
                break;
            case TIER_4: // 8 Attack, 8 Move - Total Cost: 880
                body = { attack: 8, move: 8 };
                break;
            case TIER_5: // 10 Attack, 10 Move - Total Cost: 1300
                body = { attack: 10, move: 10 };
                break;
            case TIER_8:
            case TIER_7:
            case TIER_6: // 15 Attack, 15 Move - Total Cost: 1950
                body = { attack: 15, move: 15 };
                break;
        }
        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }
    /**
     * generate options for domestic defender creep
     * @param roomState the room state for the room spawning it
     */
    static generateDomesticDefenderOptions(roomState) {
        let creepOptions = this.getDefaultCreepOptionsMili();
        switch (roomState) {
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    squadSize: 0,
                    squadUUID: null,
                    rallyLocation: null,
                    defender: true,
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
        return {};
    }
    /**
     * returns set of mili creep options with all default values
     */
    static getDefaultCreepOptionsMili() {
        return {
            squadSize: 0,
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
            job: undefined,
            options: creepOptions,
            working: false
        };
    }
    /**
     * get number of active squad members for a given squad
     * @param flagMemory the attack flag memory
     * @param room the room they are coming from
     */
    static getNumOfActiveSquadMembers(flagMemory, room) {
        // Please improve this if possible lol. Had to get around type guards as we don't actually know what a creeps memory has in it unless we explicitly know the type i think
        // We're going to run into this everytime we use creep memory so we need to find a nicer way around it if possible but if not casting it as a memory type
        // Isn't the worst solution in the world
        const militaryCreeps = MemoryApi.getMyCreeps(room.name, creep => this.isMilitaryRole(creep.memory.role));
        return _.filter(militaryCreeps, creep => {
            const creepOptions = creep.memory.options;
            return creepOptions.squadUUID === flagMemory.squadUUID;
        }).length;
    }
    /**
     * get if the creep is a military type creep or not
     * @param roleConst the role of the creep
     */
    static isMilitaryRole(roleConst) {
        return (roleConst === ROLE_DOMESTIC_DEFENDER ||
            roleConst === ROLE_STALKER ||
            roleConst === ROLE_ZEALOT ||
            roleConst === ROLE_MEDIC);
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
     * gets the ClaimRoomMemory with lowest number creeps of the specified role with it as their target room
     * Must also be less than the max amount of that role allowed for the room
     * @param room the room spawning the creep
     * @param roleConst the specified role we are checking for
     */
    static getLowestNumRoleAssignedClaimRoom(room, roleConst) {
        const allClaimRooms = MemoryApi.getClaimRooms(room);
        // Get all claim rooms in which the specified role does not yet have
        const unfulfilledClaimRooms = _.filter(allClaimRooms, claimRoom => this.getNumCreepAssignedAsTargetRoom(room, roleConst, claimRoom) <
            this.getLimitPerClaimRoomForRole(roleConst));
        let nextClaimRoom;
        // Find the unfulfilled with the lowest amount of creeps assigned to it
        for (const claimRoom of unfulfilledClaimRooms) {
            if (!nextClaimRoom) {
                nextClaimRoom = claimRoom;
                continue;
            }
            const lowestCreepsAssigned = this.getNumCreepAssignedAsTargetRoom(room, roleConst, nextClaimRoom);
            const currentCreepsAssigned = this.getNumCreepAssignedAsTargetRoom(room, roleConst, claimRoom);
            if (currentCreepsAssigned < lowestCreepsAssigned) {
                nextClaimRoom = claimRoom;
            }
        }
        return nextClaimRoom;
    }
    /**
     * gets the RemoteRoomMemory with lowest number creeps of the specified role with it as their target room
     * @param room the room spawning the creep
     * @param roleConst the specified role we are checking for
     */
    static getLowestNumRoleAssignedRemoteRoom(room, roleConst) {
        const allRemoteRooms = MemoryApi.getRemoteRooms(room);
        // Get all claim rooms in which the specified role does not yet have
        const unfulfilledRemoteRooms = _.filter(allRemoteRooms, remoteRoom => this.getNumCreepAssignedAsTargetRoom(room, roleConst, remoteRoom) <
            this.getLimitPerRemoteRoomForRolePerSource(roleConst, remoteRoom.sources.data));
        let nextRemoteRoom;
        // Find the unfulfilled with the lowest amount of creeps assigned to it
        for (const remoteRoom of unfulfilledRemoteRooms) {
            if (!nextRemoteRoom) {
                nextRemoteRoom = remoteRoom;
                continue;
            }
            const lowestCreepsAssigned = this.getNumCreepAssignedAsTargetRoom(room, roleConst, nextRemoteRoom);
            const currentCreepsAssigned = this.getNumCreepAssignedAsTargetRoom(room, roleConst, remoteRoom);
            if (currentCreepsAssigned < lowestCreepsAssigned) {
                nextRemoteRoom = remoteRoom;
            }
        }
        return nextRemoteRoom;
    }
    /**
     * gets the AttackRoomMemory with active flags
     * only one attack flag will be active at a time during any given tick
     * if this is not true because of some error/oversight, it is self correcting since
     * this will still only choose the first active flag it finds
     * @param room the room spawning the creep
     */
    static getAttackRoomWithActiveFlag(room) {
        const allAttackRooms = MemoryApi.getAttackRooms(room);
        // Return the first active flag we find (should only be 1 flag active at a time across all attack rooms)
        return _.find(allAttackRooms, attackRoom => _.some(attackRoom.flags, (flag) => flag.active));
    }
    /**
     * get number of creeps of role with target room assigned to a specified room
     * @param room the room spawning the creep
     * @param roleConst the role of the creep
     * @param roomMemory the room memory we are checking
     */
    static getNumCreepAssignedAsTargetRoom(room, roleConst, roomMemory) {
        const allCreepsOfRole = MemoryApi.getMyCreeps(room.name, creep => creep.memory.role === roleConst);
        let sum = 0;
        for (const creep of allCreepsOfRole) {
            if (creep.memory.targetRoom === roomMemory.roomName) {
                ++sum;
            }
        }
        return sum;
    }
    /**
     * gets the number of each claim room creep that is meant to be assigned to a room
     * @param roleConst the role we are checking the limit for
     */
    static getLimitPerClaimRoomForRole(roleConst) {
        let creepNum = 0;
        switch (roleConst) {
            case ROLE_CLAIMER:
                creepNum = 1;
                break;
        }
        return creepNum;
    }
    /**
     * gets the number of each remote room creep that is meant to be assigned to a room
     * @param roleConst the role we are checking the limit for
     * @param numSources the number of sources in the remote room
     */
    static getLimitPerRemoteRoomForRolePerSource(roleConst, numSources) {
        let creepNum = 0;
        switch (roleConst) {
            case ROLE_REMOTE_HARVESTER:
                creepNum = 1 * numSources;
                break;
            case ROLE_REMOTE_RESERVER:
                creepNum = 1;
        }
        return creepNum;
    }
    /**
     * gets the number of lorries for the room based on room state
     * @param room the room we are doing limits for
     * @param roomState the room state of the room we are checking limit for
     */
    static getLorryLimitForRoom(room, roomState) {
        // ! Some ideas for finding lorry limits for a room
        // ! Turned in to insane ramblings though
        /*
            Potentially, we could check that the room state is within a certain value range
            like advanced, stimulate, seige, maybe? (same values its changed on anyway, so just extra saftey)
            And we could like check if any empire jobs exist... still not sure the route we're going to take
            to make sure terminals and labs get filled exactly, but we do know that those will create room jobs
            for creeps to follow, we could also have it fill another memory structure and we check that and
            decide how many lorries we need to do this set of jobs, it also has the benifit of slowly going down
            as the job is more and more complete ie if we spawn 1 lorry per 25k energy we want to move to a terminal,
            then as the amount of energy needing to be moved remaining goes down, naturally the number of lorries needed
            will as well.

            I'm having a flash of an idea about empire job queues. Each room can check empire job queues and decide if they
            need to create any jobs in the room, and this function for example will check how many lorries need to exist in the room
            etc, etc, etc. We can see what way we wanna go there, we still are a little bit off from that since we need to finish
            the more pertinant parts of job queues and set up the flag system and make sure the room structures run themselves (thats
                when we actually start running into it, since terminals will presumably check this emprie job queue and decide if it needs
                to sell energy, move to another room)

            It would also be interesting to set up a system to supply each other with energy as needed. Like if you're being seiged and in real trouble
            and you're running dry (lets say they've knocked out a couple of your other rooms too) i could send energy and help keep your
            last room alive... possibly military support to would be really cool (that would be as simple as detecting and auto placing a flag
                in your room and the system will handle itself)

            Even more off-topic, but we make sure creep.attack() and tower.attack() is never called on an ally creep (maybe even override the functions)
            (to ensure extra saftey in the case of abug)
        */
        return 0;
    }
    /**
     * get the number of accesssible tiles for the sources in a room
     * @param room the room we are checking for
     */
    static getNumAccessTilesToSources(room) {
        const sources = MemoryApi.getSources(room.name);
        let accesssibleTiles = 0;
        const roomTerrian = new Room.Terrain(room.name);
        _.forEach(sources, (source) => {
            for (let y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
                for (let x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
                    if (source.pos.x === x && source.pos.y === y) {
                        continue;
                    }
                    if (roomTerrian.get(x, y) !== TERRAIN_MASK_WALL) {
                        accesssibleTiles++;
                    }
                }
            }
        });
        return accesssibleTiles;
    }
}
//# sourceMappingURL=SpawnHelper.js.map

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
            if (!(roomName in Game.rooms) &&
                !MemoryHelper.dependentRoomExists(roomName) &&
                !_.some(Game.creeps, (creep) => creep.memory.targetRoom === roomName)) {
                delete Memory.rooms[roomName];
            }
        }
        // Remove all dead flags from memory
        for (const flag in Memory.flags) {
            if (!_.some(Game.flags, (flagLoop) => flagLoop.name === Memory.flags[flag].flagName)) {
                delete Memory.flags[flag];
            }
        }
    }
    /**
     * update the room state for the room
     * @param room the room we are updating the room state for
     * @param roomState the new room state we are saving
     */
    static updateRoomState(roomState, room) {
        room.memory.roomState = roomState;
    }
    /**
     * get the upgrader link for the room
     * @param room the room memory we are getting the upgrader link from
     */
    static getUpgraderLink(room) {
        return Game.getObjectById(room.memory.upgradeLink);
    }
    /**
     * update the upgrader link for the room
     * @param room the room we are updating it for
     * @param id the id of the link
     */
    static updateUpgraderLink(room, id) {
        room.memory.upgradeLink = id;
    }
    /**
     * Go through the room's depedent room memory and remove null values
     * @param room the room we are cleaning the memory structure for
     */
    static cleanDependentRoomMemory(room) {
        // Re-map Remote Room array to remove null values
        const allRemoteRooms = Memory.rooms[room.name].remoteRooms;
        const nonNullRemoteRooms = [];
        _.forEach(allRemoteRooms, (rr) => {
            if (rr !== null) {
                nonNullRemoteRooms.push(rr);
            }
        });
        Memory.rooms[room.name].remoteRooms = nonNullRemoteRooms;
        // Re-map Remote Room array to remove null values
        const allClaimRooms = Memory.rooms[room.name].claimRooms;
        const nonNullClaimRooms = [];
        _.forEach(allClaimRooms, (rr) => {
            if (rr !== null) {
                nonNullClaimRooms.push(rr);
            }
        });
        Memory.rooms[room.name].claimRooms = nonNullClaimRooms;
        // Re-map Remote Room array to remove null values
        const allAttackRooms = Memory.rooms[room.name].attackRooms;
        const nonNullAttackRooms = [];
        _.forEach(allAttackRooms, (rr) => {
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
    static initRoomMemory(roomName, isOwnedRoom) {
        // You might think of a better way/place to do this, but if we delete a memory structure as a "reset",
        // We want it to be reformed
        // Make sure jobs exist
        if (Memory.rooms[roomName] && !Memory.rooms[roomName].jobs && isOwnedRoom) {
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
        }
        else {
            Memory.rooms[roomName] = {
                structures: { data: null, cache: null },
                sources: { data: null, cache: null },
                minerals: { data: null, cache: null },
                tombstones: { data: null, cache: null },
                droppedResources: { data: null, cache: null },
                constructionSites: { data: null, cache: null },
                defcon: -1,
                hostiles: { data: null, cache: null },
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
    static getRoomMemory(room, forceUpdate) {
        this.getConstructionSites(room.name, undefined, forceUpdate);
        this.getMyCreeps(room.name, undefined, forceUpdate);
        this.getHostileCreeps(room.name, undefined, forceUpdate);
        this.getSources(room.name, undefined, forceUpdate);
        this.getStructures(room.name, undefined, forceUpdate);
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
    static getMyCreeps(roomName, filterFunction, forceUpdate) {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }
        if (forceUpdate ||
            !Memory.rooms[roomName].creeps ||
            Memory.rooms[roomName].creeps.cache < Game.time - FCREEP_CACHE_TTL) {
            MemoryHelper_Room.updateMyCreeps(roomName);
        }
        const creepIDs = Memory.rooms[roomName].creeps.data;
        let creeps = MemoryHelper.getOnlyObjectsFromIDs(creepIDs);
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
    static getHostileCreeps(roomName, filterFunction, forceUpdate) {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }
        if (forceUpdate ||
            !Memory.rooms[roomName].hostiles ||
            Memory.rooms[roomName].creeps.cache < Game.time - HCREEP_CACHE_TTL) {
            MemoryHelper_Room.updateHostileCreeps(roomName);
        }
        const creepIDs = Memory.rooms[roomName].hostiles.data;
        let creeps = MemoryHelper.getOnlyObjectsFromIDs(creepIDs);
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
    static getStructures(roomName, filterFunction, forceUpdate) {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }
        if (forceUpdate ||
            Memory.rooms[roomName].structures === undefined ||
            Memory.rooms[roomName].structures.cache < Game.time - STRUCT_CACHE_TTL) {
            MemoryHelper_Room.updateStructures(roomName);
        }
        const structureIDs = [];
        // Flatten the object into an array of IDs
        for (const type in Memory.rooms[roomName].structures.data) {
            const IDs = Memory.rooms[roomName].structures.data[type];
            for (const singleID of IDs) {
                if (singleID) {
                    structureIDs.push(singleID);
                }
            }
        }
        let structures = MemoryHelper.getOnlyObjectsFromIDs(structureIDs);
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
    static getStructureOfType(roomName, type, filterFunction, forceUpdate) {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }
        if (forceUpdate ||
            Memory.rooms[roomName].structures === undefined ||
            Memory.rooms[roomName].structures.data[type] === undefined ||
            Memory.rooms[roomName].structures.cache < Game.time - STRUCT_CACHE_TTL) {
            MemoryHelper_Room.updateStructures(roomName);
        }
        const structureIDs = Memory.rooms[roomName].structures.data[type];
        let structures = MemoryHelper.getOnlyObjectsFromIDs(structureIDs);
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
    static getConstructionSites(roomName, filterFunction, forceUpdate) {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }
        if (forceUpdate ||
            !Memory.rooms[roomName].constructionSites ||
            Memory.rooms[roomName].constructionSites.cache < Game.time - CONSTR_CACHE_TTL) {
            MemoryHelper_Room.updateConstructionSites(roomName);
        }
        const constructionSiteIDs = Memory.rooms[roomName].constructionSites.data;
        let constructionSites = MemoryHelper.getOnlyObjectsFromIDs(constructionSiteIDs);
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
    static getTombstones(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].tombstones ||
            Memory.rooms[room.name].tombstones.cache < Game.time - TOMBSTONE_CACHE_TTL) {
            MemoryHelper_Room.updateTombstones(room);
        }
        const tombstoneIDs = Memory.rooms[room.name].tombstones.data;
        let tombstones = MemoryHelper.getOnlyObjectsFromIDs(tombstoneIDs);
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
    static getDroppedResources(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].droppedResources ||
            Memory.rooms[room.name].droppedResources.cache < Game.time - DROPS_CACHE_TTL) {
            MemoryHelper_Room.updateDroppedResources(room);
        }
        const resourceIDs = Memory.rooms[room.name].droppedResources.data;
        let droppedResources = MemoryHelper.getOnlyObjectsFromIDs(resourceIDs);
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
    static getSources(roomName, filterFunction, forceUpdate) {
        // If we have no vision of the room, return an empty array
        if (!Memory.rooms[roomName]) {
            return [];
        }
        if (forceUpdate ||
            Memory.rooms[roomName].sources === undefined ||
            Memory.rooms[roomName].sources.cache < Game.time - SOURCE_CACHE_TTL) {
            MemoryHelper_Room.updateSources(roomName);
        }
        const sourceIDs = Memory.rooms[roomName].sources.data;
        let sources = MemoryHelper.getOnlyObjectsFromIDs(sourceIDs);
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
    static getMinerals(room, filterFunction, forceUpdate) {
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
    static getRemoteRooms(room, filterFunction, targetRoom) {
        let remoteRooms;
        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice) => true;
        }
        // TargetRoom parameter provided
        if (targetRoom) {
            remoteRooms = _.filter(Memory.rooms[room.name].remoteRooms, (roomMemory) => roomMemory.roomName === targetRoom && filterFunction);
        }
        else {
            // No target room provided, just return them all
            remoteRooms = _.filter(Memory.rooms[room.name].remoteRooms, (roomMemory) => filterFunction);
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
    static getClaimRooms(room, filterFunction, targetRoom) {
        let claimRooms;
        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice) => true;
        }
        // TargetRoom parameter provided
        if (targetRoom) {
            claimRooms = _.filter(Memory.rooms[room.name].claimRooms, (roomMemory) => roomMemory.roomName === targetRoom && filterFunction);
        }
        else {
            // No target room provided, just return them all
            claimRooms = _.filter(Memory.rooms[room.name].claimRooms, (roomMemory) => filterFunction);
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
    static getAttackRooms(room, targetRoom, filterFunction) {
        let attackRooms;
        // Kind of hacky, but if filter function isn't provided then its just true so that is won't effect evaulation on getting the attack rooms
        if (!filterFunction) {
            filterFunction = (badPractice) => true;
        }
        // TargetRoom parameter provided
        if (targetRoom) {
            attackRooms = _.filter(Memory.rooms[room.name].attackRooms, (roomMemory) => roomMemory.roomName === targetRoom && filterFunction);
        }
        else {
            // No target room provided, just return them all
            attackRooms = _.filter(Memory.rooms[room.name].attackRooms, (roomMemory) => filterFunction);
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
    static adjustCreepLimitsByDelta(room, limitType, role, delta) {
        Memory.rooms[room.name].creepLimit[limitType][role] = delta;
    }
    /**
     * get the defcon level for the room
     * @param room the room we are checking defcon for
     */
    static getDefconLevel(room) {
        return Memory.rooms[room.name].defcon;
    }
    /**
     * Get count of all creeps, or of one if creepConst is specified
     * @param room the room we are getting the count for
     * @param creepConst [Optional] Count only one role
     */
    static getCreepCount(room, creepConst) {
        const filterFunction = creepConst === undefined ? undefined : (c) => c.memory.role === creepConst;
        // Use get active mienrs instead specifically for miners to get them out early before they die
        if (creepConst === ROLE_MINER) {
            return SpawnHelper.getActiveMiners(room);
        }
        else {
            // Otherwise just get the actual count of the creeps
            return MemoryApi.getMyCreeps(room.name, filterFunction).length;
        }
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
     * get all owned rooms
     * @param filterFunction [Optional] a filter function for the rooms
     * @returns Room[] array of rooms
     */
    static getOwnedRooms(filterFunction) {
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
    static getAllFlags(filterFunction) {
        const allFlags = Object.keys(Game.flags).map(function (flagIndex) {
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
    static getAllGetEnergyJobs(room, filterFunction, forceUpdate) {
        const allGetEnergyJobs = [];
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
    static getSourceJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs.sourceJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs.sourceJobs.cache < Game.time - SOURCE_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateGetEnergy_sourceJobs(room);
        }
        let sourceJobs = Memory.rooms[room.name].jobs.getEnergyJobs.sourceJobs.data;
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
    static getContainerJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs.containerJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs.containerJobs.cache < Game.time - CONTAINER_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateGetEnergy_containerJobs(room);
        }
        let containerJobs = Memory.rooms[room.name].jobs.getEnergyJobs.containerJobs.data;
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
    static getLinkJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs.linkJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs.linkJobs.cache < Game.time - LINK_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateGetEnergy_linkJobs(room);
        }
        let linkJobs = Memory.rooms[room.name].jobs.getEnergyJobs.sourceJobs.data;
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
    static getBackupStructuresJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs.backupStructures ||
            Memory.rooms[room.name].jobs.getEnergyJobs.backupStructures.cache < Game.time - BACKUP_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateGetEnergy_backupStructuresJobs(room);
        }
        let backupStructureJobs = Memory.rooms[room.name].jobs.getEnergyJobs.backupStructures.data;
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
    static getPickupJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.getEnergyJobs ||
            !Memory.rooms[room.name].jobs.getEnergyJobs.pickupJobs ||
            Memory.rooms[room.name].jobs.getEnergyJobs.pickupJobs.cache < Game.time - PICKUP_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateGetEnergy_pickupJobs(room);
        }
        let pickupJobs = Memory.rooms[room.name].jobs.getEnergyJobs.pickupJobs.data;
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
    static getAllClaimPartJobs(room, filterFunction, forceUpdate) {
        const allClaimPartJobs = [];
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
    static getClaimJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs.claimJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs.claimJobs.cache < Game.time - CLAIM_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateClaimPart_claimJobs(room);
        }
        let claimJobs = Memory.rooms[room.name].jobs.claimPartJobs.claimJobs.data;
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
    static getReserveJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs.reserveJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs.reserveJobs.cache < Game.time - RESERVE_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateClaimPart_reserveJobs(room);
        }
        let claimJobs = Memory.rooms[room.name].jobs.claimPartJobs.reserveJobs.data;
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
    static getSignJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs.signJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs.signJobs.cache < Game.time - SIGN_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateClaimPart_signJobs(room);
        }
        let signJobs = Memory.rooms[room.name].jobs.claimPartJobs.signJobs.data;
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
    static getControllerAttackJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.claimPartJobs ||
            !Memory.rooms[room.name].jobs.claimPartJobs.attackJobs ||
            Memory.rooms[room.name].jobs.claimPartJobs.attackJobs.cache < Game.time - ATTACK_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateClaimPart_controllerAttackJobs(room);
        }
        let attackJobs = Memory.rooms[room.name].jobs.claimPartJobs.attackJobs.data;
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
    static getAllWorkPartJobs(room, filterFunction, forceUpdate) {
        const allWorkPartJobs = [];
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
    static getRepairJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.workPartJobs ||
            !Memory.rooms[room.name].jobs.workPartJobs.repairJobs ||
            Memory.rooms[room.name].jobs.workPartJobs.repairJobs.cache < Game.time - REPAIR_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateWorkPart_repairJobs(room);
        }
        let repairJobs = Memory.rooms[room.name].jobs.workPartJobs.repairJobs.data;
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
    static getBuildJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.workPartJobs ||
            !Memory.rooms[room.name].jobs.workPartJobs.buildJobs ||
            Memory.rooms[room.name].jobs.workPartJobs.buildJobs.cache < Game.time - BUILD_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateWorkPart_buildJobs(room);
        }
        let buildJobs = Memory.rooms[room.name].jobs.workPartJobs.buildJobs.data;
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
    static getUpgradeJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.workPartJobs ||
            !Memory.rooms[room.name].jobs.workPartJobs.upgradeJobs ||
            Memory.rooms[room.name].jobs.workPartJobs.upgradeJobs.cache < Game.time - UPGRADE_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateWorkPart_upgradeJobs(room);
        }
        let upgradeJobs = Memory.rooms[room.name].jobs.workPartJobs.upgradeJobs.data;
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
    static getAllCarryPartJobs(room, filterFunction, forceUpdate) {
        const allCarryPartJobs = [];
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
    static getFillJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.carryPartJobs ||
            !Memory.rooms[room.name].jobs.carryPartJobs.fillJobs ||
            Memory.rooms[room.name].jobs.carryPartJobs.fillJobs.cache < Game.time - FILL_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateCarryPart_fillJobs(room);
        }
        let fillJobs = Memory.rooms[room.name].jobs.carryPartJobs.fillJobs.data;
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
    static getStoreJobs(room, filterFunction, forceUpdate) {
        if (forceUpdate ||
            !Memory.rooms[room.name].jobs.carryPartJobs ||
            !Memory.rooms[room.name].jobs.carryPartJobs.storeJobs ||
            Memory.rooms[room.name].jobs.carryPartJobs.storeJobs.cache < Game.time - STORE_JOB_CACHE_TTL) {
            MemoryHelper_Room.updateCarryPart_storeJobs(room);
        }
        let storeJobs = Memory.rooms[room.name].jobs.carryPartJobs.storeJobs.data;
        if (filterFunction !== undefined) {
            storeJobs = _.filter(storeJobs, filterFunction);
        }
        return storeJobs;
    }
    /**
     * get all creeps in a specific squad given the squad uuid
     * @param squadUUID the id for the squad
     */
    static getCreepsInSquad(roomName, squadUUID) {
        return MemoryApi.getMyCreeps(roomName, (creep) => {
            const currentCreepOptions = creep.memory.options;
            if (!currentCreepOptions.squadUUID) {
                return false;
            }
            return currentCreepOptions.squadUUID === squadUUID;
        });
    }
    /**
     * Updates the job value in memory to deprecate resources or mark the job as taken
     */
    static updateJobMemory(creep, room) {
        // make sure creep has a job
        if (creep.memory.job === undefined) {
            throw new UserException("Error in updateJobMemory", "Attempted to updateJobMemory using a creep with no job.", ERROR_ERROR$1);
        }
        // make sure room has a jobs property
        if (room.memory.jobs === undefined) {
            throw new UserException("Error in updateJobMemory", "The room memory to update does not have a jobs property", ERROR_ERROR$1);
        }
        const creepJob = creep.memory.job;
        let roomJob;
        // Assign room job to the room in memory
        switch (creepJob.jobType) {
            case "carryPartJob":
                roomJob = this.searchCarryPartJobs(creepJob, room);
                break;
            case "claimPartJob":
                roomJob = this.searchClaimPartJobs(creepJob, room);
                break;
            case "getEnergyJob":
                roomJob = this.searchGetEnergyJobs(creepJob, room);
                break;
            case "workPartJob":
                roomJob = this.searchWorkPartJobs(creepJob, room);
                break;
            default:
                throw new UserException("Error in updateJobMemory", "Creep has a job with an undefined jobType", ERROR_ERROR$1);
        }
        if (roomJob === undefined) {
            throw new UserException("Error in updateJobMemory", "Could not find the job in room memory to update.", ERROR_ERROR$1);
        }
        // We have the roomJob location in memory
        // now we just need to update the value based on the type of job
        switch (creepJob.jobType) {
            case "carryPartJob":
                this.updateCarryPartJob(roomJob, creep);
                break;
            case "claimPartJob":
                this.updateClaimPartJob(roomJob, creep);
                break;
            case "getEnergyJob":
                this.updateGetEnergyJob(roomJob, creep);
                break;
            case "workPartJob":
                this.updateWorkPartJob(roomJob, creep);
                break;
            default:
                throw new UserException("Error in updateJobMemory", "Creep has a job with an undefined jobType", ERROR_ERROR$1);
        }
    }
    /**
     * Searches through claimPartJobs to find a specified job
     * @param job THe job to serach for
     * @param room The room to search in
     */
    static searchClaimPartJobs(job, room) {
        if (room.memory.jobs.claimPartJobs === undefined) {
            throw new UserException("Error in searchClaimPartJobs", "The room memory does not have a claimPartJobs property", ERROR_ERROR$1);
        }
        const jobListing = room.memory.jobs.claimPartJobs;
        let roomJob;
        if (jobListing.claimJobs) {
            roomJob = _.find(jobListing.claimJobs.data, (claimJob) => job.targetID === claimJob.targetID);
        }
        if (roomJob === undefined && jobListing.reserveJobs) {
            roomJob = _.find(jobListing.reserveJobs.data, (reserveJob) => job.targetID === reserveJob.targetID);
        }
        if (roomJob === undefined && jobListing.signJobs) {
            roomJob = _.find(jobListing.signJobs.data, (signJob) => job.targetID === signJob.targetID);
        }
        return roomJob;
    }
    /**
     * Searches through carryPartJobs to find a specified job
     * @param job The job to search for
     * @param room The room to search in
     */
    static searchCarryPartJobs(job, room) {
        if (room.memory.jobs.carryPartJobs === undefined) {
            throw new UserException("Error in searchCarryPartJobs", "The room memory does not have a carryPartJobs property", ERROR_ERROR$1);
        }
        const jobListing = room.memory.jobs.carryPartJobs;
        let roomJob;
        if (jobListing.fillJobs) {
            roomJob = _.find(jobListing.fillJobs.data, (fillJob) => job.targetID === fillJob.targetID);
        }
        if (roomJob === undefined && jobListing.storeJobs) {
            roomJob = _.find(jobListing.storeJobs.data, (storeJob) => job.targetID === storeJob.targetID);
        }
        return roomJob;
    }
    /**
     * Searches through workPartJobs to find a specified job
     * @param job The job to search for
     * @param room The room to search in
     */
    static searchWorkPartJobs(job, room) {
        if (room.memory.jobs.workPartJobs === undefined) {
            throw new UserException("Error in workPartJobs", "THe room memory does not have a workPartJobs property", ERROR_ERROR$1);
        }
        const jobListing = room.memory.jobs.workPartJobs;
        let roomJob;
        if (jobListing.upgradeJobs) {
            roomJob = _.find(jobListing.upgradeJobs.data, (uJob) => job.targetID === uJob.targetID);
        }
        if (roomJob === undefined && jobListing.buildJobs) {
            roomJob = _.find(jobListing.buildJobs.data, (buildJob) => job.targetID === buildJob.targetID);
        }
        if (roomJob === undefined && jobListing.repairJobs) {
            roomJob = _.find(jobListing.repairJobs.data, (rJob) => job.targetID === rJob.targetID);
        }
        return roomJob;
    }
    /**
     * Searches through getEnergyJobs to find a specified job
     * @param job THe job to search for
     * @param room THe room to search in
     */
    static searchGetEnergyJobs(job, room) {
        if (room.memory.jobs.getEnergyJobs === undefined) {
            throw new UserException("Error in searchGetEnergyJobs", "The room memory does not have a getEnergyJobs property", ERROR_ERROR$1);
        }
        const jobListing = room.memory.jobs.getEnergyJobs;
        let roomJob;
        if (jobListing.containerJobs) {
            roomJob = _.find(jobListing.containerJobs.data, (cJob) => cJob.targetID === job.targetID);
        }
        if (roomJob === undefined && jobListing.sourceJobs) {
            roomJob = _.find(jobListing.sourceJobs.data, (sJob) => sJob.targetID === job.targetID);
        }
        if (roomJob === undefined && jobListing.pickupJobs) {
            roomJob = _.find(jobListing.pickupJobs.data, (pJob) => pJob.targetID === job.targetID);
        }
        if (roomJob === undefined && jobListing.backupStructures) {
            roomJob = _.find(jobListing.backupStructures.data, (sJob) => sJob.targetID === job.targetID);
        }
        if (roomJob === undefined && jobListing.linkJobs) {
            roomJob = _.find(jobListing.linkJobs.data, (lJob) => lJob.targetID === job.targetID);
        }
        if (roomJob === undefined && jobListing.tombstoneJobs) {
            roomJob = _.find(jobListing.tombstoneJobs.data, (tJob) => tJob.targetID === job.targetID);
        }
        return roomJob;
    }
    /**
     * Updates the CarryPartJob
     * @param job The Job to update
     */
    static updateCarryPartJob(job, creep) {
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
    static updateClaimPartJob(job, creep) {
        if (job.targetType === "controller") {
            job.isTaken = true;
            return;
        }
    }
    /**
     * Updates the getEnergyJob
     * @param job The Job to update
     */
    static updateGetEnergyJob(job, creep) {
        if (job.targetType === "source") {
            // Subtract creep effective mining capacity from resources
            job.resources.energy -= creep.getActiveBodyparts(WORK) * 2 * 300;
            if (job.resources.energy <= 0) {
                job.isTaken = true;
            }
            return;
        }
        if (job.targetType === "droppedResource" ||
            job.targetType === "link" ||
            job.targetType === "container" ||
            job.targetType === "storage" ||
            job.targetType === "terminal") {
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
    static updateWorkPartJob(job, creep) {
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
}
//# sourceMappingURL=Memory.Api.js.map

class EmpireHelper {
    /**
     * commit a remote flag to memory
     * @param flag the flag we want to commit
     */
    static processNewRemoteFlag(flag) {
        // Get the host room and set the flags memory
        const dependentRoom = Game.rooms[this.findDependentRoom(flag.pos.roomName)];
        const flagTypeConst = this.getFlagType(flag);
        const roomName = flag.pos.roomName;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        // Create the RemoteFlagMemory object for this flag
        const remoteFlagMemory = {
            active: true,
            flagName: flag.name,
            flagType: flagTypeConst
        };
        // If the dependent room already has this room covered, set the flag to be deleted and throw a warning
        const existingDepedentRemoteRoomMem = _.find(MemoryApi.getRemoteRooms(dependentRoom), (rr) => {
            if (rr) {
                return rr.roomName === roomName;
            }
            return false;
        });
        if (existingDepedentRemoteRoomMem) {
            Memory.flags[flag.name].complete = true;
            throw new UserException("Already working this dependent room!", "The room you placed the remote flag in is already being worked by " + existingDepedentRemoteRoomMem.roomName, ERROR_WARN$1);
        }
        // Otherwise, add a brand new memory structure onto it
        const remoteRoomMemory = {
            sources: { cache: Game.time, data: 1 },
            hostiles: { cache: Game.time, data: null },
            structures: { cache: Game.time, data: null },
            roomName: flag.pos.roomName,
            flags: [remoteFlagMemory],
        };
        console.log("Remote Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]");
        dependentRoom.memory.remoteRooms.push(remoteRoomMemory);
    }
    /**
     * commit a attack flag to memory
     * @param flag the flag we want to commit
     */
    static processNewAttackFlag(flag) {
        // Get the host room and set the flags memory
        const dependentRoom = Game.rooms[this.findDependentRoom(flag.pos.roomName)];
        const flagTypeConst = this.getFlagType(flag);
        const roomName = flag.pos.roomName;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        // Create the RemoteFlagMemory object for this flag
        const attackFlagMemory = this.generateAttackFlagOptions(flag, flagTypeConst, dependentRoom.name);
        // If the dependent room already has this room covered, just push this flag onto the existing structure
        const existingDepedentAttackRoomMem = _.find(MemoryApi.getAttackRooms(dependentRoom), (rr) => {
            if (rr) {
                return rr.roomName === roomName;
            }
            return false;
        });
        if (existingDepedentAttackRoomMem) {
            console.log("Attack Flag [" + flag.name + "] processed. Added to existing Host Room: [" + existingDepedentAttackRoomMem.roomName + "]");
            existingDepedentAttackRoomMem.flags.push(attackFlagMemory);
            return;
        }
        // Otherwise, add a brand new memory structure onto it
        const attackRoomMemory = {
            hostiles: { cache: Game.time, data: null },
            structures: { cache: Game.time, data: null },
            roomName: flag.pos.roomName,
            flags: [attackFlagMemory],
        };
        console.log("Attack Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]");
        dependentRoom.memory.attackRooms.push(attackRoomMemory);
    }
    /**
     * commit a claim flag to memory
     * @param flag the flag we want to commit
     */
    static processNewClaimFlag(flag) {
        // Get the host room and set the flags memory
        const dependentRoom = Game.rooms[this.findDependentRoom(flag.pos.roomName)];
        const flagTypeConst = this.getFlagType(flag);
        const roomName = flag.pos.roomName;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        // Create the ClaimFlagMemory object for this flag
        const claimFlagMemory = {
            active: true,
            flagName: flag.name,
            flagType: flagTypeConst
        };
        // If the dependent room already has this room covered, set the flag to be deleted and throw a warning
        const existingDepedentClaimRoomMem = _.find(MemoryApi.getClaimRooms(dependentRoom), (rr) => {
            if (rr) {
                return rr.roomName === roomName;
            }
            return false;
        });
        if (existingDepedentClaimRoomMem) {
            Memory.flags[flag.name].complete = true;
            throw new UserException("Already working this dependent room!", "The room you placed the claim flag in is already being worked by " + existingDepedentClaimRoomMem.roomName, ERROR_WARN$1);
        }
        // Otherwise, add a brand new memory structure onto it
        const claimRoomMemory = {
            roomName: flag.pos.roomName,
            flags: [claimFlagMemory],
        };
        console.log("Claim Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]");
        dependentRoom.memory.claimRooms.push(claimRoomMemory);
    }
    /**
     * commit a depedent room over-ride flag to memory
     * @param flag the flag we are commiting to memory
     */
    static processNewDependentRoomOverrideFlag(flag) {
        // Set all the memory values for the flag
        const flagTypeConst = this.getFlagType(flag);
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        console.log("Option Flag [" + flag.name + "] processed. Flag Type: [" + flagTypeConst + "]");
    }
    /**
     * commit a stimulate flag to an owned room
     * @param flag the flag we are commiting to memory
     */
    static processNewStimulateFlag(flag) {
        // Set all the memory values for the flag
        const flagTypeConst = this.getFlagType(flag);
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
    }
    /**
     * finds the closest colonized room to support a
     * Remote/Attack/Claim room
     * Calls helper functions to decide auto or over-ride
     * @param targetRoom the room we want to support
     */
    static findDependentRoom(targetRoom) {
        // Green & White flags are considered override flags, get those and find the one that was placed most recently
        // ! - Idea for here... going to add a constant to describe each flag type, then we can make an empire api function
        // that returns the flag type, so this next line could be replaced with (flag: Flag) => this.getFlagType === OVERRIDE_FLAG
        const allOverrideFlags = MemoryApi.getAllFlags((flag) => flag.color === COLOR_GREEN && flag.secondaryColor === COLOR_WHITE);
        let overrideFlag;
        // If we don't have any d-room override flags, we don't need to worry about it and will use auto room detection
        if (allOverrideFlags.length > 0) {
            for (const flag of allOverrideFlags) {
                if (!overrideFlag) {
                    overrideFlag = flag;
                }
                else {
                    if (flag.memory.timePlaced > overrideFlag.memory.timePlaced) {
                        overrideFlag = flag;
                    }
                }
            }
            // Set the override flag as complete and call the helper to find the override room
            Memory.flags[overrideFlag.name].complete = true;
            return this.findDependentRoomManual(overrideFlag);
        }
        // If no override flag was found, automatically find closest dependent room
        return this.findDependentRoomAuto(targetRoom);
    }
    /**
     * Automatically come up with a dependent room
     * @param targetRoom the room we want to support
     */
    static findDependentRoomAuto(targetRoom) {
        const ownedRooms = MemoryApi.getOwnedRooms();
        let shortestPathRoom;
        // Loop over owned rooms, finding the shortest path
        for (const currentRoom of ownedRooms) {
            if (!shortestPathRoom) {
                shortestPathRoom = currentRoom;
                continue;
            }
            const shortestPath = Game.map.findRoute(shortestPathRoom.name, targetRoom);
            const currentPath = Game.map.findRoute(currentRoom.name, targetRoom);
            // If the path is shorter, its the new canidate room
            if (currentPath.length < shortestPath.length) {
                shortestPathRoom = currentRoom;
            }
        }
        // Throw exception if no rooms were found
        if (!shortestPathRoom) {
            throw new UserException("Auto-Dependent Room Finder Error", "No room with shortest path found to the target room.", ERROR_WARN$1);
        }
        return shortestPathRoom.name;
    }
    /**
     * Manually get the dependent room based on flags
     * @param targetRoom the room we want to support
     * @param overrideFlag the flag for the selected override flag
     */
    static findDependentRoomManual(overrideFlag) {
        // Throw error if we have no vision in the override flag room
        // (Shouldn't happen, but user error can allow it to occur)
        if (!Game.flags[overrideFlag.name].room) {
            throw new UserException("Manual Dependent Room Finding Error", "Flag [" + overrideFlag.name + "]. We have no vision in the room you attempted to manually set as override dependent room.", ERROR_ERROR);
        }
        return Game.flags[overrideFlag.name].room.name;
    }
    /**
     * get the rally location for the room we are attacking
     * @param homeRoom the room we are spawning from
     * @param targetRoom the room we are attacking
     */
    static findRallyLocation(homeRoom, targetRoom) {
        const fullPath = Game.map.findRoute(homeRoom, targetRoom);
        // To prevent out of bounds, only allow room paths that have as least 2 elements (should literally never occur unless we
        // are attacking our own room (??? maybe an active defender strategy, so i won't throw an error for it tbh)
        if (fullPath.length <= 2) {
            return new RoomPosition(25, 25, homeRoom);
        }
        // Return the room right BEFORE the room we are attacking. This is the rally room (location is just in middle of room)
        return new RoomPosition(25, 25, fullPath[fullPath.length - 2].room);
    }
    /**
     * if a claim room has no flags associated with it, delete the claim room memory structure
     * @param claimRooms an array of all the claim room memory structures in the empire
     */
    static cleanDeadClaimRooms(claimRooms) {
        // Loop over claim rooms, and if we find one with no associated flag, remove it
        for (const claimRoom in claimRooms) {
            if (!claimRooms[claimRoom]) {
                continue;
            }
            const claimRoomName = claimRooms[claimRoom].roomName;
            if (!claimRooms[claimRoom].flags[0]) {
                console.log("Removing Claim Room [" + claimRooms[claimRoom].roomName + "]");
                // Get the dependent room for the attack room we are removing from memory
                const dependentRoom = _.find(MemoryApi.getOwnedRooms(), (room) => {
                    const rr = room.memory.claimRooms;
                    return _.some(rr, (innerRR) => {
                        if (innerRR) {
                            return innerRR.roomName === claimRoomName;
                        }
                        return false;
                    });
                });
                delete Memory.rooms[dependentRoom.name].claimRooms[claimRoom];
            }
        }
    }
    /**
     * removes all claim room memory structures that do not have an existing flag associated with them
     * @param claimRooms an array of all the claim room memory structures in the empire
     */
    static cleanDeadClaimRoomFlags(claimRooms) {
        // Loop over claim rooms, remote rooms, and attack rooms, and make sure the flag they're referencing actually exists
        // Delete the memory structure if its not associated with an existing flag
        for (const claimRoom of claimRooms) {
            if (!claimRoom) {
                continue;
            }
            for (const flag in claimRoom.flags) {
                if (!claimRoom.flags[flag]) {
                    continue;
                }
                // Tell typescript that these are claim flag memory structures
                const currentFlag = claimRoom.flags[flag];
                if (!Game.flags[currentFlag.flagName]) {
                    console.log("Removing [" + flag + "] from Claim Room [" + claimRoom.roomName + "]");
                    delete claimRoom.flags[flag];
                }
            }
        }
    }
    /**
     * if an attack room has no flags associated with it, delete the attack room memory structure
     * @param attackRooms an array of all the attack room memory structures in the empire
     */
    static cleanDeadAttackRooms(attackRooms) {
        // Loop over remote rooms, and if we find one with no associated flag, remove it
        for (const attackRoom in attackRooms) {
            if (!attackRooms[attackRoom]) {
                continue;
            }
            const attackRoomName = attackRooms[attackRoom].roomName;
            if (!attackRooms[attackRoom].flags[0]) {
                console.log("Removing Attack Room [" + attackRooms[attackRoom].roomName + "]");
                // Get the dependent room for the attack room we are removing from memory
                const dependentRoom = _.find(MemoryApi.getOwnedRooms(), (room) => {
                    const rr = room.memory.attackRooms;
                    return _.some(rr, (innerRR) => {
                        if (innerRR) {
                            return innerRR.roomName === attackRoomName;
                        }
                        return false;
                    });
                });
                delete Memory.rooms[dependentRoom.name].attackRooms[attackRoom];
            }
        }
    }
    /**
     * clean dead attack room flags from a live attack room
     */
    static cleanDeadAttackRoomFlags(attackRooms) {
        // Loop over attack rooms, and make sure the flag they're referencing actually exists
        // Delete the memory structure if its not associated with an existing flag
        for (const attackRoom of attackRooms) {
            if (!attackRoom) {
                continue;
            }
            for (const flag in attackRoom.flags) {
                if (!attackRoom.flags[flag]) {
                    continue;
                }
                // Tell typescript that these are claim flag memory structures
                const currentFlag = attackRoom.flags[flag];
                if (!Game.flags[currentFlag.flagName]) {
                    console.log("Removing [" + flag + "] from Attack Room [" + attackRoom.roomName + "]");
                    delete attackRoom.flags[flag];
                }
            }
        }
    }
    /**
     * if an remote room has no flags associated with it, delete the attack room memory structure
     * @param attackRooms an array of all the attack room memory structures in the empire
     */
    static cleanDeadRemoteRooms(remoteRooms) {
        // Loop over remote rooms, and if we find one with no associated flag, remove it
        for (const remoteRoom in remoteRooms) {
            if (!remoteRooms[remoteRoom]) {
                continue;
            }
            const remoteRoomName = remoteRooms[remoteRoom].roomName;
            if (!remoteRooms[remoteRoom].flags[0]) {
                console.log("Removing Remote Room [" + remoteRooms[remoteRoom].roomName + "]");
                // Get the dependent room for this room
                const dependentRoom = _.find(MemoryApi.getOwnedRooms(), (room) => {
                    const rr = room.memory.remoteRooms;
                    return _.some(rr, (innerRR) => {
                        if (innerRR) {
                            return innerRR.roomName === remoteRoomName;
                        }
                        return false;
                    });
                });
                delete Memory.rooms[dependentRoom.name].remoteRooms[remoteRoom];
            }
        }
    }
    /**
     * removes all claim room memory structures that do not have an existing flag associated with them
     * @param claimRooms an array of all the claim room memory structures in the empire
     */
    static cleanDeadRemoteRoomsFlags(remoteRooms) {
        // Loop over remote rooms and make sure the flag they're referencing actually exists
        // Delete the memory structure if its not associated with an existing flag
        for (const remoteRoom of remoteRooms) {
            if (!remoteRoom) {
                continue;
            }
            for (const flag in remoteRoom.flags) {
                if (!remoteRoom.flags[flag]) {
                    continue;
                }
                // Tell typescript that these are claim flag memory structures
                const currentFlag = remoteRoom.flags[flag];
                if (!Game.flags[currentFlag.flagName]) {
                    console.log("Removing [" + flag + "] from Remote Room Memory [" + remoteRoom.roomName + "]");
                    delete remoteRoom.flags[flag];
                }
            }
        }
    }
    /**
     * gets the flag type for a flag
     * @param flag the flag we are checking the type for
     * @returns the flag type constant that tells you the type of flag it is
     */
    static getFlagType(flag) {
        let flagType;
        // Attack flags
        if (flag.color === COLOR_RED) {
            // Check the subtype
            switch (flag.secondaryColor) {
                // Zealot Solo
                case COLOR_BLUE:
                    flagType = ZEALOT_SOLO;
                    break;
                // Stalker Solo
                case COLOR_BROWN:
                    flagType = STALKER_SOLO;
                // Standard Squad
                case COLOR_RED:
                    flagType = STANDARD_SQUAD;
            }
        }
        // Claim Flags
        else if (flag.color === COLOR_WHITE) {
            flagType = CLAIM_FLAG;
        }
        // Option Flags
        else if (flag.color === COLOR_GREEN) {
            // Check the subtype
            switch (flag.secondaryColor) {
                // Depedent Room Override Flag
                case COLOR_WHITE:
                    flagType = OVERRIDE_D_ROOM_FLAG;
                    break;
                case COLOR_YELLOW:
                    flagType = STIMULATE_FLAG;
            }
        }
        // Remote Flags
        else if (flag.color === COLOR_YELLOW) {
            flagType = REMOTE_FLAG;
        }
        // Unknown Flag Type
        else {
            // If it isn't a valid flag type, set it to complete to flag it for deletion and throw a warning
            Memory.flags[flag.name].complete = true;
            throw new UserException("Invalid flag type", "The flag you placed has no defined type.", ERROR_WARN$1);
        }
        return flagType;
    }
    /**
     * generate the options for an attack flag based on its type
     * @param flag the flag we are getting options for
     * @param flagTypeConst the flag type of this flag
     * @param dependentRoom the room that will be hosting this attack room
     * @returns the object for the attack flag associated memory structure
     */
    static generateAttackFlagOptions(flag, flagTypeConst, dependentRoom) {
        // Generate the attack flag options based on the type of flag it is
        const attackFlagMemory = {
            active: false,
            squadSize: 0,
            squadUUID: 0,
            rallyLocation: null,
            flagName: flag.name,
            flagType: flagTypeConst
        };
        // Fill in these options based on the flag type
        switch (flagTypeConst) {
            // Zealot Solo
            case ZEALOT_SOLO:
                // We don't need to adjust the memory for this type
                break;
            // Stalker Solo
            case STALKER_SOLO:
                // We don't need to adjust memory for this type
                break;
            // Standard Squad
            case STANDARD_SQUAD:
                attackFlagMemory.squadSize = 3;
                attackFlagMemory.squadUUID = SpawnApi.generateSquadUUID();
                attackFlagMemory.rallyLocation = this.findRallyLocation(dependentRoom, flag.pos.roomName);
                break;
            // Throw a warning if we were unable to generate memory for this flag type, and set it to be deleted
            default:
                flag.memory.complete = true;
                throw new UserException("Unable to get attack flag memory for flag type " + flagTypeConst, "Flag " + flag.name + " was of an invalid type for the purpose of generating attack flag memory", ERROR_WARN$1);
        }
        return attackFlagMemory;
    }
}
//# sourceMappingURL=EmpireHelper.js.map

// Config file for memory related actions
/**
 * set a zealot flag to one time use
 */
const ZEALOT_FLAG_ONE_TIME_USE = true;
/**
 * set a stalker flag to one time use
 */
const STALKER_FLAG_ONE_TIME_USE = true;
/**
 * set a standard squad flag to one time use
 */
const STANDARD_SQUAD_FLAG_ONE_TIME_USE = true;
//# sourceMappingURL=militaryConfig.js.map

class Empire {
    /**
     * get new flags that need to be processed
     * @returns Flag[] an array of flags that need to be processed (empty if none)
     */
    static getUnprocessedFlags() {
        // Create an array of all flags
        const allFlags = MemoryApi.getAllFlags();
        const newFlags = [];
        // Create an array of all unprocessed flags
        for (const flag of allFlags) {
            if (!flag.memory.processed || flag.memory.processed === undefined) {
                newFlags.push(flag);
            }
        }
        // Returns all unprocessed flags, empty array if there are none
        return newFlags;
    }
    /**
     * search for new flags and properly commit them
     * @param newFlags StringMap of new flags we need to process
     */
    static processNewFlags(newFlags) {
        // Don't run the function if theres no new flags
        if (newFlags.length === 0) {
            return;
        }
        // Loop over all new flags and call the proper helper
        for (const flag of newFlags) {
            switch (flag.color) {
                // Remote Flags
                case COLOR_YELLOW:
                    EmpireHelper.processNewRemoteFlag(flag);
                    break;
                // Attack Flags
                case COLOR_RED:
                    EmpireHelper.processNewAttackFlag(flag);
                    break;
                // Claim Flags
                case COLOR_WHITE:
                    EmpireHelper.processNewClaimFlag(flag);
                    break;
                // Option flags
                case COLOR_GREEN:
                    // Dependent Room override flag
                    if (flag.secondaryColor === COLOR_WHITE) {
                        EmpireHelper.processNewDependentRoomOverrideFlag(flag);
                    }
                    else if (flag.secondaryColor === COLOR_YELLOW) {
                        EmpireHelper.processNewStimulateFlag(flag);
                    }
                // Unhandled Flag, print warning to console
                // Set to processed to prevent the flag from attempting processization every tick
                default:
                    console.log("Attempted to process flag of an unhandled type.");
                    flag.memory.processed = true;
                    break;
            }
            // Set up the memory for the room if it doesn't already exist
            const roomName = flag.pos.roomName;
            if (!Memory.rooms[roomName]) {
                const isOwnedRoom = false;
                console.log("Initializing Room Memory for Dependent Room [" + roomName + "].");
                MemoryApi.initRoomMemory(roomName, isOwnedRoom);
            }
        }
    }
    /**
     * deletes all flags marked as complete
     */
    static deleteCompleteFlags() {
        const completeFlags = MemoryApi.getAllFlags((flag) => flag.memory.complete);
        // Loop over all flags, removing them and their direct memory from the game
        for (const flag of completeFlags) {
            console.log("Removing flag [" + flag.name + "]");
            flag.remove();
            delete Memory.flags[flag.name];
        }
    }
    /**
     * look for dead flags (memory with no associated flag existing) and remove them
     */
    static cleanDeadFlags() {
        // Get all flag based action memory structures (Remote, Claim, and Attack Room Memory)
        const allRooms = MemoryApi.getOwnedRooms();
        const claimRooms = _.flatten(_.map(allRooms, room => MemoryApi.getClaimRooms(room)));
        const remoteRooms = _.flatten(_.map(allRooms, room => MemoryApi.getRemoteRooms(room)));
        const attackRooms = _.flatten(_.map(allRooms, room => MemoryApi.getAttackRooms(room)));
        // Clean dead flags from memory structures
        EmpireHelper.cleanDeadClaimRoomFlags(claimRooms);
        EmpireHelper.cleanDeadRemoteRoomsFlags(remoteRooms);
        EmpireHelper.cleanDeadAttackRoomFlags(attackRooms);
        // Clean the memory of each type of dependent room memory structure with no existing flags associated
        EmpireHelper.cleanDeadClaimRooms(claimRooms);
        EmpireHelper.cleanDeadRemoteRooms(remoteRooms);
        EmpireHelper.cleanDeadAttackRooms(attackRooms);
    }
    /**
     * get if the flag is considered a one time use flag
     */
    static isAttackFlagOneTimeUse(flagMemory) {
        // Reference config file to decide what flag is considered 1 time use, assume yes by default
        switch (flagMemory.flagType) {
            case ZEALOT_SOLO:
                return ZEALOT_FLAG_ONE_TIME_USE;
            case STALKER_SOLO:
                return STALKER_FLAG_ONE_TIME_USE;
            case STANDARD_SQUAD:
                return STANDARD_SQUAD_FLAG_ONE_TIME_USE;
            default:
                return true;
        }
    }
    /**
     * if there are no active attack flags for a specific room, active one
     */
    static activateAttackFlags(room) {
        const attackRooms = MemoryApi.getAttackRooms(room);
        const attackRoomWithNoActiveFlag = _.find(attackRooms, (attackRoom) => {
            if (attackRoom) {
                return !_.some(attackRoom.flags, (flag) => flag.active);
            }
            return false;
        });
        // Break early if there are none
        if (!attackRoomWithNoActiveFlag) {
            return;
        }
        // Break early if no attack flags on this room (possible to happen from an error with cleaning)
        if (!attackRoomWithNoActiveFlag.flags) {
            return;
        }
        // Activate the first one we see, possible to change later for another standard
        for (const arf in attackRoomWithNoActiveFlag.flags) {
            if (attackRoomWithNoActiveFlag.flags[arf]) {
                attackRoomWithNoActiveFlag.flags[arf].active = true;
                break;
            }
        }
    }
}
//# sourceMappingURL=Empire.Api.js.map

// empire-wide manager
class EmpireManager {
    /**
     * run the empire for the AI
     */
    static runEmpireManager() {
        // Get unprocessed flags and process them
        const unprocessedFlags = Empire.getUnprocessedFlags();
        const ownedRooms = MemoryApi.getOwnedRooms();
        if (unprocessedFlags.length > 0) {
            Empire.processNewFlags(unprocessedFlags);
        }
        // Delete unused flags and flag memory
        Empire.deleteCompleteFlags();
        Empire.cleanDeadFlags();
        // Activate attack flags for every room
        _.forEach(ownedRooms, (room) => Empire.activateAttackFlags(room));
        // ! - [TODO] Empire Queue and Alliance/Public Memory Stuff
    }
}
//# sourceMappingURL=EmpireManager.js.map

// @ts-ignore
// manager for the memory of the empire
class MemoryManager {
    /**
     * run the memory for the AI
     */
    static runMemoryManager() {
        this.initMainMemory();
        MemoryApi.garbageCollection();
        const ownedRooms = MemoryApi.getOwnedRooms();
        _.forEach(ownedRooms, (room) => {
            const isOwnedRoom = true;
            MemoryApi.initRoomMemory(room.name, isOwnedRoom);
            MemoryApi.cleanDependentRoomMemory(room);
        });
    }
    /**
     * Ensures the initial Memory object is defined properly
     */
    static initMainMemory() {
        if (!Memory.rooms) {
            Memory.rooms = {};
        }
        if (!Memory.flags) {
            Memory.flags = {};
        }
        if (!Memory.creeps) {
            Memory.creeps = {};
        }
    }
}
//# sourceMappingURL=MemoryManagement.js.map

// room-wide manager
class RoomManager {
    /**
     * run the room for every room
     */
    static runRoomManager() {
        const ownedRooms = MemoryApi.getOwnedRooms();
        _.forEach(ownedRooms, (room) => {
            this.runSingleRoom(room);
        });
    }
    /**
     * run the room for a single room
     * @param room the room we are running this manager function on
     */
    static runSingleRoom(room) {
        // Set Defcon and Room State (roomState relies on defcon being set first)
        if (RoomHelper.excecuteEveryTicks(RUN_ROOM_STATE_TIMER)) {
            RoomApi.setDefconLevel(room);
        }
        if (RoomHelper.excecuteEveryTicks(RUN_DEFCON_TIMER)) {
            RoomApi.setRoomState(room);
        }
        // Run all structures in the room if they exist
        // Run Towers
        const defcon = MemoryApi.getDefconLevel(room);
        if (defcon >= 1 &&
            RoomHelper.excecuteEveryTicks(RUN_TOWER_TIMER)) {
            RoomApi.runTowers(room);
        }
        // Run Labs
        if (RoomHelper.isExistInRoom(room, STRUCTURE_LAB) &&
            RoomHelper.excecuteEveryTicks(RUN_LAB_TIMER)) {
            RoomApi.runLabs(room);
        }
        // Run Links
        if (RoomHelper.isExistInRoom(room, STRUCTURE_LINK) &&
            RoomHelper.excecuteEveryTicks(RUN_LINKS_TIMER)) {
            RoomApi.runLinks(room);
        }
        // Run Terminals
        if (RoomHelper.isExistInRoom(room, STRUCTURE_TERMINAL) &&
            RoomHelper.excecuteEveryTicks(RUN_TERMINAL_TIMER)) {
            RoomApi.runTerminal(room);
        }
    }
}
//# sourceMappingURL=RoomManager.js.map

// handles spawning for every room
class SpawnManager {
    /**
     * run the spawning for the AI for each room
     */
    static runSpawnManager() {
        const ownedRooms = MemoryApi.getOwnedRooms();
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
                const targetRoom = SpawnApi.getCreepTargetRoom(room, nextCreepRole);
                const militarySquadOptions = SpawnApi.generateSquadOptions(room, targetRoom, nextCreepRole);
                const homeRoom = SpawnApi.getCreepHomeRoom(room, nextCreepRole, targetRoom);
                const creepOptions = SpawnApi.generateCreepOptions(room, nextCreepRole, roomState, militarySquadOptions["squadSize"], militarySquadOptions["squadUUID"], militarySquadOptions["rallyLocation"]);
                // Spawn the creep
                SpawnApi.spawnNextCreep(room, creepBody, creepOptions, nextCreepRole, openSpawn, homeRoom, targetRoom);
            }
        }
    }
}
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
                // * if this causes an error later on, remove the first if statement and change else if to 'if'
                if (e instanceof UserException) {
                    console.log('<font color="' + e.titleColor + '">' + e.title + "</font>");
                    console.log('<font color="' + e.bodyColor + '">' + e.body + "</font>");
                }
                else if (e instanceof Error) {
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

const textColor = "#bab8ba";
const textSize = 0.8;
const charHeight = textSize * 1.1;
// Helper for room visuals
class RoomVisualManager {
    /**
     * display m
     * @param lines the array of text we want to display
     * @param x the x value we are starting it at
     * @param y the y value we are starting it at
     * @param roomName the room name its going in
     * @param isLeft if we are left aligning
     */
    static multiLineText(lines, x, y, roomName, isLeft) {
        if (lines.length === 0) {
            return;
        }
        const vis = new RoomVisual(roomName);
        // Draw text
        let dy = 0;
        for (const line of lines) {
            if (isLeft) {
                vis.text(line, x, y + dy, {
                    align: "left",
                    color: textColor,
                    opacity: 0.8,
                    font: " .7 Trebuchet MS"
                });
            }
            else {
                vis.text(line, x, y + dy, {
                    align: "right",
                    color: textColor,
                    opacity: 0.8,
                    font: " .7 Trebuchet MS"
                });
            }
            dy += charHeight;
        }
    }
    /**
     * take the room state we are given and return the name of that room state
     * @param roomState the room state we are getting the string for
     */
    static convertRoomStateToString(roomState) {
        switch (roomState) {
            case ROOM_STATE_INTRO$1:
                return "Intro";
            case ROOM_STATE_BEGINNER$1:
                return "Beginner";
            case ROOM_STATE_INTER$1:
                return "Intermediate";
            case ROOM_STATE_ADVANCED$1:
                return "Advanced";
            case ROOM_STATE_NUKE_INBOUND$1:
                return "Nuke Incoming!";
            case ROOM_STATE_STIMULATE$1:
                return "Stimulate";
            case ROOM_STATE_UPGRADER$1:
                return "Upgrader";
        }
    }
    /**
     * take the flag type we are given and return the string name of that flag type
     * @param flagType the type of flag we are getting the string for
     */
    static convertFlagTypeToString(flagType) {
        switch (flagType) {
            case STANDARD_SQUAD$1:
                return "Standard Squad";
            case STALKER_SOLO$1:
                return "Stalker Solo";
            case ZEALOT_SOLO$1:
                return "Zealot Solo";
            default:
                return "Not An Attack Flag";
        }
    }
    /**
     * get the amount of seconds in each tick (estimate)
     */
    static getSecondsPerTick(room) {
        const TIME_BETWEEN_CHECKS = 50;
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            };
        }
        // Every 50 ticks, update the time and find the new seconds per tick
        if (RoomHelper.excecuteEveryTicks(TIME_BETWEEN_CHECKS)) {
            const updatedTime = Date.now();
            const oldTime = Memory.rooms[room.name].visual.time;
            const avgTimePerTick = (updatedTime - oldTime) / TIME_BETWEEN_CHECKS / 1000;
            Memory.rooms[room.name].visual.time = updatedTime;
            Memory.rooms[room.name].visual.secondsPerTick = Math.floor(avgTimePerTick * 10) / 10;
        }
        return Memory.rooms[room.name].visual.secondsPerTick;
    }
    /**
     * get the average controller progress over the last specified ticks
     * @param ticks the number of ticks we are wanting to collect
     * @param room the room we are getting the CPPT for
     */
    static getAverageControlPointsPerTick(ticks, room) {
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            };
        }
        const progressSampleSize = Memory.rooms[room.name].visual.controllerProgressArray.length;
        const newControllerProgress = room.controller.progress;
        let progressSum = 0;
        if (progressSampleSize < ticks) {
            // Add this ticks value to the array if it isn't already too large
            Memory.rooms[room.name].visual.controllerProgressArray.push(newControllerProgress);
        }
        else {
            // Move everything left, then add new value to end
            for (let j = 0; j < progressSampleSize; ++j) {
                Memory.rooms[room.name].visual.controllerProgressArray[j] = Memory.rooms[room.name].visual.controllerProgressArray[j + 1];
            }
            Memory.rooms[room.name].visual.controllerProgressArray[progressSampleSize - 1] = newControllerProgress;
        }
        // Get the average control points per tick
        for (let i = 0; i < progressSampleSize - 1; ++i) {
            progressSum +=
                Memory.rooms[room.name].visual.controllerProgressArray[i + 1] -
                    Memory.rooms[room.name].visual.controllerProgressArray[i];
        }
        return Math.floor(progressSum / progressSampleSize);
    }
    /**
     * converts the value into something shorter so it can be displayed by the graph
     * ex converts 22,000 -> 22k
     * @param rangeVal the value we are converting
     */
    static convertRangeToDisplayVal(rangeVal) {
        return rangeVal > 999 ? (rangeVal / 1000).toFixed(1) + "k" : rangeVal;
    }
    /**
     * Converts seconds to days hours minutes seconds
     * @param seconds The seconds to convert to larger units
     */
    static convertSecondsToTime(seconds) {
        const days = Math.floor(seconds / 86400);
        seconds = seconds % 86400;
        const hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        let timeString = "";
        if (days > 0) {
            timeString = timeString.concat(days + "d ");
        }
        if (hours > 0) {
            timeString = timeString.concat(hours + "h ");
        }
        if (minutes > 0) {
            timeString = timeString.concat(minutes + "m ");
        }
        // Only show seconds if it's all there is
        if (seconds > 0 && timeString.length === 0) {
            timeString = timeString.concat(seconds + "s");
        }
        if (timeString === "") {
            return "NaN";
        }
        return timeString;
    }
    /**
     * Updates a rolling average for the controller level
     * @param room
     */
    static updateRollingAverage(newValue, room) {
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            };
        }
        // Reset rolling average so that values remain significant instead of being watered down over time
        if (Memory.rooms[room.name].visual.etaMemory.rcl !== room.controller.level) {
            Memory.rooms[room.name].visual.etaMemory.avgPointsPerTick = 0;
            Memory.rooms[room.name].visual.etaMemory.ticksMeasured = 0;
            Memory.rooms[room.name].visual.etaMemory.rcl = room.controller.level;
        }
        // Increment Tick Count
        Memory.rooms[room.name].visual.etaMemory.ticksMeasured++;
        // The difference this newValue adds/subtracts to the average
        const differential = (newValue - Memory.rooms[room.name].visual.etaMemory.avgPointsPerTick) /
            Memory.rooms[room.name].visual.etaMemory.ticksMeasured;
        // The new average is OldAverage + Differential
        Memory.rooms[room.name].visual.etaMemory.avgPointsPerTick =
            Memory.rooms[room.name].visual.etaMemory.avgPointsPerTick + differential;
    }
    /**
     * gets the estimated time in days, hours, minutes to the next rcl based on current average
     * @param room the room we are gettign this value for
     */
    static getEstimatedTimeToNextLevel(room) {
        if (room.controller === undefined) {
            return "No rcl";
        }
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            };
        }
        // Get the most recent cp/hour from memory
        const ticksTracked = Memory.rooms[room.name].visual.controllerProgressArray.length;
        if (ticksTracked < 2) {
            return "No Data";
        }
        const pointsThisTick = Memory.rooms[room.name].visual.controllerProgressArray[ticksTracked - 1] -
            Memory.rooms[room.name].visual.controllerProgressArray[ticksTracked - 2];
        // Calculate the rolling average and store it back in memory
        this.updateRollingAverage(pointsThisTick, room);
        // Get the number of points to next level
        const pointsToNextLevel = room.controller.progressTotal - room.controller.progress;
        // Get the number of ticks to next level
        const ticksToNextLevel = pointsToNextLevel / Memory.rooms[room.name].visual.etaMemory.avgPointsPerTick;
        // Get the number of seconds to next level
        const secondsToNextLevel = ticksToNextLevel * Memory.rooms[room.name].visual.secondsPerTick;
        // Get the formatted version of secondsToNextLevel
        return this.convertSecondsToTime(secondsToNextLevel);
    }
}
//# sourceMappingURL=RoomVisualHelper.js.map

// Api for room visuals
class RoomVisualApi {
    /**
     * draws the information that is empire wide (will be same for every room)
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    static createEmpireInfoVisual(room, x, y) {
        // Get all the information we will need to display in the box
        const usedCpu = Game.cpu.getUsed();
        const cpuLimit = Game.cpu['limit'];
        const bucket = Game.cpu['bucket'];
        const BUCKET_LIMIT = 10000;
        const gclProgress = Game.gcl['progress'];
        const gclTotal = Game.gcl['progressTotal'];
        const cpuPercent = Math.floor((usedCpu / cpuLimit * 100) * 10) / 10;
        const bucketPercent = Math.floor((bucket / BUCKET_LIMIT * 100) * 10) / 10;
        const gclPercent = Math.floor((gclProgress / gclTotal * 100) * 10) / 10;
        // Draw the text
        const lines = [];
        lines.push("");
        lines.push("Empire Info");
        lines.push("");
        lines.push("CPU:   " + cpuPercent + "%");
        lines.push("BKT:   " + bucketPercent + "%");
        lines.push("GCL:   " + gclPercent + "%");
        lines.push("LVL:    " + Game.gcl['level']);
        lines.push("");
        lines.push("Viewing:  [ " + room.name + " ]");
        RoomVisualManager.multiLineText(lines, x, y, room.name, true);
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 1, y + lines.length - 1, x + 7.5, y + lines.length - 1) // bottom line
            .line(x - 1, y - 1, x + 7.5, y - 1) // top line
            .line(x - 1, y - 1, x - 1, y + lines.length - 1) // left line
            .line(x + 7.5, y - 1, x + 7.5, y + lines.length - 1); // right line
        // Return where the next box should start
        return y + lines.length;
    }
    /**
     * draws the information of creep limits and currently living members
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    static createCreepCountVisual(room, x, y) {
        // Get the info we need to display
        const creepsInRoom = MemoryApi.getMyCreeps(room.name);
        const creepLimits = MemoryApi.getCreepLimits(room);
        const roles = {
            miner: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_MINER$1).length,
            harvester: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_HARVESTER$1).length,
            worker: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_WORKER$1).length,
            lorry: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_LORRY$1).length,
            powerUpgrader: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_POWER_UPGRADER$1).length,
            remoteMiner: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_REMOTE_MINER$1).length,
            remoteReserver: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_REMOTE_RESERVER$1).length,
            remoteHarvester: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_REMOTE_HARVESTER$1).length,
            claimer: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_CLAIMER$1).length,
            colonizer: _.filter(creepsInRoom, (c) => c.memory.role === ROLE_COLONIZER$1).length
        };
        const spawningCreep = _.filter(MemoryApi.getMyCreeps(room.name), (c) => c.spawning);
        let spawningRole;
        const lines = [];
        lines.push("");
        lines.push("Creep Info");
        lines.push("");
        if (spawningCreep.length === 0) {
            lines.push("Spawning:       " + "None");
        }
        for (const creep of spawningCreep) {
            spawningRole = creep.memory.role;
            lines.push("Spawning:       " + spawningRole);
        }
        lines.push("Creeps in Room:     " + MemoryApi.getCreepCount(room));
        if (creepLimits['domesticLimits']) {
            // Add creeps to the lines array
            if (creepLimits.domesticLimits.miner > 0) {
                lines.push("Miners:     " + roles[ROLE_MINER$1] + " / " + creepLimits.domesticLimits.miner);
            }
            if (creepLimits.domesticLimits.harvester > 0) {
                lines.push("Harvesters:     " + roles[ROLE_HARVESTER$1] + " / " + creepLimits.domesticLimits.harvester);
            }
            if (creepLimits.domesticLimits.worker > 0) {
                lines.push("Workers:     " + roles[ROLE_WORKER$1] + " / " + creepLimits.domesticLimits.worker);
            }
            if (creepLimits.domesticLimits.lorry > 0) {
                lines.push("Lorries:    " + roles[ROLE_LORRY$1] + " / " + creepLimits.domesticLimits.lorry);
            }
            if (creepLimits.domesticLimits.powerUpgrader > 0) {
                lines.push("Power Upgraders:    " + roles[ROLE_POWER_UPGRADER$1] + " / " + creepLimits.domesticLimits.powerUpgrader);
            }
        }
        if (creepLimits['remoteLimits']) {
            if (creepLimits.remoteLimits.remoteMiner > 0) {
                lines.push("Remote Miners:      " + roles[ROLE_REMOTE_MINER$1] + " / " + creepLimits.remoteLimits.remoteMiner);
            }
            if (creepLimits.remoteLimits.remoteHarvester > 0) {
                lines.push("Remote Harvesters:    " + roles[ROLE_REMOTE_HARVESTER$1] + " / " + creepLimits.remoteLimits.remoteHarvester);
            }
            if (creepLimits.remoteLimits.remoteReserver > 0) {
                lines.push("Remote Reservers:    " + roles[ROLE_REMOTE_RESERVER$1] + " / " + creepLimits.remoteLimits.remoteReserver);
            }
            if (creepLimits.remoteLimits.remoteColonizer > 0) {
                lines.push("Remote Colonizers:    " + roles[ROLE_COLONIZER$1] + " / " + creepLimits.remoteLimits.remoteColonizer);
            }
            if (creepLimits.remoteLimits.claimer > 0) {
                lines.push("Claimers:       " + roles[ROLE_CLAIMER$1] + " / " + creepLimits.remoteLimits.claimer);
            }
        }
        lines.push("");
        RoomVisualManager.multiLineText(lines, x, y, room.name, true);
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 1, y + lines.length - 1, x + 10, y + lines.length - 1) // bottom line
            .line(x - 1, y - 1, x + 10, y - 1) // top line
            .line(x - 1, y - 1, x - 1, y + lines.length - 1) // left line
            .line(x + 10, y - 1, x + 10, y + lines.length - 1); // right line
        // Return the end of this box
        return y + lines.length;
    }
    /**
     * draws the information of the room state
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    static createRoomInfoVisual(room, x, y) {
        // Get the info we need
        const roomState = RoomVisualManager.convertRoomStateToString(room.memory.roomState);
        const level = room.controller.level;
        const controllerProgress = room.controller.progress;
        const controllerTotal = room.controller.progressTotal;
        const controllerPercent = Math.floor((controllerProgress / controllerTotal * 100) * 10) / 10;
        const defconLevel = room.memory.defcon;
        // Draw the text
        const lines = [];
        lines.push("");
        lines.push("Room Info");
        lines.push("");
        lines.push("Room State:     " + roomState);
        lines.push("Room Level:     " + level);
        lines.push("Progress:         " + controllerPercent + "%");
        lines.push("DEFCON:         " + defconLevel);
        if (room.storage) {
            lines.push("Storage:        " + room.storage.store.energy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
        // Adding this disclaimer, beacuse some of the information you need is actually calculated in the graph function
        // Consider decoupling these so you could use them independently
        {
            lines.push("Est TTL:        " + RoomVisualManager.getEstimatedTimeToNextLevel(room));
        }
        lines.push("");
        RoomVisualManager.multiLineText(lines, x, y, room.name, true);
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 1, y + lines.length - 1, x + 10, y + lines.length - 1) // bottom line
            .line(x - 1, y - 1, x + 10, y - 1) // top line
            .line(x - 1, y - 1, x - 1, y + lines.length - 1) // left line
            .line(x + 10, y - 1, x + 10, y + lines.length - 1); // right line
        // Return where the next box should start
        return y + lines.length;
    }
    /**
     * draws the information for remote flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    static createRemoteFlagVisual(room, x, y) {
        const dependentRemoteRooms = MemoryApi.getRemoteRooms(room);
        // Draw the text
        const lines = [];
        lines.push("");
        lines.push("Remote Rooms ");
        lines.push("");
        for (const dr of dependentRemoteRooms) {
            if (!dr) {
                continue;
            }
            lines.push("Room:   [ " + dr.roomName + " ] ");
            lines.push("Flag:   [ " + dr.flags[0].flagName + " ] ");
            lines.push("");
        }
        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Remote Rooms ");
            lines.push("");
        }
        RoomVisualManager.multiLineText(lines, x, y, room.name, false);
        // Draw the box around the text
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1) // bottom line
            .line(x - 10, y - 1, x + .25, y - 1) // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1) // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1); // right line
        // Return where the next box should start
        return y + lines.length;
    }
    /**
     * draws the information for claim flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    static createClaimFlagVisual(room, x, y) {
        const dependentRemoteRooms = MemoryApi.getClaimRooms(room);
        // Draw the text
        const lines = [];
        lines.push("");
        lines.push("Claim Rooms ");
        lines.push("");
        for (const dr of dependentRemoteRooms) {
            if (!dr) {
                continue;
            }
            lines.push("Room:   [ " + dr.roomName + " ] ");
            lines.push("Flag:   [ " + dr.flags[0].flagName + " ] ");
            lines.push("");
        }
        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Claim Rooms ");
            lines.push("");
        }
        RoomVisualManager.multiLineText(lines, x, y, room.name, false);
        // Draw the box around the text
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1) // bottom line
            .line(x - 10, y - 1, x + .25, y - 1) // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1) // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1); // right line
        // Return where the next box should start
        return y + lines.length;
    }
    /**
     * draws the information for attack flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    static createAttackFlagVisual(room, x, y) {
        const dependentRemoteRooms = MemoryApi.getAttackRooms(room);
        // Draw the text
        const lines = [];
        lines.push("");
        lines.push("Attack Rooms ");
        lines.push("");
        for (const dr of dependentRemoteRooms) {
            if (!dr) {
                continue;
            }
            lines.push("Room:   [ " + dr.roomName + " ] ");
            for (const flag of dr.flags) {
                if (!flag) {
                    continue;
                }
                lines.push("Flag:   [ " + flag.flagName + " ] ");
                lines.push("Type:   [ " + RoomVisualManager.convertFlagTypeToString(flag.flagType) + " ]");
            }
            lines.push("");
        }
        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Attack Rooms ");
            lines.push("");
        }
        RoomVisualManager.multiLineText(lines, x, y, room.name, false);
        // Draw the box around the text
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1) // bottom line
            .line(x - 10, y - 1, x + .25, y - 1) // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1) // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1); // right line
        // Return where the next box should start
        return y + lines.length;
    }
    /**
     * draws the information for option flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    static createOptionFlagVisual(room, x, y) {
        const optionFlags = _.filter(Memory.flags, (flag) => flag.flagType ===
            (OVERRIDE_D_ROOM_FLAG$1) &&
            (Game.flags[flag.flagName].pos.roomName === room.name));
        // Draw the text
        const lines = [];
        lines.push("");
        lines.push("Option Flags ");
        lines.push("");
        for (const of of optionFlags) {
            if (!of) {
                continue;
            }
            lines.push("Flag:   [ " + of.flagName + " ] ");
            lines.push("Type:   [ " + of.flagType + " ] ");
            lines.push("");
        }
        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Option Flags ");
            lines.push("");
        }
        RoomVisualManager.multiLineText(lines, x, y, room.name, false);
        // Draw the box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1) // bottom line
            .line(x - 10, y - 1, x + .25, y - 1) // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1) // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1); // right line
        // Return where the next box should start
        return y + lines.length;
    }
    /**
     *
     * @param room the room we are creating the visual for
     * @param x the x value for the starting point of the graph
     * @param y the y value for the starting point of the graph
     */
    static createUpgradeGraphVisual(room, x, y) {
        const textColor = '#bab8ba';
        const X_VALS = [
            { 'start': x, 'end': x + 3 },
            { 'start': x + 3, 'end': x + 6 },
            { 'start': x + 6, 'end': x + 9 },
            { 'start': x + 9, 'end': x + 12 },
            { 'start': x + 12, 'end': x + 15 },
        ];
        const Y_SCALE = 7.5;
        const X_SCALE = 15;
        const secondsPerTick = RoomVisualManager.getSecondsPerTick(room);
        const ticksPerHour = Math.floor(3600 / secondsPerTick);
        const avgControlPointsPerTick = RoomVisualManager.getAverageControlPointsPerTick(25, room);
        const controlPointsPerHourEstimate = avgControlPointsPerTick * ticksPerHour;
        // Make sure visual memory exists
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                avgControlPointsPerHourArray: [],
                controllerProgressArray: [],
                time: 0,
                secondsPerTick: 0,
                room: {},
                etaMemory: { rcl: room.controller.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            };
        }
        const avgControlPointsPerHourSize = Memory.rooms[room.name].visual.avgControlPointsPerHourArray.length;
        if (avgControlPointsPerHourSize < 5) {
            Memory.rooms[room.name].visual.avgControlPointsPerHourArray.push(controlPointsPerHourEstimate);
        }
        else {
            for (let i = 0; i < avgControlPointsPerHourSize - 1; ++i) {
                Memory.rooms[room.name].visual.avgControlPointsPerHourArray[i] = Memory.rooms[room.name].visual.avgControlPointsPerHourArray[i + 1];
            }
            Memory.rooms[room.name].visual.avgControlPointsPerHourArray[avgControlPointsPerHourSize - 1] = controlPointsPerHourEstimate;
        }
        // Collect values and functions needed to draw the lines on the graph
        const minVal = _.min(Memory.rooms[room.name].visual.avgControlPointsPerHourArray);
        const maxVal = _.max(Memory.rooms[room.name].visual.avgControlPointsPerHourArray);
        const minRange = minVal * .75;
        const maxRange = maxVal * 1.25;
        const getY2Coord = (raw) => {
            const range = maxRange - minRange;
            const offset = raw - minRange;
            const percentage = offset / range;
            return percentage * Y_SCALE;
        };
        // Get the scale for the graph
        const displayMinRange = RoomVisualManager.convertRangeToDisplayVal(minRange).toString();
        const displayMaxRange = RoomVisualManager.convertRangeToDisplayVal(maxRange).toString();
        // Draw the graph outline and the scale text
        new RoomVisual(room.name)
            .line(x, y, x, y - Y_SCALE) // bottom line
            .line(x, y, x + X_SCALE, y) // left line
            .line(X_VALS[1].start, y - .25, X_VALS[1].start, y + .25) // tick marks
            .line(X_VALS[2].start, y - .25, X_VALS[2].start, y + .25)
            .line(X_VALS[3].start, y - .25, X_VALS[3].start, y + .25)
            .line(X_VALS[4].start, y - .25, X_VALS[4].start, y + .25)
            .text(displayMaxRange, x - 2.2, y - Y_SCALE + .5, {
            align: 'left',
            color: textColor,
            opacity: .8,
            font: ' .7 Trebuchet MS'
        })
            .text(displayMinRange, x - 2.2, y, {
            align: 'left',
            color: textColor,
            opacity: .8,
            font: ' .7 Trebuchet MS'
        });
        // Draw the lines for the graph
        let startCoord = 0;
        let endCoord = 0;
        for (let i = 0; i < avgControlPointsPerHourSize; ++i) {
            // Set the initial previous and next coordinate (first line will always be flat)
            if (i === 0) {
                startCoord = getY2Coord(Memory.rooms[room.name].visual.avgControlPointsPerHourArray[i]);
                endCoord = startCoord;
            }
            endCoord = getY2Coord(Memory.rooms[room.name].visual.avgControlPointsPerHourArray[i]);
            new RoomVisual(room.name)
                .line(X_VALS[i].start, y - startCoord, X_VALS[i].end, y - endCoord)
                .circle(X_VALS[i].end, y - endCoord);
            startCoord = endCoord;
        }
    }
}
//# sourceMappingURL=RoomVisual.Api.js.map

// Manager for room visuals
class RoomVisualManager$1 {
    /**
     * FUTURE PLANS FOR THIS MANAGER
     *
     * Create progreess bars for all the percentages
     * Place more ideas here --
     */
    /**
     * run the manager for each room
     */
    static runRoomVisualManager() {
        const ownedRooms = MemoryApi.getOwnedRooms();
        _.forEach(ownedRooms, (room) => this.runSingleRoomVisualManager(room));
    }
    /**
     * run the manager for a single room
     * @param room the room we want to run the room visual for
     */
    static runSingleRoomVisualManager(room) {
        let endLeftLine = 1;
        let endRightLine = 1;
        const LEFT_START_X = 1;
        const RIGHT_START_X = 48;
        // Left Side -----
        // Display the Empire box in the top left
        endLeftLine = RoomVisualApi.createEmpireInfoVisual(room, LEFT_START_X, endLeftLine);
        // Display the Creep Info box in middle left
        endLeftLine = RoomVisualApi.createCreepCountVisual(room, LEFT_START_X, endLeftLine);
        // Display the Room Info box in the bottom left
        endLeftLine = RoomVisualApi.createRoomInfoVisual(room, LEFT_START_X, endLeftLine);
        {
            RoomVisualApi.createUpgradeGraphVisual(room, LEFT_START_X + 1, 45);
        }
        // ------
        // Right Side -----
        // Display Remote Flag box on the top right
        endRightLine = RoomVisualApi.createRemoteFlagVisual(room, RIGHT_START_X, endRightLine);
        // Display Claim Flag Box on the upper middle right
        endRightLine = RoomVisualApi.createClaimFlagVisual(room, RIGHT_START_X, endRightLine);
        // Display Attack Flag Box on the lower middle right
        endRightLine = RoomVisualApi.createAttackFlagVisual(room, RIGHT_START_X, endRightLine);
        // Display Option Flag box on the bottom right
        endRightLine = RoomVisualApi.createOptionFlagVisual(room, RIGHT_START_X, endRightLine);
    }
}
//# sourceMappingURL=RoomVisualManager.js.map

class Normalize {
    /**
     * Returns a mockup of a room object for a given roomname
     * @param roomName
     */
    static getMockRoomObject(roomName) {
        const mockRoom = new Room(roomName);
        mockRoom.name = roomName;
        mockRoom.visual.roomName = roomName;
        mockRoom.memory = Memory.rooms[roomName];
        mockRoom.energyAvailable = -1; // Unknown Value
        mockRoom.energyCapacityAvailable = -1; // Unknown Value
    }
    /**
     * Normalizes to a Room Name
     * @param room The name of a room as a string, or the Room object
     * @returns Room.name The name of the room object
     */
    static roomName(room) {
        if (room instanceof Room) {
            room = room.name;
        }
        return room;
    }
    /**
     * Normalizes to a Room Object
     * @param room
     * @returns Room The Room Object
     */
    static roomObject(room) {
        if (!(room instanceof Room)) {
            room = Game.rooms[room];
        }
        return room;
    }
    /**
     * Normalizes to a RoomPosition object
     * @param pos A RoomPosition object or an object with a pos property
     */
    static roomPos(object) {
        if (object instanceof RoomPosition) {
            return object;
        }
        return object.pos;
    }
    /**
     * Normalizes to a creep object given an ID or Name
     * @param creep
     */
    static creepObject(creep) {
        if (creep instanceof Creep) {
            return creep;
        }
        // If passed a name - Tested first since hash keys are faster than the Game.getObjectById function
        let obj = Game.creeps[creep];
        // If passed an ID instead of a name, use the slower getObjectById function
        if (obj === undefined) {
            obj = Game.getObjectById(creep);
        }
        // Risks returning null instead of a creep object, but I think that is outside the scope of a normalize method
        return obj;
    }
}
//# sourceMappingURL=Normalize.js.map

// helper function for creeps
class CreepHelper {
    /**
     * get the mining container for a specific job
     * @param job the job we are getting the mining container from
     * @param room the room we are checking in
     */
    static getMiningContainer(job, room) {
        if (!job) {
            throw new UserException("Job is undefined", "Job is undefined for room " + room.name + ". Can't get the mining container of an undefined job.", ERROR_WARN$2);
        }
        const source = Game.getObjectById(job.targetID);
        if (!source) {
            throw new UserException("Source null in getMiningContainer", "room: " + room.name, ERROR_WARN$2);
        }
        // Get containers and find the closest one to the source
        const containers = MemoryApi.getStructureOfType(room.name, STRUCTURE_CONTAINER);
        const closestContainer = source.pos.findClosestByRange(containers);
        if (!closestContainer) {
            return undefined;
        }
        else {
            // If we have a container, but its not next to the source, its not the correct container
            if (source.pos.isNearTo(closestContainer)) {
                return closestContainer;
            }
            return undefined;
        }
    }
    /**
     * Get the text to sign a controller with
     */
    static getSigningText() {
        // Find a random index in the array of messages and choose that
        const MIN = 0;
        const MAX = CONTROLLER_SIGNING_TEXT.length - 1;
        const numberOfMessages = Math.floor(Math.random() * (+MAX - +MIN)) + +MIN;
        return CONTROLLER_SIGNING_TEXT[numberOfMessages];
    }
    /**
     * Check if the targetPosition is the destination of the creep's current move target
     * @target The target object or roomposition to move to
     * @range [Optional] The range to stop at from the target
     */
    static isTargetCurrentDestination(creep, target, range = 0) {
        if (creep.memory._move === undefined) {
            return false;
        }
        let targetPosition;
        if (target.hasOwnProperty("pos") || target instanceof RoomPosition) {
            targetPosition = Normalize.roomPos(target);
        }
        else {
            throw new UserException("Error in targetIsCurrentDestination", "Creep [" +
                creep.name +
                "] tried to check if targetIsCurrentDestination on a target with no pos property. \n Target: [" +
                JSON.stringify(target) +
                "]", ERROR_ERROR);
        }
        const currentDestination = creep.memory._move.dest;
        // Check if curr_dest = targetPosition
        // TODO Change this so that it checks if it is in a variable range
        if (currentDestination.roomName !== targetPosition.roomName) {
            return false;
        }
        const distanceApart = Math.abs(currentDestination.x - targetPosition.x) + Math.abs(currentDestination.y - targetPosition.y);
        // Return true if distance from currentDestination to targetPosition is within the allowed range (default is 0, exact match)
        return distanceApart <= range;
    }
    /**
     * Gets creep.memory.supplementary.moveTargetID, or falls back to creep.memory.job.
     */
    static getMoveTarget(creep, job) {
        // Get target to move to, using supplementary.moveTargetID if available, job.targetID if not.
        if (creep.memory.supplementary && creep.memory.supplementary.moveTargetID) {
            return Game.getObjectById(creep.memory.supplementary.moveTargetID);
        }
        else {
            return Game.getObjectById(job.targetID);
        }
    }
}
//# sourceMappingURL=CreepHelper.js.map

// Api for all types of creeps (more general stuff here)
class CreepApi {
    /**
     * Call the proper doWork function based on job.jobType
     */
    static doWork(creep, job) {
        switch (job.jobType) {
            case "getEnergyJob":
                this.doWork_GetEnergyJob(creep, job);
                break;
            case "carryPartJob":
                this.doWork_CarryPartJob(creep, job);
                break;
            case "claimPartJob":
                this.doWork_ClaimPartJob(creep, job);
                break;
            case "workPartJob":
                this.doWork_WorkPartJob(creep, job);
                break;
            default:
                throw new UserException("Bad job.jobType in CreepApi.doWork", "The jobtype of the job passed to CreepApi.doWork was invalid.", ERROR_FATAL);
        }
    }
    /**
     * Call the proper travelTo function based on job.jobType
     */
    static travelTo(creep, job) {
        switch (job.jobType) {
            case "getEnergyJob":
                this.travelTo_GetEnergyJob(creep, job);
                break;
            case "carryPartJob":
                this.travelTo_CarryPartJob(creep, job);
                break;
            case "claimPartJob":
                this.travelTo_ClaimPartJob(creep, job);
                break;
            case "workPartJob":
                this.travelTo_WorkPartJob(creep, job);
                break;
            default:
                throw new UserException("Bad job.jobType in CreepApi.travelTo", "The jobtype of the job passed to CreepApi.travelTo was invalid", ERROR_FATAL);
        }
    }
    /**
     * Do work on the target provided by claimPartJob
     */
    static doWork_ClaimPartJob(creep, job) {
        const target = Game.getObjectById(job.targetID);
        this.nullCheck_target(creep, target);
        let deleteOnSuccess = true;
        let returnCode;
        if (job.actionType === "claim" && target instanceof StructureController) {
            returnCode = creep.claimController(target);
        }
        else if (job.actionType === "reserve" && target instanceof StructureController) {
            returnCode = creep.reserveController(target);
            deleteOnSuccess = false;
        }
        else if (job.actionType === "sign" && target instanceof StructureController) {
            returnCode = creep.signController(target, CreepHelper.getSigningText());
        }
        else if (job.actionType === "attack" && target instanceof StructureController) {
            returnCode = creep.attackController(target);
            deleteOnSuccess = false;
        }
        else {
            throw this.badTarget_Error(creep, job);
        }
        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            default:
                break;
        }
    }
    /**
     * Do work on the target provided by carryPartJob
     */
    static doWork_CarryPartJob(creep, job) {
        let target;
        target = Game.getObjectById(job.targetID);
        this.nullCheck_target(creep, target);
        let returnCode;
        let deleteOnSuccess = false;
        if (job.actionType === "transfer" && (target instanceof Structure || target instanceof Creep)) {
            deleteOnSuccess = true;
            returnCode = creep.transfer(target, RESOURCE_ENERGY);
        }
        else {
            throw this.badTarget_Error(creep, job);
        }
        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful, delete the job from creep memory
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            case ERR_NOT_ENOUGH_ENERGY:
            case ERR_FULL:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                break;
        }
    }
    /**
     * Do work on the target provided by workPartJob
     */
    static doWork_WorkPartJob(creep, job) {
        const target = Game.getObjectById(job.targetID);
        this.nullCheck_target(creep, target);
        let returnCode;
        let deleteOnSuccess = false;
        if (job.actionType === "build" && target instanceof ConstructionSite) {
            returnCode = creep.build(target);
            if (!target || creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        }
        else if (job.actionType === "repair" && target instanceof Structure) {
            returnCode = creep.repair(target);
            if (target.hits === target.hitsMax || creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        }
        else if (job.actionType === "upgrade" && target instanceof StructureController) {
            returnCode = creep.upgradeController(target);
            if (creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        }
        else {
            throw this.badTarget_Error(creep, job);
        }
        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful and creep is empty, delete the job from creep memory
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
        }
    }
    /**
     * Do work on the target provided by a getEnergyJob
     */
    static doWork_GetEnergyJob(creep, job) {
        const target = Game.getObjectById(job.targetID);
        this.nullCheck_target(creep, target);
        let returnCode;
        if (job.actionType === "harvest" && (target instanceof Source || target instanceof Mineral)) {
            returnCode = creep.harvest(target);
        }
        else if (job.actionType === "pickup" && target instanceof Resource) {
            returnCode = creep.pickup(target);
        }
        else if (job.actionType === "withdraw" && target instanceof Structure) {
            returnCode = creep.withdraw(target, RESOURCE_ENERGY);
        }
        else {
            throw this.badTarget_Error(creep, job);
        }
        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful and not harvesting, delete the job from creep memory
                // * If we run into not being able to stop harvesting minerals, my best solution is to seperate
                // * the above "instanceof Source | Mineral" into two different if statements, and use a boolean to decide to delete when successful.
                if (job.actionType !== "harvest") {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            case ERR_FULL:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                break;
        }
    }
    /**
     * Travel to the target provided by GetEnergyJob in creep.memory.job
     */
    static travelTo_GetEnergyJob(creep, job) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);
        this.nullCheck_target(creep, moveTarget);
        // Move options target
        const moveOpts = DEFAULT_MOVE_OPTS$1;
        // In this case all actions are complete with a range of 1, but keeping for structure
        if (job.actionType === "harvest" && (moveTarget instanceof Source || moveTarget instanceof Mineral)) {
            moveOpts.range = 1;
        }
        else if (job.actionType === "harvest" && moveTarget instanceof StructureContainer) {
            moveOpts.range = 0;
        }
        else if (job.actionType === "withdraw" && (moveTarget instanceof Structure || moveTarget instanceof Creep)) {
            moveOpts.range = 1;
        }
        else if (job.actionType === "pickup" && moveTarget instanceof Resource) {
            moveOpts.range = 1;
        }
        if (creep.pos.getRangeTo(moveTarget) <= moveOpts.range) {
            creep.memory.working = true;
            return; // If we are in range to the target, then we do not need to move again, and next tick we will begin work
        }
        creep.moveTo(moveTarget, moveOpts);
    }
    /**
     * Travel to the target provided by CarryPartJob in creep.memory.job
     */
    static travelTo_CarryPartJob(creep, job) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);
        this.nullCheck_target(creep, moveTarget);
        // Move options for target
        const moveOpts = DEFAULT_MOVE_OPTS$1;
        if (job.actionType === "transfer" && (moveTarget instanceof Structure || moveTarget instanceof Creep)) {
            moveOpts.range = 1;
        } // else range = 0;
        if (creep.pos.getRangeTo(moveTarget) <= moveOpts.range) {
            creep.memory.working = true;
            return;
        }
        creep.moveTo(moveTarget, moveOpts);
        return;
    }
    /**
     * Travel to the target provided by ClaimPartJob in creep.memory.job
     */
    static travelTo_ClaimPartJob(creep, job) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);
        this.nullCheck_target(creep, moveTarget);
        // Move options for target
        const moveOpts = DEFAULT_MOVE_OPTS$1;
        // All actiontypes that affect controller have range of 1
        if (moveTarget instanceof StructureController) {
            moveOpts.range = 1;
        }
        if (creep.pos.getRangeTo(moveTarget) <= moveOpts.range) {
            creep.memory.working = true;
            return;
        }
        creep.moveTo(moveTarget, moveOpts);
        return;
    }
    /**
     * Travel to the target provided by WorkPartJob in creep.memory.job
     */
    static travelTo_WorkPartJob(creep, job) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);
        this.nullCheck_target(creep, moveTarget);
        // Move options for target
        const moveOpts = DEFAULT_MOVE_OPTS$1;
        if (job.actionType === "build" && moveTarget instanceof ConstructionSite) {
            moveOpts.range = 1;
        }
        else if (job.actionType === "repair" && moveTarget instanceof Structure) {
            moveOpts.range = 1;
        }
        else if (job.actionType === "upgrade" && moveTarget instanceof StructureController) {
            moveOpts.range = 3;
        }
        if (creep.pos.getRangeTo(moveTarget) <= moveOpts.range) {
            creep.memory.working = true;
            return;
        }
        creep.moveTo(moveTarget, moveOpts);
        return;
    }
    /**
     * Checks if the target is null and throws the appropriate error
     */
    static nullCheck_target(creep, target) {
        if (target === null) {
            // preserve for the error message
            const jobAsString = JSON.stringify(creep.memory.job);
            delete creep.memory.job;
            creep.memory.working = false;
            if (creep.memory.supplementary && creep.memory.supplementary.moveTarget) {
                delete creep.memory.supplementary.moveTarget;
            }
            throw new UserException("Null Job Target", "Null Job Target for creep: " + creep.name + "\nJob: " + jobAsString, ERROR_WARN$2);
        }
    }
    /**
     * Throws an error that the job actionType or targetType is invalid for the job type
     */
    static badTarget_Error(creep, job) {
        return new UserException("Invalid Job actionType or targetType", "An invalid actionType or structureType has been provided by creep [" +
            creep.name +
            "]" +
            "\n Job: " +
            JSON.stringify(job), ERROR_ERROR$2);
    }
    /**
     * move the creep off of the exit tile
     * @param creep the creep we are moving
     * @returns if the creep had to be moved
     */
    static moveCreepOffExit(creep) {
        const x = creep.pos.x;
        const y = creep.pos.y;
        if (x === 0) {
            creep.move(RIGHT);
            return true;
        }
        if (y === 0) {
            creep.move(BOTTOM);
            return true;
        }
        if (x === 49) {
            creep.move(LEFT);
            return true;
        }
        if (y === 49) {
            creep.move(TOP);
            return true;
        }
        // Creep is not on exit tile
        return false;
    }
    /**********************************************************/
    /*        GET NEW JOB SECTION                           ***/
    /**********************************************************/
    static getNewSourceJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.harvestSources) {
            // forceUpdate to get accurate job listing
            const sourceJobs = MemoryApi.getSourceJobs(room, (sJob) => !sJob.isTaken, true);
            if (sourceJobs.length > 0) {
                // Filter out jobs that have too little energy -
                // The energy in the StoreDefinition is the amount of energy per 300 ticks left
                const suitableJobs = _.filter(sourceJobs, (sJob) => sJob.resources.energy >= creep.getActiveBodyparts(WORK) * 2 * 300 //  (Workparts * 2 * 300 = effective mining capacity)
                );
                // If config allows getting closest source
                {
                    let sourceIDs;
                    // Get sources from suitableJobs if any, else get regular sourceJob instead
                    if (suitableJobs.length > 0) {
                        sourceIDs = _.map(suitableJobs, (job) => job.targetID);
                    }
                    else {
                        sourceIDs = _.map(sourceJobs, (job) => job.targetID);
                    }
                    // Find the closest source
                    const sourceObjects = MemoryHelper.getOnlyObjectsFromIDs(sourceIDs);
                    const closestAvailableSource = creep.pos.findClosestByRange(sourceObjects); // Force not null since we used MemoryHelper.getOnlyObjectsFromIds;
                    // return the job that corresponds with the closest source
                    return _.find(sourceJobs, (job) => job.targetID === closestAvailableSource.id);
                }
            }
        }
        return undefined;
    }
}
//# sourceMappingURL=Creep.Api.js.map

// Manager for the miner creep role
class MinerCreepManager {
    /**
     * Run the miner creep
     * @param creep The creep to run
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return; // Don't do anything until you've spawned
        }
        const homeRoom = Game.rooms[creep.memory.homeRoom];
        if (creep.memory.job === undefined) {
            creep.memory.job = CreepApi.getNewSourceJob(creep, homeRoom);
            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }
            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep, homeRoom);
        }
        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }
            CreepApi.travelTo(creep, creep.memory.job);
        }
    }
    /**
     * Handle initalizing a new job
     */
    static handleNewJob(creep, room) {
        // Update room memory to reflect the new job
        MemoryApi.updateJobMemory(creep, room);
        const miningContainer = CreepHelper.getMiningContainer(creep.memory.job, Game.rooms[creep.memory.homeRoom]);
        if (miningContainer === undefined) {
            // Returning here to prevent supplementary id from being formed,
            // so in that case creep will just walk up to the source
            return;
        }
        // Check for any creeps on the miningContainer
        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);
        if (creepsOnContainer.length > 0) {
            // If the creep on the container is a miner (and not some random creep that's in the way)
            if (creepsOnContainer[0].memory.role === ROLE_MINER$1) {
                return; // Don't target it
            }
        }
        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }
        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
//# sourceMappingURL=MinerCreepManager.js.map

// Manager for the miner creep role
class HarvesterCreepManager {
    /**
     * run the harvester creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return; // don't do anything until spawned
        }
        const homeRoom = Game.rooms[creep.memory.homeRoom];
        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);
            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }
            this.handleNewJob(creep, homeRoom);
        }
        if (!creep.memory.working) {
            CreepApi.travelTo(creep, creep.memory.job);
        }
        if (creep.memory.working) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }
    }
    /**
     * Decides which kind of job to get and calls the appropriate function
     */
    static getNewJob(creep, room) {
        // if creep is empty, get a GetEnergyJob
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        }
        else {
            let job = this.newCarryPartJob(creep, room);
            if (job === undefined) {
                job = this.newWorkPartJob(creep, room);
            }
            if (job !== undefined) {
                // Reset creep options if a job is found
                // * This prevents a creep from getting a storageFill job after getting a getFromStorage job
                const options = creep.memory.options;
                options.fillStorage = true;
                options.fillTerminal = true;
            }
            return job;
        }
    }
    /**
     * Get a GetEnergyJob for the harvester
     */
    static newGetEnergyJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.getFromContainer) {
            // All container jobs with enough energy to fill creep.carry, and not taken
            const containerJobs = MemoryApi.getContainerJobs(room, (cJob) => !cJob.isTaken && cJob.resources.energy >= creep.carryCapacity);
            if (containerJobs.length > 0) {
                return containerJobs[0];
            }
        }
        if (creepOptions.getDroppedEnergy) {
            // All dropped resources with enough energy to fill creep.carry, and not taken
            const dropJobs = MemoryApi.getPickupJobs(room, (dJob) => !dJob.isTaken && dJob.resources.energy >= creep.carryCapacity);
            if (dropJobs.length > 0) {
                return dropJobs[0];
            }
        }
        if (creepOptions.getFromStorage || creepOptions.getFromTerminal) {
            // All backupStructures with enough energy to fill creep.carry, and not taken
            const backupStructures = MemoryApi.getBackupStructuresJobs(room, (job) => !job.isTaken && job.resources.energy >= creep.carryCapacity);
            if (backupStructures.length > 0) {
                // Turn off access to storage until creep gets a work/carry job
                const options = creep.memory.options;
                options.fillStorage = false;
                options.fillTerminal = false;
                return backupStructures[0];
            }
            return undefined;
        }
        return undefined;
    }
    /**
     * Get a CarryPartJob for the harvester
     */
    static newCarryPartJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.fillTower || creepOptions.fillSpawn) {
            const fillJobs = MemoryApi.getFillJobs(room, (fJob) => !fJob.isTaken && fJob.targetType !== "link", true);
            if (fillJobs.length > 0) {
                return fillJobs[0];
            }
        }
        if (creepOptions.fillStorage || creepOptions.fillTerminal) {
            const storeJobs = MemoryApi.getStoreJobs(room, (bsJob) => !bsJob.isTaken);
            if (storeJobs.length > 0) {
                const jobObjects = MemoryHelper.getOnlyObjectsFromIDs(_.map(storeJobs, job => job.targetID));
                const closestTarget = creep.pos.findClosestByRange(jobObjects);
                let closestJob;
                if (closestTarget !== null) {
                    closestJob = _.find(storeJobs, (job) => job.targetID === closestTarget.id);
                }
                else {
                    // if findCLosest nulls out, just choose first
                    closestJob = storeJobs[0];
                }
                return closestJob;
            }
            return undefined;
        }
        return undefined;
    }
    /**
     * Gets a new WorkPartJob for harvester
     */
    static newWorkPartJob(creep, room) {
        const creepOptions = creep.memory.options;
        const upgradeJobs = MemoryApi.getUpgradeJobs(room, (job) => !job.isTaken);
        if (creepOptions.upgrade) {
            if (upgradeJobs.length > 0) {
                return upgradeJobs[0];
            }
        }
        if (creepOptions.build) {
            const buildJobs = MemoryApi.getBuildJobs(room, (job) => !job.isTaken);
            if (buildJobs.length > 0) {
                return buildJobs[0];
            }
        }
        return undefined;
    }
    /**
     * Handles setup for a new job
     */
    static handleNewJob(creep, room) {
        MemoryApi.updateJobMemory(creep, room);
    }
}
//# sourceMappingURL=HarvesterCreepManager.js.map

// Manager for the miner creep role
class WorkerCreepManager {
    /**
     * run the worker creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return;
        }
        const homeRoom = Game.rooms[creep.memory.homeRoom];
        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);
            if (creep.memory.job === undefined) {
                return;
            }
            this.handleNewJob(creep, homeRoom);
        }
        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }
            CreepApi.travelTo(creep, creep.memory.job);
        }
    }
    /**
     * Gets a new job for the worker creep
     */
    static getNewJob(creep, room) {
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        }
        else {
            let job = this.newWorkPartJob(creep, room);
            if (job === undefined) {
                job = this.newCarryPartJob(creep, room);
            }
            return job;
        }
    }
    /**
     * Get a GetEnergyJob for the harvester
     */
    static newGetEnergyJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.getFromContainer) {
            // All container jobs with enough energy to fill creep.carry, and not taken
            const containerJobs = MemoryApi.getContainerJobs(room, (cJob) => !cJob.isTaken && cJob.resources.energy >= creep.carryCapacity);
            if (containerJobs.length > 0) {
                return containerJobs[0];
            }
        }
        if (creepOptions.getDroppedEnergy) {
            // All dropped resources with enough energy to fill creep.carry, and not taken
            const dropJobs = MemoryApi.getPickupJobs(room, (dJob) => !dJob.isTaken && dJob.resources.energy >= creep.carryCapacity);
            if (dropJobs.length > 0) {
                return dropJobs[0];
            }
        }
        if (creepOptions.getFromTerminal || creepOptions.getFromStorage) {
            // All backupStructures with enough energy to fill creep.carry, and not taken
            const backupStructures = MemoryApi.getBackupStructuresJobs(room, (job) => !job.isTaken && job.resources.energy >= creep.carryCapacity);
            if (backupStructures.length > 0) {
                return backupStructures[0];
            }
            return undefined;
        }
        return undefined;
    }
    /**
     * Gets a new WorkPartJob for worker
     */
    static newWorkPartJob(creep, room) {
        const creepOptions = creep.memory.options;
        const upgradeJobs = MemoryApi.getUpgradeJobs(room, (job) => !job.isTaken);
        const isCurrentUpgrader = _.some(MemoryApi.getMyCreeps(room.name), (c) => c.memory.job && c.memory.job.actionType === "upgrade");
        // Assign upgrade job is one isn't currently being worked
        if (creepOptions.upgrade && !isCurrentUpgrader) {
            if (upgradeJobs.length > 0) {
                return upgradeJobs[0];
            }
        }
        if (creepOptions.build) {
            const buildJobs = MemoryApi.getBuildJobs(room, (job) => !job.isTaken);
            if (buildJobs.length > 0) {
                return buildJobs[0];
            }
        }
        if (creepOptions.repair) {
            const repairJobs = MemoryApi.getRepairJobs(room, (job) => !job.isTaken);
            if (repairJobs.length > 0) {
                return repairJobs[0];
            }
        }
        if (creepOptions.upgrade) {
            if (upgradeJobs.length > 0) {
                return upgradeJobs[0];
            }
        }
        return undefined;
    }
    /**
     * Get a CarryPartJob for the worker
     */
    static newCarryPartJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.fillSpawn || creepOptions.fillTower) {
            const fillJobs = MemoryApi.getFillJobs(room, (fJob) => !fJob.isTaken && fJob.targetType !== "link");
            if (fillJobs.length > 0) {
                return fillJobs[0];
            }
        }
        if (creepOptions.fillStorage || creepOptions.fillTerminal) {
            const storeJobs = MemoryApi.getStoreJobs(room, (bsJob) => !bsJob.isTaken);
            if (storeJobs.length > 0) {
                return storeJobs[0];
            }
        }
        return undefined;
    }
    /**
     * Handles new job initializing
     */
    static handleNewJob(creep, room) {
        MemoryApi.updateJobMemory(creep, room);
        switch (creep.memory.job.jobType) {
            case "getEnergyJob":
                break;
            case "carryPartJob":
                break;
            case "workPartJob":
                break;
            default:
                break;
        }
    }
}
//# sourceMappingURL=WorkerCreepManager.js.map

// Manager for the miner creep role
class LorryCreepManager {
    /**
     * run the lorry creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
    }
}
//# sourceMappingURL=LorryCreepManager.js.map

// Manager for the miner creep role
class PowerUpgraderCreepManager {
    /**
     * run the power upgrader creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return; // don't do anything until spawned
        }
        const homeRoom = Game.rooms[creep.memory.homeRoom];
        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);
            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }
            this.handleNewJob(creep, homeRoom);
        }
        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }
            CreepApi.travelTo(creep, creep.memory.job);
        }
    }
    /**
     * Decides which kind of job to get and calls the appropriate function
     */
    static getNewJob(creep, room) {
        // if creep is empty, get a GetEnergyJob
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        }
        else {
            // Creep energy > 0
            return this.newUpgradeJob(creep, room);
        }
    }
    /**
     * get an upgrading job
     */
    static newUpgradeJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.upgrade) {
            // All link jobs with enough energy to fill creep.carry, and not taken
            const upgraderJob = MemoryApi.getUpgradeJobs(room, (job) => !job.isTaken);
            if (upgraderJob.length > 0) {
                return upgraderJob[0];
            }
            return undefined;
        }
        return undefined;
    }
    /**
     * Get a GetEnergyJob for the power upgrader
     */
    static newGetEnergyJob(creep, room) {
        // All link jobs with enough energy to fill creep.carry, and not taken
        const linkJobs = MemoryApi.getLinkJobs(room, (job) => !job.isTaken);
        if (linkJobs.length > 0) {
            return linkJobs[0];
        }
        return undefined;
    }
    /**
     * Handles setup for a new job
     */
    static handleNewJob(creep, room) {
        MemoryApi.updateJobMemory(creep, room);
    }
}
//# sourceMappingURL=PowerUpgraderCreepManager.js.map

// Manager for the miner creep role
class RemoteMinerCreepManager {
    /**
     * Run the remote miner creep
     * @param creep The creep to run
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return; // Don't do anything until you've spawned
        }
        const targetRoom = Game.rooms[creep.memory.targetRoom];
        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewSourceJob(creep, targetRoom);
            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }
            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep);
        }
        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }
            CreepApi.travelTo(creep, creep.memory.job);
        }
    }
    /**
     * Find a job for the creep
     */
    static getNewSourceJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.harvestSources) {
            const sourceJobs = MemoryApi.getSourceJobs(room, (sjob) => !sjob.isTaken);
            if (sourceJobs.length > 0) {
                return sourceJobs[0];
            }
        }
        return undefined;
    }
    /**
     * Handle initalizing a new job
     */
    static handleNewJob(creep) {
        const miningContainer = CreepHelper.getMiningContainer(creep.memory.job, Game.rooms[creep.memory.targetRoom]);
        if (miningContainer === undefined) {
            return; // We don't need to do anything else if the container doesn't exist
        }
        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);
        if (creepsOnContainer.length > 0) {
            if (creepsOnContainer[0].memory.role === ROLE_REMOTE_MINER$1) {
                return; // If there is already a miner creep on the container, then we don't target it
            }
        }
        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }
        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
//# sourceMappingURL=RemoteMinerCreepManager.js.map

// Manager for the miner creep role
class RemoteHarvesterCreepManager {
    /**
     * run the remote harvester creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return; // don't do anything until spawned
        }
        const targetRoom = Game.rooms[creep.memory.targetRoom];
        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, targetRoom);
            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }
            this.handleNewJob(creep);
        }
        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }
            CreepApi.travelTo(creep, creep.memory.job);
        }
    }
    /**
     * Decides which kind of job to get and calls the appropriate function
     */
    static getNewJob(creep, room) {
        // if creep is empty, get a GetEnergyJob
        if (creep.carry.energy === 0) {
            return this.newGetEnergyJob(creep, room);
        }
        else {
            // Creep energy > 0
            return this.newCarryPartJob(creep, room);
        }
    }
    /**
     * Get a GetEnergyJob for the harvester
     */
    static newGetEnergyJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.getFromContainer) {
            // All container jobs with enough energy to fill creep.carry, and not taken
            const containerJobs = MemoryApi.getContainerJobs(room, (cJob) => !cJob.isTaken && cJob.resources.energy >= creep.carryCapacity);
            if (containerJobs.length > 0) {
                return containerJobs[0];
            }
        }
        if (creepOptions.getDroppedEnergy) {
            // All dropped resources with enough energy to fill creep.carry, and not taken
            const dropJobs = MemoryApi.getPickupJobs(room, (dJob) => !dJob.isTaken && dJob.resources.energy >= creep.carryCapacity);
            if (dropJobs.length > 0) {
                return dropJobs[0];
            }
        }
        return undefined;
    }
    /**
     * Get a CarryPartJob for the harvester
     */
    static newCarryPartJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.fillLink) {
            const linkJobs = MemoryApi.getFillJobs(room, (fJob) => !fJob.isTaken && fJob.targetType === 'link');
            if (linkJobs.length > 0) {
                return linkJobs[0];
            }
        }
        if (creepOptions.fillSpawn) {
            const fillJobs = MemoryApi.getFillJobs(room, (fJob) => !fJob.isTaken && fJob.targetType !== 'link');
            if (fillJobs.length > 0) {
                return fillJobs[0];
            }
        }
        const storeJobs = MemoryApi.getStoreJobs(room, (bsJob) => !bsJob.isTaken);
        if (storeJobs.length > 0) {
            const storageJob = _.find(storeJobs, (storeJob) => !storeJob.isTaken && storeJob.targetType === STRUCTURE_STORAGE);
            if (storageJob) {
                return storageJob;
            }
        }
        return undefined;
    }
    /**
     * Handles setup for a new job
     */
    static handleNewJob(creep) {
        if (creep.memory.job.jobType === "getEnergyJob") {
            // TODO Decrement the energy available in room.memory.job.xxx.yyy by creep.carryCapacity
            return;
        }
        else if (creep.memory.job.jobType === "carryPartJob") {
            // TODO Mark the job we chose as taken
            return;
        }
    }
}
//# sourceMappingURL=RemoteHarvesterCreepManager.js.map

// Manager for the miner creep role
class RemoteColonizerCreepManager {
    /**
     * run the remote colonizer creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
    }
}
//# sourceMappingURL=RemoteColonizerCreepManager.js.map

// Manager for the miner creep role
class ClaimerCreepManager {
    /**
     * run the claimer creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
    }
}
//# sourceMappingURL=ClaimerCreepManager.js.map

// Api for military creep's
class CreepMili {
    /**
     * check if we're still waiting on creeps to rally
     * @param creepOptions the options for the military creep
     * @param creep the creep we're checking on
     */
    static setWaitingForRally(creep, creepOptions) {
        // If these options aren't defined, creep isn't waiting for rally
        if (!creepOptions.rallyLocation || !creepOptions.squadSize || !creepOptions.rallyLocation) {
            return false;
        }
        const squadSize = creepOptions.squadSize;
        const squadUUID = creepOptions.squadUUID;
        const rallyRoom = creepOptions.rallyLocation.roomName;
        const creepsInSquad = MemoryApi.getCreepsInSquad(creep.room.name, squadUUID);
        // If we don't have the full squad spawned yet, creep is waiting
        if (!creepsInSquad && creepsInSquad.length < squadSize) {
            return true;
        }
        // If not every creep is in the rally room, we are waiting
        if (_.some(creepsInSquad, (c) => c.room.name !== rallyRoom)) {
            return true;
        }
        // Finally, make sure every creep is within an acceptable distance of each other
        const creepsWithinRallyDistance = _.every(creepsInSquad, (cis) => // Check that every creep is within 2 tiles of at least 1 other creep in squad
         _.some(creepsInSquad, (innerC) => innerC.pos.inRangeTo(cis.pos.x, cis.pos.y, 2))) &&
            _.every(creepsInSquad, (c) => // Check that every creep is within 7 tiles of every creep in the squad
             _.every(creepsInSquad, (innerC) => c.pos.inRangeTo(innerC.pos.x, innerC.pos.y, 7)));
        if (creepsWithinRallyDistance) {
            return true;
        }
        // If we make it to here, we are done waiting
        return false;
    }
    /**
     * check if the creep is in range to attack the target
     * @param creep the creep we are checking for
     * @param target the room position for the target in question
     * @param isMelee if the creep can only melee
     */
    static isInAttackRange(creep, target, isMelee) {
        if (isMelee) {
            return creep.pos.isNearTo(target);
        }
        return creep.pos.inRangeTo(target, 3);
    }
    /**
     * have the creep flee back to the homestead
     * @param creep the creep that is fleeing
     * @param fleeRoom the room the creep is running too
     */
    static fleeCreep(creep, fleeRoom) {
        creep.moveTo(new RoomPosition(25, 25, fleeRoom), DEFAULT_MOVE_OPTS$1);
    }
    /**
     * get an attack target for the attack creep
     * @param creep the creep we are getting the target for
     * @param creepOptions the creep's military options
     * @param rangeNum the range the creep is requesting for a target
     */
    static getAttackTarget(creep, creepOptions, rangeNum) {
        let path;
        const goal = { pos: new RoomPosition(25, 25, creep.memory.targetRoom), range: rangeNum };
        const pathFinderOptions = {
            roomCallback: (roomName) => {
                const room = Game.rooms[roomName];
                const costs = new PathFinder.CostMatrix;
                if (!room) {
                    return false;
                }
                // Set walls and ramparts as unwalkable
                room.find(FIND_STRUCTURES).forEach(function (struct) {
                    if (struct.structureType === STRUCTURE_WALL ||
                        struct.structureType === STRUCTURE_RAMPART) {
                        // Set walls and ramparts as unwalkable
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });
                // Set creeps as unwalkable
                room.find(FIND_CREEPS).forEach(function (currentCreep) {
                    costs.set(currentCreep.pos.x, currentCreep.pos.y, 0xff);
                });
                return costs;
            },
        };
        // Check for a straight path to one of the preferred targets
        // Enemy Creeps
        const hostileCreeps = MemoryApi.getHostileCreeps(creep.room.name, undefined, true);
        const closestCreep = _.first(hostileCreeps);
        if (closestCreep) {
            goal.pos = closestCreep.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return closestCreep;
            }
        }
        // Enemy Towers
        const enemyTower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (struct) => struct.structureType === STRUCTURE_TOWER });
        if (enemyTower) {
            goal.pos = enemyTower.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyTower;
            }
        }
        // Enemy Spawn
        const enemySpawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
        if (enemySpawn) {
            goal.pos = enemySpawn.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemySpawn;
            }
        }
        // Enemy Extensions
        const enemyExtension = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (struct) => struct.structureType === STRUCTURE_TOWER });
        if (enemyExtension) {
            goal.pos = enemyExtension.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyExtension;
            }
        }
        // Other Structures
        const enemyStructure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (struct) => struct.structureType !== STRUCTURE_TOWER &&
                struct.structureType !== STRUCTURE_SPAWN &&
                struct.structureType !== STRUCTURE_EXTENSION
        });
        if (enemyStructure) {
            goal.pos = enemyStructure.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyStructure;
            }
        }
        // Get a wall target
        return this.getIdealWallTarget(creep);
    }
    /**
     * get a target for a domestic defender
     * @param creep the defender creep
     * @param creepOptions the options for the defender creep
     */
    static getDomesticDefenseAttackTarget(creep, creepOptions, CREEP_RANGE) {
        const hostileCreeps = MemoryApi.getHostileCreeps(creep.room.name);
        if (hostileCreeps.length > 0) {
            return creep.pos.findClosestByPath(hostileCreeps);
        }
        return null;
    }
    /**
     * get a healing target for the healer creep
     * @param creep the creep we are geting the target for
     * @param creepOptions the options for the military creep
     */
    static getHealingTarget(creep, creepOptions) {
        let healingTarget;
        const squadMembers = MemoryApi.getCreepsInSquad(creep.room.name, creepOptions.squadUUID);
        // If squad, find closest squad member with missing health
        if (creepOptions.squadUUID && squadMembers) {
            // Squad implied, find closest squadMember with missing health
            healingTarget = creep.pos.findClosestByPath(squadMembers, {
                filter: (c) => c.hits < c.hitsMax
            });
            return healingTarget;
        }
        // No squad members, find closest creep
        const creepsInRoom = creep.room.find(FIND_MY_CREEPS);
        return creep.pos.findClosestByPath(creepsInRoom, { filter: (c) => c.hits < c.hitsMax });
    }
    /**
     * find the ideal wall to attack
     * TODO make this balance between distance and health (ie if a 9m wall is 2 tiles closer than a 2m wall)
     * @param creep the creep we are checking for
     */
    static getIdealWallTarget(creep) {
        const rampart = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_RAMPART
        });
        const wall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_WALL
        });
        if (!wall && !rampart) {
            return undefined;
        }
        if (wall && rampart) {
            return (wall.pos.getRangeTo(creep.pos) < rampart.pos.getRangeTo(creep.pos) ? wall : rampart);
        }
        return (wall ? wall : rampart);
    }
    /**
     * moves the creep away from the target
     */
    static kiteEnemyCreep(creep) {
        const hostileCreep = creep.pos.findClosestByPath(MemoryApi.getHostileCreeps(creep.room.name));
        const CREEP_RANGE = 3;
        if (!hostileCreep) {
            return false;
        }
        let path;
        const goal = { pos: new RoomPosition(25, 25, creep.memory.targetRoom), range: CREEP_RANGE };
        const pathFinderOptions = { flee: true };
        path = PathFinder.search(hostileCreep.pos, goal, pathFinderOptions);
        if (path.path.length > 0) {
            creep.moveTo(path.path[0], DEFAULT_MOVE_OPTS$1);
            return true;
        }
        return false;
    }
    /**
     * perform the basic operations for military creeps
     * This includes: Fleeing, Rallying, moving into target room, and moving off exit tile
     * @param creep the creep we are doing the operations for
     * @param creepOptions the options for the military creep
     */
    static checkMilitaryCreepBasics(creep, creepOptions) {
        const targetRoom = creep.memory.targetRoom;
        // I love tenary operators
        const fleeLocation = creepOptions.rallyLocation ? creepOptions.rallyLocation.roomName : creep.memory.homeRoom;
        // Check if we need to flee
        if (creepOptions.flee && creep.hits < .25 * creep.hitsMax) {
            this.fleeCreep(creep, fleeLocation);
            return true;
        }
        if (!creepOptions.rallyDone) {
            if (this.setWaitingForRally(creep, creepOptions)) {
                return true; // idle if we are waiting on everyone to rally still
            }
            // Have the creep stop checking for rally
            creepOptions.rallyDone = true;
            creep.memory.options = creepOptions;
        }
        // Everyone is rallied, time to move out into the target room as a group if not already there
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom), DEFAULT_MOVE_OPTS$1);
            return true;
        }
        // If creep is on exit tile, move them off
        if (CreepApi.moveCreepOffExit(creep)) {
            return true;
        }
        // Return false if we didn't need to do any of this
        return false;
    }
}
//# sourceMappingURL=CreepMili.Api.js.map

// Manager for the miner creep role
class RemoteDefenderCreepManager {
    /**
     * run the remote defender creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return;
        }
        const creepOptions = creep.memory.options;
        const CREEP_RANGE = 3;
        // Carry out the basics of a military creep before moving on to specific logic
        if (CreepMili.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }
        // Find a target for the creep
        const target = CreepMili.getAttackTarget(creep, creepOptions, CREEP_RANGE);
        const isMelee = false;
        if (!target) {
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!CreepMili.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target, DEFAULT_MOVE_OPTS$1);
            return;
        }
        else {
            CreepMili.kiteEnemyCreep(creep);
        }
        // We are in attack range and healthy, attack the target
        creep.attack(target);
    }
}
//# sourceMappingURL=RemoteDefenderCreepManager.js.map

// Manager for the miner creep role
class RemoteReserverCreepManager {
    /**
     * run the remote reserver creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return; // Don't do anything until you've spawned
        }
        const targetRoom = Game.rooms[creep.memory.targetRoom];
        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewClaimJob(creep, targetRoom);
            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }
            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep);
        }
        if (creep.memory.working === true) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }
        CreepApi.travelTo(creep, creep.memory.job);
    }
    /**
     * Find a job for the creep
     */
    static getNewClaimJob(creep, room) {
        const creepOptions = creep.memory.options;
        if (creepOptions.claim) {
            const claimJob = MemoryApi.getClaimJobs(room, (sjob) => !sjob.isTaken);
            if (claimJob.length > 0) {
                return claimJob[0];
            }
        }
        return undefined;
    }
    /**
     * Handle initalizing a new job
     */
    static handleNewJob(creep) {
        // set is taken to true
    }
}
//# sourceMappingURL=RemoteReserverCreepManager.js.map

// Manager for the miner creep role
class ZealotCreepManager {
    /**
     * run the zealot creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        if (creep.spawning) {
            return;
        }
        const creepOptions = creep.memory.options;
        const CREEP_RANGE = 1;
        // Carry out the basics of a military creep before moving on to specific logic
        if (CreepMili.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }
        // Find a target for the creep
        const target = CreepMili.getAttackTarget(creep, creepOptions, CREEP_RANGE);
        const isMelee = true;
        if (!target) {
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!CreepMili.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target, DEFAULT_MOVE_OPTS$1);
            return;
        }
        // We are in attack range and healthy, attack the target
        creep.attack(target);
    }
}
//# sourceMappingURL=ZealotCreepManager.js.map

// Manager for the miner creep role
class MedicCreepManager {
    /**
     * run the medic creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        const creepOptions = creep.memory.options;
        const CREEP_RANGE = 3;
        if (CreepMili.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }
        // Get a healing target
        const healingTarget = CreepMili.getHealingTarget(creep, creepOptions);
        if (creepOptions.squadUUID) {
            const squadMembers = MemoryApi.getCreepsInSquad(creep.room.name, creepOptions.squadUUID);
            // No healing target, move towards closest squad member
            if (!healingTarget && squadMembers) {
                const closestSquadMember = creep.pos.findClosestByRange(squadMembers);
                if (closestSquadMember && !creep.pos.isNearTo(closestSquadMember)) {
                    creep.moveTo(closestSquadMember, DEFAULT_MOVE_OPTS$1);
                }
                CreepMili.fleeCreep(creep, creep.memory.homeRoom);
                return;
            }
        }
        // If no healing target and we aren't in a squad, find closest friendly creep and move to them, flee otherwise
        if (!healingTarget) {
            const closestFriendlyCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS);
            if (closestFriendlyCreep) {
                creep.moveTo(closestFriendlyCreep, DEFAULT_MOVE_OPTS$1);
            }
            return;
        }
        // If we are in range, heal it, otherwise move to it
        if (creep.pos.inRangeTo(healingTarget.pos, CREEP_RANGE)) {
            if (!creep.pos.isNearTo(healingTarget)) {
                creep.moveTo(healingTarget);
            }
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep); // heal self first if we need to
            }
            else {
                creep.heal(healingTarget);
            }
        }
        else {
            creep.moveTo(healingTarget, DEFAULT_MOVE_OPTS$1);
        }
    }
}
//# sourceMappingURL=MedicCreepManager.js.map

// Manager for the miner creep role
class StalkerCreepManager {
    /**
     * run the stalker creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        const creepOptions = creep.memory.options;
        const CREEP_RANGE = 3;
        // Carry out the basics of a military creep before moving on to specific logic
        if (CreepMili.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }
        // Find a target for the creep
        const target = CreepMili.getAttackTarget(creep, creepOptions, CREEP_RANGE);
        const isMelee = false;
        if (!target) {
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!CreepMili.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target, DEFAULT_MOVE_OPTS$1);
            return;
        }
        else {
            CreepMili.kiteEnemyCreep(creep);
        }
        // We are in attack range and healthy, attack the target
        creep.attack(target);
    }
}
//# sourceMappingURL=StalkerCreepManager.js.map

// Manager for the Domestic Defender Creep Role
class DomesticDefenderCreepManager {
    /**
     * run the domestic defender creep
     * @param creep the creep we are running
     */
    static runCreepRole(creep) {
        // This iteration of domestic defender is a melee creep that bee-lines to the enemy.
        // Possible upgrade if this proves to be a weakness would be switching to ranged
        // creep that seeks out the nearest rampart to the closest enemy creep and camps it
        if (creep.spawning) {
            return;
        }
        const creepOptions = creep.memory.options;
        const CREEP_RANGE = 1;
        // Carry out the basics of a military creep before moving on to specific logic
        if (CreepMili.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }
        // Find a target for the creep
        const target = CreepMili.getDomesticDefenseAttackTarget(creep, creepOptions, CREEP_RANGE);
        const isMelee = true;
        if (!target) {
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!CreepMili.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target, DEFAULT_MOVE_OPTS$1);
            return;
        }
        // We are in attack range and healthy, attack the target
        creep.attack(target);
    }
}
//# sourceMappingURL=DomesticDefenderCreepManager.js.map

// Call the creep manager for each role
class CreepManager {
    /**
     * loop over all creeps and call single creep manager for it
     */
    static runCreepManager() {
        for (const creep in Game.creeps) {
            try {
                this.runSingleCreepManager(Game.creeps[creep]);
            }
            catch (e) {
                UtilHelper.printError(e);
            }
        }
    }
    /**
     * run single creep manager
     * @param creep the creep we are calling the manager for
     */
    static runSingleCreepManager(creep) {
        const role = creep.memory.role;
        // Call the correct helper function based on creep role
        switch (role) {
            case ROLE_MINER:
                MinerCreepManager.runCreepRole(creep);
                break;
            case ROLE_HARVESTER:
                HarvesterCreepManager.runCreepRole(creep);
                break;
            case ROLE_WORKER:
                WorkerCreepManager.runCreepRole(creep);
                break;
            case ROLE_LORRY:
                LorryCreepManager.runCreepRole(creep);
                break;
            case ROLE_POWER_UPGRADER:
                PowerUpgraderCreepManager.runCreepRole(creep);
                break;
            case ROLE_REMOTE_MINER:
                RemoteMinerCreepManager.runCreepRole(creep);
                break;
            case ROLE_REMOTE_HARVESTER:
                RemoteHarvesterCreepManager.runCreepRole(creep);
                break;
            case ROLE_COLONIZER:
                RemoteColonizerCreepManager.runCreepRole(creep);
                break;
            case ROLE_CLAIMER:
                ClaimerCreepManager.runCreepRole(creep);
                break;
            case ROLE_REMOTE_DEFENDER:
                RemoteDefenderCreepManager.runCreepRole(creep);
                break;
            case ROLE_REMOTE_RESERVER:
                RemoteReserverCreepManager.runCreepRole(creep);
                break;
            case ROLE_ZEALOT:
                ZealotCreepManager.runCreepRole(creep);
                break;
            case ROLE_MEDIC:
                MedicCreepManager.runCreepRole(creep);
                break;
            case ROLE_STALKER:
                StalkerCreepManager.runCreepRole(creep);
                break;
            case ROLE_DOMESTIC_DEFENDER:
                DomesticDefenderCreepManager.runCreepRole(creep);
                break;
            default:
                throw new UserException("Invalid role for runSingleCreepManager.", 'The role "' + role + '" was invalid for running a creep role.', ERROR_ERROR$1);
        }
    }
}
//# sourceMappingURL=CreepManager.js.map

class ConsoleCommands {
    static init() {
        global.removeFlags = this.removeFlags;
        global.removeConstructionSites = this.removeConstructionSites;
        global.killAllCreeps = this.killAllCreeps;
        global.sendResource = this.sendResource;
        global.displayRoomStatus = this.displayRoomStatus;
    }
}
/**
 * remove all construction sites from the room when called
 * @param roomName the name of the room we want to remove construction sites from
 * @param structureType [optional] the type of structure we want to remove the sites of
 */
ConsoleCommands.removeConstructionSites = function (roomName, structureType) {
    Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).forEach((site) => {
        if (!structureType || site.structureType === structureType) {
            site.remove();
        }
    });
};
/**
 * remove all flags from the empire when called
 * @param substr a name contained in flags we want to remove
 */
ConsoleCommands.removeFlags = function (substr) {
    _.forEach(Game.flags, (flag) => {
        if (_.includes(flag.name, substr)) {
            console.log(`removing flag ${flag.name} in ${flag.pos.roomName}`);
            flag.remove();
        }
    });
};
/**
 * display status of specified room or all rooms if room specified
 * @param room [optional] the room we want to display the stats for (default all rooms)
 */
ConsoleCommands.displayRoomStatus = function (roomName) {
    // if no room was specified, display status for all
    if (!roomName) {
        _.forEach(Game.rooms, (currentRoom) => {
            console.log(`Room: ${currentRoom.name} -----------`);
            console.log(`State: ${currentRoom.memory.roomState}`);
            console.log(`Storage: ${RoomHelper.getStoredAmount(currentRoom.storage, RESOURCE_ENERGY)}`);
            console.log('----------------------------');
        });
    }
    else {
        const room = Game.rooms[roomName];
        console.log(`Room: ${room.name} -----------`);
        console.log(`State: ${room.memory.roomState}`);
        if (room.storage) {
            console.log(`Storage: ${RoomHelper.getStoredAmount(room.storage, RESOURCE_ENERGY)}`);
        }
        console.log('----------------------------');
    }
};
/**
 * kill all creeps
 * @param room [optional] the room we want to kill all creeps in (default all rooms)
 */
ConsoleCommands.killAllCreeps = function (room, role) {
    // if no room specified, kill all creeps
    if (!room) {
        _.forEach(Game.creeps, (creep) => {
            if (!role || creep.memory.role === role) {
                creep.suicide();
            }
        });
    }
    else {
        _.forEach(Game.creeps, (creep) => {
            if (creep.room.name === room.name) {
                if (!role || creep.memory.role === role) {
                    creep.suicide();
                }
            }
        });
    }
};
/**
 * send energy from one room to another
 * @param sendingRoom the room sending resources
 * @param receivingRoom the room receiving resources
 * @param resourceType the type of resource we want to transfer
 * @param amount the amount of the resource we want to send
 */
ConsoleCommands.sendResource = function (sendingRoom, receivingRoom, resourceType, amount) {
    // check if terminal exists in the sending room
    // check if we have enough energy to send the resource
    // send the resources
};
//# sourceMappingURL=ConsoleCommands.js.map

/*
  Kung Fu Klan's Screeps Code
  Written and maintained by -
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/
const loop = ErrorMapper.wrapLoop(() => {
    // Init console commands
    ConsoleCommands.init();
    if (RoomHelper.excecuteEveryTicks(1000)) {
        ConsoleCommands.init();
    }
    // run the empire
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > EMPIRE_MANAGER_BUCKET_LIMIT) {
        try {
            EmpireManager.runEmpireManager();
        }
        catch (e) {
            UtilHelper.printError(e);
        }
    }
    // run rooms
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > ROOM_MANAGER_BUCKET_LIMIT) {
        try {
            RoomManager.runRoomManager();
        }
        catch (e) {
            UtilHelper.printError(e);
        }
    }
    // run spawning
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > SPAWN_MANAGER_BUCKET_LIMIT) {
        try {
            SpawnManager.runSpawnManager();
        }
        catch (e) {
            UtilHelper.printError(e);
        }
    }
    // run creeps
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > CREEP_MANAGER_BUCKET_LIMIT) {
        try {
            CreepManager.runCreepManager();
        }
        catch (e) {
            UtilHelper.printError(e);
        }
    }
    // clean up memory
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > MEMORY_MANAGER_BUCKET_LIMIT) {
        try {
            MemoryManager.runMemoryManager();
        }
        catch (e) {
            UtilHelper.printError(e);
        }
    }
    // Display room visuals if we have a fat enough bucket and config option allows it
    if (!Game.cpu["bucket"] || (Game.cpu["bucket"] > 2000 && ROOM_OVERLAY_ON)) {
        try {
            RoomVisualManager$1.runRoomVisualManager();
        }
        catch (e) {
            UtilHelper.printError(e);
        }
    }
    // -------- end managers --------
});
//# sourceMappingURL=main.js.map

exports.loop = loop;
//# sourceMappingURL=main.js.map
