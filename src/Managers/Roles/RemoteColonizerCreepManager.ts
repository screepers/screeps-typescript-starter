import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepApi from "Api/Creep.Api";
import {
    DEFAULT_MOVE_OPTS,
    ROLE_COLONIZER,
} from "utils/constants";

// Manager for the miner creep role
export default class RemoteColonizerCreepManager implements ICreepRoleManager {

    public name: RoleConstant = ROLE_COLONIZER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the remote colonizer creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        // keep
    }
}
