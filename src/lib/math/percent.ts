import { simplify, type Fraction } from "./fractions";

export function percentToDecimal(percent: number): number {
  return percent / 100;
}

export function decimalToPercent(decimal: number): number {
  return decimal * 100;
}

/** Percent as fraction of 100, simplified (e.g. 40% -> 2/5). */
export function percentToFraction(percent: number): Fraction {
  return simplify({ num: percent, den: 100 });
}
