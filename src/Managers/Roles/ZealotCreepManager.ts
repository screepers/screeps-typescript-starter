import { ROLE_ZEALOT, MiliApi } from "utils/internals";

// Manager for the miner creep role
export class ZealotCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_ZEALOT;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the zealot creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const CREEP_RANGE: number = 1;

        // Carry out the basics of a military creep before moving on to specific logic
        if (MiliApi.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }

        // Find a target for the creep
        creepOptions.attackTarget = MiliApi.getAttackTarget(creep, creepOptions, CREEP_RANGE);
        const target: Creep | Structure<StructureConstant> | undefined = creepOptions.attackTarget;
        const isMelee: boolean = true;
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
        }

        // We are in attack range and healthy, attack the target
        creep.attack(target);
        // Reset creep's target
        MiliApi.resetOffensiveTarget(creep);
    }
}
