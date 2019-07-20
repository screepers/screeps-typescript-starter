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
declare const ROOM_STATE_STIMULATE = 6;
declare const ROOM_STATE_NUKE_INBOUND = 7;

type RoomStateConstant =
    | ROOM_STATE_INTRO
    | ROOM_STATE_BEGINNER
    | ROOM_STATE_INTER
    | ROOM_STATE_ADVANCED
    | ROOM_STATE_UPGRADER
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
declare const ROLE_MINERAL_MINER = "mineralMiner";
declare const ROLE_REMOTE_MINER = "remoteMiner";
declare const ROLE_REMOTE_HARVESTER = "remoteHarvester";
declare const ROLE_REMOTE_RESERVER = "remoteReserver";
declare const ROLE_REMOTE_DEFENDER = "remoteDefender";
declare const ROLE_COLONIZER = "remoteColonizer";
declare const ROLE_CLAIMER = "claimer";
declare const ROLE_ZEALOT = "zealot";
declare const ROLE_STALKER = "stalker";
declare const ROLE_MEDIC = "medic";
declare const ROLE_DOMESTIC_DEFENDER = "domesticDefender";

/**
 * role constants
 */
type RoleConstant =
    | ROLE_MINER
    | ROLE_HARVESTER
    | ROLE_WORKER
    | ROLE_POWER_UPGRADER
    | ROLE_LORRY
    | ROLE_MINERAL_MINER
    | ROLE_REMOTE_MINER
    | ROLE_REMOTE_HARVESTER
    | ROLE_REMOTE_RESERVER
    | ROLE_REMOTE_DEFENDER
    | ROLE_COLONIZER
    | ROLE_CLAIMER
    | ROLE_ZEALOT
    | ROLE_STALKER
    | ROLE_MEDIC
    | ROLE_DOMESTIC_DEFENDER;

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
 * moves energy or resources around the room to where it needs to be
 */
type ROLE_LORRY = "lorry";
/**
 * static miner for minerals
 */
type ROLE_MINERAL_MINER = "mineralMiner";
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
 * goes into claim room and claims it
 */
type ROLE_CLAIMER = "claimer"; //
/**
 * Military Creep - offensive melee
 */
type ROLE_ZEALOT = "zealot"; //
/**
 * Military Creep - offensive ranged
 */
type ROLE_STALKER = "stalker"; //
/**
 * Military Creep - offensive healer
 */
type ROLE_MEDIC = "medic"; //
/**
 * Military Creep - Defends the home room
 */
type ROLE_DOMESTIC_DEFENDER = "domesticDefender"; //

// Role Interfaces to be implemented  -------------
/**
 * Interface for Creep Role Managers
 */
interface ICreepRoleManager {
    name: RoleConstant;
    runCreepRole: (creep: Creep) => void;
}

/**
 * Interface for Creep Role Helpers (for body and options)
 */
interface ICreepBodyOptsHelper {
    name: RoleConstant;
    generateCreepOptions: (
        roomState: RoomStateConstant,
        squadSizeParam: number,
        squadUUIDParam: number | null,
        rallyLocationParam: RoomPosition | null) => (CreepOptionsCiv | undefined) | (CreepOptionsMili | undefined);
    generateCreepBody: (tier: TierConstant) => BodyPartConstant[];
}
// --------------------------------------------------------------------

/**
 * global console functions
 */
declare namespace NodeJS {
    interface Global {
        removeConstructionSites(roomName: string, structureType?: string): void;
        removeFlags(substr: string): void;
        displayRoomStatus(roomName: string): void;
        killAllCreeps(room?: Room): void;
        sendResource(sendingRoom: Room, receivingRoom: Room, resourceType: ResourceConstant, amount: number): void;
    }
}

/**
 * Creep Body Options Object
 */
interface CreepBodyOptions {
    mixType?: string;
    toughFirst?: boolean;
    healLast?: boolean;
}

/**
 * UserException Object - A custom error that will color itself in console when thrown.
 */
