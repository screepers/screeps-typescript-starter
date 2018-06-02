// type shim for nodejs' `require()` syntax
// for stricter node.js typings, remove this and install `@types/node`
declare const require: (module: string) => any;

// add your custom typings here
declare enum CreepRole {
    Worker,
    Harvester
}

declare interface CreepMemory {
    role: string
    job: string
    silo: string
    energySource: string
}
