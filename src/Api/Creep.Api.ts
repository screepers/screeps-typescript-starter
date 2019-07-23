import UserException from "utils/UserException";
import CreepHelper from "Helpers/CreepHelper";
import {
    DEFAULT_MOVE_OPTS,
    ERROR_ERROR,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTRO,
    ROLE_MINER,
    ERROR_WARN,
    ERROR_FATAL
} from "utils/constants";
import MemoryApi from "./Memory.Api";
import { MINERS_GET_CLOSEST_SOURCE, RAMPART_HITS_THRESHOLD, STUCK_COUNT_LIMIT, USE_STUCK_VISUAL } from "utils/config";
import MemoryHelper from "Helpers/MemoryHelper";
import UtilHelper from "Helpers/UtilHelper";
import RoomVisualApi from "Managers/RoomVisuals/RoomVisual.Api";
import RoomVisualManager from "Managers/RoomVisuals/RoomVisualManager";
import RoomVisualHelper from "Managers/RoomVisuals/RoomVisualHelper";

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
            case "movePartJob":
                this.doWork_MovePartJob(creep, job as MovePartJob);
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
        // Perform Stuck Detection - Delete old path if stuck
        if (this.isCreepStuck(creep)) {
            delete creep.memory._move;
        }

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
            case "movePartJob":
                this.travelTo_MovePartJob(creep, job as MovePartJob);
                break;
            default:
                throw new UserException(
                    "Bad job.jobType in CreepApi.travelTo",
                    "The jobtype of the job passed to CreepApi.travelTo was invalid" +
                    "\nCreep: " +
                    creep.name +
                    "\n Job Type: " +
                    job.jobType,
                    ERROR_FATAL
                );
        }
    }

    /**
     * Prepare stuck detection each tick, return true if stuck, false if not.
     * @param creep
     */
    public static isCreepStuck(creep: Creep): boolean {
        if (!creep.memory._move) {
            return false; // Creep has not found a path yet
        }

        const currPosition: string = creep.pos.x.toString() + creep.pos.y.toString() + creep.room.name;

        if (!creep.memory._move.lastPosition) {
            creep.memory._move.lastPosition = currPosition;
            creep.memory._move.stuckCount = 0;
            return false; // Creep is moving for the first time
        }

        if (creep.memory._move.lastPosition !== currPosition) {
            creep.memory._move.lastPosition = currPosition;
            creep.memory._move.stuckCount = 0;
            return false; // Creep has moved since last tick
        } else {
            // Creep hasn't moved since last tick
            if (creep.fatigue === 0) {
                creep.memory._move.stuckCount++;
            }

            // Visualize if wanted
            if (USE_STUCK_VISUAL) {
                RoomVisualHelper.visualizeStuckCreep(creep);
            }

            if (creep.memory._move.stuckCount > STUCK_COUNT_LIMIT) {
                return true; // Creep is stuck
            } else {
                return false; // Creep is not stuck yet
            }
        }
    }

    /**
     * Do work on the target provided by claimPartJob
     */
    public static doWork_ClaimPartJob(creep: Creep, job: ClaimPartJob) {
        let target: any;

        if (job.targetType === "roomName") {
            if (creep.memory.supplementary && creep.memory.supplementary.moveTargetID) {
                target = Game.getObjectById(creep.memory.supplementary.moveTargetID);
            } else {
                target = null;
            }
        } else {
            target = Game.getObjectById(job.targetID);
        }

        this.nullCheck_target(creep, target);

        let deleteOnSuccess = true;

        let returnCode: number;

        if (job.actionType === "claim" && target instanceof StructureController) {
            returnCode = creep.claimController(target);
        } else if (job.actionType === "reserve" && target instanceof StructureController) {
            returnCode = creep.reserveController(target);
            deleteOnSuccess = false; // don't delete job since we do this until death
        } else if (job.actionType === "sign" && target instanceof StructureController) {
            returnCode = creep.signController(target, CreepHelper.getSigningText());
        } else if (job.actionType === "attack" && target instanceof StructureController) {
            returnCode = creep.attackController(target);
            deleteOnSuccess = false; // Do this until death
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
        let target: any;

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
        const target: any = Game.getObjectById(job.targetID);

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
     * Do work on the target provided by workPartJob
     * * We may need to flesh this method out to accomodate future usage
     * @param creep The creep to do the work
     * @param job The job to perform work on
     */
    public static doWork_MovePartJob(creep: Creep, job: MovePartJob) {
        // If we are in here then that means that we have either reached the roomPosition
        // or are in the specified roomName
        delete creep.memory.job;
        creep.memory.working = false;
    }

    /**
     * Do work on the target provided by a getEnergyJob
     */
    public static doWork_GetEnergyJob(creep: Creep, job: GetEnergyJob) {
        const target: any = Game.getObjectById(job.targetID);

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
        moveOpts.reusePath = 999;

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
        moveOpts.reusePath = 999;

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
        // Remove supplementary.moveTarget if we are not in room with controller - Safety
        if (job.targetType === "roomName" && job.targetID !== creep.pos.roomName) {
            if (creep.memory.supplementary) {
                delete creep.memory.supplementary!.moveTarget;
            }
        }

        // Will return a roomPosition in this case, or controller if we have that targeted instead
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        this.nullCheck_target(creep, moveTarget);

        // Move options for target
        const moveOpts = DEFAULT_MOVE_OPTS;
        moveOpts.reusePath = 999;

        // All actiontypes that affect controller have range of 1
        if (moveTarget instanceof StructureController) {
            moveOpts.range = 1;
        } else if (moveTarget instanceof RoomPosition) {
            moveOpts.range = 0;
        }

        // If target is roomPosition then we know we want the controller
        // So as soon as we get in room we set supplementaryTarget
        if (job.targetType === "roomName" && creep.pos.roomName === job.targetID) {
            if (CreepApi.moveCreepOffExit(creep)) {
                return;
            }

            const targetRoom = Game.rooms[job.targetID];

            // If there is a controller, set it as supplementary room target
            if (targetRoom.controller) {
                if (!creep.memory.supplementary) {
                    creep.memory.supplementary = {};
                }
                creep.memory.supplementary.moveTargetID = targetRoom.controller.id;
            } else {
                throw new UserException(
                    "No controller in room",
                    "There is no controller in room: " + job.targetID + "\nCreep: " + creep.name,
                    ERROR_WARN
                );
            }
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
        moveOpts.reusePath = 999;

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
     * Travel to the target provided by MovePartJob in creep.memory.job
     */
    public static travelTo_MovePartJob(creep: Creep, job: MovePartJob) {
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        this.nullCheck_target(creep, moveTarget);

        const moveOpts = DEFAULT_MOVE_OPTS;
        moveOpts.reusePath = 999;

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

    public static creepShouldFlee(creep: Creep): boolean {
        const targetRoom = creep.memory.targetRoom;

        if (Memory.rooms[targetRoom] === undefined) {
            // If we don't know the state of the room, we have no way of knowing but to check
            return false;
        }

        return Memory.rooms[targetRoom].defcon > 1;
    }
    /**
     * Flee from remoteRoom - Called when defcon is > 1
     * @param creep The creep to flee
     * @param homeRoom The homeRoom of the creep
     */
    public static fleeRemoteRoom(creep: Creep, homeRoom: Room): void {
        // If we are in home room, idle until we no longer need to flee
        if (creep.room.name === homeRoom.name) {
            creep.memory.working = true; // Mark as working for pathing purposes
            CreepApi.moveCreepOffExit(creep);
            return;
        }
        // If we are not in homeRoom, but our job is to move to homeRoom, then do so
        if (creep.memory.job && creep.memory.job.targetID === homeRoom.name) {
            this.travelTo(creep, creep.memory.job);
            return;
        }

        // Clean out old job data
        delete creep.memory.job;
        creep.memory.working = false;
        if (creep.memory.supplementary) {
            delete creep.memory.supplementary.moveTargetID;
        }

        // Set new move job to homeRoom
        creep.memory.job = {
            jobType: "movePartJob",
            targetType: "roomName",
            targetID: creep.memory.homeRoom,
            actionType: "move",
            isTaken: false
        };
    }

    /**********************************************************/
    /*        GET NEW JOB SECTION                           ***/
    /**********************************************************/

    /**
     * Gets a new WorkPartJob for worker
     */
    public static newWorkPartJob(creep: Creep, room: Room): WorkPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;
        const upgradeJobs = MemoryApi.getUpgradeJobs(room, (job: WorkPartJob) => !job.isTaken);
        const isCurrentUpgrader: boolean = _.some(
            MemoryApi.getMyCreeps(room.name),
            (c: Creep) => c.memory.job && c.memory.job!.actionType === "upgrade"
        );

        // Assign upgrade job is one isn't currently being worked
        if (creepOptions.upgrade && !isCurrentUpgrader) {
            if (upgradeJobs.length > 0) {
                return upgradeJobs[0];
            }
        }

        // Startup On Ramparts
        if (creepOptions.repair) {
            const defenseRepairJobs = MemoryApi.getRepairJobs(room, (job: WorkPartJob) => {
                const target = Game.getObjectById(job.targetID) as Structure;
                if (target.structureType === STRUCTURE_RAMPART) {
                    return target.hits <= RAMPART_HITS_THRESHOLD;
                }
                return false;
            });

            if (defenseRepairJobs.length > 0) {
                return defenseRepairJobs[0];
            }
        }

        // Priority Repair Only
        if (creepOptions.repair) {
            const priorityRepairJobs = MemoryApi.getPriorityRepairJobs(room);
            if (priorityRepairJobs.length > 0) {
                return priorityRepairJobs[0];
            }
        }

        if (creepOptions.build) {
            const buildJobs = MemoryApi.getBuildJobs(room, (job: WorkPartJob) => !job.isTaken);
            if (buildJobs.length > 0) {
                return buildJobs[0];
            }
        }

        // Regular repair
        if (creepOptions.repair) {
            const repairJobs = MemoryApi.getRepairJobs(room, (job: WorkPartJob) => !job.isTaken);
            if (repairJobs.length > 0) {
                return repairJobs[0];
            }
        }

        if (creepOptions.upgrade) {
            if (upgradeJobs.length > 0) {
                return upgradeJobs[0];
            }
        }

        return undefined;
    }

    public static getNewSourceJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        const creepOptions = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.harvestSources) {
            // forceUpdate to get accurate job listing
            const sourceJobs = MemoryApi.getSourceJobs(room, (sJob: GetEnergyJob) => !sJob.isTaken, true);

            if (sourceJobs.length > 0) {
                // Filter out jobs that have too little energy -
                // The energy in the StoreDefinition is the amount of energy per 300 ticks left
                const suitableJobs = _.filter(
                    sourceJobs,
                    (sJob: GetEnergyJob) => sJob.resources.energy >= creep.getActiveBodyparts(WORK) * 2 * 300 //  (Workparts * 2 * 300 = effective mining capacity)
                );

                // If config allows getting closest source
                if (MINERS_GET_CLOSEST_SOURCE) {
                    let sourceIDs: string[];

                    // Get sources from suitableJobs if any, else get regular sourceJob instead
                    if (suitableJobs.length > 0) {
                        sourceIDs = _.map(suitableJobs, (job: GetEnergyJob) => job.targetID);
                    } else {
                        sourceIDs = _.map(sourceJobs, (job: GetEnergyJob) => job.targetID);
                    }

                    // Find the closest source
                    const sourceObjects: Source[] = MemoryHelper.getOnlyObjectsFromIDs(sourceIDs);

                    const closestAvailableSource: Source = creep.pos.findClosestByRange(sourceObjects)!; // Force not null since we used MemoryHelper.getOnlyObjectsFromIds;

                    // return the job that corresponds with the closest source
                    return _.find(sourceJobs, (job: GetEnergyJob) => job.targetID === closestAvailableSource.id);
                } else {
                    // Return the first suitableJob if any
                    // if none, return first sourceJob.
                    if (suitableJobs.length > 0) {
                        return suitableJobs[0];
                    } else {
                        return sourceJobs[0];
                    }
                }
            }
        }

        return undefined;
    }

    /**
     *
     * @param creep the creep we are getting the job for
     * @param roomName the room we are getting the job in
     */
    public static getNewMineralJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        const creepOptions = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.harvestMinerals) {
            // forceUpdate to get accurate job listing
            const mineralJobs = MemoryApi.getMineralJobs(room, (sJob: GetEnergyJob) => !sJob.isTaken, true);

            if (mineralJobs.length > 0) {
                return mineralJobs[0];
            }
        }
        return undefined;
    }

    /**
     * Get a GetEnergyJob for the creep
     * @param creep the creep we are getting the job for
     * @param roomName the room name we are getting the job in
     */
    public static newGetEnergyJob(creep: Creep, room: Room): GetEnergyJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;
        if (creepOptions.getFromContainer) {
            // All container jobs with enough energy to fill creep.carry, and not taken
            const containerJobs = MemoryApi.getContainerJobs(
                room,
                (cJob: GetEnergyJob) => !cJob.isTaken && cJob.resources!.energy >= creep.carryCapacity
            );

            if (containerJobs.length > 0) {
                return containerJobs[0];
            }
        }

        if (creepOptions.getDroppedEnergy) {
            // All dropped resources with enough energy to fill creep.carry, and not taken
            const dropJobs = MemoryApi.getPickupJobs(
                room,
                (dJob: GetEnergyJob) => !dJob.isTaken && dJob.resources!.energy >= creep.carryCapacity
            );

            if (dropJobs.length > 0) {
                return dropJobs[0];
            }
        }

        // TODO Get Tombstones Here

        if (creepOptions.getFromStorage || creepOptions.getFromTerminal) {
            // All backupStructures with enough energy to fill creep.carry, and not taken
            const backupStructures = MemoryApi.getBackupStructuresJobs(
                room,
                (job: GetEnergyJob) => !job.isTaken && job.resources!.energy >= creep.carryCapacity
            );

            // Only get from the storage if there are jobs that don't involve just putting it right back
            const isFillJobs: boolean = MemoryApi.getFillJobs(
                room,
                (fJob: CarryPartJob) => !fJob.isTaken && fJob.targetType !== "link",
                true
            ).length > 0;
            if (backupStructures.length > 0 && isFillJobs) {
                return backupStructures[0];
            }
        }

        return undefined;
    }

    /**
     * Get a MovePartJob for the harvester
     */
    public static newMovePartJob(creep: Creep, roomName: string): MovePartJob | undefined {
        const newJob: MovePartJob = {
            jobType: "movePartJob",
            targetType: "roomName",
            targetID: roomName,
            actionType: "move",
            isTaken: false
        };

        return newJob;
    }
}
