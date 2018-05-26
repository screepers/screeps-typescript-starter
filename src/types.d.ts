// type shim for nodejs' `require()` syntax
// for stricter node.js typings, remove this and install `@types/node`
declare const require: (module: string) => any;

// add your custom typings here
declare enum CreepRole {
    Worker,
    Harvester
}

declare enum State {
    Idle,
    Working,
    Collecting
}

declare interface CreepMemory {
    role: string
    state: State
    job: string
    silo: string
    energySource: string
}
