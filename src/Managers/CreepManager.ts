
import {
    CREEP_MANAGERS
} from "utils/Constants";
import UtilHelper from "Helpers/UtilHelper";

// Call the creep manager for each role
export default class CreepManager {
    /**
     * loop over all creeps and call single creep manager for it
     */
    public static runCreepManager(): void {
        for (const creep in Game.creeps) {
            try {
                this.runSingleCreepManager(Game.creeps[creep]);
            } catch (e) {
                UtilHelper.printError(e);
            }
        }
    }

    /**
     * run single creep manager
     * @param creep the creep we are calling the manager for
     */
    public static runSingleCreepManager(creep: Creep): void {
        const role = creep.memory.role;
        CREEP_MANAGERS[role].runCreepRole(creep);
    }
}
