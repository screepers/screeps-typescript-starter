import { BaseRoom } from "./baseRoom";
import { Harvester } from "../creeps/roles/harvester";

/**
 * Rooms that the player controls. Includes scripts necessary to run all tasks
 * that happen within the room.
 *
 * @export
 * @class ControlledRoom
 * @extends {BaseRoom}
 */
export class ControlledRoom extends BaseRoom {
  private harvesters: Creep[];

  /**
   * Creates an instance of ControlledRoom.
   *
   * @param {Room} room
   *
   * @memberOf ControlledRoom
   */
  constructor(room: Room) {
    super(room);
  }

  /**
   * Runs all room tasks.
   *
   * @memberOf ControlledRoom
   */
  public run() {
    this.checkMemory();
    this.buildMissingCreeps();
    this.runRoomCreeps();
  }

  private loadCreeps() {
    this.creeps = this.room.find<Creep>(FIND_MY_CREEPS);
    this.creepCount = _.size(this.creeps);

    this.harvesters = this.creeps.filter(function (creep: Creep) {
      return creep.memory.role === "harvester";
    });

    if (this.debug) {
      console.log("[ControlledRoom.loadCreeps] " + this.creepCount + " creeps found in the playground.");
    }
  }

  private buildMissingCreeps() {
    let spawns: Spawn[] = this.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: function (spawn: Spawn) {
        return spawn.spawning === null;
      },
    });

    if (this.debug) {
      if (spawns[0]) {
        console.log("[ControlledRoom.buildMissingCreeps] Spawn: " + spawns[0].name);
      }
    }

    for (let i = 0; i < spawns.length; i++) {
      if (spawns[i].canCreateCreep) {
        this.loadCreeps();

        if (this.harvesters.length < 2) {
          this.spawnCreep(spawns[i], "harvester");
        }
      }
    }
  }

  /**
   * Spawns a new creep.
   *
   * @private
   * @param {Spawn} spawn
   * @param {string} role
   * @returns
   *
   * @memberOf ControlledRoom
   */
  private spawnCreep(spawn: Spawn, role: string) {
    let body: string[] | undefined = this.setBodyParts(role);
    let name: string = this.room.name + "_" + role + "_" + Memory.uuid;

    let properties = {
      role: role,
      room: this.room.name,
    };

    if (body) {
      let status: number | string = spawn.createCreep(body, name, properties);
      if (typeof status === "string") {
        console.log("Started creating new Creep in room " + spawn.room.name);
        Memory.uuid++;
      } else if (status !== -6)  {
        console.log("Failed to spawn creep in room " + spawn.room.name + ":", status, "[" + role + "]");
      }
    } else {
      console.log("Failed to spawn creep in room " + spawn.room.name + ":", "unknown body part", "[" + role + "]");
    }
  }

  /**
   * Checks the room's memory entry for any out-of-bounds memory entries.
   *
   * @private
   *
   * @memberOf ControlledRoom
   */
  private checkMemory() {
    if (!this.room.memory.workers) {
      this.room.memory.workers = {
        harvesters: 0,
      };
    }
  }

  private runRoomCreeps() {
    for (let creep of this.creeps) {
      if (creep.memory.role === "harvester") {
        let harvester = new Harvester(creep, this.room);
        harvester.run();
      }
    }
  }

}
