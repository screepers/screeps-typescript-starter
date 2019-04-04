import UserException from "utils/UserException";
import CreepHelper from "Helpers/CreepHelper";
import {
    DEFAULT_MOVE_OPTS,
    ERROR_ERROR,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTRO,
    ROLE_MINER,
    ERROR_WARN
} from "utils/constants";

// Api for all types of creeps (more general stuff here)
export default class CreepApi {
    /**
     * Call the proper doWork function based on job.jobType
     */
    public static doWork(creep: Creep, job: BaseJob) {
        switch (job.jobType) {
            case "getEnergyJob":
                this.doWork_GetEnergyJob(creep, job as GetEnergyJob);
                break;
            case "carryPartJob":
                this.doWork_CarryPartJob(creep, job as CarryPartJob);
                break;
            case "claimPartJob":
                this.doWork_ClaimPartJob(creep, job as ClaimPartJob);
                break;
            case "workPartJob":
                this.doWork_WorkPartJob(creep, job as WorkPartJob);
                break;
            default:
                throw new UserException(
                    "Bad job.jobType in CreepApi.doWork",
                    "The jobtype of the job passed to CreepApi.doWork was invalid.",
                    ERROR_FATAL
                );
        }
    }

    /**
     * Call the proper travelTo function based on job.jobType
     */
    public static travelTo(creep: Creep, job: BaseJob) {
        switch (job.jobType) {
            case "getEnergyJob":
                this.travelTo_GetEnergyJob(creep, job as GetEnergyJob);
                break;
            case "carryPartJob":
                this.travelTo_CarryPartJob(creep, job as CarryPartJob);
                break;
            case "claimPartJob":
                this.travelTo_ClaimPartJob(creep, job as ClaimPartJob);
                break;
            case "workPartJob":
                this.travelTo_WorkPartJob(creep, job as WorkPartJob);
                break;
            default:
                throw new UserException(
                    "Bad job.jobType in CreepApi.travelTo",
                    "The jobtype of the job passed to CreepApi.travelTo was invalid",
                    ERROR_FATAL
                );
        }
    }

    /**
     * Do work on the target provided by claimPartJob
     */
    public static doWork_ClaimPartJob(creep: Creep, job: ClaimPartJob) {
        const target = Game.getObjectById(job.targetID);
        this.nullCheck_target(creep, target);

        let deleteOnSuccess = true;

        let returnCode: number;

        if (job.actionType === "claim" && target instanceof StructureController) {
            returnCode = creep.claimController(target);
        } else if (job.actionType === "reserve" && target instanceof StructureController) {
            returnCode = creep.reserveController(target);
            deleteOnSuccess = false;
        } else if (job.actionType === "sign" && target instanceof StructureController) {
            returnCode = creep.signController(target, CreepHelper.getSigningText());
        } else if (job.actionType === "attack" && target instanceof StructureController) {
            returnCode = creep.attackController(target);
            deleteOnSuccess = false;
        } else {
            throw this.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            default:
                break;
        }
    }

    /**
     * Do work on the target provided by carryPartJob
     */
    public static doWork_CarryPartJob(creep: Creep, job: CarryPartJob) {
        let target;

        target = Game.getObjectById(job.targetID);

        this.nullCheck_target(creep, target);

        let returnCode: number;
        let deleteOnSuccess: boolean = false;

        if (job.actionType === "transfer" && (target instanceof Structure || target instanceof Creep)) {
            deleteOnSuccess = true;
            returnCode = creep.transfer(target, RESOURCE_ENERGY);
        } else {
            throw this.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful, delete the job from creep memory
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            case ERR_NOT_ENOUGH_ENERGY:
            case ERR_FULL:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                break;
        }
    }

