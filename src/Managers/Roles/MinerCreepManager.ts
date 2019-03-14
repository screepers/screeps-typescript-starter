import CreepRoleManagerParent from "./CreepRoleManagerParent";

// Manager for the miner creep role
export default class MinerCreepManager extends CreepRoleManagerParent {

    /**
     * run the miner creep, overrides runCreepRole in parent class
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {
        // if the creep is not working, get an open source job
        // move to container on that source
        // mine that source and set working to true
        // if the creep is working, do nothing
        // if no source job found, do nothing (possible to happen if miner spawns early
        // before the previous miner has actually died)
    }

}
