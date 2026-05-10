export type RoundPlace = "tenth" | "hundredth";

export function placeScale(place: RoundPlace): number {
  return place === "tenth" ? 10 : 100;
}

export function roundToPlace(value: number, place: RoundPlace): number {
  const scale = placeScale(place);
  return Math.round(value * scale) / scale;
}

export function decimalPlacesForRounding(place: RoundPlace): number {
  return place === "tenth" ? 1 : 2;
}
