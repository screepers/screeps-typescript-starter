/**
 * Disallow the caching of all memory
 *
 * Turning this setting on will massively reduce performance
 * but will ensure that all memory is as accurate as possible
 */
export const NO_CACHING_MEMORY = false;

/**
 * Allow UtilHelper.throwError to throw an error rather than just print to console
 */
export const ALLOW_CUSTOM_ERRORS = true;

/**
 * Minimum amount of energy a container must have to be used in a GetEnergyJob
 */
export const CONTAINER_MINIMUM_ENERGY = 100;
/**
 * Minimum amount of energy a link must have to be used in a GetEnergyJob
 */
export const LINK_MINIMUM_ENERGY = 1;

/**
 * Percentage HP to begin repairing structures (besides Ramparts and Walls)
 */
export const REPAIR_THRESHOLD = .75;

/**
 * toggle for the room visual overlay
 */
export const ROOM_OVERLAY_ON = true;

/**
 * toggle for the graph in room overlay (high cpu cost)
 */
export const ROOM_OVERLAY_GRAPH_ON = true;

/**
 * display % or raw value on your rcl progress
 */
export const ROOM_OVERLAY_RCL_RAW_VAL = true;

/**
 * The text to sign controllers with
 */
export const CONTROLLER_SIGNING_TEXT = [
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
export const RUN_TOWER_TIMER = 1;
export const RUN_LAB_TIMER = 5;
export const RUN_LINKS_TIMER = 2;
export const RUN_TERMINAL_TIMER = 5;
export const RUN_ROOM_STATE_TIMER = 5;
export const RUN_DEFCON_TIMER = 2;

/**
 * bucket limits for manager
 * decides the min the bucket must be to run this manager
 */
export const CREEP_MANAGER_BUCKET_LIMIT = 1000;
export const SPAWN_MANAGER_BUCKET_LIMIT = 50;
export const EMPIRE_MANAGER_BUCKET_LIMIT = 5000;
export const ROOM_MANAGER_BUCKET_LIMIT = 500;
export const MEMORY_MANAGER_BUCKET_LIMIT = 1;
