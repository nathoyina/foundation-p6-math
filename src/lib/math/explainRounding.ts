import type { RoundPlace } from "./rounding";

export function roundingTip(place: RoundPlace): string {
  switch (place) {
    case "whole":
      return "Look at the digit in the tenths place. If it is 5 or more, round the ones digit up.";
    case "tenth":
      return "Look at the digit in the hundredths place. If it is 5 or more, round the tenths digit up.";
    case "hundredth":
      return "Look at the digit in the thousandths place. If it is 5 or more, round the hundredths digit up.";
    case "thousandth":
      return "Look at the digit in the ten-thousandths place. If it is 5 or more, round the thousandths digit up.";
  }
}

/** Digit just after the place you are rounding to (the “deciding” digit). */
export function nextDigitForRounding(value: number, place: RoundPlace): number {
  const v = Math.abs(value);
  switch (place) {
    case "whole":
      return Math.floor(v * 10) % 10;
    case "tenth":
      return Math.floor(v * 100) % 10;
    case "hundredth":
      return Math.floor(v * 1000) % 10;
    case "thousandth":
      return Math.floor(v * 10000) % 10;
  }
}
