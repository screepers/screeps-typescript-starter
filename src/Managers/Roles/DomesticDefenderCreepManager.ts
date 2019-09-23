import { ROLE_DOMESTIC_DEFENDER, MiliApi, RoomApi } from "utils/internals";

// Manager for the Domestic Defender Creep Role
export class DomesticDefenderCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_DOMESTIC_DEFENDER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the domestic defender creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        // This iteration of domestic defender is a melee creep that bee-lines to the enemy.
        // Possible upgrade if this proves to be a weakness would be switching to ranged
        // creep that seeks out the nearest rampart to the closest enemy creep and camps it

        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const CREEP_RANGE: number = 1;

        // Carry out the basics of a military creep before moving on to specific logic
        if (MiliApi.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }

        // Find a target for the creep
        const target: Creep | null = MiliApi.getDomesticDefenseAttackTarget(creep, creepOptions, CREEP_RANGE);
        const defendingRampart: StructureRampart | null = RoomApi.getDefenseRampart(creep.room, target);
        const isMelee: boolean = false;
        if (!target) {
            return; // idle if no current target
        }

        if (defendingRampart) {
            if (creep.pos !== defendingRampart!.pos) {
                creep.moveTo(defendingRampart);
            }
        } else {
            // If we aren't in attack range, move towards the attack target
            if (!MiliApi.isInAttackRange(creep, target.pos, isMelee)) {
                creep.moveTo(target);
                return;
            } else {
                MiliApi.kiteEnemyCreep(creep);
            }
        }

        // We are in attack range and healthy, attack the target
        creep.rangedAttack(target);
    }
}
