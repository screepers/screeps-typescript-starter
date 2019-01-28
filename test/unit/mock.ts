export const Game = {
    creeps: [],
    rooms: [],
    spawns: {},
    time: 12345
};

export const Memory = {
    creeps: []
};

export const OK = 0;
export const ERR_NOT_OWNER = -1;
export const ERR_NO_PATH = -2;
export const ERR_NAME_EXISTS = -3;
export const ERR_BUSY = -4;
export const ERR_NOT_FOUND = -5;
export const ERR_NOT_ENOUGH_RESOURCES = -6;
export const ERR_NOT_ENOUGH_ENERGY = -6;
export const ERR_INVALID_TARGET = -7;
export const ERR_FULL = -8;
export const ERR_NOT_IN_RANGE = -9;
export const ERR_INVALID_ARGS = -10;
export const ERR_TIRED = -11;
export const ERR_NO_BODYPART = -12;
export const ERR_NOT_ENOUGH_EXTENSIONS = -6;
export const ERR_RCL_NOT_ENOUGH = -14;
export const ERR_GCL_NOT_ENOUGH = -15;

export const FIND_EXIT_TOP = 1;
export const FIND_EXIT_RIGHT = 3;
export const FIND_EXIT_BOTTOM = 5;
export const FIND_EXIT_LEFT = 7;
export const FIND_EXIT = 10;
export const FIND_CREEPS = 101;
export const FIND_MY_CREEPS = 102;
export const FIND_HOSTILE_CREEPS = 103;
export const FIND_SOURCES_ACTIVE = 104;
export const FIND_SOURCES = 105;
/** `FIND_DROPPED_ENERGY` is deprecated the return value is the same as `FIND_DROPPED_RESOURCES` */
export const FIND_DROPPED_ENERGY = -106;
export const FIND_DROPPED_RESOURCES = 106;
export const FIND_STRUCTURES = 107;
export const FIND_MY_STRUCTURES = 108;
export const FIND_HOSTILE_STRUCTURES = 109;
export const FIND_FLAGS = 110;
export const FIND_CONSTRUCTION_SITES = 111;
export const FIND_MY_SPAWNS = 112;
export const FIND_HOSTILE_SPAWNS = 113;
export const FIND_MY_CONSTRUCTION_SITES = 114;
export const FIND_HOSTILE_CONSTRUCTION_SITES = 115;
export const FIND_MINERALS = 116;
export const FIND_NUKES = 117;
export const FIND_TOMBSTONES = 118;

export const TOP = 1;
export const TOP_RIGHT = 2;
export const RIGHT = 3;
export const BOTTOM_RIGHT = 4;
export const BOTTOM = 5;
export const BOTTOM_LEFT = 6;
export const LEFT = 7;
export const TOP_LEFT = 8;

export const COLOR_RED = 1;
export const COLOR_PURPLE = 2;
export const COLOR_BLUE = 3;
export const COLOR_CYAN = 4;
export const COLOR_GREEN = 5;
export const COLOR_YELLOW = 6;
export const COLOR_ORANGE = 7;
export const COLOR_BROWN = 8;
export const COLOR_GREY = 9;
export const COLOR_WHITE = 10;

export const CREEP_SPAWN_TIME = 3;
export const CREEP_LIFE_TIME = 1500;
export const CREEP_CLAIM_LIFE_TIME = 600;
export const CREEP_CORPSE_RATE = 0.2;

export const OBSTACLE_OBJECT_TYPES = [
    "spawn",
    "creep",
    "wall",
    "source",
    "constructedWall",
    "extension",
    "link",
    "storage",
    "tower",
    "observer",
    "powerSpawn",
    "powerBank",
    "lab",
    "terminal",
    "nuker"
];

export const ENERGY_REGEN_TIME = 300;
export const ENERGY_DECAY = 1000;

export const REPAIR_COST = 0.01;

export const RAMPART_DECAY_AMOUNT = 300;
export const RAMPART_DECAY_TIME = 100;
export const RAMPART_HITS = 1;
export const RAMPART_HITS_MAX = {
    2: 300000,
    3: 1000000,
    4: 3000000,
    5: 10000000,
    6: 30000000,
    7: 100000000,
    8: 300000000
};

