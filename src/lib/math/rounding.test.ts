import { describe, expect, it } from "vitest";
import { roundToPlace } from "./rounding";

describe("roundToPlace", () => {
  it("rounds to tenths", () => {
    expect(roundToPlace(3.47, "tenth")).toBe(3.5);
    expect(roundToPlace(3.44, "tenth")).toBe(3.4);
  });

  it("rounds to hundredths", () => {
    expect(roundToPlace(2.345, "hundredth")).toBe(2.35);
    expect(roundToPlace(2.344, "hundredth")).toBe(2.34);
  });

  it("rounds to whole numbers", () => {
    expect(roundToPlace(12.6, "whole")).toBe(13);
    expect(roundToPlace(12.4, "whole")).toBe(12);
  });

  it("rounds to thousandths", () => {
    expect(roundToPlace(1.2346, "thousandth")).toBe(1.235);
  });
});
