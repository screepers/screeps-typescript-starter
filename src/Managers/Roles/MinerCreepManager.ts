import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import { ERROR_WARN, ERROR_ERROR } from "utils/constants";
import GetEnergyJobs from "Jobs/GetEnergyJobs";
import UserException from "utils/UserException";

// Manager for the miner creep role
export default class MinerCreepManager {
    /**
     * run the miner creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {
        const working: boolean = creep.memory.working;
        const room: Room = Game.rooms[creep.memory.homeRoom];
        let job: BaseJob | undefined = creep.memory.job;

        // If the creep is already working, mine the source they are already targeting
        if (working && job !== undefined) {
            switch (job.jobType) {
                case "getEnergyJob":
                    this.runGetEnergyJob(creep, job as GetEnergyJob);
                    break;

                default:
                    throw new UserException(
                        "Invalid job type for creep",
                        "Invalid job type for creep: " + creep.name + "\n Job: " + JSON.stringify(job),
                        ERROR_ERROR
                    );
            }
        }
        // ---------- End of working state

        if (!job) {
            // Creep is not yet working, find an open source job for it
            job = this.getNewSourceJob(creep, room);
        }

        if (job) {
            this.handleNewJob(creep, job);
        }
        // ------- End of not working state
    }

    /**
     * Perform running operations for a creep with a GetEnergyJob
     * @param creep The creep to run
     * @param job The job to run the creep for
     */
    public static runGetEnergyJob(creep: Creep, job: GetEnergyJob): void {
        if (CreepDomesticApi.isOnMiningContainerOrSource(creep, job as GetEnergyJob)) {
            CreepApi.doWork_GetEnergyJob(creep, job);
            return;
        }
        CreepDomesticApi.moveToMiningContainerOrSource(creep, job as GetEnergyJob);
    }

    /**
     * Find a job for the creep
     */
    public static getNewSourceJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        return _.find(
            MemoryApi.getAllGetEnergyJobs(room, (sJob: GetEnergyJob) => !sJob.isTaken && sJob.targetType === "source")
        );
    }

    /**
     * Handle initalizing a new job
     */
    public static handleNewJob(creep: Creep, job: BaseJob): void {
        CreepDomesticApi.moveToMiningContainerOrSource(creep, job as GetEnergyJob);
        creep.memory.job = job;
        creep.memory.working = true;
    }
}
