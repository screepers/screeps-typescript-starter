import {assert} from "chai";

describe("ts-node test", () => {
  it("the global should exist", () => {
    // this is defined in /typings/globals/screeps/index.d.ts
    assert.isNotNull(RESOURCE_ENERGY);
  });
});