export const SPAWN_HITS = 5000;
export const SPAWN_ENERGY_START = 300;
export const SPAWN_ENERGY_CAPACITY = 300;

export const SOURCE_ENERGY_CAPACITY = 3000;
export const SOURCE_ENERGY_NEUTRAL_CAPACITY = 1500;
export const SOURCE_ENERGY_KEEPER_CAPACITY = 4000;

export const WALL_HITS = 1;
export const WALL_HITS_MAX = 300000000;

export const EXTENSION_HITS = 1000;
export const EXTENSION_ENERGY_CAPACITY = {
    0: 50,
    1: 50,
    2: 50,
    3: 50,
    4: 50,
    5: 50,
    6: 50,
    7: 100,
    8: 200
};

export const ROAD_HITS = 5000;
export const ROAD_WEAROUT = 1;
export const ROAD_DECAY_AMOUNT = 100;
export const ROAD_DECAY_TIME = 1000;

export const LINK_HITS = 1000;
export const LINK_HITS_MAX = 1000;
export const LINK_CAPACITY = 800;
export const LINK_COOLDOWN = 1;
export const LINK_LOSS_RATIO = 0.03;

export const STORAGE_CAPACITY = 1000000;
export const STORAGE_HITS = 10000;

export const CARRY_CAPACITY = 50;
export const HARVEST_POWER = 2;
export const HARVEST_MINERAL_POWER = 1;
export const REPAIR_POWER = 100;
export const DISMANTLE_POWER = 50;
export const BUILD_POWER = 5;
export const ATTACK_POWER = 30;
export const UPGRADE_CONTROLLER_POWER = 1;
export const RANGED_ATTACK_POWER = 10;
export const HEAL_POWER = 12;
export const RANGED_HEAL_POWER = 4;
export const DISMANTLE_COST = 0.005;

export const MOVE = "move";
export const WORK = "work";
export const CARRY = "carry";
export const ATTACK = "attack";
export const RANGED_ATTACK = "ranged_attack";
export const TOUGH = "tough";
export const HEAL = "heal";
export const CLAIM = "claim";

export const BODYPARTS_ALL = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, TOUGH, HEAL, CLAIM];

export const CONSTRUCTION_COST_ROAD_SWAMP_RATIO = 5;

export const STRUCTURE_EXTENSION = "extension";
export const STRUCTURE_RAMPART = "rampart";
export const STRUCTURE_ROAD = "road";
export const STRUCTURE_SPAWN = "spawn";
export const STRUCTURE_LINK = "link";
export const STRUCTURE_WALL = "constructedWall";
export const STRUCTURE_KEEPER_LAIR = "keeperLair";
export const STRUCTURE_CONTROLLER = "controller";
export const STRUCTURE_STORAGE = "storage";
export const STRUCTURE_TOWER = "tower";
export const STRUCTURE_OBSERVER = "observer";
export const STRUCTURE_POWER_BANK = "powerBank";
export const STRUCTURE_POWER_SPAWN = "powerSpawn";
export const STRUCTURE_EXTRACTOR = "extractor";
export const STRUCTURE_LAB = "lab";
export const STRUCTURE_TERMINAL = "terminal";
export const STRUCTURE_CONTAINER = "container";
export const STRUCTURE_NUKER = "nuker";
export const STRUCTURE_PORTAL = "portal";

