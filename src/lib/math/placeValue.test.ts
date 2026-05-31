import { describe, expect, it } from "vitest";
import {
  parseDecimalPlaces,
  roundPlaceToColumn,
  selectableRoundingColumns,
} from "./placeValue";

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
  });

  it("supports four decimal places for level 2", () => {
    const { columns } = parseDecimalPlaces(5.6789, 4);
    expect(columns).toContain("tenThousandths");
  });
});

describe("roundPlaceToColumn", () => {
  it("maps rounding targets to column names", () => {
    expect(roundPlaceToColumn("whole")).toBe("ones");
    expect(roundPlaceToColumn("tenth")).toBe("tenths");
    expect(roundPlaceToColumn("hundredth")).toBe("hundredths");
    expect(roundPlaceToColumn("thousandth")).toBe("thousandths");
  });
});

describe("selectableRoundingColumns", () => {
  it("foundation only allows tenths and hundredths", () => {
    const cols = ["tenths", "hundredths", "thousandths"] as const;
    expect(selectableRoundingColumns([...cols], "foundation")).toEqual([
      "tenths",
      "hundredths",
    ]);
  });

  it("level 2 includes ones and thousandths", () => {
    const cols = ["tenths", "hundredths", "thousandths"] as const;
    const sel = selectableRoundingColumns([...cols], "level2");
    expect(sel).toContain("ones");
    expect(sel).toContain("thousandths");
  });
});
