import { ROLE_STALKER, MiliApi } from "utils/internals";

// Manager for the miner creep role
export class StalkerCreepManager implements ICreepRoleManager {
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
        creepOptions.attackTarget = MiliApi.getAttackTarget(creep, creepOptions, CREEP_RANGE);
        const target: Creep | Structure<StructureConstant> | undefined = creepOptions.attackTarget;
        const isMelee: boolean = false;
        if (!target) {
            // Keep the creeps together in the squad, if they're in a squad
            if (creepOptions.squadUUID) {
                MiliApi.moveCreepToFurthestSquadMember(creep);
            }
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!MiliApi.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target);
            return;
        } else {
            MiliApi.kiteEnemyCreep(creep);
        }

        // We are in attack range and healthy, attack the target
        creep.rangedAttack(target);

        // Reset offensive target
        MiliApi.resetOffensiveTarget(creep);
    }
}
