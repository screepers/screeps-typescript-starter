// Config file for memory related actions
import { ROLE_MEDIC, ROLE_STALKER, ROLE_ZEALOT, ROLE_DOMESTIC_DEFENDER } from "utils/internals";

// -----
/* Arrays for military flags */
/**
 * create the array for the zealot solo flag
 */
export const ZEALOT_SOLO_ARRAY: RoleConstant[] = [ROLE_ZEALOT];

/**
 * create the array for standard squad flag
 */
export const STANDARD_SQUAD_ARRAY: RoleConstant[] = [ROLE_STALKER, ROLE_MEDIC, ROLE_ZEALOT];

/**
 * create the array for stalker solo flag
 */
export const STALKER_SOLO_ARRAY: RoleConstant[] = [ROLE_STALKER];
// -------------------------------

// -----
/**
 * Config for priority tier 1
 */
export const TIER_1_MILITARY_PRIORITY: RoleConstant[] = [ROLE_DOMESTIC_DEFENDER];
/**
 * Config for priority tier 2
 */
export const TIER_2_MILITARY_PRIORITY: RoleConstant[] = [];

/**
 * Config for priority tier 3
 */
export const TIER_3_MILITARY_PRIORITY: RoleConstant[] = [ROLE_STALKER, ROLE_MEDIC, ROLE_ZEALOT];
// --------------------------

// -----
/**
 * config for all military roles
 */
export const ALL_MILITARY_ROLES: RoleConstant[] = [ROLE_STALKER, ROLE_MEDIC, ROLE_ZEALOT, ROLE_DOMESTIC_DEFENDER];

/**
 * config for all defensive roles (no requesting flag)
 * considering refactoring so defense drops a flag for a defender rather than special case?
 */
export const ALL_DEFENSIVE_ROLES: RoleConstant[] = [ROLE_DOMESTIC_DEFENDER];
// ------------------------------
