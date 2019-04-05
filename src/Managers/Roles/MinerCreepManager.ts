import MemoryApi from "../../Api/Memory.Api";
import CreepApi from "Api/Creep.Api";
import { ROLE_MINER } from "utils/constants";
import CreepHelper from "Helpers/CreepHelper";
import RoomApi from "Api/Room.Api";
import UtilHelper from "Helpers/UtilHelper";
import Normalize from "Helpers/Normalize";
import MemoryHelper from "Helpers/MemoryHelper";
import { MINERS_GET_CLOSEST_SOURCE } from "utils/config";

// Manager for the miner creep role
export default class MinerCreepManager {
    /**
     * Run the miner creep
     * @param creep The creep to run
     */
    public static runCreepRole(creep: Creep): void {
        if (creep.spawning) {
            return; // Don't do anything until you've spawned
        }

        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = CreepApi.getNewSourceJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }

            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep, homeRoom);
        }

        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }

            CreepApi.travelTo(creep, creep.memory.job);
        }
    }

    /**
     * Handle initalizing a new job
     */
    public static handleNewJob(creep: Creep, room: Room): void {
        // Update room memory to reflect the new job
        MemoryApi.updateJobMemory(creep, room);

        const miningContainer = CreepHelper.getMiningContainer(
            creep.memory.job as GetEnergyJob,
            Game.rooms[creep.memory.homeRoom]
        );

        if (miningContainer === undefined) {
            return; // We don't need to do anything else if the container doesn't exist
        }

        // Check for any creeps on the miningContainer
        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);

        if (creepsOnContainer.length > 0) {
            // If the creep on the container is a miner (and not some random creep that's in the way)
            if (creepsOnContainer[0].memory.role === ROLE_MINER) {
                return; // Don't target it
            }
        }

        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }

        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
