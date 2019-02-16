import { assert } from "chai";
import { loop } from "../../src/main";
import { AssertionError } from "assert";
import { helper } from "./helper";
import SpawnApi from "../../src/Api/Spawn.Api";
import { GROUPED, COLLATED } from "../../src/utils/constants";

// I think we should have a new file for each .ts file.
// It's important that you name the file *********.test.ts, and place it in /test/unit
// or else it will not get run when we call `npm run test-unit`
describe("Spawn.Api", () => {
    describe("#getCreepBody()", async function() {
        // const HEAL = "heal";
        // const WORK = "work";
        // const MOVE = "move";
        // const CARRY = "carry";
        // const TOUGH = "tough";
        it("should return undefined if given invalid, or no arguments", async function() {
            const expectedResults = undefined;
            const actualResults = SpawnApi.getCreepBody({}, undefined);
            // const actualResults = SpawnApi.getCreepBody({ pitter: 2, patter: 2 }, undefined);
            assert.equal(actualResults, expectedResults);
        });
        describe("Input of { heal: 3, work: 1, move: 5, carry: 2, tough: 4 }", async function() {
            describe("Options.mixType: GROUPED", async function() {
                beforeEach(async function() {
                    await helper.server.tick();
                });
                it("Should return grouped in the order they were written", async function() {
                    const opts = { mixType: GROUPED };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
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
                it("Should return tough first, then grouped (opt.toughFirst)", async function() {
                    const opts = { mixType: GROUPED, toughFirst: true };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
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
                it("Should return grouped, with heal last (opt.healLast)", async function() {
                    const opts = { mixType: GROUPED, healLast: true };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
                    const expectedResults: BodyPartConstant[] = [
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
                        TOUGH,
                        HEAL,
                        HEAL,
                        HEAL
                    ];
                    const actualResults = SpawnApi.getCreepBody(body, opts);
                    assert.deepEqual(actualResults, expectedResults);
                });
                it("Should return tough first, grouped, and then heal last (opt.toughFirst && opt.healLast)", async function() {
                    const opts = { mixType: GROUPED, toughFirst: true, healLast: true };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
                    const expectedResults: BodyPartConstant[] = [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        WORK,
                        MOVE,
                        MOVE,
                        MOVE,
                        MOVE,
                        MOVE,
                        CARRY,
                        CARRY,
                        HEAL,
                        HEAL,
                        HEAL
                    ];
                    const actualResults = SpawnApi.getCreepBody(body, opts);
                    assert.deepEqual(actualResults, expectedResults);
                });
            });
            describe("Options.mixType: COLLATED", async function() {
                it("Should return collated in the order they were written", async function() {
                    const opts = { mixType: COLLATED };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
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
                it("Should return tough first, the collated (opt.toughFirst)", async function() {
                    const opts = { mixType: COLLATED, toughFirst: true };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
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
                it("Should return collated, then heal last (opt.healLast)", async function() {
                    const opts = { mixType: COLLATED, healLast: true };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
                    const expectedResults: BodyPartConstant[] = [
                        WORK,
                        MOVE,
                        CARRY,
                        TOUGH,
                        MOVE,
                        CARRY,
                        TOUGH,
                        MOVE,
                        TOUGH,
                        MOVE,
                        TOUGH,
                        MOVE,
                        HEAL,
                        HEAL,
                        HEAL
                    ];
                    const actualResults = SpawnApi.getCreepBody(body, opts);
                    assert.deepEqual(actualResults, expectedResults);
                });
                it("Should return tough first, collated, then heal last (opt.toughFirst && opt.healLast)", async function() {
                    const opts = { mixType: COLLATED, toughFirst: true, healLast: true };
                    const body = { heal: 3, work: 1, move: 5, carry: 2, tough: 4 };
                    const expectedResults: BodyPartConstant[] = [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        WORK,
                        MOVE,
                        CARRY,
                        MOVE,
                        CARRY,
                        MOVE,
                        MOVE,
                        MOVE,
                        HEAL,
                        HEAL,
                        HEAL
                    ];
                    const actualResults = SpawnApi.getCreepBody(body, opts);
                    assert.deepEqual(actualResults, expectedResults);
                });
            });
        });
    });
});
