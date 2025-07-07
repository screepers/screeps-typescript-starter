import { VisualBuilding } from "./visual";
import { err } from "../Message";
import PriorityQueue from "../../utils/PriorityQueue";

const SpawnsLoc = [
  { x: 1, y: 0 },
  { x: -4, y: 2 },
  { x: -1, y: -4 }
];
const ExtensionLoc = [
  { x: 3, y: 0 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
  { x: 0, y: 3 },
  { x: -1, y: 3 },
  { x: -2, y: 2 },
  { x: -3, y: 1 },
  { x: -3, y: -1 },
  { x: -2, y: -2 },
  { x: -1, y: -3 },
  // stage 2
  { x: 4, y: 0 },
  { x: 5, y: 0 },
  { x: 4, y: 1 },
  { x: 3, y: 2 },
  { x: 2, y: 3 },
  { x: 1, y: 4 },
  { x: 0, y: 4 },
  { x: 0, y: 5 },
  { x: -1, y: 5 },
  { x: -2, y: 4 },
  { x: -3, y: 3 },
  { x: -4, y: 0 },
  { x: -5, y: -1 },
  { x: -4, y: -2 },
  { x: -3, y: -4 },
  { x: -2, y: -3 },
  { x: -2, y: -4 },
  { x: -2, y: -5 },
  // stage 3
  { x: 5, y: 2 },
  { x: 4, y: 3 },
  { x: 5, y: 4 },
  { x: 4, y: 5 },
  { x: 3, y: 4 },
  { x: 3, y: 5 },
  { x: 2, y: 5 },
  { x: -3, y: 5 },
  { x: -4, y: 4 },
  { x: -5, y: 5 },
  { x: -6, y: 4 },
  { x: -5, y: 3 },
  { x: -6, y: 2 },
  { x: -5, y: 1 },
  { x: -6, y: 1 },
  { x: -6, y: 0 },
  { x: -6, y: -2 },
  { x: -5, y: -3 },
  { x: -6, y: -3 },
  { x: -5, y: -4 },
  { x: -6, y: -4 },
  { x: -6, y: -5 },
  { x: -5, y: -6 },
  { x: -4, y: -5 },
  { x: -4, y: -6 },
  { x: -3, y: -6 },
  { x: -1, y: -6 },
  { x: 0, y: -6 },
  { x: 1, y: -6 },
  { x: 4, y: -6 },
  { x: 5, y: -5 },
  { x: 5, y: -2 }
];
const TowerLoc = [
  { x: 2, y: 2 },
  { x: 4, y: -1 },
  { x: -1, y: 4 },
  { x: -3, y: 2 },
  { x: -4, y: -1 },
  { x: -3, y: -3 }
];
const StorageLoc = { x: 1, y: -1 };
const LinkLoc = { x: -1, y: -1 };
const TerminalLoc = { x: -1, y: 1 };
const LabLoc = [
  { x: 2, y: -2 },
  { x: 3, y: -2 },
  { x: 1, y: -3 },
  { x: 3, y: -3 },
  { x: 4, y: -3 },
  { x: 1, y: -4 },
  { x: 2, y: -4 },
  { x: 4, y: -4 },
  { x: 2, y: -5 },
  { x: 3, y: -5 }
];
const FactoryLoc = { x: 0, y: -1 };
const ObserverLoc = { x: 0, y: -5 };
const PowerSpawnLoc = { x: 0, y: 1 };
const NukerLoc = { x: -1, y: 0 };
const RampartLoc = [
  { x: 5, y: 0 },
  { x: 5, y: 1 },
  { x: 5, y: 2 },
  { x: 5, y: 3 },
  { x: 5, y: 4 },
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
  { x: 2, y: 5 },
  { x: 1, y: 5 },
  { x: 0, y: 5 },
  { x: -1, y: 5 },
  { x: -2, y: 5 },
  { x: -3, y: 5 },
  { x: -4, y: 5 },
  { x: -5, y: 5 },
  { x: -6, y: 5 },
  { x: -6, y: 4 },
  { x: -6, y: 3 },
  { x: -6, y: 2 },
  { x: -6, y: 1 },
  { x: -6, y: 0 },
  { x: -6, y: -1 },
  { x: -6, y: -2 },
  { x: -6, y: -3 },
  { x: -6, y: -4 },
  { x: -6, y: -5 },
  { x: -6, y: -6 },
  { x: -5, y: -6 },
  { x: -4, y: -6 },
  { x: -3, y: -6 },
  { x: -2, y: -6 },
  { x: -1, y: -6 },
  { x: 0, y: -6 },
  { x: 1, y: -6 },
  { x: 2, y: -6 },
  { x: 3, y: -6 },
  { x: 4, y: -6 },
  { x: 5, y: -6 },
  { x: 5, y: -5 },
  { x: 5, y: -4 },
  { x: 5, y: -3 },
  { x: 5, y: -2 },
  { x: 5, y: -1 }
];
const RoadLoc = [
  // stage 1
  { x: 2, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 2 },
  { x: -1, y: 2 },
  { x: -2, y: 1 },
  { x: -2, y: 0 },
  { x: -2, y: -1 },
  { x: -1, y: -2 },
  { x: 0, y: -2 },
  { x: 1, y: -2 },
  { x: 2, y: -1 },
  // stage 2
  { x: 3, y: -1 },
  { x: 4, y: -2 },
  { x: 5, y: -1 },
  { x: 3, y: 1 },
  { x: 4, y: 2 },
  { x: 5, y: 1 },
  { x: 1, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 3 },
  { x: 1, y: 5 },
  { x: -2, y: 3 },
  { x: -3, y: 4 },
  { x: -2, y: 5 },
  { x: -4, y: 3 },
  { x: -5, y: 2 },
  { x: -4, y: 1 },
  { x: -3, y: 0 },
  { x: -5, y: 0 },
  { x: -6, y: -1 },
  { x: -5, y: -2 },
  { x: -4, y: -3 },
  { x: -3, y: -2 },
  { x: -4, y: -4 },
  { x: -3, y: -5 },
  { x: -2, y: -6 },
  { x: -1, y: -5 },
  { x: 0, y: -4 },
  { x: 0, y: -3 },
  // stage 3
  { x: 1, y: -5 },
  { x: 2, y: -6 },
  { x: 3, y: -6 },
  { x: 4, y: -5 },
  { x: 5, y: -4 },
  { x: 5, y: -3 },
  { x: 2, y: -3 },
  { x: 3, y: -4 },
  { x: 5, y: -6 },
  { x: 5, y: 3 },
  { x: 4, y: 4 },
  { x: 5, y: 5 },
  { x: -4, y: 5 },
  { x: -5, y: 4 },
  { x: -6, y: 5 },
  { x: -6, y: 3 },
  { x: -5, y: -5 },
  { x: -6, y: -6 }
];

function error(message: string, throwError = false) {
  err(`<Bunker Layout> ${message}`, throwError);
}

function checkReachSurroundingRoad(x: number, y: number): number {
  // returns -1 if inside kernel or non-road boarder
  // returns 0 if outside kernel
  // returns 1 if it is surrounding road
  if (x < 5 && x > -6 && y < 5 && y > -6) return -1;
  if (x > 5 || x < -6 || y > 5 || y < -6) return 0;
  if (x == 5) {
    if (y == -6 || y == -4 || y == -3 || y == -1 || y == 1 || y == 3 || y == 5) return 1;
    else return -1;
  } else if (x == -6) {
    if (y == -6 || y == -1 || y == 3 || y == 5) return 1;
    else return -1;
  } else if (y == 5) {
    if (x == 1 || x == -2 || x == -4) return 1;
    else return -1;
  } else if (y == -6) {
    if (x == 3 || x == 2 || x == -2) return 1;
    else return -1;
  }
  error(`Unreachable! Please check bug`, true);
  return -100; // unreachable. cheat typescript checker
}

function floodFillSearchPath(room: Room, target: RoomPosition) {
  const center = room.memory.center;
  const terrain = room.getTerrain();
  let vis: boolean[][] = Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => false));
  let from: number[][] = Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => -1));
  vis[target.x][target.y] = true;
  let dequeue: { x: number; y: number }[] = [{ x: target.x, y: target.y }];
  let head = 0,
    tail = 1;
  let sx = -1,
    sy = -1;
  //const dx = [1, 1, 0, -1, -1, -1, 0, 1];
  //const dy = [0, 1, 1, 1, 0, -1, -1, -1];
  const dx = [1, 0, -1, 0, 1, 1, -1, -1];
  const dy = [0, 1, 0, -1, -1, 1, 1, -1];
  while (head < tail) {
    let pos = dequeue[head];
    let x = pos.x,
      y = pos.y;
    head++;
    let stop: boolean = false;
    for (let i = 0; i < 8; i++) {
      let nx = x + dx[i],
        ny = y + dy[i];
      if (nx < 0 || nx > 49 || ny < 0 || ny > 49) continue;
      if (vis[nx][ny]) continue;
      vis[nx][ny] = true;
      if (terrain.get(nx, ny) != TERRAIN_MASK_WALL) {
        // check if (nx, ny) reaches kernel
        const result = checkReachSurroundingRoad(nx - center.x, ny - center.y);
        if (result == 1) {
          sx = nx;
          sy = ny;
          from[nx][ny] = ((i + 2) % 4) + 4 * (i >> 2);
          stop = true;
          break;
        }
        if (result == 0) {
          // from[nx][ny] = (i + 4) % 8;
          from[nx][ny] = ((i + 2) % 4) + 4 * (i >> 2);
          dequeue[tail] = { x: nx, y: ny };
          tail++;
        }
      }
    }
    if (stop) break;
  }

  // generate full path
  let path: { x: number; y: number }[] = [];
  let dir = from[sx][sy];
  let p = { x: sx + dx[dir], y: sy + dy[dir] };
  while (p.x != target.x || p.y != target.y) {
    path.push({ x: p.x, y: p.y });
    // if (from[p.x][p.y]) {}
    dir = from[p.x][p.y];
    p = { x: p.x + dx[dir], y: p.y + dy[dir] };
  }
  return path;
}

