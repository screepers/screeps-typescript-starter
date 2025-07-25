import { CENTER, CreepAPI, CreepType } from "./creeps/CreepAPI";
import PriorityQueue from "../utils/PriorityQueue";
import { updateFallback } from "./mood/develop";

export const SpawnController = function (context: SpawnControllerContext) {
  const run = function (): void {
    // init structure spawn
    let room = context.room;
    let spawns = room.spawn;
    let spawns_avail: StructureSpawn[] = [];
    for (let spawn of spawns) {
      if (spawn.isActive()) spawns_avail.push(spawn);
    }
    // init spawn queue
    let sq = new PriorityQueue(SpawnTaskJudge);
    for (const creepName of context.room.memory.sq) {
      sq.push(new SpawnTask(creepName));
    }
    if (sq.empty()) return;
    updateFallback(context.room);
    // try to spawn
    let task = sq.peek();
    if (task.name.startsWith(CENTER)) {
      // use the first spawn
      let spawn = room.spawn[0];
      let result = spawn.spawnCreep(task.body, task.name, { dryRun: true });
      while (result == ERR_NAME_EXISTS) {
        sq.poll();
        if (sq.empty()) break;
        task = sq.peek();
        result = spawn.spawnCreep(task.body, task.name, { dryRun: true });
      }
      if (result == OK) {
        // can spawn
        spawn.spawnCreep(task.body, task.name, { memory: { state: 0, no_pull: false }, directions: [LEFT] });
        sq.poll();
      }
    } else {
      for (let spawn of spawns_avail) {
        let result = spawn.spawnCreep(task.body, task.name, { dryRun: true });
        while (result == ERR_NAME_EXISTS) {
          sq.poll();
          if (sq.empty()) break;
          task = sq.peek();
          result = spawn.spawnCreep(task.body, task.name, { dryRun: true });
        }
        if (result == OK) {
          // can spawn
          spawn.spawnCreep(task.body, task.name, { memory: { state: 0, no_pull: false } });
          sq.poll();
          // update task
          if (sq.empty()) break;
          task = sq.peek();
        }
      }
    }

    // reset Memory.sq
    context.room.memory.sq = [];
    while (!sq.empty()) {
      context.room.memory.sq.push(sq.poll().name);
    }
  };

  const createSpawnTask = function (creepName: string): void {
    context.room.memory.sq.push(creepName);
  };

  return { run, createSpawnTask };
};

interface SpawnControllerContext {
  room: Room;
}

class SpawnTask {
  name: string;
  type: CreepType;
  body: BodyPartConstant[];
  cost: number;

  constructor(creepName: string) {
    let config = CreepAPI.getCreepConfig(creepName, { getSpawnInfo: true, getCreepType: true });
    this.name = creepName;
    this.body = config.body!;
    this.cost = config.spawnCost!;
    this.type = config.creepType!;
  }
}

function SpawnTaskJudge(task1: SpawnTask, task2: SpawnTask): boolean {
  if (task1.type == task2.type) {
    // same type, lower cost first
    return task1.cost <= task2.cost;
  } else return task1.type < task2.type;
}
