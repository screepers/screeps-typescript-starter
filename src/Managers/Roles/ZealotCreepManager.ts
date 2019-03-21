import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import MiliApi from "Api/CreepMili.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN
} from "utils/constants";

// Manager for the miner creep role
export default class ZealotCreepManager {

    /**
     * run the zealot creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {
        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const targetRoom: string = creep.memory.targetRoom;

        if (MiliApi.isWaitingForRally(creepOptions)) {
            return; // idle if we are waiting on everyone to rally still
        }
        // Everyone is rallied, time to move out into the target room as a group
    }
}
