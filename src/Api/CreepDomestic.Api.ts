import CreepHelper from "Helpers/CreepHelper";
import UserException from "utils/UserException";
import {
    ERROR_WARN
} from "utils/constants";

export default class CreepDomestic {

    /**
     * check if the creep is on a mining container, or source if no mining container exists
     * @param creep the creep we are checking
     * @param job the creep's job
     * @returns boolean if they are on the mining container or not
     */
    public static isOnMiningContainerOrSource(creep: Creep, job: GetEnergyJob | undefined): boolean {
        if (!job) {
            throw new UserException(
                "Job is undefined",
                "Job is undefined for creep " + creep.name + ", can't move to mining container.",
                ERROR_WARN);
        }

        const room: Room = Game.rooms[creep.memory.homeRoom];
        const miningContainer: StructureContainer | undefined = CreepHelper.getMiningContainer(job, room);
        if (miningContainer) {
            return creep.pos.isEqualTo(miningContainer.pos);
        }
        else {
            const source: Source | null = Game.getObjectById(job.targetID);
            if (source) {
                return creep.pos.isNearTo(source.pos);
            }
            return false;
        }
    }

    /**
     * move the creep to the mining container, or source if no mining container exists
     * @param creep the creep we are moving
     * @param container the container we are moving to
     */
    public static moveToMiningContainerOrSource(creep: Creep, job: GetEnergyJob | undefined): void {
        if (!job) {
            throw new UserException(
                "Job is undefined",
                "Job is undefined for creep " + creep.name + ", can't move to mining container.",
                ERROR_WARN);
        }

        const room: Room = Game.rooms[creep.memory.homeRoom];
        const miningContainer: StructureContainer | undefined = CreepHelper.getMiningContainer(job, room);
        if (miningContainer) {
            creep.moveTo(miningContainer.pos);
        }
        else {
            const source: Source | null = Game.getObjectById(job.targetID);
            if (source) {
                creep.moveTo(source.pos);
            }
        }
    }
};
