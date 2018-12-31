// manager for the memory of the empire
export class MemoryManager{

    // properties -----------

    // ----------------------


    // methods -------------
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


}