import { CreepAPI } from "./CreepAPI";

export const Creep_upgrader = {
  run(creep: Creep): void {
    if (creep.spawning) return;

    let state: STATE = creep.memory.state;

    // check data
    if (!creep.memory.data) {
      if (state == STATE.IDLE) {
        // init memory data
        const config = CreepAPI.getCreepConfig(creep.name, { getCreepMemoryData: true });
        creep.memory.data = config.creepMemoryData;
        creep.memory.state = STATE.FETCH;
        state = STATE.FETCH;
      } else {
        creep.say("No data");
      }
    }
    if (state == STATE.IDLE) {

    }
  }
}

interface Upgrader_data {
  cid: string;  // container id
}

enum STATE {
  IDLE,
  FETCH,  // fetch energy
  WORK    // upgrade
}