export function createBunkerLayout(
  room: Room,
  createFn: (x: number, y: number, type: BuildableStructureConstant) => void
): void {
  const controller = room.controller;
  if (!room.controller || !room.controller.my) {
    error(`Room ${room.name} has no controller or controller is not mine`);
    return;
  }

  const center = room.memory.center;
  switch (controller!.level) {
    case 1: {
      // road && container
      let roads: { x: number; y: number }[] = [];
      let containers: { x: number; y: number }[] = [];
      if (room.name == "sim") {
        for (const source of room.source.slice(0, 2)) {
          let path = floodFillSearchPath(room, source.pos);
          if (path.length == 0) {
            error(`Path is null`, true);
          }
          containers.push(path.pop()!);
          roads.push(...path);
        }
      } else
        for (const source of room.source) {
          let path = floodFillSearchPath(room, source.pos);
          if (path.length == 0) {
            error(`Path is null`, true);
          }
          containers.push(path.pop()!);
          roads.push(...path);
        }
      for (const road of roads) createFn(road.x, road.y, STRUCTURE_ROAD);
      for (const container of containers) createFn(container.x, container.y, STRUCTURE_CONTAINER);
      break;
    }
    case 2: {
      // build extension, road and container

      // build roads around spawn
      let roads = RoadLoc.slice(0, 11).map(loc => {
        return { x: loc.x + center.x, y: loc.y + center.y };
      });
      for (const road of roads) createFn(road.x, road.y, STRUCTURE_ROAD);
      // road to controller
      let path = floodFillSearchPath(room, room.controller!.pos);
      if (path.length > 2) {
        for (const road of roads.slice(0, path.length - 2))
          createFn(room.controller!.pos.x, room.controller!.pos.y, STRUCTURE_ROAD);
      }

      // extension
      let extensions = ExtensionLoc.slice(0, 5).map(loc => {
        return { x: loc.x + center.x, y: loc.y + center.y };
      });
      for (const extension of extensions) createFn(extension.x, extension.y, STRUCTURE_EXTENSION);
      break;
    }
    default:
      error(`Unimplemented controller level ${controller!.level}`);
  }
}

