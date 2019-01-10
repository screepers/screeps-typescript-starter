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
export const ROLE_POWER_UPGRADER = "power_upgrader";
export const ROLE_LORRY = "lorry";
export const ROLE_REMOTE_MINER = "remote_miner";
export const ROLE_REMOTE_HARVESTER = "remote_harvester";
export const ROLE_REMOTE_RESERVER = "remote_reserver";
export const ROLE_REMOTE_DEFENDER = "remote_defender";
export const ROLE_COLONIZER = "remote_colonizer";
export const ROLE_ZEALOT = "zealot";
export const ROLE_STALKER = "stalker";
export const ROLE_MEDIC = "medic";

// List of every structure in the game
export const AllStructureTypes: StructureConstant[] = [
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
    0,       // RCL 0
    25000,   // RCL 1
    50000,   // RCL 2
    100000,  // RCL 3
    250000,  // RCL 4
    500000,  // RCL 5
    1000000, // RCL 6
    1500000, // RCL 7
    5000000  // RCL 8
];