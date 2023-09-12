import { forEach, keys, sortBy } from "lodash";
import { Bootstrap } from "bootstrap";
import { EnergyMining } from "EnergyMining";
import { EnergyCarrying } from "EnergyCarrying";
import { Construction } from "Construction";

export function RoomProgram(room: Room) {
  forEach(getRoomRoutines(room), (routine) => {
    routine.RemoveDeadCreeps();
    routine.AddNewlySpawnedCreeps(room);
    routine.SpawnCreeps(room);
    routine.routine(room);
  });
}

function getRoomRoutines(room: Room): RoomRoutine[] {
  if (room.controller?.level == 1) {
    return [new Bootstrap()]; //, "energyCarrying", "energyMining", "bootstrap"];
  } else {
    return [];
  }
}

export abstract class RoomRoutine {
  name!: string;
  position!: RoomPosition;

  spawnQueue!:
    {
      body: BodyPartConstant[],
      pos: RoomPosition,
      role: string
    }[];

  creepIds!: {
    [role: string]: Id<Creep>[];
  };

  runRoutine(room: Room) : void {
    this.RemoveDeadCreeps();
    this.AddNewlySpawnedCreeps(room);
    this.SpawnCreeps(room);
    this.routine(room);
  }

  abstract routine(room: Room): void;
  abstract calcSpawnQueue(room: Room): void;

  RemoveDeadCreeps(): void {
    forEach(keys(this.creepIds), (role) => {
      this.creepIds[role] = _.filter(this.creepIds[role], (creepId: Id<Creep>) => {
        return Game.getObjectById(creepId) != null;
      });
    });
  }

  AddNewlySpawnedCreeps(room: Room): void {
    if (this.spawnQueue.length == 0) return;

    forEach(keys(this.creepIds), (role) => {
      let idleCreeps = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
          return creep.memory.role == role && !creep.spawning;
        }
      });

      if (idleCreeps.length == 0) { return }

      let closestIdleCreep = sortBy(idleCreeps, (creep) => {
        return creep.pos.getRangeTo(this.position);
      })[0];

      this.AddNewlySpawnedCreep(role, closestIdleCreep);
    });
  }

  AddNewlySpawnedCreep(role: string, creep :  Creep ): void {
      this.creepIds[role].push(creep.id);
      creep.memory.role = "busy" + role;
  }

  SpawnCreeps(room: Room): void {
      this.calcSpawnQueue(room);
      if (this.spawnQueue.length == 0) return;

      let spawns = room.find(FIND_MY_SPAWNS, { filter: spawn => !spawn.spawning });
      if (spawns.length == 0) return;

      spawns = sortBy(spawns, spawn => this.position.findPathTo(spawn).length);
      let spawn = spawns[0];

      spawn.spawnCreep(
        this.spawnQueue[0].body,
        spawn.name + Game.time,
        { memory: { role: this.spawnQueue[0].role } }) == OK;
  }
}

