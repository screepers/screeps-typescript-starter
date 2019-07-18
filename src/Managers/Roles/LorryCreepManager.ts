import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN
} from "utils/constants";

// Manager for the miner creep role
export default class LorryCreepManager implements ICreepRoleManager {

    /**
     * run the lorry creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        if (creep.spawning) {
            return;
        }
    }
}
