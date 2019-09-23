import * as internals from "utils/internals";

// Constant containing the manager for each job, which all implement doWork & travelTo
export const JobTypes: IJobTypeHelper[] = [
    new internals.CarryPartJobs(),
    new internals.ClaimPartJobs(),
    new internals.GetEnergyJobs(),
    new internals.MovePartJobs(),
    new internals.WorkPartJobs()
];

// Constant containing the manager for each role, which all implement runRole
export const CREEP_MANAGERS: ICreepRoleManager[] = [
    new internals.MinerCreepManager(),
    new internals.HarvesterCreepManager(),
    new internals.WorkerCreepManager(),
    new internals.LorryCreepManager(),
    new internals.MineralMinerCreepManager(),
    new internals.PowerUpgraderCreepManager(),
    new internals.RemoteMinerCreepManager(),
    new internals.RemoteHarvesterCreepManager(),
    new internals.RemoteReserverCreepManager(),
    new internals.RemoteDefenderCreepManager(),
    new internals.RemoteColonizerCreepManager(),
    new internals.ClaimerCreepManager(),
    new internals.ZealotCreepManager(),
    new internals.StalkerCreepManager(),
    new internals.MedicCreepManager(),
    new internals.DomesticDefenderCreepManager(),
    new internals.ScoutCreepManager()
];

// Constant containing the body and options helper for a creep, which implement these helper functions
export const CREEP_BODY_OPT_HELPERS: ICreepBodyOptsHelper[] = [
    new internals.MinerBodyOptsHelper(),
    new internals.HarvesterBodyOptsHelper(),
    new internals.WorkerBodyOptsHelper(),
    new internals.LorryBodyOptsHelper(),
    new internals.MineralMinerBodyOptsHelper(),
    new internals.PowerUpgraderBodyOptsHelper(),
    new internals.RemoteMinerBodyOptsHelper(),
    new internals.RemoteHarvesterBodyOptsHelper(),
    new internals.RemoteReserverBodyOptsHelper(),
    new internals.RemoteDefenderBodyOptsHelper(),
    new internals.RemoteColonizerBodyOptsHelper(),
    new internals.ClaimerBodyOptsHelper(),
    new internals.ZealotBodyOptsHelper(),
    new internals.StalkerBodyOptsHelper(),
    new internals.MedicBodyOptsHelper(),
    new internals.DomesticDefenderBodyOptsHelper(),
    new internals.ScoutBodyOptsHelper()
];

// This is where each class instance is stored to be searched through so the correct one can be selected
// Follow advanced state creeep limits for next section
export const ROOM_STATE_CREEP_LIMITS: ICreepSpawnLimits[] = [
    new internals.IntroStateCreepLimits(),
    new internals.BeginnerStateCreepLimits(),
    new internals.IntermediateStateCreepLimits(),
    new internals.AdvancedStateCreepLimits(),
    new internals.UpgraderStateCreepLimits(),
    new internals.StimulateStateCreepLimits(),
    new internals.NukeStateCreepLimits()
];

// Constant containing all instances of the class related to processing flags
export const PROCESS_FLAG_HELPERS: IFlagProcesser[] = [
    new internals.ProcessDefaultAttackFlag(),
    new internals.ProcessDefaultClaimRoom(),
    new internals.ProcessDefaultRemoteRoom(),
    new internals.ProcessDefaultStimulateFlag(),
    new internals.ProcessDependentRoomOverride()
];
