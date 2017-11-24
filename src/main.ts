import { ErrorMapper } from "utils/ErrorMapper";

export function loop() {
  try {
    // Clear non-existing creep memory.
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory[name];
      }
    }

    console.log(`Current tick is ${Game.time}`);
  } catch (e) {
    console.log(ErrorMapper.sourceMappedStackTrace(e));
  }
}