interface UserException {
    title: string;
    body: string;
    severity: number;
    titleColor: any;
    bodyColor: string;
}

/**
 * Creep Body Descriptor Object
 */
interface CreepBodyDescriptor {
    [index: string]: any;
    move?: number;
    work?: number;
    carry?: number;
    tough?: number;
    attack?: number;
    ranged_attack?: number;
    heal?: number;
    claim?: number;
}
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
// ----------------------------------------

// custom memory objects ------------

/**
 * add memory to the structure for the compiler
 */
interface Structure {
    memory: StructureMemory;
}

// Define the structure memory
interface StructureMemory {
    processed: boolean
}

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
     * the job the creep is working
     */
    job: BaseJob | undefined;
    /**
     * the creep's options given to it at birth (can be adjusted thorugh lifetime)
     */
    options: CreepOptionsCiv | CreepOptionsMili;
    /**
     * tracks if the creep is currently working
     */
    working: boolean;
    /**
     * Additional memory options that vary from role to role
     */
    supplementary?: StringMap;
    /**
     * The memory used by screeps to store movePaths
     */
    _move?: {
        dest: { x: number; y: number; roomName: string };
        time: number;
        path: number;
        room: string;
        // Custom stuck-detection object - xyroomName string
        lastPosition: string;
        stuckCount: number;
    };
}

/**
 * Contains all of the sublists of job objects
 *
 * This is the object to store in `Memory.rooms[room.name].Jobs`
 */
interface JobListing {
    getEnergyJobs?: GetEnergyJobListing;
    claimPartJobs?: ClaimPartJobListing;
    workPartJobs?: WorkPartJobListing;
    carryPartJobs?: CarryPartJobListing;
}

/**
 * Structures that have a energy, minerals, or store property
 */
type ResourceContainingStructureConstant =
    | STRUCTURE_CONTAINER
    | STRUCTURE_EXTENSION
    | STRUCTURE_LAB
    | STRUCTURE_LINK
    | STRUCTURE_NUKER
    | STRUCTURE_POWER_SPAWN
    | STRUCTURE_SPAWN
    | STRUCTURE_STORAGE
    | STRUCTURE_TERMINAL
    | STRUCTURE_TOWER;

/**
 * Valid types for the GetEnergyJob targetType
 */
type GetEnergy_ValidTargets =
    | "source"
    | "tombstone"
    | "droppedResource"
    | STRUCTURE_EXTRACTOR
    | ResourceContainingStructureConstant;
/**
 * Valid actions for GetEnergyJob actionType
 */
type GetEnergy_ValidActions = "withdraw" | "harvest" | "pickup";

/**
 * Valid types for the WorkPartJob targetType
 */
type WorkPart_ValidTargets = BuildableStructureConstant | STRUCTURE_CONTROLLER | "constructionSite";
/**
 * Valid actions for WorkPartJob actionType
 */
type WorkPart_ValidActions = "build" | "repair" | "upgrade";

/**
 * Valid types for the ClaimPartJob targetType
 * ? Probably unnecessary, but provided for flexibility
 */
type ClaimPart_ValidTargets = STRUCTURE_CONTROLLER | "roomName";
/**
 * Valid actions for ClaimPartJob actionType
 */
type ClaimPart_ValidActions = "claim" | "reserve" | "attack" | "sign";

/**
 * Valid types for the CarryPartJob targetType
 */
type CarryPart_ValidTargets = ResourceContainingStructureConstant | "roomPosition";
/**
 * Valid actions for CarryPartJob actionType
 */
type CarryPart_ValidActions = "transfer" | "drop";

/**
 * Valid types for the MovePartJob targetType
 */
type MovePart_ValidTargets = "roomPosition" | "roomName";
/**
 * Valid actions for MovePartJob actionType
 */
type MovePart_ValidActions = "move"

/**
 * Acceptable ValidTargets Lists for BaseJob
 */
