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
 * The text to sign controllers with
 */
export const CONTROLLER_SIGNING_TEXT = "get signed on boy";

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
