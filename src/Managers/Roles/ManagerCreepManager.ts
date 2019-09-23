import { ROLE_MANAGER, MemoryApi, CreepApi } from "utils/internals";

// Manager for the miner creep role
export class ManagerCreepManager implements ICreepRoleManager {
    public name: RoleConstant = ROLE_MANAGER;

    constructor() {
        const self = this;
        self.runCreepRole = self.runCreepRole.bind(this);
    }

    // Need to figure out what jobs we're looking for
    // Need to remove those options at lvl 6 from harvesters and workers
    // Need to add basic repairing to towers at lvl 6
    // The only real job getting removed from harvester is ability to fill terminal
    // Only real job getting removed from workers is regular repairing (wall repairing will be their full time job now)
    // On spawning this role, need to add something to spawn system to make sure we can choose a direction on 'spawn creep' then add a 'get creep direction'
    // function in spawn manager that makes ssure we ddon't spawn anything non manager in the middle, and only allow manager to spawn in the middle
    // Probably just add this function

    // Need to adjust getNextCreep to make sure to only check for a manager if we're on one of the center spawns, and allow the above function to handle direction still
    // Add spawn limits for manager creep, and we're done with the project

    // Will finish getNextCreep refactor and logging before respawning in so we can make sure things are streamlined a'f before moving onto auto construction

    /**
     * Run the miner creep
     * @param creep The creep to run
     */
    public runCreepRole(creep: Creep): void {
        const homeRoom: Room = Game.rooms[creep.memory.homeRoom];

        if (creep.memory.job === undefined) {
            creep.memory.job = this.getNewJob(creep, homeRoom);

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
        }
    }

    /**
     * Decides which kind of job to get and calls the appropriate function
     * @param creep the creep we are getting the job for
     * @param room the room we are in
     * @returns BaseJob of the new job we recieved (undefined if none)
     */
    public getNewJob(creep: Creep, room: Room): BaseJob | undefined {
        // get a new job
        // TODO
        return {
            jobType: "workPartJob",
            targetID: "3939301",
            targetType: "constructedWall",
            actionType: "repair",
            isTaken: false
        };
    }

    /**
     * Handle initalizing a new job
     * @param creep the creep we are using
     * @param room the room we are in
     */
    public handleNewJob(creep: Creep, room: Room): void {
        // Handle new job here
        // TODO
    }
}
