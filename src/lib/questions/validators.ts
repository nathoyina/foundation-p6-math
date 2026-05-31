import { fractionsEqual, simplify, type Fraction } from "@/lib/math/fractions";
import { roundPlaceToColumn, type DecimalPlace } from "@/lib/math/placeValue";
import type {
  DecimalRoundingQuestion,
  MixedToImproperQuestion,
  PercentConvertQuestion,
} from "./types";

const EPS = 1e-9;
const PCT_EPS = 0.05;

export function validateDecimalRounding(
  q: DecimalRoundingQuestion,
  selected: number,
): boolean {
  return Math.abs(selected - q.correctRounded) < EPS;
}

export function validateRoundingPlace(
  q: DecimalRoundingQuestion,
  selected: DecimalPlace,
): boolean {
  const expected = roundPlaceToColumn(q.roundPlace);
  return selected === expected;
}

export function validateMixedToImproper(
  q: MixedToImproperQuestion,
  student: Fraction,
): boolean {
  if (student.den === 0) return false;
  return fractionsEqual(simplify(student), simplify(q.answer));
}

export function validateImproperToMixed(
  q: MixedToImproperQuestion,
  wholeStr: string,
  numStr: string,
  denStr: string,
): boolean {
  if (!q.answerMixed) return false;
  const whole = Number(wholeStr);
  const num = Number(numStr);
  const den = Number(denStr);
  if (!Number.isFinite(whole) || !Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
    return false;
  }
  const a = q.answerMixed;
  return whole === a.whole && num === a.num && den === a.den;
}

export function parseFractionInput(numStr: string, denStr: string): Fraction | null {
  const num = Number(numStr);
  const den = Number(denStr);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
  return { num: Math.trunc(num), den: Math.trunc(den) };
}

export function validatePercentConvert(
  q: PercentConvertQuestion,
  input: {
    decimalStr?: string;
    percentStr?: string;
    numStr?: string;
    denStr?: string;
  },
): boolean {
  switch (q.mode) {
    case "pct-to-decimal": {
      const v = Number(input.decimalStr?.trim());
      if (!Number.isFinite(v) || q.expectedDecimal === undefined) return false;
      return Math.abs(v - q.expectedDecimal) < EPS;
    }
    case "pct-to-fraction": {
      const f = parseFractionInput(input.numStr ?? "", input.denStr ?? "");
      if (!f || !q.expectedFraction) return false;
      return fractionsEqual(simplify(f), simplify(q.expectedFraction));
    }
    case "decimal-to-pct": {
      const raw = input.percentStr?.trim().replace(/%/g, "") ?? "";
      const v = Number(raw);
      if (!Number.isFinite(v) || q.expectedPercent === undefined) return false;
      const tol = q.level === "level2" ? PCT_EPS : EPS;
      return Math.abs(v - q.expectedPercent) < tol;
    }
    case "fraction-to-pct": {
      const raw = input.percentStr?.trim().replace(/%/g, "") ?? "";
      const v = Number(raw);
      if (!Number.isFinite(v) || q.expectedPercent === undefined) return false;
      const tol = q.level === "level2" ? PCT_EPS : EPS;
      return Math.abs(v - q.expectedPercent) < tol;
    }
    default:
      return false;
  }
}
