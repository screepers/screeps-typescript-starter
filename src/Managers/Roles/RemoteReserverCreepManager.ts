import { ROLE_REMOTE_RESERVER, MemoryApi, CreepApi } from "utils/internals";

// Manager for the miner creep role
export class RemoteReserverCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_REMOTE_RESERVER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    /**
     * run the remote reserver creep
     * @param creep the creep we are running
     */
    public runCreepRole(creep: Creep): void {
        const homeRoom = Game.rooms[creep.memory.homeRoom];
        const targetRoom = Game.rooms[creep.memory.targetRoom];

        if (CreepApi.creepShouldFlee(creep)) {
            CreepApi.fleeRemoteRoom(creep, homeRoom);
            return;
        }

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewReserveJob(creep, homeRoom);

            if (creep.memory.job === undefined) {
                return;
            }

            this.handleNewJob(creep, homeRoom);
        }

        if (creep.memory.working === true) {
            CreepApi.doWork(creep, creep.memory.job);
            return;
        }

        CreepApi.travelTo(creep, creep.memory.job);
        return;
    }

    /**
     * Find a job for the creep
     */
    public getNewReserveJob(creep: Creep, room: Room): ClaimPartJob | undefined {
        const creepOptions: CreepOptionsCiv = creep.memory.options as CreepOptionsCiv;

        if (creepOptions.claim) {
            const reserveJob = MemoryApi.getReserveJobs(room, (sjob: ClaimPartJob) => !sjob.isTaken);
            if (reserveJob.length > 0) {
                return reserveJob[0];
            }
        }
        return undefined;
    }

    /**
     * Handle initalizing a new job
     */
    public handleNewJob(creep: Creep, room: Room): void {
        MemoryApi.updateJobMemory(creep, room);
    }
}
