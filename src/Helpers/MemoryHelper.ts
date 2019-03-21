import { STRUCT_CACHE_TTL } from "utils/constants";
import MemoryHelper_Room from "./MemoryHelper_Room";
import MemoryApi from "Api/Memory.Api";
import { NO_CACHING_MEMORY } from "utils/config";

// Accessing Memory Helpers
export default class MemoryHelper {
    /**
     * Returns an array of creeps of a role
     * @param role The role to check for
     */
    public static getCreepOfRole(room: Room, role: RoleConstant, forceUpdate?: boolean): Creep[] {
        const filterByRole = (creep: Creep) => {
            return creep.memory.role === role;
        };
        const creepsOfRole = MemoryApi.getMyCreeps(room.name, filterByRole);

        return creepsOfRole;
    }

    /**
     * Performs the length checks and null checks for all getXXX functions that use IDs to get the objects
     * @param idArray An array of ids to check
     */
    public static getOnlyObjectsFromIDs<T>(idArray: string[]): T[] {
        if (idArray.length === 0) {
            return [];
        }

        const objects: T[] = [];
        _.forEach(idArray, (id: string) => {
            const object: T | null = Game.getObjectById(id);
            if (object !== null) {
                objects.push(object);
            }
        });

        return objects;
    }

    /**
     * clear the memory structure for the creep
     * @param creep the creep we want to clear the memory of
     */
    public static clearCreepMemory(creep: Creep) {
        // check if the memory object exists and delete it
        if (Memory.creeps[creep.name]) {
            delete creep.memory;
        }
    }

    /**
     * clear the memory for a room
     * @param room the room we want to clear the memory for
     */
    public static clearRoomMemory(room: Room) {
        // check if the memory structures exists and delete it
        if (Memory.rooms[room.name]) {
            delete room.memory;
        }
    }
}
