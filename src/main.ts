export function loop() {

  // Clear non-existing creep memory.
  for(let name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory[name];
    }
  }

  console.log(`Current tick is ${Game.time}`);
}