    /**
     * Do work on the target provided by workPartJob
     */
    public static doWork_WorkPartJob(creep: Creep, job: WorkPartJob) {
        const target = Game.getObjectById(job.targetID);

        this.nullCheck_target(creep, target);

        let returnCode: number;
        let deleteOnSuccess: boolean = false;

        if (job.actionType === "build" && target instanceof ConstructionSite) {
            returnCode = creep.build(target);
            if (!target || creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        } else if (job.actionType === "repair" && target instanceof Structure) {
            returnCode = creep.repair(target);
            if (target.hits === target.hitsMax || creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        } else if (job.actionType === "upgrade" && target instanceof StructureController) {
            returnCode = creep.upgradeController(target);
            if (creep.carry.energy === 0) {
                deleteOnSuccess = true;
            }
        } else {
            throw this.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful and creep is empty, delete the job from creep memory
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                if (deleteOnSuccess) {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
        }
    }

    /**
     * Do work on the target provided by a getEnergyJob
     */
    public static doWork_GetEnergyJob(creep: Creep, job: GetEnergyJob) {
        const target = Game.getObjectById(job.targetID);

        this.nullCheck_target(creep, target);

        let returnCode: number;

        if (job.actionType === "harvest" && (target instanceof Source || target instanceof Mineral)) {
            returnCode = creep.harvest(target);
        } else if (job.actionType === "pickup" && target instanceof Resource) {
            returnCode = creep.pickup(target);
        } else if (job.actionType === "withdraw" && target instanceof Structure) {
            returnCode = creep.withdraw(target, RESOURCE_ENERGY);
        } else {
            throw this.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                // If successful and not harvesting, delete the job from creep memory
                // * If we run into not being able to stop harvesting minerals, my best solution is to seperate
                // * the above "instanceof Source | Mineral" into two different if statements, and use a boolean to decide to delete when successful.
                if (job.actionType !== "harvest") {
                    delete creep.memory.job;
                    creep.memory.working = false;
                }
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.working = false;
                break;
            case ERR_NOT_FOUND:
                break;
            case ERR_FULL:
                delete creep.memory.job;
                creep.memory.working = false;
                break;
            default:
                break;
        }
    }

    /**
     * Travel to the target provided by GetEnergyJob in creep.memory.job
     */
    public static travelTo_GetEnergyJob(creep: Creep, job: GetEnergyJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        this.nullCheck_target(creep, moveTarget);

        // Move options target
        const moveOpts: MoveToOpts = DEFAULT_MOVE_OPTS;

        // In this case all actions are complete with a range of 1, but keeping for structure
        if (job.actionType === "harvest" && (moveTarget instanceof Source || moveTarget instanceof Mineral)) {
            moveOpts.range = 1;
        } else if (job.actionType === "harvest" && moveTarget instanceof StructureContainer) {
            moveOpts.range = 0;
        } else if (job.actionType === "withdraw" && (moveTarget instanceof Structure || moveTarget instanceof Creep)) {
            moveOpts.range = 1;
        } else if (job.actionType === "pickup" && moveTarget instanceof Resource) {
            moveOpts.range = 1;
        }

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return; // If we are in range to the target, then we do not need to move again, and next tick we will begin work
        }

        creep.moveTo(moveTarget!, moveOpts);
    }

    /**
     * Travel to the target provided by CarryPartJob in creep.memory.job
     */
    public static travelTo_CarryPartJob(creep: Creep, job: CarryPartJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        this.nullCheck_target(creep, moveTarget);

        // Move options for target
        const moveOpts = DEFAULT_MOVE_OPTS;

        if (job.actionType === "transfer" && (moveTarget instanceof Structure || moveTarget instanceof Creep)) {
            moveOpts.range = 1;
        } // else range = 0;

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return;
        }

        creep.moveTo(moveTarget!, moveOpts);
        return;
    }

    /**
     * Travel to the target provided by ClaimPartJob in creep.memory.job
     */
    public static travelTo_ClaimPartJob(creep: Creep, job: ClaimPartJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        this.nullCheck_target(creep, moveTarget);

        // Move options for target
        const moveOpts = DEFAULT_MOVE_OPTS;

        // All actiontypes that affect controller have range of 1
        if (moveTarget instanceof StructureController) {
            moveOpts.range = 1;
        }

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return;
        }

        creep.moveTo(moveTarget!, moveOpts);
        return;
    }

    /**
     * Travel to the target provided by WorkPartJob in creep.memory.job
     */
    public static travelTo_WorkPartJob(creep: Creep, job: WorkPartJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        this.nullCheck_target(creep, moveTarget);

        // Move options for target
        const moveOpts = DEFAULT_MOVE_OPTS;

        if (job.actionType === "build" && moveTarget instanceof ConstructionSite) {
            moveOpts.range = 1;
        } else if (job.actionType === "repair" && moveTarget instanceof Structure) {
            moveOpts.range = 1;
        } else if (job.actionType === "upgrade" && moveTarget instanceof StructureController) {
            moveOpts.range = 3;
        }

        if (creep.pos.getRangeTo(moveTarget!) <= moveOpts.range!) {
            creep.memory.working = true;
            return;
        }

        creep.moveTo(moveTarget!, moveOpts);
        return;
    }

    /**
     * Checks if the target is null and throws the appropriate error
     */
    public static nullCheck_target(creep: Creep, target: object | null) {
        if (target === null) {
            // preserve for the error message
            const jobAsString: string = JSON.stringify(creep.memory.job);

            delete creep.memory.job;
            creep.memory.working = false;

            if (creep.memory.supplementary && creep.memory.supplementary.moveTarget) {
                delete creep.memory.supplementary.moveTarget;
            }

            throw new UserException(
                "Null Job Target",
                "Null Job Target for creep: " + creep.name + "\nJob: " + jobAsString,
                ERROR_WARN
            );
        }
    }

    /**
     * Throws an error that the job actionType or targetType is invalid for the job type
     */
    public static badTarget_Error(creep: Creep, job: BaseJob) {
        return new UserException(
            "Invalid Job actionType or targetType",
            "An invalid actionType or structureType has been provided by creep [" +
                creep.name +
                "]" +
                "\n Job: " +
                JSON.stringify(job),
            ERROR_ERROR
        );
    }

    /**
     * move the creep off of the exit tile
     * @param creep the creep we are moving
     * @returns if the creep had to be moved
     */
    public static moveCreepOffExit(creep: Creep): boolean {
        const x: number = creep.pos.x;
        const y: number = creep.pos.y;

        if (x === 0) {
            creep.move(RIGHT);
            return true;
        }
        if (y === 0) {
            creep.move(BOTTOM);
            return true;
        }
        if (x === 49) {
            creep.move(LEFT);
            return true;
        }
        if (y === 49) {
            creep.move(TOP);
            return true;
        }

        // Creep is not on exit tile
        return false;
    }
}
