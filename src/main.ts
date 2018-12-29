// @ts-ignore
import { ErrorMapper } from "utils/ErrorMapper";

// ------ end imports


// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
// ------ begin main loop
export const loop = ErrorMapper.wrapLoop(() => {

  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  // really wanna move this into memory section and just call the function
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }


  // we can begin planning soon
  // as far as git goes, i gave us each our own branch...
  // we will push features onto that branch and then we can merge into master 
  // once they have ran for a little bit and are declared stable to our knowledge

  console.log("hello sonny boy, nice day we're having")
});
// ------ end main loop
