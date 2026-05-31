export type RoundPlace = "whole" | "tenth" | "hundredth" | "thousandth";

export function placeScale(place: RoundPlace): number {
  switch (place) {
    case "whole":
      return 1;
    case "tenth":
      return 10;
    case "hundredth":
      return 100;
    case "thousandth":
      return 1000;
  }
}

export function roundToPlace(value: number, place: RoundPlace): number {
  const scale = placeScale(place);
  return Math.round(value * scale) / scale;
}

export function decimalPlacesForRounding(place: RoundPlace): number {
  switch (place) {
    case "whole":
      return 0;
    case "tenth":
      return 1;
    case "hundredth":
      return 2;
    case "thousandth":
      return 3;
  }
}

/** Foundation rounding targets only. */
export const FOUNDATION_ROUND_PLACES: RoundPlace[] = ["tenth", "hundredth"];

/** Level 2 adds nearest whole and thousandths. */
export const LEVEL2_ROUND_PLACES: RoundPlace[] = [
  "whole",
  "tenth",
  "hundredth",
  "thousandth",
];