export function showBunkerLayout(roomName: string) {
  let buildings: { [name: string]: string[] } = {};
  const center = Game.rooms[roomName].memory.center;
  let x = center.x,
    y = center.y;
  buildings["spawn"] = SpawnsLoc.map(loc => {
    return `${x + loc.x}/${y + loc.y}`;
  });
  buildings["extension"] = ExtensionLoc.map(loc => {
    return `${x + loc.x}/${y + loc.y}`;
  });
  buildings["tower"] = TowerLoc.map(loc => {
    return `${x + loc.x}/${y + loc.y}`;
  });
  buildings["storage"] = [`${x + StorageLoc.x}/${y + StorageLoc.y}`];
  buildings["link"] = [`${x + LinkLoc.x}/${y + LinkLoc.y}`];
  buildings["terminal"] = [`${x + TerminalLoc.x}/${y + TerminalLoc.y}`];
  buildings["lab"] = LabLoc.map(loc => {
    return `${x + loc.x}/${y + loc.y}`;
  });
  buildings["factory"] = [`${x + FactoryLoc.x}/${y + FactoryLoc.y}`];
  buildings["observer"] = [`${x + ObserverLoc.x}/${y + ObserverLoc.y}`];
  buildings["powerSpawn"] = [`${x + PowerSpawnLoc.x}/${y + PowerSpawnLoc.y}`];
  buildings["nuker"] = [`${x + NukerLoc.x}/${y + NukerLoc.y}`];
  buildings["road"] = RoadLoc.map(loc => {
    return `${x + loc.x}/${y + loc.y}`;
  });

  VisualBuilding(roomName, buildings);
}