type Any_ValidTargets =
    | GetEnergy_ValidTargets
    | CarryPart_ValidTargets
    | ClaimPart_ValidTargets
    | WorkPart_ValidTargets
    | MovePart_ValidTargets;
/**
 * Acceptable ValidAction Lists for BaseJob
 */
type Any_ValidActions =
    | GetEnergy_ValidActions
    | CarryPart_ValidActions
    | ClaimPart_ValidActions
    | WorkPart_ValidActions
    | MovePart_ValidActions;

/**
 * Valid jobType for BaseJob
 */
type Valid_JobTypes = "getEnergyJob" | "claimPartJob" | "carryPartJob" | "workPartJob" | "movePartJob";
/**
 * Basic Job Interface
 */
interface BaseJob {
    /**
     * Type of the job object
     */
    jobType: Valid_JobTypes;
    /**
     * Valid actions to perform on the job object
     */
    actionType: Any_ValidActions;
    /**
     * ID of the target object
     */
    targetID: string;
    /**
     * Type of the target object
     */
    targetType: Any_ValidTargets;
    /**
     * Whether or not the job has been taken
     */
    isTaken: boolean;
}
/**
 * JobObject for the GetEnergyJobListing
 * Overrides targetType to only GetEnergy_ValidTargets
 */
interface GetEnergyJob extends BaseJob {
    /**
     * The type of the target object
     */
    targetType: GetEnergy_ValidTargets;
    /**
     * The action to perform on the target object
     */
    actionType: GetEnergy_ValidActions;
    /**
     * The resources in the object in the format of Structure.Store
     *
     * Each object key is one of the RESOURCE_* constants, values are resources amounts.
     * RESOURCE_ENERGY is always defined and equals to 0 when empty, other resources are undefined when empty.
     */
    resources: StoreDefinition;
}

/**
 * JobObject for the WorkPartJobListing
 */
interface WorkPartJob extends BaseJob {
    /**
     * The type of the target object
     */
    targetType: WorkPart_ValidTargets;
    /**
     * The action to perform on the target object
     */
    actionType: WorkPart_ValidActions;
    /**
     * The progress (% to next level, % hp, % to construction) of the target
     */
    remaining: number;
}

/**
 * JobObject for the ClaimPartJobListing
 */
interface ClaimPartJob extends BaseJob {
    /**
     * The type of the target object
     */
    targetType: ClaimPart_ValidTargets;
    /**
     * The action to perform on the target object
     */
    actionType: ClaimPart_ValidActions;
}

/**
 * JobObject for the CarryPartJobListing
 */
interface CarryPartJob extends BaseJob {
    /**
     * The type of the target object
     */
    targetType: CarryPart_ValidTargets;
    /**
     * The action to perform on the target object
     */
    actionType: CarryPart_ValidActions;
    /**
     * The amount of energy to be filled
     */
    remaining: number;
}

/**
 * JobObject used to move a creep's location
 */
interface MovePartJob extends BaseJob {
    /**
     * The type of the target object
     */
    targetType: MovePart_ValidTargets;
    /**
     * The action to perform on the target object
     */
    actionType: MovePart_ValidActions;
}

/**
 * Object that stores the seperate lists of GetEnergyJob Objects
 */
interface GetEnergyJobListing {
    /**
     * Jobs that target sources that are not being mined optimally (RoomAPI.getOpenSources)
     */
    sourceJobs?: Cache;
    /**'
     * Jobs that target containers with resources
     */
    containerJobs?: Cache;
    /**
     * Jobs that target links that contain energy (and are not deposit only)
     */
    linkJobs?: Cache;
    /**
     * Jobs that target structures that store excess resources (Storage, Terminal)
     */
    backupStructures?: Cache;
    /**
     * Jobs that target resources on the ground
     */
    pickupJobs?: Cache;
    /**
     * Jobs that target tombstones
     */
    tombstoneJobs?: Cache;
}

/**
 * Object that stores the seperate lists of claimPartJob Objects
 */
