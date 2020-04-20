// example declaration file - remove these and add your own custom typings

// Shim to allow continued use of global lodash without having to explicitley import in every file.
// as of @types/lodash@3.10.3
import _ from "lodash";
declare global {
  const _: typeof _;
}

// memory extension samples
interface CreepMemory {
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
