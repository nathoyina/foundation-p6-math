import type { RoundPlace } from "./rounding";

export type DecimalPlace =
  | "ones"
  | "tenths"
  | "hundredths"
  | "thousandths"
  | "tenThousandths";

export const PLACE_LABELS: Record<DecimalPlace, string> = {
  ones: "Ones",
  tenths: "Tenths",
  hundredths: "Hundredths",
  thousandths: "Thousandths",
  tenThousandths: "Ten-thousandths",
};

export function roundPlaceToColumn(place: RoundPlace): DecimalPlace {
  switch (place) {
    case "whole":
      return "ones";
    case "tenth":
      return "tenths";
    case "hundredth":
      return "hundredths";
    case "thousandth":
      return "thousandths";
  }
}

export function columnToRoundPlace(col: DecimalPlace): RoundPlace | null {
  if (col === "ones") return "whole";
  if (col === "tenths") return "tenth";
  if (col === "hundredths") return "hundredth";
  if (col === "thousandths") return "thousandth";
  return null;
}

/** Column immediately to the right — the “deciding” digit for rounding. */
export function decidingColumn(target: DecimalPlace): DecimalPlace | null {
  if (target === "ones") return "tenths";
  if (target === "tenths") return "hundredths";
  if (target === "hundredths") return "thousandths";
  if (target === "thousandths") return "tenThousandths";
  return null;
}

export function parseDecimalPlaces(
  value: number,
  sourceDp: number,
): {
  wholePart: string;
  columns: DecimalPlace[];
  digits: Partial<Record<DecimalPlace, string>>;
} {
  const fixed = value.toFixed(sourceDp);
  const [whole, frac = ""] = fixed.split(".");

  const digits: Partial<Record<DecimalPlace, string>> = {};
  const columns: DecimalPlace[] = [];

  if (frac.length >= 1) {
    columns.push("tenths");
    digits.tenths = frac[0];
  }
  if (frac.length >= 2) {
    columns.push("hundredths");
    digits.hundredths = frac[1];
  }
  if (frac.length >= 3) {
    columns.push("thousandths");
    digits.thousandths = frac[2];
  }
  if (frac.length >= 4) {
    columns.push("tenThousandths");
    digits.tenThousandths = frac[3];
  }

  return { wholePart: whole, columns, digits };
}

export function selectableRoundingColumns(
  columns: DecimalPlace[],
  level: "foundation" | "level2",
): DecimalPlace[] {
  if (level === "foundation") {
    return columns.filter((c) => c === "tenths" || c === "hundredths");
  }
  const selectable: DecimalPlace[] = ["ones"];
  for (const c of columns) {
    if (
      c === "tenths" ||
      c === "hundredths" ||
      c === "thousandths"
    ) {
      selectable.push(c);
    }
  }
  return selectable;
}
