import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import MiliApi from "Api/CreepMili.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN, DEFAULT_MOVE_OPTS
} from "utils/constants";

// Manager for the miner creep role
export default class ZealotCreepManager {

    /**
     * run the zealot creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {

        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const targetRoom: string = creep.memory.targetRoom;

        // Check if we need to flee
        if (creepOptions.flee && creep.hits < .25 * creep.hitsMax) {
            MiliApi.fleeCreep(creep, creep.memory.homeRoom);
            return;
        }

        if (!creepOptions.rallyDone) {
            if (MiliApi.setWaitingForRally(creepOptions)) {
                return; // idle if we are waiting on everyone to rally still
            }
            // Have the creep stop checking for rally
            creepOptions.rallyDone = true;
            creep.memory.options = creepOptions;
        }

        // Everyone is rallied, time to move out into the target room as a group if not already there
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom), DEFAULT_MOVE_OPTS);
            return;
        }

        // If creep is on exit tile, move them off
        if (CreepApi.moveCreepOffExit(creep)) {
            return;
        }

        // Find a target for the creep
        const target: Creep | Structure<StructureConstant> | undefined = MiliApi.getAttackTarget(creep, creepOptions, 1);
        const isMelee: boolean = true;
        if (!target) {
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!MiliApi.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target, DEFAULT_MOVE_OPTS);
            return;
        }

        // We are in attack range and healthy, attack the target
        creep.attack(target);
    }
}
