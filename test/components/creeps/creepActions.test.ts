/// <reference path="../../../typings/globals/screeps/index.d.ts"/>
import {assert, expect} from "chai";
// import * as sinon from "sinon";
import {canWork} from "../../../src/components/creeps/creepActions";
import {CreepFactory} from "../../mock/factory.creep";

describe("creep actions", () => {

  const creepFactory = new CreepFactory()
    .body([WORK, CARRY, MOVE])
    .carrying(RESOURCE_ENERGY, 50)
    .memory({working: false});

  before(() => {
    // runs before all tests in this block
  });

  beforeEach(() => {
    // runs before each test in this block
  });

  it("can work when not working and at capacity", () => {
    const creep = creepFactory.build();

    assert.isTrue(canWork(creep));
    expect(creep.memory.working).to.be.true;
  });

  it("cannot work when working and at capacity", () => {
    // modify the creep factory to produce creeps carrying nothing, and a different memory
    const creep = creepFactory.carrying({}).memory({working: true}).build();

    assert.isFalse(canWork(creep));
    expect(creep.memory.working).to.be.false;
  });
});
