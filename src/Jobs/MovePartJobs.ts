import { CreepHelper, CreepApi, PathfindingApi } from "utils/internals";

export class MovePartJobs implements IJobTypeHelper {
    public jobType: Valid_JobTypes = "movePartJob";

    constructor() {
        const self = this;
        self.doWork = self.doWork.bind(self);
        self.travelTo = self.travelTo.bind(this);
    }
    /**
     * Travel to the target provided by MovePartJob in creep.memory.job
     */
    public travelTo(creep: Creep, job: BaseJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        CreepApi.nullCheck_target(creep, moveTarget);

        const moveOpts = PathfindingApi.GetDefaultMoveOpts();

        if (job.targetType === "roomName") {
            // 23 should get us inside the room and off the exit
            moveOpts.range = 23;
        } else if (job.targetType === "roomPosition") {
            moveOpts.range = 0;
        }

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return;
        }

        creep.moveTo(moveTarget!, moveOpts);
        return;
    }

    /**
     * Do work on the target provided by workPartJob
     * * We may need to flesh this method out to accomodate future usage
     * @param creep The creep to do the work
     * @param job The job to perform work on
     */
    public doWork(creep: Creep, job: BaseJob) {
        // If we are in here then that means that we have either reached the roomPosition
        // or are in the specified roomName
        delete creep.memory.job;
        creep.memory.working = false;
    }
}
