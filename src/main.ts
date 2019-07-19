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
 * TODO Complete Remote Job Creation - Need to get the rooms that need something done
 *
 * 1. Migrate some of the getJob functions from CreepManagers to Creep.Api to make code accessible by other CreepManagers
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
 * 8. Create a dismantler class, for example theres a room above me with 10m on ramparts, but its a dead room, and storage
 * has 1 mil in it. At this level I can make a 20 work, 6 move creep that could slice through the ramparts at a decent rate
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
 * ~~~~~~~~~~~~~~~~
 * ~~ BUG FIXES ~~
 * ~~~~~~~~~~~~~~~~
 *
 * 2. It spawns 2 reservers when a remote room is placed, due to it not detecting the first one targeting the room yet.
 *
 * 3. UpgraderLink does not set itself in room memory - It should choose the one closest to spawn
 *          To be more useable, it should also reset if there is a closer link placed. This follows our rule of not forcing a gameplay style.
 *
 */

/**
 * fix red + brown spawning squad instead of stalker solo
 *
 * start with zealot and examine its attack code, look for bugs
 *
 * fix squad stuff (after stalker examinization obv)
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
    MEMORY_MANAGER_BUCKET_LIMIT,
    EVENT_MANAGER_BUCKET_LIMIT,
    ROOM_OVERLAY_BUCKET_LIMIT
} from "utils/config";
import CreepManager from "Managers/CreepManager";
import { ConsoleCommands } from "Helpers/ConsoleCommands";
import RoomHelper from "Helpers/RoomHelper";
import EventManager from "Managers/EventManager";

// Define prototypes
import "./proto/structures.prototype";

export const loop = ErrorMapper.wrapLoop(() => {

    if (RoomHelper.excecuteEveryTicks(1000)) {
        ConsoleCommands.init();
    }

    // clean up memory
    if (!Game.cpu["bucket"] || Game.cpu["bucket"] > MEMORY_MANAGER_BUCKET_LIMIT) {
        try {
            MemoryManager.runMemoryManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
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


    // Display room visuals if we have a fat enough bucket and config option allows it
    if (!Game.cpu["bucket"] || (Game.cpu["bucket"] > ROOM_OVERLAY_BUCKET_LIMIT && ROOM_OVERLAY_ON)) {
        try {
            RoomVisualManager.runRoomVisualManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }

    // Display room visuals if we have a fat enough bucket and config option allows it
    if (!Game.cpu["bucket"] || (Game.cpu["bucket"] > EVENT_MANAGER_BUCKET_LIMIT)) {
        try {
            EventManager.runEventManager();
        } catch (e) {
            UtilHelper.printError(e);
        }
    }
    // -------- end managers --------
});
