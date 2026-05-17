import type { RoundPlace } from "./rounding";

export type DecimalPlace = "ones" | "tenths" | "hundredths" | "thousandths";

export const PLACE_LABELS: Record<DecimalPlace, string> = {
  ones: "Ones",
  tenths: "Tenths",
  hundredths: "Hundredths",
  thousandths: "Thousandths",
};

export function roundPlaceToColumn(place: RoundPlace): DecimalPlace {
  return place === "tenth" ? "tenths" : "hundredths";
}

export function columnToRoundPlace(col: DecimalPlace): RoundPlace | null {
  if (col === "tenths") return "tenth";
  if (col === "hundredths") return "hundredth";
  return null;
}

/** Column immediately to the right — the “deciding” digit for rounding. */
export function decidingColumn(target: DecimalPlace): DecimalPlace | null {
  if (target === "ones") return "tenths";
  if (target === "tenths") return "hundredths";
  if (target === "hundredths") return "thousandths";
  return null;
}

export function parseDecimalPlaces(
  value: number,
  sourceDp: number,
): {
  /** Full digits before the decimal point (e.g. "12" for 12.333). */
  wholePart: string;
  /** Fractional place columns shown after the decimal point. */
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

  return { wholePart: whole, columns, digits };
}

/** Fractional columns a student may choose as the rounding target. */
export function selectableRoundingColumns(columns: DecimalPlace[]): DecimalPlace[] {
  return columns.filter((c) => c === "tenths" || c === "hundredths");
}