export const RESOURCE_ENERGY = "energy";
export const RESOURCE_POWER = "power";
export const RESOURCE_UTRIUM = "U";
export const RESOURCE_LEMERGIUM = "L";
export const RESOURCE_KEANIUM = "K";
export const RESOURCE_GHODIUM = "G";
export const RESOURCE_ZYNTHIUM = "Z";
export const RESOURCE_OXYGEN = "O";
export const RESOURCE_HYDROGEN = "H";
export const RESOURCE_CATALYST = "X";
export const RESOURCE_HYDROXIDE = "OH";
export const RESOURCE_ZYNTHIUM_KEANITE = "ZK";
export const RESOURCE_UTRIUM_LEMERGITE = "UL";
export const RESOURCE_UTRIUM_HYDRIDE = "UH";
export const RESOURCE_UTRIUM_OXIDE = "UO";
export const RESOURCE_KEANIUM_HYDRIDE = "KH";
export const RESOURCE_KEANIUM_OXIDE = "KO";
export const RESOURCE_LEMERGIUM_HYDRIDE = "LH";
export const RESOURCE_LEMERGIUM_OXIDE = "LO";
export const RESOURCE_ZYNTHIUM_HYDRIDE = "ZH";
export const RESOURCE_ZYNTHIUM_OXIDE = "ZO";
export const RESOURCE_GHODIUM_HYDRIDE = "GH";
export const RESOURCE_GHODIUM_OXIDE = "GO";
export const RESOURCE_UTRIUM_ACID = "UH2O";
export const RESOURCE_UTRIUM_ALKALIDE = "UHO2";
export const RESOURCE_KEANIUM_ACID = "KH2O";
export const RESOURCE_KEANIUM_ALKALIDE = "KHO2";
export const RESOURCE_LEMERGIUM_ACID = "LH2O";
export const RESOURCE_LEMERGIUM_ALKALIDE = "LHO2";
export const RESOURCE_ZYNTHIUM_ACID = "ZH2O";
export const RESOURCE_ZYNTHIUM_ALKALIDE = "ZHO2";
export const RESOURCE_GHODIUM_ACID = "GH2O";
export const RESOURCE_GHODIUM_ALKALIDE = "GHO2";
export const RESOURCE_CATALYZED_UTRIUM_ACID = "XUH2O";
export const RESOURCE_CATALYZED_UTRIUM_ALKALIDE = "XUHO2";
export const RESOURCE_CATALYZED_KEANIUM_ACID = "XKH2O";
export const RESOURCE_CATALYZED_KEANIUM_ALKALIDE = "XKHO2";
export const RESOURCE_CATALYZED_LEMERGIUM_ACID = "XLH2O";
export const RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE = "XLHO2";
export const RESOURCE_CATALYZED_ZYNTHIUM_ACID = "XZH2O";
export const RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE = "XZHO2";
export const RESOURCE_CATALYZED_GHODIUM_ACID = "XGH2O";
export const RESOURCE_CATALYZED_GHODIUM_ALKALIDE = "XGHO2";

export const SUBSCRIPTION_TOKEN = "token";

export const SAFE_MODE_DURATION = 20000;
export const SAFE_MODE_COOLDOWN = 50000;
export const SAFE_MODE_COST = 1000;

export const LOOK_CREEPS = "creep";
export const LOOK_ENERGY = "energy";
export const LOOK_RESOURCES = "resource";
export const LOOK_SOURCES = "source";
export const LOOK_MINERALS = "mineral";
export const LOOK_STRUCTURES = "structure";
export const LOOK_FLAGS = "flag";
export const LOOK_CONSTRUCTION_SITES = "constructionSite";
export const LOOK_NUKES = "nuke";
export const LOOK_TERRAIN = "terrain";
export const LOOK_TOMBSTONES = "tombstone";

export const ORDER_SELL = "sell";
export const ORDER_BUY = "buy";

export const TOMBSTONE_DECAY_PER_PART = 5;

export const EVENT_ATTACK = 1;
export const EVENT_OBJECT_DESTROYED = 2;
export const EVENT_ATTACK_CONTROLLER = 3;
export const EVENT_BUILD = 4;
export const EVENT_HARVEST = 5;
export const EVENT_HEAL = 6;
export const EVENT_REPAIR = 7;
export const EVENT_RESERVE_CONTROLLER = 8;
export const EVENT_UPGRADE_CONTROLLER = 9;
export const EVENT_EXIT = 10;

export const EVENT_ATTACK_TYPE_MELEE = 1;
export const EVENT_ATTACK_TYPE_RANGED = 2;
export const EVENT_ATTACK_TYPE_RANGED_MASS = 3;
export const EVENT_ATTACK_TYPE_DISMANTLE = 4;
export const EVENT_ATTACK_TYPE_HIT_BACK = 5;
export const EVENT_ATTACK_TYPE_NUKE = 6;

export const EVENT_HEAL_TYPE_MELEE = 1;
export const EVENT_HEAL_TYPE_RANGED = 2;
