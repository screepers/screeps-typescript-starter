import { ROLE_COLONIZER } from "utils/internals";

// Manager for the miner creep role
export class RemoteColonizerCreepManager implements ICreepRoleManager {
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
