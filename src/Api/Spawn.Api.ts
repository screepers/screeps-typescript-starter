import { RoomHelper } from "../Helpers/RoomHelper";
import { MemoryHelper } from "../Helpers/MemoryHelper";
import { MemoryApi } from "./Memory.Api";

/**
 * the api used by the spawn manager
 */
export class SpawnApi {
    /**
     * get count for the specified creep
     * @param room the room we are getting the count for
     * @param creepConst the role of the creep we want
     */
    public static getCreepCount(room: Room, creepConst: any): number {
        return _.sum(MemoryApi.getMyCreeps(room,
            (c: Creep) => c.memory.role === creepConst));
    }

    /**
     * get the limit for the specified creep
     * @param room the room we are getting the limits for
     * @param creepConst the role of the creep we want
     */
    public static getCreepLimits(room: Room, creepConst: RoleConstant): CreepLimits {
        return room.memory.creepLimit[creepConst];
    }

    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    public static getOpenSpawn(room: Room): Structure<StructureConstant> | null {

        // get all spawns then just take the first one from it
        const allSpawns: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(room,
            (s: Structure<StructureConstant>) => s.structureType === STRUCTURE_SPAWN);

        return _.first(allSpawns);
    }

    /**
     * get next creep to spawn
     */


    /**
     * spawn the next creep
     */


    /**
     * get energy cost of creep
     */


    /**
     * check if we have enough energy to spawn this creep
     */


    /**
     * check what tier of this creep we are spawning
     */


    /**
     * get the memory options for this creep
     */

}
