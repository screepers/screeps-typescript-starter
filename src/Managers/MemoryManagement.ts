// manager for the memory of the empire
export class MemoryManager{

    // clean up dead memory
    public static garbageCollector(): void{

        // dead creeps
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }
    }
    // ---------------------

    // calls all memory init functions 
    public static initMemory(): void{

        // init room memory

        // init empire memory
    }

    // initializes empire memory
    private static initEmpireMemory(): void{

        // check if each thing has been init yet
        // init if needed
        // init the things that must be rechecked every tick
    }

    // initializes room memory
    private static initRoomMemory(): void{

        // check if each thing in the room has been initialized
        // init if needed
        // init the things that must be rechecked every tick
    }
}