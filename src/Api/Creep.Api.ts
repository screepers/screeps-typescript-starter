import UtilHelper from "Helpers/UtilHelper";
import UserException from "utils/UserException";


// Api for all types of creeps (more general stuff here)
export default class CreepApi {

    /**
     * do work on the target provided
     * @param job the job the creep should do, undefined if no job yet
     */
    public static doWork(creep: Creep, job: BaseJob | undefined) {

        // If job is undefined, throw error off the bat
        if (!job) {
            throw new UserException(
                "Job Undefined",
                "creep " + creep.name + " can't do work on an undefined job, room [ " + creep.memory.homeRoom + " ] ",
                ERROR_WARN);
        }

        // decide what the target is, and call the appropriate helper function perform the proper action
    }
}
