import { Log } from "../components/support/log";

/**
 * Enable this if you want a lot of text to be logged to console.
 * @type {boolean}
 */
export const ENABLE_DEBUG_MODE: boolean = true;

/**
 * Enable this to use the experimental PathFinder class.
 */
export const USE_PATHFINDER: boolean = true;

/**
 * Minimum number of ticksToLive for a Creep before they go to renew.
 * @type {number}
 */
export const DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL: number = 700;

export const LOG_LEVEL: number = Log.DEBUG;

// To print file/line number for each log entry. Slow, disable when not needed.
export const LOG_PRINT_LINES: boolean = true;

// To load source map and resolve file/line to original typescript source.
// Slow and doubles script size.
// Currently works only with prod deployments because depends on webpack
// to stream in "source-map" node module
export const LOG_LOAD_SOURCE_MAP: boolean = true;
