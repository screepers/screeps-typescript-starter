// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  job: string | null;
  source_id: string;
  spawn_id: string;
  controller_id: string;
  construction_id: string;
  extension_id: string;
  tower_id: string;
  role: string;
  room: string;
  working: boolean;
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
