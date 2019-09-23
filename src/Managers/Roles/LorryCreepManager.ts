import { ROLE_LORRY } from "utils/internals";

// Manager for the miner creep role
export class LorryCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_LORRY;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the lorry creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        // keep
    }
}
