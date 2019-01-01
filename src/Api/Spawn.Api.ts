import { RoomHelper } from "../Helpers/RoomHelper"

// the api used by the spawn manager
export class SpawnApi {

    // get count for the specified creep
    public static getCreepCount(room: Room, creepConst: RoleConstant): number {
        return RoomHelper.getNumCreepsInRoomBy(room, creepConst);
    }

    // get the limit for the specified creep
    public static getCreepLimits(room: Room, creepConst: RoleConstant): StringMap {
        return room.memory.creepLimit[creepConst];
    }

    // set a new limit for the specified creep
}
