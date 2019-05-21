import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepHelper from "Helpers/CreepHelper";
import CreepDomestic from "Api/CreepDomestic.Api";
import { ERROR_WARN } from "utils/constants";
import RoomHelper from "Helpers/RoomHelper";
import MemoryHelper_Room from "Helpers/MemoryHelper_Room";
import UserException from "utils/UserException";

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

        if (creep.room.memory.defcon > 0) {
            // Flee code here
        }

        const homeRoom = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            this.getNewReserveJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return;
            }

            this.handleNewJob(creep, creep.memory.job);
        }

        if (creep.memory.working === true) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }

        CreepApi.travelTo(creep, creep.memory.job);
        return;
    }

    /**
     * Find a job for the creep
     */
    public static getNewReserveJob(creep: Creep, room: Room): ClaimPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.claim) {
            const reserveJob = MemoryApi.getReserveJobs(room, (sjob: ClaimPartJob) => !sjob.isTaken);
            if (reserveJob.length > 0) {
                return reserveJob[0];
            }
        }
        return undefined;
    }

    /**
     * Handle initalizing a new job
     */
    public static handleNewJob(creep: Creep, job: ClaimPartJob): void {
        const newJob = MemoryApi.searchClaimPartJobs(job, Game.rooms[creep.memory.homeRoom]);

        if (newJob === undefined) {
            const exception = new UserException(
                "Invalid Job For RemoteReserver",
                "Creep: " + creep.name + "\nJob: " + JSON.stringify(creep.memory.job),
                ERROR_WARN
            );

            delete creep.memory.job;

            throw exception;
        } else {
            newJob.isTaken = true;
        }
    }
}
