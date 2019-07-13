import {
    DEFAULT_MOVE_OPTS,
    ROLE_STALKER,
} from "utils/constants";
import MiliApi from "Api/CreepMili.Api";


// Manager for the miner creep role
export default class StalkerCreepManager implements ICreepRoleManager {

    public name: RoleConstant = ROLE_STALKER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the stalker creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {

        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const CREEP_RANGE: number = 3;

        // Carry out the basics of a military creep before moving on to specific logic
        if (MiliApi.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }

        // Find a target for the creep
        const target: Creep | Structure<StructureConstant> | undefined = MiliApi.getAttackTarget(creep, creepOptions, CREEP_RANGE);
        const isMelee: boolean = false;
        if (!target) {
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!MiliApi.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target, DEFAULT_MOVE_OPTS);
            return;
        }
        else {
            MiliApi.kiteEnemyCreep(creep)
        }

        // We are in attack range and healthy, attack the target
        creep.attack(target);
    }
}
