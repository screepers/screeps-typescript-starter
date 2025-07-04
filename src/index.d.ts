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

interface Memory {
  sq: string[]; // spawn queue
  lastCreepCheck: number; // ticks since last creep check
  creepConfigUpdate: boolean; // creep config update flag
}

interface CreepMemory {
  state: number;
  data?: object;
}
interface RoomMemory {
  creeps: string[];
}

interface SpawnConfig {
  type: string;   // Creep type name
  conf: number;   // Spawn config index (use index number to save memory)
}
