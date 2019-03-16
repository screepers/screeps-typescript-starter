import UtilHelper from "Helpers/UtilHelper";
import UserException from "utils/UserException";
import CreepHelper from "Helpers/CreepHelper";

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
     * Do work on the target provided by claimPartJob
     */
    public static doWork_ClaimPartJob(creep: Creep, job: ClaimPartJob) {
        const target = Game.getObjectById(job.targetID);

        this.nullCheck_target(creep, target);

        let returnCode: number;

        if (job.actionType === "claim" && target instanceof StructureController) {
            returnCode = creep.claimController(target);
        } else if (job.actionType === "reserve" && target instanceof StructureController) {
            returnCode = creep.reserveController(target);
        } else if (job.actionType === "sign" && target instanceof StructureController) {
            returnCode = creep.signController(target, CreepHelper.getSigningText());
        } else if (job.actionType === "attack" && target instanceof StructureController) {
            returnCode = creep.attackController(target);
        } else {
            throw this.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
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

        if (job.targetType === "roomPosition") {
            // TODO Change this to parse a string to create a RoomPosition object
            // * Should be something like "25,25,W12S49" that corresponds to x, y, roomName
            // ! Temporary, not used for anything atm, but target needs to be of type RoomPosition.
            target = new RoomPosition(25, 25, creep.memory.homeRoom);
        } else {
            target = Game.getObjectById(job.targetID);
            this.nullCheck_target(creep, target);
        }

        let returnCode: number;

        if (job.actionType === "transfer" && (target instanceof Structure || target instanceof Creep)) {
            returnCode = creep.transfer(target, RESOURCE_ENERGY);
        } else if (job.actionType === "drop" && target instanceof RoomPosition) {
            returnCode = creep.drop(RESOURCE_ENERGY);
        } else {
            throw this.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                break;
            case ERR_NOT_FOUND:
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

        if (job.actionType === "build" && target instanceof ConstructionSite) {
            returnCode = creep.build(target);
        } else if (job.actionType === "repair" && target instanceof Structure) {
            returnCode = creep.repair(target);
        } else if (job.actionType === "upgrade" && target instanceof StructureController) {
            returnCode = creep.upgradeController(target);
        } else {
            throw this.badTarget_Error(creep, job);
        }

        // Can handle the return code here - e.g. display an error if we expect creep to be in range but it's not
        switch (returnCode) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                break;
            case ERR_NOT_FOUND:
                break;
            default:
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
                break;
            case ERR_NOT_IN_RANGE:
                break;
            case ERR_NOT_FOUND:
                break;
            default:
                break;
        }
    }

    /**
     * Checks if the target is null and throws the appropriate error
     */
    public static nullCheck_target(creep: Creep, target: object | null) {
        if (target === null) {
            throw new UserException(
                "Null Job Target",
                "Null Job Target for creep: " + creep.name + "\n The error occurred in: " + this.caller,
                ERROR_ERROR
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
                "] for function [" +
                this.caller +
                "]" +
                "\n Job: " +
                JSON.stringify(job),
            ERROR_ERROR
        );
    }
}
