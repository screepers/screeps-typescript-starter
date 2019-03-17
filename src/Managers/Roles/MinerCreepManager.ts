import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import { ERROR_WARN, ERROR_ERROR, ROLE_MINER } from "utils/constants";
import GetEnergyJobs from "Jobs/GetEnergyJobs";
import UserException from "utils/UserException";
import CreepManager from "Managers/CreepManager";
import CreepHelper from "Helpers/CreepHelper";

// Manager for the miner creep role
export default class MinerCreepManager {
    /**
     * Run the miner creep
     * @param creep The creep to run
     */
    public static runCreepRole(creep: Creep): void {

        if(creep.spawning){
            return; // Don't do anything until you've spawned
        }

        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewSourceJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }

            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep);
        }

        if (creep.memory.working === true) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }

        CreepApi.travelTo(creep, creep.memory.job);
    }

    /**
     * Find a job for the creep
     */
    public static getNewSourceJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        // TODO change this to check creep options to filter jobs -- e.g. If creep.options.harvestSources = true then we can get jobs where actionType = "harvest" and targetType = "source"
        const sourceJobs = MemoryApi.getSourceJobs(room, (sjob: GetEnergyJob) => !sjob.isTaken);

        if (sourceJobs.length > 0) {
            return sourceJobs[0];
        } else {
            return undefined;
        }
    }

    /**
     * Handle initalizing a new job
     */
    public static handleNewJob(creep: Creep): void {
        const miningContainer = CreepHelper.getMiningContainer(
            creep.memory.job as GetEnergyJob,
            Game.rooms[creep.memory.homeRoom]
        );

        if (miningContainer === undefined) {
            return; // We don't need to do anything else if the container doesn't exist
        }

        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);

        if (creepsOnContainer.length > 0) {
            if (creepsOnContainer[0].memory.role === ROLE_MINER) {
                return; // If there is already a miner creep on the container, then we don't target it
            }
        }

        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }

        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
