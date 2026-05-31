import { generateDecimalRounding } from "./generators/decimalRounding";
import { generateMixedToImproper } from "./generators/mixedToImproper";
import { generatePercentConvert } from "./generators/percentConvert";
import {
  validateDecimalRounding,
  validateImproperToMixed,
  validateMixedToImproper,
  validatePercentConvert,
  validateRoundingPlace,
} from "./validators";
import { roundPlaceToColumn } from "@/lib/math/placeValue";

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

describe("level 2 generators", () => {
  it("decimal rounding includes whole or thousandth targets", () => {
    const places = new Set<string>();
    for (let s = 0; s < 80; s++) {
      places.add(generateDecimalRounding(s, "level2").roundPlace);
    }
    expect(places.has("whole")).toBe(true);
    expect(places.has("thousandth")).toBe(true);
  });

  it("mixed fraction level 2 can be improper-to-mixed", () => {
    let found = false;
    for (let s = 0; s < 100; s++) {
      const q = generateMixedToImproper(s, "level2");
      if (q.direction === "improper-to-mixed") {
        found = true;
        expect(
          validateImproperToMixed(
            q,
            String(q.answerMixed!.whole),
            String(q.answerMixed!.num),
            String(q.answerMixed!.den),
          ),
        ).toBe(true);
        break;
      }
    }
    expect(found).toBe(true);
  });

  it("percent level 2 can use fraction bar", () => {
    const q = generatePercentConvert(99, "fraction-to-pct", "level2");
    expect(q.useFractionBar).toBe(true);
    expect(q.fractionParts).toBeDefined();
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
