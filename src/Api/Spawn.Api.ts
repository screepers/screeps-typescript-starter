import { RoomHelper } from "../Helpers/RoomHelper"

/**
* the api used by the spawn manager
*/
export class SpawnApi {

    /**
    * get count for the specified creep
    */
    public static getCreepCount(room: Room, creepConst: RoleConstant): number {
        return RoomHelper.getNumCreepsInRoomBy(room, creepConst);
    }

    /**
    * get the limit for the specified creep
    */
    public static getCreepLimits(room: Room, creepConst: RoleConstant): CreepLimits {
        return room.memory.creepLimit[creepConst];
    }

    
}
