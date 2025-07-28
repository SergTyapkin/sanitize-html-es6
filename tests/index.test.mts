import { describe, test, expect, beforeEach, afterEach } from "@jest/globals"
import SanitizeHTML from "../dist/index.js";


describe("SanitizeHTML", () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test("Default", () => {
    const input = '<img src="http://some.site:3000/image/some.png" alt="image" onerror="const evil = \'code\'"><div><i>Some</i> <b>text</b></div>';
    const output = '<img src="http://some.site:3000/image/some.png"><div><i>Some</i> <b>text</b></div>';

    expect(SanitizeHTML.sanitize(input)).toBe(output);
  });

  test("Iframe", () => {
    const input = '<iframe src="http://some.site:3000/image/some.png" alt="image" onerror="const evil = \'code\'"></iframe><div><i>Some</i> <b>text</b></div>';
    const output = '<div><i>Some</i> <b>text</b></div>';

    expect(SanitizeHTML.sanitize(input)).toBe(output);
  });
});
