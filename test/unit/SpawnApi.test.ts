import { assert } from "chai";
import { loop } from "../../src/main";
import { Game, Memory, WORK, MOVE, CARRY, TOUGH, HEAL, CLAIM, ATTACK, RANGED_ATTACK } from "./mock"; // Ensure you import this on any tests, this is where game constants are defined
import { AssertionError } from "assert";
import SpawnApi from "../../src/Api/Spawn.Api";
import { GROUPED, COLLATED } from "../../src/utils/constants";

// I think we should have a new file for each .ts file.
// It's important that you name the file *********.test.ts, and place it in /test/unit
// or else it will not get run when we call `npm run test-unit`
describe("Spawn.Api", () => {
    describe("#getCreepBody()", function() {
        describe("Input of { heal: 3, work: 1, move: 5, carry: 2, tough: 4 }", function() {
            // Body Definition
            const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };

            describe("Options.mixType: GROUPED", function() {
                it("Should return grouped in the order they were written", function() {
                    const opts = { mixType: GROUPED };
                    const expectedResults: BodyPartConstant[] = [
                        HEAL,
                        HEAL,
                        HEAL,
                        WORK,
                        MOVE,
                        MOVE,
                        MOVE,
                        MOVE,
                        MOVE,
                        CARRY,
                        CARRY,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH
                    ];
                    const actualResults = SpawnApi.getCreepBody(body, opts);
                    assert.deepEqual(actualResults, expectedResults);
                });
                describe("Options.toughFirst: true", function() {
                    it("Should return tough first, then grouped", function() {
                        const opts = { mixType: GROUPED, toughFirst: true };
                        const expectedResults: BodyPartConstant[] = [
                            TOUGH,
                            TOUGH,
                            TOUGH,
                            TOUGH,
                            HEAL,
                            HEAL,
                            HEAL,
                            WORK,
                            MOVE,
                            MOVE,
                            MOVE,
                            MOVE,
                            MOVE,
                            CARRY,
                            CARRY
                        ];

                        const actualResults = SpawnApi.getCreepBody(body, opts);
                        assert.deepEqual(actualResults, expectedResults);
                    });
                });
            });
            describe("Options.mixType: COLLATED", function() {
                it("Should return collated in the order they were written", function() {
                    const opts = { mixType: COLLATED };
                    const expectedResults: BodyPartConstant[] = [
                        HEAL,
                        WORK,
                        MOVE,
                        CARRY,
                        TOUGH,
                        HEAL,
                        MOVE,
                        CARRY,
                        TOUGH,
                        HEAL,
                        MOVE,
                        TOUGH,
                        MOVE,
                        TOUGH,
                        MOVE
                    ];
                    const actualResults = SpawnApi.getCreepBody(body, opts);

                    assert.deepEqual(actualResults, expectedResults);
                });
                describe("Options.toughFirst: true", function() {
                    const opts = { mixType: COLLATED, toughFirst: true };
                    const expectedResults: BodyPartConstant[] = [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        HEAL,
                        WORK,
                        MOVE,
                        CARRY,
                        HEAL,
                        MOVE,
                        CARRY,
                        HEAL,
                        MOVE,
                        MOVE,
                        MOVE
                    ];
                    const actualResults = SpawnApi.getCreepBody(body, opts);

                    assert.deepEqual(actualResults, expectedResults);
                });
            });
        });
    });
});
