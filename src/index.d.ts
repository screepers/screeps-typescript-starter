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

interface Task {
  type: string;
  time: number;
  data: object;
}
interface CarryTaskData {
  targetId: string;
  resourceType: ResourceConstant;
  resourceNum: number;
  carriedNum: number;
}
interface RepairTaskData {
  targetId: string;
  hits: number;
}
interface BuildTaskData {
  targetId: string;
}

interface CreepMemory {
  state: number;
  no_pull: boolean;
  data?: object;
}
interface RoomMemory {
  mq: Task[]; // maintenancer queue
  cq: Task[]; // construction queue
  sq: string[]; // spawn queue
  creeps: string[];
  center: { x: number; y: number };
  lv: number; // controller level(used to check controller upgrade)
  source: { id: string; type: string };
  lastCreepCheck: number; // ticks since last creep check
  creepConfigUpdate: boolean; // creep config update flag
}

interface SpawnConfig {
  type: string; // Creep type name
  conf: number; // Spawn config index (use index number to save memory)
}
