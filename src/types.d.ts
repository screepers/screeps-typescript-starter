// constants -----

// Error Constants
declare const ERROR_FATAL = 3;
declare const ERROR_ERROR = 2;
declare const ERROR_WARN = 1;
declare const ERROR_INFO = 0;

type ErrorConstant = ERROR_FATAL | ERROR_ERROR | ERROR_WARN | ERROR_INFO;
/**
 *  Very severe error - Game ruining
 */
type ERROR_FATAL = 3;
/**
 *  Regular error - Creep/Room ruining
 */
type ERROR_ERROR = 2;
/**
 *  Small error - Something went wrong, but doesn't ruin anything
 */
type ERROR_WARN = 1;
/**
 *  Non-error - Used to log when something happens (e.g. memory is updated)
 */
type ERROR_INFO = 0;

// room state constants

declare const ROOM_STATE_INTRO = 0;
declare const ROOM_STATE_BEGINNER = 1;
declare const ROOM_STATE_INTER = 2;
declare const ROOM_STATE_ADVANCED = 3;
declare const ROOM_STATE_UPGRADER = 4;
declare const ROOM_STATE_SEIGE = 5;
declare const ROOM_STATE_STIMULATE = 6;
declare const ROOM_STATE_NUKE_INBOUND = 7;

type RoomStateConstant =
    | ROOM_STATE_INTRO
    | ROOM_STATE_BEGINNER
    | ROOM_STATE_INTER
    | ROOM_STATE_ADVANCED
    | ROOM_STATE_UPGRADER
    | ROOM_STATE_SEIGE
    | ROOM_STATE_STIMULATE
    | ROOM_STATE_NUKE_INBOUND;

/**
 * right when a room is starting and nothing is built/no creeps exist
 */
type ROOM_STATE_INTRO = 0;
/**
 * once some creeps have been established but no containers/storage exist
 */
type ROOM_STATE_BEGINNER = 1;
/**
 * once container mining is in place but we do not have a storage
 */
type ROOM_STATE_INTER = 2;
/**
 * once storage economy is in place but we aren't power upgrading
 */
type ROOM_STATE_ADVANCED = 3;
/**
 * once we have power upgrader based economy
 */
type ROOM_STATE_UPGRADER = 4;
/**
 * if we are under seige and must defend the room/only do basic functions
 */
type ROOM_STATE_SEIGE = 5;
/**
 * if the room has been flagged and is receiving heavy external assistance to upgrade quickly
 */
type ROOM_STATE_STIMULATE = 6;
/**
 * if a nuke is inbound to the room and we have to prepare for the strike x ticks before (low priority but good to keep in mind)
 */
type ROOM_STATE_NUKE_INBOUND = 7;
// --------------------------------------------------------------------

// role constants
declare const ROLE_MINER = "miner";
declare const ROLE_HARVESTER = "harvester";
declare const ROLE_WORKER = "worker";
declare const ROLE_POWER_UPGRADER = "powerUpgrader";
declare const ROLE_LORRY = "lorry";
declare const ROLE_REMOTE_MINER = "remoteMiner";
declare const ROLE_REMOTE_HARVESTER = "remoteHarvester";
declare const ROLE_REMOTE_RESERVER = "remoteReserver";
declare const ROLE_REMOTE_DEFENDER = "remoteDefender";
declare const ROLE_COLONIZER = "remoteColonizer";
declare const ROLE_ZEALOT = "zealot";
declare const ROLE_STALKER = "stalker";
declare const ROLE_MEDIC = "medic";

/**
 * role constants
 */
type RoleConstant =
    | ROLE_MINER
    | ROLE_HARVESTER
    | ROLE_WORKER
    | ROLE_POWER_UPGRADER
    | ROLE_LORRY
    | ROLE_REMOTE_MINER
    | ROLE_REMOTE_HARVESTER
    | ROLE_REMOTE_RESERVER
    | ROLE_REMOTE_DEFENDER
    | ROLE_COLONIZER
    | ROLE_ZEALOT
    | ROLE_STALKER
    | ROLE_MEDIC;

