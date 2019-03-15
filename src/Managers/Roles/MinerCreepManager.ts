import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN
} from "utils/constants";


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
        if (working) {
            if (CreepDomesticApi.isOnMiningContainerOrSource(creep, job as GetEnergyJob)) {
                CreepApi.doWork(creep, job);
                return;
            }
            CreepDomesticApi.moveToMiningContainerOrSource(creep, job as GetEnergyJob);
        }
        // ---------- End of working state

        if (!job) {
            // Creep is not yet working, find an open source job for it
            job = _.find(MemoryApi.getAllGetEnergyJobs(room,
                (sJob: GetEnergyJob) => !sJob.isTaken && sJob.targetType === "source"
            ));
        }

        if (job) {
            CreepDomesticApi.moveToMiningContainerOrSource(creep, job as GetEnergyJob);
            creep.memory.job = job;
            creep.memory.working = true;
        }
        // ------- End of not working state
    }
}
