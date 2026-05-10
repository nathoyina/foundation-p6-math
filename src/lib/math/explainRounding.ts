import type { RoundPlace } from "./rounding";

export function roundingTip(place: RoundPlace): string {
  if (place === "tenth") {
    return "Look at the digit in the hundredths place. If it is 5 or more, round the tenths digit up.";
  }
  return "Look at the digit in the thousandths place. If it is 5 or more, round the hundredths digit up.";
}

/** Digit just after the place you are rounding to (the “deciding” digit). */
export function nextDigitForRounding(value: number, place: RoundPlace): number {
  const v = Math.abs(value);
  if (place === "tenth") {
    return Math.floor(v * 100) % 10;
  }
  return Math.floor(v * 1000) % 10;
}
