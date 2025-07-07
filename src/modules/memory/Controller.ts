import { RoomMemoryController } from "./RoomMemory";

export const MemoryController = function (context: MemoryControllerContext) {
  const run = function () {
    RoomMemoryController.run(context.room.memory);
  };

  return { run };
};

interface MemoryControllerContext {
  room: Room;
}
