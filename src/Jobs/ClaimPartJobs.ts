import { CreepHelper, CreepApi, PathfindingApi, MemoryApi, RESERVER_MIN_TTL, UserException } from "utils/internals";

export class ClaimPartJobs implements IJobTypeHelper {
    public jobType: Valid_JobTypes = "claimPartJob";

    constructor() {
        const self = this;
        self.doWork = self.doWork.bind(self);
        self.travelTo = self.travelTo.bind(this);
    }
    /**
     * Do work on the target provided by claimPartJob
     */
    public doWork(creep: Creep, job: BaseJob) {
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

        CreepApi.nullCheck_target(creep, target);

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
            throw CreepApi.badTarget_Error(creep, job);
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
     * Travel to the target provided by ClaimPartJob in creep.memory.job
     */
    public travelTo(creep: Creep, job: BaseJob) {
        // Remove supplementary.moveTarget if we are not in room with controller - Safety
        if (job.targetType === "roomName" && job.targetID !== creep.pos.roomName) {
            if (creep.memory.supplementary) {
                delete creep.memory.supplementary!.moveTarget;
            }
        }

        // Will return a roomPosition in this case, or controller if we have that targeted instead
        const moveTarget = CreepHelper.getMoveTarget(creep, job);

        CreepApi.nullCheck_target(creep, moveTarget);

        // Move options for target
        const moveOpts = PathfindingApi.GetDefaultMoveOpts();

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
     * Gets a list of ClaimJobs for the Room
     * @param room The room to get the jobs for
     */
    public static createClaimJobs(room: Room): ClaimPartJob[] {
        // Get only ClaimRoomMemory objects that are defined
        const claimRooms = MemoryApi.getClaimRooms(room);

        if (claimRooms.length === 0) {
            return [];
        }

        const claimJobs: ClaimPartJob[] = [];

        _.forEach(claimRooms, (room: ClaimRoomMemory) => {
            const claimJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: room.roomName,
                targetType: "roomName",
                actionType: "claim",
                isTaken: false
            };

            claimJobs.push(claimJob);
        });

        return claimJobs;
    }

    /**
     * Gets a list of ReserveJobs for the room
     * @param room The room to get the jobs for
     */
    public static createReserveJobs(room: Room): ClaimPartJob[] {
        const reserveRooms: RemoteRoomMemory[] = MemoryApi.getRemoteRooms(room, (roomMemory: RemoteRoomMemory) => {
            return roomMemory.reserveTTL < RESERVER_MIN_TTL;
        });

        if (reserveRooms.length === 0) {
            return [];
        }

        const reserveJobs: ClaimPartJob[] = [];

        _.forEach(reserveRooms, (room: RemoteRoomMemory) => {
            const reserveJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: room.roomName,
                targetType: "roomName",
                actionType: "reserve",
                isTaken: false
            };

            reserveJobs.push(reserveJob);
        });

        return reserveJobs;
    }

    /**
     * Gets a list of SignJobs for the room (signing the controller)
     * @param room The room to get the jobs for
     *
     */
    public static createSignJobs(room: Room): ClaimPartJob[] {
        // TODO Get a list of controllers to be signed
        // Every controller we have vision of the room in the scouting structure,
        // its not owned by another player,
        // and its not signed
        const controllers: StructureController[] = [];

        if (controllers.length === 0) {
            return [];
        }

        const signJobs: ClaimPartJob[] = [];

        _.forEach(controllers, (controller: StructureController) => {
            const signJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: controller.id,
                targetType: "controller",
                actionType: "sign",
                isTaken: false
            };

            signJobs.push(signJob);
        });

        return signJobs;
    }

    /**
     * Gets a list of AttackJobs for the room (attacking enemy controller)
     * @param room The room to get the jobs for
     */
    public static createAttackJobs(room: Room): ClaimPartJob[] {
        // TODO Get a list of rooms to attack
        const roomNames: string[] = [];

        if (roomNames.length === 0) {
            return [];
        }

        const attackJobs: ClaimPartJob[] = [];

        _.forEach(roomNames, (name: string) => {
            const attackJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: name,
                targetType: "roomName",
                actionType: "attack",
                isTaken: false
            };

            attackJobs.push(attackJob);
        });

        return attackJobs;
    }
}
