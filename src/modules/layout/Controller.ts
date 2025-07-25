import { checkInsideLayout, createBunkerLayout } from "./bunkerLayout";

export const LayoutController = function (context: LayoutControllerContext) {
  const createLayout = function (createFn: (x: number, y: number, type: BuildableStructureConstant) => void): void {
    // TODO: implement other layout
    createBunkerLayout(context.room, createFn);
  };

  const getRampartTargetHits = function (): number {
    switch (context.room.controller?.level) {
      case undefined:
      case 0:
      case 1:
      case 2:
        return 0;
      case 3:
        return 5000;
      case 4:
        return 50000;
      case 5:
        return 500000;
      case 6:
        return 5000000;
      case 7:
        return 50000000;
      case 8:
        return 300000000;
      default:
        return 0;
    }
  };

  const checkPositionInsideLayout = function (x: number, y: number): boolean {
    // TODO: implement other layout
    return checkInsideLayout(context.room, x, y);
  };

  return { createLayout, getRampartTargetHits, checkPositionInsideLayout };
};

interface LayoutControllerContext {
  room: Room;
}
