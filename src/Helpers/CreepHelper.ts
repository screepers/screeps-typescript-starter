import { ERROR_WARN } from "utils/constants";
import UserException from "utils/UserException";
import MemoryApi from "Api/Memory.Api";
import { CONTROLLER_SIGNING_TEXT } from "utils/config";
import Normalize from "./Normalize";

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
                "Job is undefined for room " + room.name + ". Can't get the mining container of an undefined job.",
                ERROR_WARN
            );
        }

        const source: Source | null = Game.getObjectById(job.targetID);
        if (!source) {
            throw new UserException("Source null in getMiningContainer", "room: " + room.name, ERROR_WARN);
        }

        // Get containers and find the closest one to the source
        const containers: StructureContainer[] = MemoryApi.getStructureOfType(
            room,
            STRUCTURE_CONTAINER
        ) as StructureContainer[];

        const closestContainer = source.pos.findClosestByRange(containers);

        if (!closestContainer) {
            return undefined;
        } else {
            // If we have a container, but its not next to the source, its not the correct container
            if (source.pos.isNearTo(closestContainer)) {
                return closestContainer;
            }
            return undefined;
        }
    }

    /**
     * Get the text to sign a controller with
     */
    public static getSigningText(): string {
        // TODO Implement some kind of options interface that allows for customizing signing text
        // * for now we just use a constant from config to sign
        return CONTROLLER_SIGNING_TEXT;
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
     */
    public static getMoveTarget(creep: Creep, job: BaseJob): RoomObject | null {
        // Get target to move to, using supplementary.moveTargetID if available, job.targetID if not.
        if (creep.memory.supplementary && creep.memory.supplementary.moveTargetID) {
            return Game.getObjectById(creep.memory.supplementary.moveTargetID);
        } else {
            return Game.getObjectById(job.targetID);
        }
    }
}
