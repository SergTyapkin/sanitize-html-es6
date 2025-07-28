import { describe, test, expect, beforeEach, afterEach } from "@jest/globals"
import YourPackage from "../dist/index.js";


describe("YourPackage", () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test("YourPackage is ok", () => {
    expect(YourPackage).not.toBeNull();
  });
});
