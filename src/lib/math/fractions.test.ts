import { describe, expect, it } from "vitest";
import {
  fractionsEqual,
  gcd,
  mixedToImproper,
  simplify,
} from "./fractions";

describe("gcd", () => {
  it("computes greatest common divisor", () => {
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(17, 13)).toBe(1);
  });
});

describe("simplify", () => {
  it("reduces fractions", () => {
    expect(simplify({ num: 8, den: 12 })).toEqual({ num: 2, den: 3 });
  });
});

describe("fractionsEqual", () => {
  it("detects equivalence", () => {
    expect(fractionsEqual({ num: 2, den: 4 }, { num: 1, den: 2 })).toBe(true);
    expect(fractionsEqual({ num: 3, den: 4 }, { num: 2, den: 3 })).toBe(false);
  });
});

describe("mixedToImproper", () => {
  it("converts mixed numbers", () => {
    expect(mixedToImproper(2, 3, 4)).toEqual({ num: 11, den: 4 });
  });
});
