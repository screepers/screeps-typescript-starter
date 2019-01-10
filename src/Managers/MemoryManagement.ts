// @ts-ignore
import MemoryApi from "Api/Memory.Api";

// manager for the memory of the empire
export default class MemoryManager {
    /**
     * run the memory for the AI
     */
    public static runMemoryManager(): void {
        
        MemoryApi.garbageCollection();
        
        //
        _.forEach(Game.rooms, (room: Room) => {
            MemoryApi.initRoomMemory(room);
        });
    }
}
