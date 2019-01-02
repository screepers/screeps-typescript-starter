// the api for the memory class
export class MemoryApi{
    
    /**
     * clear out all dead memory
     */
    public static garbageCollection(): void{
        // dead creeps
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }

        // dead flags
        // idk whatever else dies
    }
}