/**
 * sits on the source and mines energy full-time
 */
type ROLE_MINER = "miner";
/**
 * brings energy from the miners to fill spawn/extensions
 */
type ROLE_HARVESTER = "harvester"; //
/**
 * repairs, builds, upgrades, etc... general labourer
 */
type ROLE_WORKER = "worker"; //
/**
 * sits at the controller and upgrades full-time
 */
type ROLE_POWER_UPGRADER = "powerUpgrader"; //
/**
 * moves energy around the room to where it needs to be
 */
type ROLE_LORRY = "lorry";
/**
 * goes into remote room and sits on source to mine full-time
 */
type ROLE_REMOTE_MINER = "remoteMiner"; //
/**
 * goes into remote room and brings energy back to main room
 */
type ROLE_REMOTE_HARVESTER = "remoteHarvester"; //
/**
 * goes into remote room and reserves the controller full-time
 */
type ROLE_REMOTE_RESERVER = "remoteReserver"; //
/**
 * goes into remote room and clears out invaders
 */
type ROLE_REMOTE_DEFENDER = "remoteDefender"; //
/**
 * goes into claim room and helps get the spawn up and running
 */
type ROLE_COLONIZER = "remoteColonizer"; //
/**
 * Military Creep - To be described
 */
type ROLE_ZEALOT = "zealot";
/**
 * Military Creep - To be described
 */
type ROLE_STALKER = "stalker";
/**
 * Military Creep - To be described
 */
type ROLE_MEDIC = "medic";
// --------------------------------------------------------------------

/**
 * Ally Names
 */
type AllyConstant = JAKESBOY2 | UHMBROCK;
type JAKESBOY2 = "jakesboy2";
type UHMBROCK = "uhmbrock";

/**
 * Generic
 */
interface StringMap {
    [key: string]: any;
}
//----------------------------------------

// custom memory objects ------------
// main memory modules --------------
interface CreepMemory {
    /**
     * the creep's role
     */
    role: RoleConstant;
    /**
     * the home room for the creep
     */
    homeRoom: string;
    /**
     * the room where operations are performed
     */
    targetRoom: string;
    /**
     * the creep's target at the moment (storage, construction site, etc)
     */
    workTarget: any;
    /**
     * the creep's options given to it at birth (can be adjusted thorugh lifetime)
     */
    options: CreepOptionsCiv | CreepOptionsMili;
    /**
     * tracks if the creep is currently working
     */
    working: boolean;
}

interface RoomMemory {
    roomState: RoomStateConstant;
    /**
     * IDs of all structures in the room
     * Stringmap : [structure.type] = String[]
     */
    structures: Cache;
    /**
     * IDs of all construction sites in the room
     */
    constructionSites: Cache;
    /**
     * IDs of all sources in the room
     */
    sources: Cache;
    /**
     * IDs of the link the power upgrader pulls from
     */
    upgradeLink: string;
    /**
     * Cache of all creeps
     */
    creeps: Cache;
    /**
     * the limit of each role for the room
     */
    creepLimit: StringMap | CreepLimits;
    /**
     * IDs of all hostile creeps in this room
     */
    hostiles: Cache;
    /**
     * the defcon level for the room
     */
    defcon: number;
    /**
     * Names of all rooms flagged to attack
     */
    attackRooms: Cache;
    /**
     * Names of all rooms flagged to remote harvest
     */
    remoteRooms: Cache;
    /**
     * Names of all rooms flagged to colonize
     */
    claimRooms: Cache;
}

interface EmpireMemory {}
// ----------------------------------

/**
 * options for civilian creeps
 */
