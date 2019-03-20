import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepHelper from "Helpers/CreepHelper";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN
} from "utils/constants";

// Manager for the miner creep role
export default class RemoteReserverCreepManager {

    /**
     * run the remote reserver creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {

        if (creep.spawning) {
            return; // Don't do anything until you've spawned
        }

        const targetRoom: Room = Game.rooms[creep.memory.targetRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewClaimJob(creep, targetRoom);

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
    public static getNewClaimJob(creep: Creep, room: Room): ClaimPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.claim) {
            const claimJob = MemoryApi.getClaimJobs(room, (sjob: ClaimPartJob) => !sjob.isTaken);
            if (claimJob.length > 0) {
                return claimJob[0];
            }
        }
        return undefined;
    }

    /**
     * Handle initalizing a new job
     */
    public static handleNewJob(creep: Creep): void {
        // set is taken to true
    }
}
