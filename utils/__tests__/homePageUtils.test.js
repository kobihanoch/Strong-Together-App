import { getDaysSince, getBodyPartsForSplit } from "../homePageUtils";

describe("homePageUtils", () => {
  test("check getDaysSince returns today on null", () => {
    const result = getDaysSince(null);
    expect(result).toBe("today");
  });
});
