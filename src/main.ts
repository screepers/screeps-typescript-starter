/*
  Kung Fu Klan's Screeps Code
  Written and maintained by -
    Jakesboy2
    UhmBrock

  Starting Jan 2019
*/

// TODO
/**
 *  ~~~ TO DO LIST ~~~
 *
 *
 * ~~~~~~~~~~~~~~~~~~
 * ~~ NEW FEATURES ~~
 * ~~~~~~~~~~~~~~~~~~
 *
 * 2. Complete Remote Miner
 * We want the remote miner to go to a source and mine it, build a container and his feet, and build/repair it during his down time.
 * We should also give remote miners 7 work parts imo. 6 wasn't enough to keep the container repaired and it was slow on building it
 * It is an extra 100 energy per creep cycle but I think its worth it to keep the remote rooms going smoother
 *
 * 3. Complete Remote Harvester
 * They are so simple, just get a container or pick up job in the remote room
 * Should be straight forward, bring the energy back and based on options, do harvester jobs with it
 *
 * 4. Complete Remote Reserver
 * Find reserve job in remote room and reserve it until death, basically a miner for the controller
 * We need to find a way to get the rooms that need to be reserver
 * Probably just put a value in room memory and simulate its down ticks like we did last code base, it worked really well
 *
 * 5. Complete Claimer
 * Find a claim job in a claim room and claim it
 * We need to find a way to get the rooms that need to be claimed (should be easier than finding ones that need to be reserved)
 *
 * 6. Complete Colonizer
 * Goes to remote room, mines for itself, builds the spawn, pumps energy into the spawn or upgrades until death
 *
 * Something to keep in mind on all these remote creeps, we need to make sure their travelTo calls get off exit (should just add to
 * all travel to methods, there are cases where we will send domestic creeps places as well)
 *
 * 7. Consider preferring closer jobs to further ones that are on the same level
 * Currently harvesters are kinda going from place to place when they could be filling up multiple on the way
 * to other extensions
 *
 * 8. Rework room state seige
 * Possibly just remove it and let defcon handle all seige related stuff
 * It doesn't allow us to hold the actual progress of the room during a seige, we could be
 * on power upgraders, or at a point of intro, better to let defcon make the changes it needs to
 * make to properly defend a room
 *
 * 9. Have some creeps possibly consider tombstones so we can pick up energy from invaders or allies
 * Def want this for remote harvesters, but possibly for workers too
 *
 * 10. Create a thief remote class that goes into enemy remote rooms and takes dropped energy or energy from the container
 * Consider using multiple of these flags to spawn multiple thieves, or consider using multiple of them to create a queue
 * of remote rooms for them to rotate to
 * Flag should be considered "done" after x amount of creep lives in case the enemies spawn defenders we don't wanna keep wasting energy
 *
 * 11. Create harrasser mili class that hit and runs enemy remote rooms and moves on to the next room in the queue before enemy creeps can respond to the threat
 * Can also have a flag that brings the harrasseer in with a thief as a squad to help defend it
 *
 * 12. Create tower drainer mili class
 * Thoughts to be determined
 *
 * 13. Consider spawning extra workers if X amount of construction sites appear (to assist with new level construction spikes)
 * Also make the system that spawns more workers in the case of remote rooms more reliable and cleanly coded (combine these systems preferrably)
 * into a function like getExtraWorkerAmount: number and add to the base amount of workers for that room state
 *
 * 14. Expand tower targeting to target non-combat creeps if no other targets are found, we might as well snipe out scouts
 * Still do not target solo healers (maybe consider it if we calculate our damage (we have a function for that, thanks bonzai)
 * and find that we can out damage the amount of healing on a creep and those around it)
 *
 * The only job list that updates from old values atm is sourceJobs.
 * I need to update every other queue to refresh in one of two ways
 *
 * 1) Jobs that are amount sensitive, such as filling extensions, spawns, turrets etc need to be handled in a precise way
 *  -- I need to loop through each creep in the room and check if they are targetting that structure and have the appropriate job type in memory
 * -- essentially I loop through and recreate the effects of updateJobMemory (I might be able to even just call updateJobMemory if I do it right)
 *
 * 2) Jobs that are not amount sensitive, e.g. upgrading controller, constructing a building
 * -- I need to basically create a new job and compare it to the old job
 *  - If old job has a higher number (e.g. more hits remaining to completely being built) than new job, I use the new job completely.
 * -- If new job has a higher number than old job, I use old job completely
 *
 *
 * ~~~~~~~~~~~~~~~~
 * ~~ BUG FIXES ~~
 * ~~~~~~~~~~~~~~~~
 *
 * 1. Harvesters fill themselves on storage and put it right back again, same issue as last code base, and they were doing it while energy was in the containers
 * Need to expand rules for when they should use storage in their get energy jobs method
 *
 * 3. Ramparts are being left to decay as their job is too low on the totem pole
 * Need to raise them up, the idea from Brock was structures under 25% get precedence over construction
 * Good idea in general and easy to do with how our jobs are structured
 *
 * 4. Rework how we are getting military limits to fit how the other ones work
 *    We need a way to make sure a flag only effects the limits while its active,
 *    so we need to get all active attack flags (should only be 1 at a time tho)
 *    and set the limits accordingly all in the same method then return that to do the adjusting
 *
 * 5. Zealot spawned with no target room, need to figure out why getTargetRoom for creep memory set up is going wrong
 *
 * 6. Option flags throw an error regardless if they are processed or not
 * Place an option flag to recreate
 *
 * 7. Stimulate flags don't process at all
 * Place a stimulate flag to recreate
 *
 * 8. Towers do not fire the last shot to kill invaders, only seen this happen once
 * To recreate, spawn a big boosted invader and the tower will stop on the final attack
 * and the defcon level will go down. This is most likely related to how we are getting the defcon level
 * because towers won't even attempt to target anything if the defcon level is 0
 * So start by looking in how we're getting defcon and make sure we keep it that level until every creep is dead
 *
 * 8. Even worse, just had an invasion and my targets didn't even fire once. Either defcon isn't getting set properly or they aren't finding their target properly.
 * Not sure how to recreate, as they seem to respond to invasions, but it happens frequently enough where i lost 200 creep parts in last 24 hours
 */

