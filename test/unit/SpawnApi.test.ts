import { assert } from "chai";
import { loop } from "../../src/main";
import { Game, Memory } from "./mock";
import { AssertionError } from "assert";
import SpawnApi from "../../src/Api/Spawn.Api";
import { GROUPED } from "../../src/utils/constants";

describe("Spawn.Api", () => {
    //
    describe("#getBodyFromObject()", function() {
        it("Should return an array of 3 WORK, 3 MOVE, and 3 CARRY parts", function() {
            assert.equal(SpawnApi.getBodyFromObject({ WORK: 3, MOVE: 3, CARRY: 3 }, GROUPED), [
                WORK,
                WORK,
                WORK,
                MOVE,
                MOVE,
                MOVE,
                CARRY,
                CARRY,
                CARRY
            ]);
        });
    });
});
