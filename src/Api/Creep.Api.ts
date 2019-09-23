import {
    JobTypes,
    UserException,
    CreepHelper,
    ERROR_ERROR,
    ERROR_WARN,
    ERROR_FATAL,
    ERROR_INFO,
    MemoryApi,
    MINERS_GET_CLOSEST_SOURCE,
    RAMPART_HITS_THRESHOLD,
    STUCK_COUNT_LIMIT,
    USE_STUCK_VISUAL,
    MemoryHelper,
    RoomVisualHelper,
    RoomHelper,
    MemoryHelper_Room,
    PathfindingApi
} from "utils/internals";

// Api for all types of creeps (more general stuff here)
export class CreepApi {
    /**
     * Call the proper doWork function based on job.jobType
     */
    public static doWork(creep: Creep, job: BaseJob) {
        for (const index in JobTypes) {
            if (JobTypes[index].jobType === job.jobType) {
                return JobTypes[index].doWork(creep, job);
            }
        }
        throw new UserException(
            "Bad jobType in CreepApi.doWork",
            "The jobtype of the job passed to CreepApi.doWork was invalid, or there is no implementation of that job type." +
                "\n Job Type: " +
                job.jobType,
            ERROR_FATAL
        );
    }

    /**
     * Call the proper travelTo function based on job.jobType
     */
    public static travelTo(creep: Creep, job: BaseJob) {
        // Update MovementData for empire if creep changed rooms
        if (PathfindingApi.CreepChangedRooms(creep)) {
            PathfindingApi.updateRoomData(creep.room);
        }

        // Perform Stuck Detection - Delete old path if stuck
        if (this.isCreepStuck(creep)) {
            delete creep.memory._move;
        }

        for (const index in JobTypes) {
            if (JobTypes[index].jobType === job.jobType) {
                return JobTypes[index].travelTo(creep, job);
            }
        }

        throw new UserException(
            "Bad jobType in CreepApi.travelTo",
            "The jobtype of the job passed to CreepApi.travelTo was invalid, or there is no implementation of this job type" +
                "\n Job Type: " +
                job.jobType,
            ERROR_FATAL
        );
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
     * Checks if the target is null and throws the appropriate error
     */
    public static nullCheck_target(creep: Creep, target: object | null) {
        if (target === null) {
            // If it was a construction job, update work part jobs to ensure ramparts are repaired swiftly
            if (creep.memory.job && creep.memory.job!.actionType === "build") {
                MemoryHelper_Room.updateWorkPart_repairJobs(creep.room);
            }

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
                ERROR_INFO
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
            const defenseRepairJobs: WorkPartJob[] = MemoryApi.getRepairJobs(room, (job: WorkPartJob) => {
                const target = Game.getObjectById(job.targetID) as Structure;
                if (target.structureType === STRUCTURE_RAMPART) {
                    return target.hits <= RAMPART_HITS_THRESHOLD;
                }
                return false;
            });

            if (defenseRepairJobs.length > 0) {
                const rampartsToBeRepaired: StructureRampart[] = _.map(
                    defenseRepairJobs,
                    (j: WorkPartJob) => Game.getObjectById(j.targetID) as StructureRampart
                );
                const closestRampart: StructureRampart = creep.pos.findClosestByRange(
                    rampartsToBeRepaired
                ) as StructureRampart;
                return {
                    targetID: closestRampart.id,
                    targetType: "rampart",
                    actionType: "repair",
                    jobType: "workPartJob",
                    isTaken: false,
                    remaining: closestRampart.hitsMax - closestRampart.hits
                };
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
                    const accessibleSourceObjects: Source[] = [];

                    // ! Known issue - Multiple Sources, but the one with enough access tiles is not "suitable"
                    // ! e.g. 2 sources, 1 access tile and 3 access tiles -- Only the 1 access tile will be "suitable"
                    // ! but will not have enough accessTiles to be assigned. Creep needs to target the "not suitable" source in this case.
                    // Get rid of any sources that are out of access tiles
                    _.forEach(sourceObjects, (source: Source) => {
                        const numAccessTiles = RoomHelper.getNumAccessTilesForTarget(source);
                        const numCreepsTargeting = MemoryApi.getMyCreeps(room.name, (creep: Creep) => {
                            return (
                                creep.memory.job !== undefined &&
                                (creep.memory.role === "remoteMiner" || creep.memory.role === "miner") &&
                                creep.memory.job.targetID === source.id
                            );
                        }).length;

                        if (numCreepsTargeting < numAccessTiles) {
                            accessibleSourceObjects.push(source);
                        }
                    });

                    const closestAvailableSource: Source = creep.pos.findClosestByRange(accessibleSourceObjects)!; // Force not null since we used MemoryHelper.getOnlyObjectsFromIds;

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
            // All dropped resources with enough energy to fill creep.carry, and not taken, also accept dropped resources that are at least 60% of carry
            const dropJobs = MemoryApi.getPickupJobs(
                room,
                (dJob: GetEnergyJob) =>
                    !dJob.isTaken &&
                    (dJob.resources!.energy >= creep.carryCapacity ||
                        (dJob.targetType === "droppedResource" && dJob.resources!.energy >= creep.carryCapacity * 0.6))
            );

            if (dropJobs.length > 0) {
                return dropJobs[0];
            }

            // TODO consider tombstones dropped energy and get them here
        }

        if (creepOptions.getFromStorage || creepOptions.getFromTerminal) {
            // All backupStructures with enough energy to fill creep.carry, and not taken
            const backupStructures = MemoryApi.getBackupStructuresJobs(
                room,
                (job: GetEnergyJob) => !job.isTaken && job.resources!.energy >= creep.carryCapacity
            );

            // Only get from the storage if there are jobs that don't involve just putting it right back
            const isFillJobs: boolean =
                MemoryApi.getFillJobs(room, (fJob: CarryPartJob) => !fJob.isTaken && fJob.targetType !== "link", true)
                    .length > 0;
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
