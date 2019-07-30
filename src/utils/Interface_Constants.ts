// Creep Managers' Implementations
import MinerCreepManager from "../Managers/Roles/MinerCreepManager";
import HarvesterCreepManager from "../Managers/Roles/HarvesterCreepManager";
import WorkerCreepManager from "../Managers/Roles/WorkerCreepManager";
import LorryCreepManager from "../Managers/Roles/LorryCreepManager";
import MineralMinerCreepManager from "Managers/Roles/MineralMinerManager";
import PowerUpgraderCreepManager from "../Managers/Roles/PowerUpgraderCreepManager";
import RemoteMinerCreepManager from "../Managers/Roles/RemoteMinerCreepManager";
import RemoteHarvesterCreepManager from "../Managers/Roles/RemoteHarvesterCreepManager";
import RemoteColonizerCreepManager from "../Managers/Roles/RemoteColonizerCreepManager";
import ClaimerCreepManager from "../Managers/Roles/ClaimerCreepManager";
import RemoteDefenderCreepManager from "../Managers/Roles/RemoteDefenderCreepManager";
import RemoteReserverCreepManager from "../Managers/Roles/RemoteReserverCreepManager";
import ZealotCreepManager from "../Managers/Roles/ZealotCreepManager";
import MedicCreepManager from "../Managers/Roles/MedicCreepManager";
import StalkerCreepManager from "../Managers/Roles/StalkerCreepManager";
import DomesticDefenderCreepManager from "../Managers/Roles/DomesticDefenderCreepManager";
// ---------------------------
// Body/Option Helper Implementations
import { MinerBodyOptsHelper } from "../Helpers/RoleHelpers/MinerBodyOptsHelper";
import { HarvesterBodyOptsHelper } from "../Helpers/RoleHelpers/HarvesterBodyOptsHelper";
import { WorkerBodyOptsHelper } from "../Helpers/RoleHelpers/WorkerBodyOptsHelper";
import { LorryBodyOptsHelper } from "../Helpers/RoleHelpers/LorryBodyOptsHelper";
import { MineralMinerBodyOptsHelper } from "../Helpers/RoleHelpers/MineralMinerBodyOptsHelper";
import { PowerUpgraderBodyOptsHelper } from "../Helpers/RoleHelpers/PowerUpgraderBodyOptsHelper";
import { ZealotBodyOptsHelper } from "../Helpers/RoleHelpers/ZealotBodyOptsHelper";
import { StalkerBodyOptsHelper } from "../Helpers/RoleHelpers/StalkerBodyOptsHelper";
import { MedicBodyOptsHelper } from "../Helpers/RoleHelpers/MedicBodyOptsHelper";
import { DomesticDefenderBodyOptsHelper } from "../Helpers/RoleHelpers/DomesticDefenderBodyOptsHelper";
import { RemoteColonizerBodyOptsHelper } from "../Helpers/RoleHelpers/RemoteColonizerBodyOptsHelper";
import { RemoteDefenderBodyOptsHelper } from "../Helpers/RoleHelpers/RemoteDefenderOptsHelper";
import { RemoteMinerBodyOptsHelper } from "../Helpers/RoleHelpers/RemoteMinerBodyOptsHelper";
import { RemoteHarvesterBodyOptsHelper } from "../Helpers/RoleHelpers/RemoteHarvesterBodyOptsHelper";
import { ClaimerBodyOptsHelper } from "../Helpers/RoleHelpers/ClaimerBodyOptsHelper";
import { RemoteReserverBodyOptsHelper } from "../Helpers/RoleHelpers/RemoteReserverBodyOptsHelper";
// ---------------------------
// Room Spawn Limit Implementations
import { IntroStateCreepLimits } from "../Helpers/CreepLimitHelpers/IntroStateCreepLimits";
import { BeginnerStateCreepLimits } from "../Helpers/CreepLimitHelpers/BeginnerStateCreepLimits";
import { IntermediateStateCreepLimits } from "../Helpers/CreepLimitHelpers/IntermediateStateCreepLimits";
import { AdvancedStateCreepLimits } from "../Helpers/CreepLimitHelpers/AdvancedStateCreepLimits";
import { StimulateStateCreepLimits } from "../Helpers/CreepLimitHelpers/StimulateStateCreepLimits";
import { NukeStateCreepLimits } from "../Helpers/CreepLimitHelpers/NukeStateCreepLimits";
import { UpgraderStateCreepLimits } from "../Helpers/CreepLimitHelpers/UpgraderStateCreepLimits";
// ----------------------------
// ---------- End Imports ----------------------------------------------------------------------------

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
]

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
    new NukeStateCreepLimits(),
];

