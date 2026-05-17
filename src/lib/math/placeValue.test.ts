import { describe, expect, it } from "vitest";
import { parseDecimalPlaces, roundPlaceToColumn } from "./placeValue";

describe("parseDecimalPlaces", () => {
  it("parses fractional digits by column", () => {
    const { wholePart, digits, columns } = parseDecimalPlaces(3.472, 3);
    expect(wholePart).toBe("3");
    expect(columns).toEqual(["tenths", "hundredths", "thousandths"]);
    expect(digits.tenths).toBe("4");
    expect(digits.hundredths).toBe("7");
    expect(digits.thousandths).toBe("2");
  });

  it("keeps the full whole part for multi-digit integers", () => {
    const { wholePart, digits, columns } = parseDecimalPlaces(12.333, 3);
    expect(wholePart).toBe("12");
    expect(columns).toEqual(["tenths", "hundredths", "thousandths"]);
    expect(digits.tenths).toBe("3");
    expect(digits.hundredths).toBe("3");
    expect(digits.thousandths).toBe("3");
  });
});

describe("roundPlaceToColumn", () => {
  it("maps rounding targets to column names", () => {
    expect(roundPlaceToColumn("tenth")).toBe("tenths");
    expect(roundPlaceToColumn("hundredth")).toBe("hundredths");
  });
});
