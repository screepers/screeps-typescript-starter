import { warn } from "../Message";

export const RoomMemoryController = {
  run(memory: RoomMemory) {
    // check source
    if (memory.source.id != "") {
      switch (memory.source.type) {
        case "Spawn":
          // if sq is not empty, reset to none
          if (memory.sq.length > 0) memory.source.id = "";
          break;
        case "Container": {
          // if container has no energy, reset to none
          const container = Game.getObjectById(memory.source.id as Id<StructureContainer>);
          if (!container) memory.source.id = "";
          else if (container.store.energy < 50) memory.source.id = "";
          break;
        }
        default:
          warn(`<ROOM MEMORY> memory source type invalid, reset to none. current type is ${memory.source.type}`);
          memory.source.id = "";
      }
    }
  }
};
