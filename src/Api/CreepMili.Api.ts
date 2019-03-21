import MemoryApi from "./Memory.Api";
import { DEFAULT_MOVE_OPTS } from "utils/constants";

// Api for military creep's
export default class CreepMili {

    /**
     * check if we're still waiting on creeps to rally
     * @param creepOptions the options for the military creep
     */
    public static setWaitingForRally(creepOptions: CreepOptionsMili): boolean {

        // If these options aren't defined, creep isn't waiting for rally
        if (!creepOptions.rallyLocation || !creepOptions.squadSize || !creepOptions.rallyLocation) {
            return false;
        }
        const squadSize: number = creepOptions.squadSize!;
        const squadUUID: number = creepOptions.squadUUID!;
        const rallyRoom: string = creepOptions.rallyLocation.roomName;
        const creepsInSquad: Creep[] = MemoryApi.getMyCreeps(rallyRoom, (creep: Creep) => {
            const currentCreepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
            if (!currentCreepOptions.squadUUID) {
                return false;
            }
            return currentCreepOptions.squadUUID === squadUUID;
        });

        // If we don't have the full squad spawned yet, creep is waiting
        if (creepsInSquad.length < squadSize) {
            return true;
        }

        // If not every creep is in the rally room, we are waiting
        if (_.some(creepsInSquad, (c: Creep) => c.room.name !== rallyRoom)) {
            return true;
        }

        // Finally, make sure every creep is within an acceptable distance of each other
        const creepsWithinRallyDistance: boolean =
            _.every(creepsInSquad, (cis: Creep) =>  // Check that every creep is within 2 tiles of at least 1 other creep in squad
                _.some(creepsInSquad, (innerC: Creep) => innerC.pos.inRangeTo(cis.pos.x, cis.pos.y, 2))
            ) &&
            _.every(creepsInSquad, (c: Creep) =>    // Check that every creep is within 7 tiles of every creep in the squad
                _.every(creepsInSquad, (innerC: Creep) => c.pos.inRangeTo(innerC.pos.x, innerC.pos.y, 7))
            );

        if (creepsWithinRallyDistance) {
            return true;
        }

        // If we make it to here, we are done waiting
        return false;
    }

    /**
     * check if the creep is in range to attack the target
     * @param creep the creep we are checking for
     * @param target the room position for the target in question
     * @param isMelee if the creep can only melee
     */
    public static isInAttackRange(creep: Creep, target: RoomPosition, isMelee: boolean): boolean {
        if (isMelee) {
            return creep.pos.isNearTo(target);
        }
        return creep.pos.inRangeTo(target, 3);
    }

    /**
     * have the creep flee back to the homestead
     * @param creep the creep that is fleeing
     */
    public static fleeCreep(creep: Creep, homeRoom: string): void {
        creep.moveTo(new RoomPosition(25, 25, homeRoom), DEFAULT_MOVE_OPTS);
    }
};
