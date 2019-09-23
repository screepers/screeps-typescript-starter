import { ERROR_WARN, UserException, MemoryApi, CONTROLLER_SIGNING_TEXT, Normalize } from "utils/internals";

// helper function for creeps
export class CreepHelper {
    /**
     * get the mining container for a specific job
     * @param job the job we are getting the mining container from
     * @param room the room we are checking in
     * @param isSource if we nee the mining contrainer for a source
     */
    public static getMiningContainer(
        job: GetEnergyJob | undefined,
        room: Room,
        isSource: boolean
    ): StructureContainer | undefined {
        if (!job) {
            throw new UserException(
                "Job is undefined",
                "Job is undefined for room " + room.name + ". Can't get the mining container of an undefined job.",
                ERROR_WARN
            );
        }

        let sourceTarget: Source | Mineral | null = Game.getObjectById(job.targetID);
        if (isSource) {
            sourceTarget = sourceTarget as Source;
        } else {
            sourceTarget = sourceTarget as Mineral;
        }

        if (!sourceTarget) {
            throw new UserException("Source null in getMiningContainer", "room: " + room.name, ERROR_WARN);
        }

        // Get containers and find the closest one to the source
        const containers: StructureContainer[] = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_CONTAINER
        ) as StructureContainer[];

        const closestContainer = sourceTarget.pos.findClosestByRange(containers);

        if (!closestContainer) {
            return undefined;
        } else {
            // If we have a container, but its not next to the source, its not the correct container
            if (sourceTarget.pos.isNearTo(closestContainer)) {
                return closestContainer;
            }
            return undefined;
        }
    }

    /**
     * Get the text to sign a controller with
     */
    public static getSigningText(): string {
        // Find a random index in the array of messages and choose that
        const MIN = 0;
        const MAX = CONTROLLER_SIGNING_TEXT.length - 1;
        const numberOfMessages: number = Math.floor(Math.random() * (+MAX - +MIN)) + +MIN;
        return CONTROLLER_SIGNING_TEXT[numberOfMessages];
    }

    /**
     * Check if the targetPosition is the destination of the creep's current move target
     * @target The target object or roomposition to move to
     * @range [Optional] The range to stop at from the target
     */
    public static isTargetCurrentDestination(creep: Creep, target: object, range = 0): boolean {
        if (creep.memory._move === undefined) {
            return false;
        }

        let targetPosition: RoomPosition;

        if (target.hasOwnProperty("pos") || target instanceof RoomPosition) {
            targetPosition = Normalize.roomPos(target as _HasRoomPosition | RoomPosition);
        } else {
            throw new UserException(
                "Error in targetIsCurrentDestination",
                "Creep [" +
                    creep.name +
                    "] tried to check if targetIsCurrentDestination on a target with no pos property. \n Target: [" +
                    JSON.stringify(target) +
                    "]",
                ERROR_ERROR
            );
        }

        const currentDestination = creep.memory._move.dest;

        // Check if curr_dest = targetPosition
        // TODO Change this so that it checks if it is in a variable range
        // ? Is this done? It seems to be as far as I can tell, but explain further if its not

        if (currentDestination.roomName !== targetPosition.roomName) {
            return false;
        }

        const distanceApart =
            Math.abs(currentDestination.x - targetPosition.x) + Math.abs(currentDestination.y - targetPosition.y);
        // Return true if distance from currentDestination to targetPosition is within the allowed range (default is 0, exact match)
        return distanceApart <= range;
    }

    /**
     * Gets creep.memory.supplementary.moveTargetID, or falls back to creep.memory.job.
     * @param creep the creep we are getting target for
     * @param job the job we are getting move target for
     */
    public static getMoveTarget(creep: Creep, job: BaseJob): RoomObject | RoomPosition | null {
        // Get target to move to, using supplementary.moveTargetID if available, job.targetID if not.
        if (creep.memory.supplementary && creep.memory.supplementary.moveTargetID) {
            return Game.getObjectById(creep.memory.supplementary.moveTargetID);
        } else if (creep.memory.job && creep.memory.job.targetType === "roomName") {
            return new RoomPosition(25, 25, creep.memory.job.targetID);
        } else if (creep.memory.job && creep.memory.job.targetType === "roomPosition") {
            // TODO Handle parsing a string into a roomPosition object here
            // what the hell is line 125 lmfao. Also is this done? If not explain further
            const x = 25;
            const y = 25;
            const roomName = "X##Y##";
            return new RoomPosition(x, y, roomName);
        } else {
            return Game.getObjectById(job.targetID);
        }
    }

    /**
     * check if the body part exists on the creep
     * @param creep the creep we are checking
     * @param part the body part we are checking
     */
    public static bodyPartExists(creep: Creep, bodyPart: BodyPartConstant): boolean {
        return _.some(creep.body, (part: BodyPartDefinition) => part.type === bodyPart);
    }
}
