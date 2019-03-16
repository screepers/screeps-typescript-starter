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