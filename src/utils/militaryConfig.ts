// Config file for memory related actions
import {
    ROLE_MEDIC,
    ROLE_STALKER,
    ROLE_ZEALOT,
} from "utils/Constants";

/**
 * set a zealot flag to one time use
 */
export const ZEALOT_FLAG_ONE_TIME_USE = true;

/**
 * set a stalker flag to one time use
 */
export const STALKER_FLAG_ONE_TIME_USE = true;

/**
 * set a standard squad flag to one time use
 */
export const STANDARD_SQUAD_FLAG_ONE_TIME_USE = true;

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
