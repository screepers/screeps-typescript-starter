import EventApi from "Api/Event.Api";
import { C_EVENT_CREEP_SPAWNED, C_EVENT_BUILD_COMPLETE, STANDARD_SQUAD, STALKER_SOLO } from "utils/Constants";
import { STANDARD_SQUAD_ARRAY, ZEALOT_SOLO_ARRAY, STALKER_SOLO_ARRAY } from "utils/militaryConfig";
import MemoryApi from "Api/Memory.Api";
import MemoryHelper_Room from "./MemoryHelper_Room";
import UserException from "utils/UserException";

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
        MemoryApi.cleanCreepDeadJobsMemory(room.name);
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
        if (!creep.memory.options) {
            return;
        }

        // Get all attack flag memory associated with the room (should only be 1, but plan for multiple possible in future)
        const attackRoomFlags: AttackFlagMemory[] = MemoryApi.getAllAttackFlagMemoryForHost(room.name);
        const creepOptions: CreepOptionsMili = creep.memory.options! as CreepOptionsMili;
        const creepRole: RoleConstant = creep.memory.role;
        const creepIsSquadMember: boolean = creepOptions.squadSize !== 0;
        let requestingFlag: AttackFlagMemory | undefined;

        // Find the one that requested this creep and handle it accordingly
        // !TODO Before Merging pullrequest and finish bug fixes
        // Move this into a function, no reason the function should be this crowded with nonsense
        // Also, brak plz, help me find a way to standarize this so we don't have to edit some cryptic function
        // every time we want to add a military role
        // If not removing that entirely, at least help make it easy to edit please lol
        for (const attackFlag of attackRoomFlags) {

            const flagType = attackFlag.flagType;
            if (creepIsSquadMember) {
                // Find flag for the creep in a squad
                switch (flagType) {

                    case STANDARD_SQUAD:
                        if (STANDARD_SQUAD_ARRAY.includes(creepRole)) {
                            requestingFlag = attackFlag;
                        }
                        break;
                }
            }
            else {
                // Find flag for creep NOT in a squad (solo)
                switch (flagType) {

                    case ZEALOT_SOLO:
                        if (ZEALOT_SOLO_ARRAY.includes(creepRole)) {
                            requestingFlag = attackFlag;
                        }
                        break;

                    // If
                    case STALKER_SOLO:
                        if (STALKER_SOLO_ARRAY.includes(creepRole)) {
                            requestingFlag = attackFlag;
                        }
                        break;
                }
            }

            // If we found the flag, break the loop
            if (requestingFlag !== undefined) {
                break;
            }
        } // -------------------------------------

        // Throw an error if we didn't find the flag
        if (requestingFlag === undefined) {
            throw new UserException(
                "The event for spawning a military creep was improperly handled.",
                "The creep couldn't increment the correct flags memory, meaning the attack flag\n" +
                "will not be removed properly and must be done manually. [ " + creep.name + " ].",
                ERROR_ERROR
            );
        }

        // Increment the current spawned, if thats the cut off, complete the associated real flag
        requestingFlag!.currentSpawnCount = requestingFlag!.currentSpawnCount + 1;
        if (requestingFlag!.currentSpawnCount >= requestingFlag!.squadSize && requestingFlag!.currentSpawnCount > 0) {
            if (Game.flags[requestingFlag!.flagName]) {
                Game.flags[requestingFlag!.flagName].memory.complete = true;
            }
        }
    }

    /**
     * scan for structure built events
     * @param room the room we are scanning
     */
    public static scanForStructureBuiltEvents(room: Room): void {

        // ISSUES
        // The structure is NOT getting set as processed
        // Solved, defined the property for it. should be fine now

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
            console.log(structure);
            console.log("b4: " + structure.memory.processed);
            EventApi.createCustomEvent(room.name, structure.id, C_EVENT_BUILD_COMPLETE);
            structure.memory.processed = true;
            console.log("after: " + structure.memory.processed);
        }
    }

    /**
     * scan for creep spawned events
     * @param room the room we are scanning
     */
    public static scanForCreepSpawnedEvents(room: Room): void {

        // Get all creeps who spawned this turn
        const spawnedCreeps: Creep[] = _.filter(MemoryApi.getMyCreeps(room.name, undefined, true), (creep: Creep) =>
            creep.ticksToLive && creep.ticksToLive === 1500
        );

        // Loop over these creeps and create an event for them
        for (const creep of spawnedCreeps) {
            if (!creep) {
                continue;
            }
            EventApi.createCustomEvent(creep.room.name, creep.id, C_EVENT_CREEP_SPAWNED);
        }
    }
}