interface ClaimPartJobListing {
    /**
     * Jobs to claim controllers
     */
    claimJobs?: Cache;
    /**
     * Jobs to reserve controllers
     */
    reserveJobs?: Cache;
    /**
     * Jobs to sign controllers
     */
    signJobs?: Cache;
    /**
     * Jobs to attack enemy controllers
     */
    attackJobs?: Cache;
}

/**
 * Object that stores the seperate lists of workPartJob Objects
 */
interface WorkPartJobListing {
    /**
     * Jobs to repair structures
     */
    repairJobs?: Cache;
    /**
     * Jobs to build constructionSites
     */
    buildJobs?: Cache;
    /**
     * Jobs to upgrade controllers
     */
    upgradeJobs?: Cache;
}

/**
 * Object that stores the seperate lists of carryPartJob Objects
 */
interface CarryPartJobListing {
    /**
     * Jobs to fill objects that need resources to function (Extensions, Spawns, Links, Towers)
     */
    fillJobs?: Cache;
    /**
     * Jobs to store away or sell excess resources (Storage, Terminal, Containers)
     */
    storeJobs?: Cache;
}

/**
 * types of custom events
 */
type C_EVENT_BUILD_COMPLETE = 1;
type C_EVENT_CREEP_SPAWNED = 2;
type CustomEventConstant =
    C_EVENT_BUILD_COMPLETE |
    C_EVENT_CREEP_SPAWNED;

/**
 * a custom event that signals something notable that occured in a room
 */
interface CustomEvent {
    /**
     * the constant of the type of event that occured
     */
    type: CustomEventConstant;
    /**
     * the target id that the event occured on
     */
    targetId: string;
    /**
     * the room name the event occured in
     */
    roomName: string;
    /**
     * to mark the event as processed (ie done)
     */
    processed: boolean;
}

interface RoomMemory {
    roomState?: RoomStateConstant;
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
     * IDs of all minerals in the room
     */
    minerals: Cache;
    /**
     * IDs of all dropped resources in a room
     */
    droppedResources: Cache;
    /**
     * IDs of all tombstones in the room
     */
    tombstones: Cache;
    /**
     * IDs of the link the power upgrader pulls from
     */
    upgradeLink?: string;
    /**
     * Cache of all creeps
     */
    creeps?: Cache;
    /**
     * the limit of each role for the room
     */
    creepLimit?: CreepLimits;
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
    attackRooms?: AttackRoomMemory[];
    /**
     * Names of all rooms flagged to remote harvest
     */
    remoteRooms?: RemoteRoomMemory[];
    /**
     * Names of all rooms flagged to colonize
     */
    claimRooms?: ClaimRoomMemory[];
    /**
     * List of all of the room's GetEnergyJobs
     */
    jobs?: JobListing;
    /**
     * extra memory for visual function
     */
    visual?: VisualMemory;
    /**
     * memory for the custom in room events
     */
    events: CustomEvent[];
}

interface Memory {
    empire: EmpireMemory;
    structures: { [structureID: string]: StructureMemory };
}
interface EmpireMemory {
    /**
     * messages to display in each room's alert box
     */
    alertMessages?: AlertMessageNode[];
}

/**
 * override structure type
 */

/**
 * a node for an alert message
 */
interface AlertMessageNode {
    /**
     * the message
     */
    message: string;
    /**
     * tick that it was created on
     */
    tickCreated: number;
    /**
     * the number of ticks you want the message to be shown
     */
    expirationLimit: number;
}
// ----------------------------------

/**
 * options for civilian creeps
 */
