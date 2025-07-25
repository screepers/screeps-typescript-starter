interface Room {
  // multiple structures
  spawn: StructureSpawn[];
  extension: StructureExtension[];
  road: StructureRoad[];
  wall: StructureWall[];
  rampart: StructureRampart[];
  keeperLair: StructureKeeperLair[];
  portal: StructurePortal[];
  link: StructureLink[];
  tower: StructureTower[];
  lab: StructureLab[];
  container: StructureContainer[];
  powerBank: StructurePowerBank[];

  // single structures
  observer?: StructureObserver;
  powerSpawn?: StructureSpawn;
  extractor?: StructureExtractor;
  nuker?: StructureNuker;
  factory?: StructureFactory;
  invaderCore?: StructureInvaderCore;
  mineral?: Mineral;

  // additional
  source: Source[];
  deposit: Deposit[];

  mass_stores: Set<string>;
  my: boolean;
  level: number;

  // function
  update(): void;
}
interface Room {
  resetQueue: () => void;
}

interface ConstructTask {
  tgt: string;
}
interface CarryTask {
  tgt: string; // target id
  rt: ResourceConstant; // resource type.
}
interface RepairTask {
  tgt: string; // target id.
  hits: number; // hits to be repaired
  sn: string; // structure name
}

interface FallBackData {
  fb: boolean; // fallback flag
  fbc: number; // fallback cost
  t: number; // fallback timer(used for harvester)
}

interface TowerMemory {
  rt: RepairTask | null;
}

interface CreepMemory {
  state: number;
  no_pull: boolean;
  data?: object;
}
interface RoomMemory {
  // structure memory
  tm: { [id: string]: TowerMemory };

  caq: CarryTask[]; // carry task queue
  cis: string[]; // carry task id set
  rq: RepairTask[]; // repair task queue
  erq: RepairTask[]; // emergency repair task
  ris: string[]; // repair task id set
  eris: string[]; // emergency repair task id set
  cq: ConstructTask[]; // construction queue
  sq: string[]; // spawn queue
  fb: boolean; // creep config fallback
  fbc: number; // fallback cost
  sr: string[]; // source rooms(外矿房)
  creeps: string[];
  center: { x: number; y: number };
  lv: number; // controller level(used to check controller upgrade)
  lastCreepCheck: number; // ticks since last creep check
  creepConfigUpdate: boolean; // creep config update flag
}
interface SRMemory {
  // source room memory
  init: boolean;
  numSource: number;
  ready: boolean; // room is ready to harvest(when containers are built)
  hasInvader: boolean;
  hasDefender: boolean;
}

interface SpawnConfig {
  type: string; // Creep type name
  conf: number; // Spawn config index (use index number to save memory)
}