interface CreepOptionsCiv {
    /**
     * if the creep can build construction sites
     */
    build: boolean;
    /**
     * if the creep can upgrade the controller
     */
    upgrade: boolean;
    /**
     * if the creep can repair containers/roads, etc
     */
    repair: boolean;
    /**
     * if the creep can repair walls and ramparts
     */
    wallRepair: boolean;
    /**
     * if the creep can fill towers
     */
    fillTower: boolean;
    /**
     * if the creep can fill storage
     */
    fillStorage: boolean;
    /**
     * if the creep can fill containers
     */
    fillContainer: boolean;
    /**
     * if the creep can fill links
     */
    fillLink: boolean;
    /**
     * if the creep can fill the terminal
     */
    fillTerminal: boolean;
    /**
     * if the creep can fill a lab
     */
    fillLab: boolean;
    /**
     * if the creep can pull from storage
     */
    getFromStorage: boolean;
    /**
     * if the creep can pull from a container
     */
    getFromContainer: boolean;
    /**
     * if the creep can seek out dropped energy
     */
    getDroppedEnergy: boolean;
    /**
     * if the creep can pull from a link
     */
    getFromLink: boolean;
    /**
     * if the creep can pull from the terminal
     */
    getFromTerminal: boolean;
}

/**
 * options for military creeps
 */
interface CreepOptionsMili {
    /**
     * the number of other creeps in this creep's squad
     */
    squadSize: number | null;
    /**
     * the generated token that ties members of this squad together
     */
    squadUUID: number | null;
    /**
     * the area the squad is going to meet
     */
    rallyLocation: RoomPosition | null;
    /**
     * if the creep is meant to seige the room to attrition (tower drain, etc)
     */
    seige: boolean;
    /**
     * if the creep is meant to dismantle walls and structures
     */
    dismantler: boolean;
    /**
     * if the creep is meant to heal other creeps/itself
     */
    healer: boolean;
    /**
     * if the creep is meant to seek out enemy creeps
     */
    attacker: boolean;
    /**
     * if the creep is meant to defend a room from invaders
     */
    defender: boolean;
    /**
     * if the creep values it's life and flees at low health
     */
    flee: boolean;
}

/**
 * creep limits for room
 */
interface CreepLimits extends StringMap {
    /**
     * creep limits for remote creeps
     */
    remoteLimits: RemoteCreepLimits;
    /**
     * creep limits for domestic creeps
     */
    domesticLimits: DomesticCreepLimits;
    /**
     * creep limits for military creeps
     */
    militaryLimits: MilitaryCreepLimits;
}

/**
 * creep limits for remote creeps
 */
interface RemoteCreepLimits {
    [index: string]: number;
    /**
     * limit for remote miners
     */
    remoteMiner: number;
    /**
     * limit for remote harvesters
     */
    remoteHarvester: number;
    /**
     * limit for remote reservers
     */
    remoteReserver: number;
    /**
     * limit for remote defenders
     */
    remoteDefender: number;
    /**
     * limit for remote colonizers
     */
    remoteColonizer: number;
}

/**
 * creep limits for domestic creeps
 */
interface DomesticCreepLimits {
    [index: string]: number;
    /**
     * limit for domestic miners
     */
    miner: number;
    /**
     * limit for domestic harvesters
     */
    harvester: number;
    /**
     * limit for domestic workers
     */
    worker: number;
    /**
     * limit for domestic power upgraders
     */
    powerUpgrader: number;
    /**
     * limit for domestic lorries
     */
    lorry: number;
}

/**
 * creep limits for military creeps
 */
interface MilitaryCreepLimits {
    [index: string]: number;
    /**
     * limit for military zealots
     */
    zealot: number;
    /**
     * limit for military stalkers
     */
    stalker: number;
    /**
     * limit for military medics
     */
    medic: number;
}

/**
 * A container object for Cache memory - Stores a StructureCache or CreepCache
 */
interface Cache {
    /**
     * The data that the Cache object validates
     */
    data: any;
    /**
     * Cache Object - used for validation
     */
    cache: any;
}

/**
 * Memory for flags. Allows us to tell if a flag should be
 * deleted from memory or if it still needs to be processed
 */
interface FlagMemory {
    /**
     * if the flag has been set into the proper memory channels
     */
    processed: boolean;
    /**
     * if the flag has been removed from the game
     */
    deleted: boolean;
}

// Attack Flag Options
/**
 * Red - Red
 * Zealot/Stalker/Medic Squad
 */
type ATTACK_BASIC_SQUAD = "basic_squad"; //