interface CreepOptionsCiv {
    /**
     * if the creep can build construction sites
     */
    build?: boolean;
    /**
     * if the creep can upgrade the controller
     */
    upgrade?: boolean;
    /**
     * if the creep can repair containers/roads, etc
     */
    repair?: boolean;
    /**
     * claim or reserve
     */
    claim?: boolean;
    /**
     * if the creep can harvest sources
     */
    harvestSources?: boolean;
    /**
     * if the creep can harvest minerals
     */
    harvestMinerals?: boolean;
    /**
     * if the creep can repair walls and ramparts
     */
    wallRepair?: boolean;
    /**
     * If the creep can fill extensions
     */
    fillExtension?: boolean;
    /**
     * if the creep can fill towers
     */
    fillTower?: boolean;
    /**
     * if the creep can fill storage
     */
    fillStorage?: boolean;
    /**
     * if the creep can fill containers
     */
    fillContainer?: boolean;
    /**
     * if the creep can fill links
     */
    fillLink?: boolean;
    /**
     * fill spawn/extensions
     */
    fillSpawn?: boolean;
    /**
     * if the creep can fill the terminal
     */
    fillTerminal?: boolean;
    /**
     * if the creep can fill a lab
     */
    fillLab?: boolean;
    /**
     * if the creep can pull from storage
     */
    getFromStorage?: boolean;
    /**
     * if the creep can pull from a container
     */
    getFromContainer?: boolean;
    /**
     * if the creep can seek out dropped energy
     */
    getDroppedEnergy?: boolean;
    /**
     * if the creep can pull from a link
     */
    getFromLink?: boolean;
    /**
     * if the creep can pull from the terminal
     */
    getFromTerminal?: boolean;
}

/**
 * options for military creeps
 */
interface CreepOptionsMili {
    /**
     * the number of other creeps in this creep's squad
     */
    squadSize?: number | null;
    /**
     * the generated token that ties members of this squad together
     */
    squadUUID?: number | null;
    /**
     * the area the squad is going to meet
     */
    rallyLocation?: RoomPosition | null;
    /**
     * if the rally conditions have already been met
     */
    rallyDone?: boolean;
    /**
     * the attack target for an offensive military creep
     */
    attackTarget?: Creep | Structure<StructureConstant> | undefined;
    /**
     * if the creep is meant to seige the room to attrition (tower drain, etc)
     */
    seige?: boolean;
    /**
     * if the creep is meant to dismantle walls and structures
     */
    dismantler?: boolean;
    /**
     * if the creep is meant to heal other creeps/itself
     */
    healer?: boolean;
    /**
     * if the creep is meant to seek out enemy creeps
     */
    attacker?: boolean;
    /**
     * if the creep is meant to defend a room from invaders
     */
    defender?: boolean;
    /**
     * if the creep values it's life and flees at low health
     */
    flee?: boolean;
}

/**
 * creep limits for room
 */
interface CreepLimits {
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
    militaryLimits: RoleConstant[];
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
    /**
     * limit for claimers
     */
    claimer: number;
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
     * if the flag has completed its requirements
     */
    complete: boolean;
    /**
     * time the flag was placed
     */
    timePlaced: number;
    /**
     * the type of flag this is
     */
    flagType: FlagTypeConstant | undefined;
    /**
     * the name of the flag
     */
    flagName: string;
    /**
     * if the spawning has been processed
     * currently only relevant to military flags
     */
    spawnProcessed: boolean;
}

// Attack Flag Options
/**
 * Red - Red
 * Zealot/Stalker/Medic Squad
 */
type ATTACK_BASIC_SQUAD = "basic_squad"; //

// Memory for remote/attack/claim rooms
/**
 * parent memory for depedent rooms
 */
interface DepedentRoomParentMemory {
    /**
     * the name of the room for lookup purposes
     */
    roomName: string;
    /**
     * reference to the attack flags placed in the room
     */
    flags: ParentFlagMemory[];
}
/**
 * Attack room memory structure
 */
interface AttackRoomMemory extends DepedentRoomParentMemory {
    /**
     * hostiles in the room
     */
    hostiles: Cache;
    /**
     * structures in room
     */
    structures: Cache;
}

/**
 * Remote room memory structure
 */
interface RemoteRoomMemory extends DepedentRoomParentMemory {
    /**
     * sources in the room
     */
    sources: Cache;
    /**
     * hostiles in the room
     */
    hostiles: Cache;
    /**
     * structures in room
     */
    structures: Cache;
    /**
     * time remaining for reserving the controller
     */
    reserveTTL: number;
}

