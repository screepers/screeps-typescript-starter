import EventApi from "Api/Event.Api";
import { C_EVENT_CREEP_SPAWNED, C_EVENT_BUILD_COMPLETE, STANDARD_SQUAD, STALKER_SOLO, ZEALOT_SOLO, ERROR_ERROR } from "utils/Constants";
import { STANDARD_SQUAD_ARRAY, ZEALOT_SOLO_ARRAY, STALKER_SOLO_ARRAY } from "utils/militaryConfig";
import MemoryApi from "Api/Memory.Api";
import MemoryHelper_Room from "./MemoryHelper_Room";
import UserException from "utils/UserException";
import { SpawnHelper } from "./SpawnHelper";
import Normalize from "./Normalize";

export default class EventHelper {

    /**
     * process event triggered for ramparts built in a room
     * @param room the room the event occured in
     * @param event the event that occured
     * @param constructionSite the site we are triggering the event for
     */
    public static rampartBuiltTrigger(room: Room, event: CustomEvent, siteBuilt: Structure): void {

        // Update upgrade jobs and fire all the creeps
        MemoryHelper_Room.updateWorkPart_buildJobs(room);
    }

    /**
     * military creep successfully spawned event
     * this function is a straight mess, will need refactoring once bugs are ironed out
     * @param room the room the event occured in
     * @param event the event that occured
     * @param creep the creep thaat just spawned
     */
    public static miltaryCreepSpawnTrigger(room: Room, event: CustomEvent, creep: Creep): void {

        // Early return if creep has no options for some reason
        if (!creep.memory.options || SpawnHelper.isDefenseCreep(creep.memory.role)) {
            return;
        }

        const creepBody: BodyPartConstant[] = Normalize.convertCreepBodyToBodyPartConstant(creep.body);
        const requestingFlag: AttackFlagMemory | undefined = this.getMiliRequestingFlag(room, creep.memory.role, creep.name);
        // Throw an error if we didn't find the flag
        if (requestingFlag === undefined) {
            throw new UserException(
                "The event for spawning a military creep was improperly handled.",
                "The creep couldn't increment the correct flags memory, meaning the attack flag\n" +
                "will not be removed properly and must be done manually. [ " + creep.name + " ].",
                ERROR_ERROR
            );
        }

        // Increment the current spawned, if thats the cut off, complete the associated real flag so it will be removed
        requestingFlag!.currentSpawnCount = requestingFlag!.currentSpawnCount + 1;
        const squadSize: number = requestingFlag!.squadSize;
        const currCount: number = requestingFlag!.currentSpawnCount;
        const flagName: string = requestingFlag!.flagName;
        if (currCount >= squadSize) {
            if (Game.flags[flagName]) {
                Game.flags[flagName].memory.complete = true;
            }
        }
    }

    /**
     * Find the flag that requested this creep to be spawned
     * @param creep the creep we are checking the flag for
     * @param room the room we are in
     * @param creepName the name of the creep for referencing
     * @returns the requesting flag for this creep role
     */
    public static getMiliRequestingFlag(room: Room, roleConst: RoleConstant, creepName: string): AttackFlagMemory | undefined {

        // Get all attack flag memory associated with the room (should only be 1, but plan for multiple possible in future)
        const attackRoomFlags: AttackFlagMemory[] = MemoryApi.getAllAttackFlagMemoryForHost(room.name);

        // Find the one that requested this creep to be returned
        for (const attackFlag of attackRoomFlags) {
            if (this.isRequestFlag(roleConst, creepName, attackFlag, room.name)) {
                if (!attackFlag.squadMembers.includes(creepName)) {
                    attackFlag.squadMembers.push(creepName);
                }
                return attackFlag;
            }
        }
        return undefined;
    }

    /**
     * returns bool if the attack flag requested the creep
     * @param creepRole the creep role we are checking for
     * @param creepName the creep name we are checking for
     * @param attackFlag the attack flag we are checking against
     * @param roomName the name of the room making the request
     * @returns true if the flag requested this creep
     */
    public static isRequestFlag(
        creepRole: RoleConstant,
        creepName: string,
        attackFlag: AttackFlagMemory,
        roomName: string
    ): boolean {

        // If we are provided a defined creep name, check if the flag references it first
        if (attackFlag.squadMembers.includes(creepName)) {
            return true;
        }

        // The creep is not assigned to a flag yet, find it's flag and assign it
        const flagType = attackFlag.flagType;
        let requestingRoleArray: RoleConstant[] = [];
        switch (flagType) {

            case STANDARD_SQUAD:

                const creepsInSquad: Creep[] | null = MemoryApi.getCreepsInSquad(roomName, attackFlag.squadUUID);
                if (creepsInSquad) {
                    const numRoleRequested: number = this.getNumRoleRequestedFromSquadFlag(STANDARD_SQUAD_ARRAY, creepRole);
                    const numRoleExisting: number = _.filter(creepsInSquad, (c: Creep) => c.memory.role === creepRole).length;
                    if (numRoleRequested < numRoleExisting) {
                        requestingRoleArray = STANDARD_SQUAD_ARRAY;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    requestingRoleArray = STANDARD_SQUAD_ARRAY;
                }
                break;

            case ZEALOT_SOLO:
                requestingRoleArray = ZEALOT_SOLO_ARRAY;
                break;

            case STALKER_SOLO:
                requestingRoleArray = STALKER_SOLO_ARRAY;
                break;
        }

        return requestingRoleArray.includes(creepRole);
    }

    /**
     * scan for structure built events
     * @param room the room we are scanning
     */
    public static scanForStructureBuiltEvents(room: Room): void {

        // Still need to check this for bugs

        // Get all structures in the room that have not yet been processed
        const structures: Structure[] = MemoryApi.getStructures(
            room.name,
            (structure: Structure) =>
                structure.structureType !== STRUCTURE_KEEPER_LAIR
                && structure.structureType !== STRUCTURE_CONTROLLER &&
                (structure.memory.processed === false || structure.memory.processed === undefined),
            true
        );


        // Create an event for each unprocesseed structure, then set it as processed
        for (const key in structures) {
            const structure: Structure<StructureConstant> = structures[key];
            EventApi.createCustomEvent(room.name, structure.id, C_EVENT_BUILD_COMPLETE);
            structure.memory.processed = true;
        }
    }

    /**
     * scan for creep spawned events
     * @param room the room we are scanning
     */
    public static scanForCreepSpawnedEvents(room: Room): void {

        // Get all creeps who spawned this turn
        const spawnedCreeps: Creep[] = _.filter(MemoryApi.getMyCreeps(room.name, undefined, true), (creep: Creep) =>
            creep.ticksToLive && creep.ticksToLive === 1499
        );

        // Loop over these creeps and create an event for them
        for (const creep of spawnedCreeps) {
            if (!creep) {
                continue;
            }
            EventApi.createCustomEvent(creep.room.name, creep.id, C_EVENT_CREEP_SPAWNED);
        }
    }

    /**
     * get the number of creeps of a role type that the flag calls for
     */
    public static getNumRoleRequestedFromSquadFlag(flagRoleArray: RoleConstant[], creepRole: RoleConstant): number {
        let sum: number = 0;
        for (const i in flagRoleArray) {
            if (flagRoleArray[i] === creepRole) {
                ++sum;
            }
        }
        return sum;
    }
}
