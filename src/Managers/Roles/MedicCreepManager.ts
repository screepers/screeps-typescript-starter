import MemoryApi from "../../Api/Memory.Api";
import {
    DEFAULT_MOVE_OPTS,
    ROLE_MEDIC,
} from "utils/constants";
import MiliApi from "Api/CreepMili.Api";


// Manager for the miner creep role
export default class MedicCreepManager implements ICreepRoleManager {

    public name: RoleConstant = ROLE_MEDIC;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the medic creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {

        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const CREEP_RANGE: number = 3;

        if (MiliApi.checkMilitaryCreepBasics(creep, creepOptions)) {
            return;
        }

        // Get a healing target
        const healingTarget: Creep | null = MiliApi.getHealingTarget(creep, creepOptions);

        if (creepOptions.squadUUID) {
            const squadMembers: Creep[] | null = MemoryApi.getCreepsInSquad(creep.room.name, creepOptions.squadUUID);
            // No healing target, move towards closest squad member
            if (!healingTarget && squadMembers) {
                const closestSquadMember: Creep | null = creep.pos.findClosestByRange(squadMembers);
                if (closestSquadMember && !creep.pos.isNearTo(closestSquadMember)) {
                    creep.moveTo(closestSquadMember, DEFAULT_MOVE_OPTS);
                }

                MiliApi.fleeCreep(creep, creep.memory.homeRoom);
                return;
            }
        }

        // If no healing target and we aren't in a squad, find closest friendly creep and move to them, flee otherwise
        if (!healingTarget) {
            const closestFriendlyCreep: Creep | null = creep.pos.findClosestByPath(FIND_MY_CREEPS);
            if (closestFriendlyCreep) {
                creep.moveTo(closestFriendlyCreep, DEFAULT_MOVE_OPTS);
            }
            return;
        }
        // If we are in range, heal it, otherwise move to it
        if (creep.pos.inRangeTo(healingTarget.pos, CREEP_RANGE)) {
            if (!creep.pos.isNearTo(healingTarget)) {
                creep.moveTo(healingTarget)
            }
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);  // heal self first if we need to
            }
            else {
                creep.heal(healingTarget);
            }
        }
        else {
            creep.moveTo(healingTarget, DEFAULT_MOVE_OPTS);
        }
    }
}
