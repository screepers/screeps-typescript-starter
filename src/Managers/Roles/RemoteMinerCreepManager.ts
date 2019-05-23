import MemoryApi from "../../Api/Memory.Api";
import CreepApi from "Api/Creep.Api";
import CreepHelper from "Helpers/CreepHelper";
import { ROLE_REMOTE_MINER } from "utils/constants";

// Manager for the miner creep role
export default class RemoteMinerCreepManager {
    /**
     * Run the remote miner creep
     * @param creep The creep to run
     */
    public static runCreepRole(creep: Creep): void {
        if (creep.spawning) {
            return; // Don't do anything until you've spawned
        }

        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];
        const targetRoom = Game.rooms[creep.memory.targetRoom];

        if (targetRoom && targetRoom.memory.defcon > 0) {
            // Flee Here
        }

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep);

            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }

            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep);
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
     * Get new job for the creep
     */
    public static getNewJob(creep: Creep): BaseJob | undefined {
        if (creep.room.name === creep.memory.targetRoom) {
            const targetRoom = Game.rooms[creep.memory.targetRoom];
            return CreepApi.getNewSourceJob(creep, targetRoom);
        } else if (creep.room.name !== creep.memory.targetRoom) {
            return CreepApi.newMovePartJob(creep, creep.memory.targetRoom);
        }

        return undefined;
    }

    /**
     * Handle initalizing a new job
     */
    public static handleNewJob(creep: Creep): void {
        const targetRoom: Room = Game.rooms[creep.memory.targetRoom];
        if (creep.memory.job!.jobType === "movePartJob") {
            return;
        }

        MemoryApi.updateJobMemory(creep, targetRoom);

        const miningContainer = CreepHelper.getMiningContainer(
            creep.memory.job as GetEnergyJob,
            Game.rooms[creep.memory.targetRoom]
        );

        if (miningContainer === undefined) {
            return; // We don't need to do anything else if the container doesn't exist
        }

        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);

        if (creepsOnContainer.length > 0) {
            if (creepsOnContainer[0].memory.role === ROLE_REMOTE_MINER) {
                return; // If there is already a miner creep on the container, then we don't target it
            }
        }

        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }

        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
