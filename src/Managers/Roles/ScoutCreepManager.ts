import { ROLE_SCOUT, CreepApi } from "utils/internals";

export class ScoutCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_SCOUT;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * Run the scout creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        if (creep.memory.job === undefined) {
            creep.memory.job = this.getMovePartJob(creep);
        }

        if (creep.memory.working) {
            return;
        }

        CreepApi.travelTo(creep, creep.memory.job);
    }

    /**
     * Get a MovePartJob for the scout - Should never be undefined
     */
    public getMovePartJob(creep: Creep): MovePartJob {
        const newJob: MovePartJob = {
            jobType: "movePartJob",
            targetType: "roomName",
            targetID: creep.memory.targetRoom,
            actionType: "move",
            isTaken: false
        };

        return newJob;
    }
}
