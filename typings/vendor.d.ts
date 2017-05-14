/* tslint:disable */
// Put shims and extensions to installed modules and typings here


// add objects to `global` here
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

// type CreepMemory = any;
interface CreepMemory {}
interface FlagMemory {}
interface RoomMemory {}
interface SpawnMemory {}

// shim uglify-js for webpack
declare module "uglify-js" {
  export interface MinifyOptions {}
}