/**
 * Claim room memory structure
 */
// tslint:disable-next-line:no-empty-interface
interface ClaimRoomMemory extends DepedentRoomParentMemory {
    // Parent memory covers everything currently needed in here
}

/**
 * Parent flag memory that all flag memory inhereits
 */
interface ParentFlagMemory {
    /**
     * if the related flag is currently active
     */
    active: boolean;
    /**
     * the name of the flag
     */
    flagName: string;
    /**
     * the type of the flag
     */
    flagType: FlagTypeConstant | undefined;
}
/**
 * memory for an attack flag
 */
interface AttackFlagMemory extends ParentFlagMemory {
    /**
     * the number of creeps we are asking for
     */
    squadSize: number;
    /**
     * the unique id for the sqauad
     */
    squadUUID: number;
    /**
     * the location creeps are going to meet
     */
    rallyLocation: RoomPosition | null;
    /**
     * the number of creeps this flag has successfully spawned
     */
    currentSpawnCount: number;
}

/**
 * memory associated with a claim flag inside a claim room memory
 */
// tslint:disable-next-line:no-empty-interface
interface ClaimFlagMemory extends ParentFlagMemory {
    // For now, its covered by parent interface
    // Extra claim room flags at the moment don't do anything like it does for attack rooms
    // its just meant to mark the room (possible to change)
}

/**
 * memory associated with a remote flag inside a remote room memory
 */
// tslint:disable-next-line:no-empty-interface
interface RemoteFlagMemory extends ParentFlagMemory {
    // Same deal as above for now
}

/**
 * flag type constant definitions
 */
declare const ZEALOT_SOLO = 1;
declare const STALKER_SOLO = 2;
declare const STANDARD_SQUAD = 3;
declare const CLAIM_FLAG = 4;
declare const REMOTE_FLAG = 5;
declare const OVERRIDE_D_ROOM_FLAG = 6;
declare const STIMULATE_FLAG = 7;

/**
 * flag types type definitions
 */
type ZEALOT_SOLO = 1;
type STALKER_SOLO = 2;
type STANDARD_SQUAD = 3;
type CLAIM_FLAG = 4;
type REMOTE_FLAG = 5;
type OVERRIDE_D_ROOM_FLAG = 6;
type STIMULATE_FLAG = 7;

/**
 * type that holds all flag type constants
 */
type FlagTypeConstant =
    | ZEALOT_SOLO
    | STALKER_SOLO
    | STANDARD_SQUAD
    | CLAIM_FLAG
    | REMOTE_FLAG
    | OVERRIDE_D_ROOM_FLAG
    | STIMULATE_FLAG;

/**
 * Tier Definitions
 */
declare const TIER_1 = 300;
declare const TIER_2 = 550;
declare const TIER_3 = 800;
declare const TIER_4 = 1300;
declare const TIER_5 = 1800;
declare const TIER_6 = 2300;
declare const TIER_7 = 5300;
declare const TIER_8 = 12300;

type TierConstant = TIER_1 | TIER_2 | TIER_3 | TIER_4 | TIER_5 | TIER_6 | TIER_7 | TIER_8;

type TIER_1 = 300;
type TIER_2 = 550;
type TIER_3 = 800;
type TIER_4 = 1300;
type TIER_5 = 1800;
type TIER_6 = 2300;
type TIER_7 = 5300;
type TIER_8 = 12300;

/**
 * room visual memory related memory
 */
interface VisualMemory {
    time: number;
    secondsPerTick: number;
    controllerProgressArray: number[];
    avgControlPointsPerHourArray: number[];
    room: StringMap;
    etaMemory: ETAMemory;
}

/**
 * structure for nodes on the visual graph
 */
interface GraphTickMarkMemory {
    start: number;
    end: number;
}

/**
 * Memory used by rolling average to next eta level
 */
interface ETAMemory {
    rcl: number;
    avgPointsPerTick: number;
    ticksMeasured: number;
}
