import { RoomHelper } from "../Helpers/RoomHelper";
import { MemoryHelper } from "../Helpers/MemoryHelper";

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
        return MemoryHelper.getNumCreepsInRoomBy(room, creepConst);
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
    public static getOpenSpawn(room: Room): StructureSpawn | undefined {
        const allOpenSpawns = _.filter(room.memory.structures[STRUCTURE_SPAWN], (s: StructureSpawn) => !s.spawning);

        // if there exists an open spawn, return it, or return undefined
        if (allOpenSpawns.length > 0) {
            return allOpenSpawns[0];
        }

        return undefined;
    }

    /**
     * check if theres an open spawn in the room
     * @param room the room we are checking the spawn for
     */
    public static isOpenSpawn(room: Room): boolean {
        return _.some(room.memory.structures[STRUCTURE_SPAWN], (s: StructureSpawn) => !s.spawning);
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
