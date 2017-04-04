import {assert} from "chai";

describe("lodash", () => {

  it("the global should exist", () => {
    assert.isNotNull(_);
  });

  it("map should exist", () => {
    assert.isNotNull(_.map);
  });

});
