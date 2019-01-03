// @ts-ignore
import { MemoryApi } from "Api/Memory.Api";

// manager for the memory of the empire
export class MemoryManager {
    /**
     * run the memory for the AI
     */
    public static runMemoryManager(): void {
        MemoryApi.garbageCollection();
        console.log("Running Init");
        MemoryApi.initialize_room_memories();
    }
}
