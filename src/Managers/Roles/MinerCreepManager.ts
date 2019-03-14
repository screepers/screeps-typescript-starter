import CreepRoleManagerParent from "./CreepRoleManagerParent";
import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN
} from "utils/constants";

// Manager for the miner creep role
export default class MinerCreepManager extends CreepRoleManagerParent {

    /**
     * run the miner creep, overrides runCreepRole in parent class
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {

        const working: boolean = creep.memory.working;
        const room: Room = Game.rooms[creep.memory.homeRoom];
        let targetID: string | null;
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

        // Creep is not yet working, find an open source job for it
        const sourceJob: GetEnergyJob | undefined = _.find(MemoryApi.getAllGetEnergyJobs(room,
            (job: GetEnergyJob) => !job.isTaken && job.targetType === "source"
        ));

        if (sourceJob) {
            CreepDomesticApi.moveToMiningContainerOrSource(creep, job as GetEnergyJob);
            creep.memory.job = sourceJob;
            creep.memory.working = true;
        }
        // ------- End of not working state
    }
}