import EmpireManager from "Managers/EmpireManager";
import MemoryManager from "Managers/MemoryManagement";
import RoomManager from "Managers/RoomManager";
import SpawnManager from "Managers/SpawnManager";
import { ErrorMapper } from "utils/ErrorMapper";
import UtilHelper from "Helpers/UtilHelper";
import RoomVisualManager from "Managers/RoomVisuals/RoomVisualManager";
import {
    ROOM_OVERLAY_ON,
    CREEP_MANAGER_BUCKET_LIMIT,
    SPAWN_MANAGER_BUCKET_LIMIT,
    EMPIRE_MANAGER_BUCKET_LIMIT,
    ROOM_MANAGER_BUCKET_LIMIT,
    MEMORY_MANAGER_BUCKET_LIMIT
} from "utils/config";
import CreepManager from "Managers/CreepManager";
import { ConsoleCommands } from "Helpers/ConsoleCommands";
import RoomHelper from "Helpers/RoomHelper";

export const loop = ErrorMapper.wrapLoop(() => {
    // Init console commands
    ConsoleCommands.init();

    if (RoomHelper.excecuteEveryTicks(1000)) {
        ConsoleCommands.init();
    }

    // run the empire
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > EMPIRE_MANAGER_BUCKET_LIMIT) {
        try {
            EmpireManager.runEmpireManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }

    // run rooms
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > ROOM_MANAGER_BUCKET_LIMIT) {
        try {
            RoomManager.runRoomManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }

    // run spawning
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > SPAWN_MANAGER_BUCKET_LIMIT) {
        try {
            SpawnManager.runSpawnManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }

    // run creeps
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > CREEP_MANAGER_BUCKET_LIMIT) {
        try {
            CreepManager.runCreepManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }

    // clean up memory
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > MEMORY_MANAGER_BUCKET_LIMIT) {
        try {
            MemoryManager.runMemoryManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }

    // Display room visuals if we have a fat enough bucket and config option allows it
    if (!Game.cpu["bucket"] || (Game.cpu["bucket"] > 2000 && ROOM_OVERLAY_ON)) {
        try {
            RoomVisualManager.runRoomVisualManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }
    // -------- end managers --------
});
