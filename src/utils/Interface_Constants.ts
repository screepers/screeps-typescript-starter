import {
    CarryPartJobs,
    ClaimPartJobs,
    GetEnergyJobs,
    MovePartJobs,
    WorkPartJobs,
    MinerCreepManager,
    HarvesterCreepManager,
    WorkerCreepManager,
    LorryCreepManager,
    MineralMinerCreepManager,
    PowerUpgraderCreepManager,
    RemoteMinerCreepManager,
    RemoteHarvesterCreepManager,
    RemoteReserverCreepManager,
    RemoteDefenderCreepManager,
    RemoteColonizerCreepManager,
    ClaimerCreepManager,
    ZealotCreepManager,
    StalkerCreepManager,
    MedicCreepManager,
    DomesticDefenderCreepManager,
    ScoutCreepManager,
    MinerBodyOptsHelper,
    HarvesterBodyOptsHelper,
    WorkerBodyOptsHelper,
    LorryBodyOptsHelper,
    MineralMinerBodyOptsHelper,
    PowerUpgraderBodyOptsHelper,
    RemoteMinerBodyOptsHelper,
    RemoteHarvesterBodyOptsHelper,
    RemoteReserverBodyOptsHelper,
    RemoteDefenderBodyOptsHelper,
    RemoteColonizerBodyOptsHelper,
    ClaimerBodyOptsHelper,
    ZealotBodyOptsHelper,
    StalkerBodyOptsHelper,
    MedicBodyOptsHelper,
    DomesticDefenderBodyOptsHelper,
    ScoutBodyOptsHelper,
    IntroStateCreepLimits,
    BeginnerStateCreepLimits,
    IntermediateStateCreepLimits,
    AdvancedStateCreepLimits,
    UpgraderStateCreepLimits,
    StimulateStateCreepLimits,
    NukeStateCreepLimits,
    ProcessDefaultAttackFlag,
    ProcessDefaultClaimRoom,
    ProcessDefaultRemoteRoom,
    ProcessDefaultStimulateFlag,
    ProcessDependentRoomOverride
} from "utils/internals";

// Constant containing the manager for each job, which all implement doWork & travelTo
export const JobTypes: IJobTypeHelper[] = [
    new CarryPartJobs(),
    new ClaimPartJobs(),
    new GetEnergyJobs(),
    new MovePartJobs(),
    new WorkPartJobs()
];

// Constant containing the manager for each role, which all implement runRole
export const CREEP_MANAGERS: ICreepRoleManager[] = [
    new MinerCreepManager(),
    new HarvesterCreepManager(),
    new WorkerCreepManager(),
    new LorryCreepManager(),
    new MineralMinerCreepManager(),
    new PowerUpgraderCreepManager(),
    new RemoteMinerCreepManager(),
    new RemoteHarvesterCreepManager(),
    new RemoteReserverCreepManager(),
    new RemoteDefenderCreepManager(),
    new RemoteColonizerCreepManager(),
    new ClaimerCreepManager(),
    new ZealotCreepManager(),
    new StalkerCreepManager(),
    new MedicCreepManager(),
    new DomesticDefenderCreepManager(),
    new ScoutCreepManager()
];

// Constant containing the body and options helper for a creep, which implement these helper functions
export const CREEP_BODY_OPT_HELPERS: ICreepBodyOptsHelper[] = [
    new MinerBodyOptsHelper(),
    new HarvesterBodyOptsHelper(),
    new WorkerBodyOptsHelper(),
    new LorryBodyOptsHelper(),
    new MineralMinerBodyOptsHelper(),
    new PowerUpgraderBodyOptsHelper(),
    new RemoteMinerBodyOptsHelper(),
    new RemoteHarvesterBodyOptsHelper(),
    new RemoteReserverBodyOptsHelper(),
    new RemoteDefenderBodyOptsHelper(),
    new RemoteColonizerBodyOptsHelper(),
    new ClaimerBodyOptsHelper(),
    new ZealotBodyOptsHelper(),
    new StalkerBodyOptsHelper(),
    new MedicBodyOptsHelper(),
    new DomesticDefenderBodyOptsHelper(),
    new ScoutBodyOptsHelper()
];

// This is where each class instance is stored to be searched through so the correct one can be selected
// Follow advanced state creeep limits for next section
export const ROOM_STATE_CREEP_LIMITS: ICreepSpawnLimits[] = [
    new IntroStateCreepLimits(),
    new BeginnerStateCreepLimits(),
    new IntermediateStateCreepLimits(),
    new AdvancedStateCreepLimits(),
    new UpgraderStateCreepLimits(),
    new StimulateStateCreepLimits(),
    new NukeStateCreepLimits()
];

// Constant containing all instances of the class related to processing flags
export const PROCESS_FLAG_HELPERS: IFlagProcesser[] = [
    new ProcessDefaultAttackFlag(),
    new ProcessDefaultClaimRoom(),
    new ProcessDefaultRemoteRoom(),
    new ProcessDefaultStimulateFlag(),
    new ProcessDependentRoomOverride()
];
