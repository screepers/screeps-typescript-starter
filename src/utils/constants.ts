// Room State Constants
export const ROOM_STATE_INTRO = 0;
export const ROOM_STATE_BEGINNER = 1;
export const ROOM_STATE_INTER = 2;
export const ROOM_STATE_ADVANCED = 3;
export const ROOM_STATE_UPGRADER = 4;
export const ROOM_STATE_SEIGE = 5;
export const ROOM_STATE_STIMULATE = 6;
export const ROOM_STATE_NUKE_INBOUND = 7;

// Role Constants
export const ROLE_MINER = "miner";
export const ROLE_HARVESTER = "harvester";
export const ROLE_WORKER = "worker";
export const ROLE_POWER_UPGRADER = "powerUpgrader";
export const ROLE_LORRY = "lorry";
export const ROLE_REMOTE_MINER = "remoteMiner";
export const ROLE_REMOTE_HARVESTER = "remoteHarvester";
export const ROLE_REMOTE_RESERVER = "remoteReserver";
export const ROLE_REMOTE_DEFENDER = "remoteDefender";
export const ROLE_CLAIMER = "claimer";
export const ROLE_COLONIZER = "remoteColonizer";
export const ROLE_ZEALOT = "zealot";
export const ROLE_STALKER = "stalker";
export const ROLE_MEDIC = "medic";
export const ROLE_DOMESTIC_DEFENDER = "domesticDefender";

// Tier Constants
export const TIER_1 = 300;
export const TIER_2 = 550;
export const TIER_3 = 800;
export const TIER_4 = 1300;
export const TIER_5 = 1800;
export const TIER_6 = 2300;
export const TIER_7 = 5300;
export const TIER_8 = 12300;

// Attack Flag Constants
export const ZEALOT_SOLO = 1;
export const STALKER_SOLO = 2;
export const STANDARD_SQUAD = 3;

// Creep Body Layout Constants
export const GROUPED = "grouped";
export const COLLATED = "collated";

// Role Priority List
// * Keep this list ordered by spawn priority
export const domesticRolePriority: RoleConstant[] = [
    ROLE_MINER,
    ROLE_HARVESTER,
    ROLE_WORKER,
    ROLE_POWER_UPGRADER,
    ROLE_LORRY
];

// * Keep this list ordered by spawn priority
export const remoteRolePriority: RoleConstant[] = [
    ROLE_REMOTE_RESERVER,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_HARVESTER,
    ROLE_REMOTE_DEFENDER,
    ROLE_COLONIZER
];

// * Keep this list ordered by spawn priority
export const militaryRolePriority: RoleConstant[] = [ROLE_MEDIC, ROLE_STALKER, ROLE_ZEALOT];

// List of every structure in the game
export const ALL_STRUCTURE_TYPES: StructureConstant[] = [
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
export const WALL_LIMIT: number[] = [
    0, // RCL 0
    25000, // RCL 1
    50000, // RCL 2
    100000, // RCL 3
    250000, // RCL 4
    500000, // RCL 5
    1000000, // RCL 6
    1500000, // RCL 7
    5000000 // RCL 8
];

// Cache Tick Limits
export const STRUCT_CACHE_TTL = 50; // Structures
export const SOURCE_CACHE_TTL = -1; // Sources
export const CONSTR_CACHE_TTL = 50; // Construction Sites
export const TOMBSTONE_CACHE_TTL = 50; // Tombstones
export const DROPS_CACHE_TTL = 50; // Dropped Resources
export const FCREEP_CACHE_TTL = 20; // Friendly Creep
export const HCREEP_CACHE_TTL = 1; // Hostile Creep
// GetEnergyJob Constants
export const SOURCE_JOB_CACHE_TTL = 50; // Source jobs
export const CONTAINER_JOB_CACHE_TTL = 50; // Container jobs
export const LINK_JOB_CACHE_TTL = 50; // Link Jobs
export const BACKUP_JOB_CACHE_TTL = 50; // Backup Jobs
// ClaimPartJob Constants
export const CLAIM_JOB_CACHE_TTL = 1; // Claim Jobs
export const RESERVE_JOB_CACHE_TTL = 1; // Reserve Jobs
export const SIGN_JOB_CACHE_TTL = 50; // Sign Jobs
export const ATTACK_JOB_CACHE_TTL = 1; // Attack Jobs
// ? Should we change DEPNDT to be 3 seperate consts? Attack, Remote, Claim?
export const DEPNDT_CACHE_TTL = 50; // Dependent Rooms - Attack, Remote, Claim

// Error Severity Constants
export const ERROR_FATAL = 3; // Very severe error - Game ruining
export const ERROR_ERROR = 2; // Regular error - Creep/Room ruining
export const ERROR_WARN = 1; // Small error - Something went wrong, but doesn't ruin anything
export const ERROR_INFO = 0; // Non-error - Used to log when something happens (e.g. memory is updated)

// Color Constants
export const COLORS: any = {};
COLORS[ERROR_FATAL] = "#FF0000";
COLORS[ERROR_ERROR] = "#E300FF";
COLORS[ERROR_WARN] = "#F0FF00";
COLORS[ERROR_INFO] = "#0045FF";
