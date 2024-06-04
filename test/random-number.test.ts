import assert from "assert";
import { myUtils } from "../src";

describe("randomNumber", () => {
  it("case", () => {
    for (let i = 0; i < 10; i++) {
      let res = myUtils.randomNumber(i, i + 10, i);
      assert(res >= i);
      assert(res <= i + 10);

      assert((res.toString().split(".")[1] || "").length <= i);
    }
  });
});
