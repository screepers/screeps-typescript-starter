import * as Config from "../../config/config";

/**
 * The base class for Rooms.
 *
 * @export
 * @class BaseRoom
 */
export class BaseRoom {
  protected room: Room;
  protected creeps: Creep[] = [];
  protected structures: Structure[] = [];
  protected flags: Flag[] = [];
  protected spawns: Spawn[] = [];
  protected creepCount: number = 0;

  protected debug: boolean = false;

  /**
   * Creates an instance of BaseRoom.
   *
   * @param {Room} room
   *
   * @memberOf BaseRoom
   */
  constructor(room: Room) {
    this.room = room;

    if (Config.ENABLE_DEBUG_MODE) {
      this.debug = Config.ENABLE_DEBUG_MODE;
    }

    for (let key in Game.creeps) {
      let creep: Creep = Game.creeps[key];
      if (creep.memory.assignedRoom === this.room.name) {
        this.creeps.push(creep);
      }
    }
    for (let key in Game.structures) {
      let structure: Structure = Game.structures[key];
      if (structure.room.name === this.room.name) {
        this.structures.push(structure);
      }
    }
    for (let key in Game.flags) {
      let flag: Flag = Game.flags[key];
      if (flag.room.name === this.room.name) {
        this.flags.push(flag);
      }
    }
    for (let key in Game.spawns) {
      let spawn: Spawn = Game.spawns[key];
      if (spawn.room.name === spawn.room.name) {
        this.spawns.push(spawn);
      }
    }
  }

  /**
   * Calculates the base body parts for certain roles.
   *
   * @param {string} role
   * @returns {(string[] | undefined)}
   *
   * @memberOf BaseRoom
   */
  protected setBodyParts(role: string): string[] | undefined {
    if (this.debug) {
      console.log("[BaseRoom.setBodyParts] Current role:", role);
    }

    if (role === "harvester") {
      return [MOVE, MOVE, CARRY, WORK];
    }
  }
}
