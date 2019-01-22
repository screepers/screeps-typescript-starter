import { assert } from "chai";
import { loop } from "../../src/main";
import { Game, Memory, WORK, MOVE, CARRY } from "./mock"; // Ensure you import this on any tests, this is where game constants are defined
import { AssertionError } from "assert";
import SpawnApi from "../../src/Api/Spawn.Api";
import { GROUPED, COLLATED } from "../../src/utils/constants";

// I think we should have a new file for each .ts file.
// It's important that you name the file *********.test.ts, and place it in /test/unit 
// or else it will not get run when we call `npm run test-unit` 
describe("Spawn.Api", () => {

    // This is how mocha recommends we define functions, but we can reformat if we want.
    describe("#getBodyFromObject()", function() {

        describe("Input of { WORK: 3, MOVE: 3, CARRY: 3 }", function(){
            const inputObject = { work: 3, move: 3, carry: 3 };
            it("Should return an [ WORK x 3, MOVE x 3, CARRY x 3] when GROUPED", function(){
                // Arrange
                const expectedResults = [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY];
                // Act
                const actualResults = SpawnApi.getBodyFromObject(inputObject, GROUPED);
                // Assert
                assert.deepEqual(actualResults, expectedResults);
            });

            it("Should return [ WORK, MOVE, CARRY ] x 3 when COLLATED", function(){
                // Arrange
                const expectedResults = [WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY];
                // Act
                const actualResults = SpawnApi.getBodyFromObject(inputObject, COLLATED);
                // Assert
                assert.deepEqual(actualResults, expectedResults);
            })
        });
        // * If you would like to write a "pending test", meaning "someone should write this test code eventually", just leave off the callback function.
        it("Should return null if an invalid body descriptor is passed to it."); // This will not be considered a failed test

        // * If you have a written test, but do not want to run it for some reason, you can add the modifier "skip"
        it.skip("This is a pretend test that for some reason is no longer applicable", function() { /* This is code that wouldn't normally be commented out */ });
    });
});
