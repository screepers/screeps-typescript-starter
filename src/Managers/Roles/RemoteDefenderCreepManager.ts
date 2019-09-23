import { ROLE_REMOTE_DEFENDER, MiliApi } from "utils/internals";

// Manager for the miner creep role
export class RemoteDefenderCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_REMOTE_DEFENDER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the remote defender creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const CREEP_RANGE: number = 3;

        // Carry out the basics of a military creep before moving on to specific logic
        if (MiliApi.checkMilitaryCreepBasics(creep, creepOptions)) {
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            }
            return;
        }

        // Find a target for the creep
        const target: Creep | Structure<StructureConstant> | undefined = MiliApi.getAttackTarget(
            creep,
            creepOptions,
            CREEP_RANGE
        );
        const isMelee: boolean = false;
        if (!target) {
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            }
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!MiliApi.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target);
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            }
            return;
        } else {
            MiliApi.kiteEnemyCreep(creep);
        }

        // We are in attack range and healthy, attack the target
        creep.rangedAttack(target);
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
}
