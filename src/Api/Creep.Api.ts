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
                ERROR_WARN
            );
        }

        // decide what the target is, and call the appropriate helper function perform the proper action
    }

    /**
     * Do work on the target provided by a getEnergyJob
     */
    public static doWork_GetEnergyJob(creep: Creep, job: GetEnergyJob) {
        const target = Game.getObjectById(job.targetID);

        if (target === null) {
            throw new UserException(
                "Invalid Job Target",
                "Invalid Job Target for creep: " + creep.name + "\n The error occurred in: doWork_GetEnergyJob()",
                ERROR_ERROR
            );
        }

        if (job.targetType === "source" || job.targetType === "extractor") {
            creep.harvest(target as Source | Mineral);
        } else if (job.targetType === "droppedResource") {
            creep.pickup(target as Resource);
        } else {
            creep.withdraw(target as Structure, RESOURCE_ENERGY);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
    }
}
