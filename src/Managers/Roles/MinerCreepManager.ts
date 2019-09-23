import { ROLE_MINER, CreepHelper, CreepApi, MemoryApi } from "utils/internals";

// Manager for the miner creep role
export class MinerCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_MINER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * Run the miner creep
     * @param creep The creep to run
     */
    public runCreepRole(creep: Creep): void {
        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = CreepApi.getNewSourceJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return; // idle for a tick
            }

            // Set supplementary.moveTarget to container if one exists and isn't already taken
            this.handleNewJob(creep, homeRoom);
        }

        if (creep.memory.job) {
            if (creep.memory.working) {
                CreepApi.doWork(creep, creep.memory.job);
                return;
            }

            CreepApi.travelTo(creep, creep.memory.job);
        }
    }

    /**
     * Handle initalizing a new job
     * @param creep the creep we are using
     * @param room the room we are in
     */
    public handleNewJob(creep: Creep, room: Room): void {
        // Update room memory to reflect the new job
        MemoryApi.updateJobMemory(creep, room);

        const isSource: boolean = true;
        const miningContainer = CreepHelper.getMiningContainer(
            creep.memory.job as GetEnergyJob,
            Game.rooms[creep.memory.homeRoom],
            isSource
        );

        if (miningContainer === undefined) {
            // Returning here to prevent supplementary id from being formed,
            // so in that case creep will just walk up to the source
            return;
        }

        // Check for any creeps on the miningContainer
        const creepsOnContainer = miningContainer.pos.lookFor(LOOK_CREEPS);

        if (creepsOnContainer.length > 0) {
            // If the creep on the container is a miner (and not some random creep that's in the way)
            if (creepsOnContainer[0].memory.role === ROLE_MINER) {
                return; // Don't target it
            }
        }

        if (creep.memory.supplementary === undefined) {
            creep.memory.supplementary = {};
        }

        creep.memory.supplementary.moveTargetID = miningContainer.id;
    }
}
