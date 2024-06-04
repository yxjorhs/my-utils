import assert from "assert";
import { myUtils } from "../src/index";

describe("randomString", () => {
  it("case", () => {
    for (let i = 0; i < 100; i++) {
      assert(myUtils.randomString(i, "base64").length === i);
    }
  });
});
