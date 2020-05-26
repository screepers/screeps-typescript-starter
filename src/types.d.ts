// example declaration file - remove these and add your own custom typings

// memory extension samples
declare enum CreepRole {
    Worker,
    Harvester
}

interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
  job: string
  silo: string
  energySource: string
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
