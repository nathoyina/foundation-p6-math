import { describe, expect, it } from "vitest";
import { generateDecimalRounding } from "./generators/decimalRounding";
import { generateMixedToImproper } from "./generators/mixedToImproper";
import { generatePercentConvert } from "./generators/percentConvert";
import { roundPlaceToColumn } from "@/lib/math/placeValue";
import {
  validateDecimalRounding,
  validateMixedToImproper,
  validatePercentConvert,
  validateRoundingPlace,
} from "./validators";

describe("validateDecimalRounding", () => {
  it("accepts correct rounded value", () => {
    const q = generateDecimalRounding(42);
    expect(validateDecimalRounding(q, q.correctRounded)).toBe(true);
    expect(validateDecimalRounding(q, q.correctRounded + 0.01)).toBe(false);
  });
});

describe("validateRoundingPlace", () => {
  it("accepts the column that matches the question", () => {
    const q = generateDecimalRounding(42);
    expect(validateRoundingPlace(q, roundPlaceToColumn(q.roundPlace))).toBe(true);
    const wrong =
      q.roundPlace === "tenth" ? "hundredths" : ("tenths" as const);
    expect(validateRoundingPlace(q, wrong)).toBe(false);
  });
});

describe("validateMixedToImproper", () => {
  it("accepts equivalent fractions", () => {
    const q = generateMixedToImproper(99);
    expect(
      validateMixedToImproper(q, {
        num: q.answer.num * 2,
        den: q.answer.den * 2,
      }),
    ).toBe(true);
  });
});

describe("validatePercentConvert", () => {
  it("checks percent to decimal", () => {
    const q = generatePercentConvert(7, "pct-to-decimal");
    expect(
      validatePercentConvert(q, {
        decimalStr: String(q.expectedDecimal),
      }),
    ).toBe(true);
  });

  it("checks fraction to percent", () => {
    const q = generatePercentConvert(11, "fraction-to-pct");
    expect(
      validatePercentConvert(q, {
        percentStr: String(q.expectedPercent),
      }),
    ).toBe(true);
  });
});
