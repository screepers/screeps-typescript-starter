import {
    ERROR_WARN,
} from "utils/constants";
import UserException from "utils/UserException";
import MemoryApi from "Api/Memory.Api";

// helper function for creeps
export default class CreepHelper {

    /**
     * get the mining container for a specific job
     * @param job the job we are getting the mining container from
     * @param room the room we are checking in
     */
    public static getMiningContainer(job: GetEnergyJob | undefined, room: Room): StructureContainer | undefined {
        if (!job) {
            throw new UserException(
                "Job is undefined",
                "Job is undefined for creep " + room.name + ", can't move to mining container.",
                ERROR_WARN);
        }

        const source: Source | null = Game.getObjectById(job.targetID);
        if (!source) {
            throw new UserException("Source null in getMiningContainer", "room: " + room.name, ERROR_WARN);
        }

        const containers: StructureContainer[] = MemoryApi.getStructureOfType(room, STRUCTURE_CONTAINER) as StructureContainer[];
        const closestContainer = source.pos.findClosestByRange(containers);

        if (!closestContainer) {
            return undefined;
        }
        else {
            return closestContainer;
        }
    }
}
