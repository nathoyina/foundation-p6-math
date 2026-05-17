import { decimalPlacesForRounding, roundToPlace, type RoundPlace } from "@/lib/math/rounding";
import { mulberry32, randInt } from "../rng";
import type { DecimalRoundingQuestion, Difficulty } from "../types";

function inferDifficulty(place: RoundPlace, dp: number): Difficulty {
  if (place === "hundredth" && dp >= 3) return "hard";
  if (place === "tenth" && dp >= 3) return "medium";
  return "easy";
}

export function generateDecimalRounding(seed: number): DecimalRoundingQuestion {
  const rng = mulberry32(seed);
  const roundPlace: RoundPlace = rng() < 0.55 ? "tenth" : "hundredth";
  const scale = roundPlace === "tenth" ? 10 : 100;

  const intPart = randInt(rng, 0, 15);
  /** Must have at least one more dp than the rounding target (e.g. 3+ dp when rounding to hundredths). */
  const minDp = roundPlace === "tenth" ? 2 : 3;
  const maxDpExclusive = 6;
  const dp = randInt(rng, minDp, maxDpExclusive);
  const divisor = 10 ** dp;
  const numerator = randInt(rng, 1, divisor - 1);
  const value = intPart + numerator / divisor;

  const correctRounded = roundToPlace(value, roundPlace);

  const lower = Math.floor(value * scale - 3) / scale;
  const upper = Math.ceil(value * scale + 3) / scale;
  const ticks: number[] = [];
  for (let x = lower; x <= upper + 1e-9; x += 1 / scale) {
    const t = Math.round(x * scale) / scale;
    if (ticks.length === 0 || ticks[ticks.length - 1] !== t) ticks.push(t);
  }

  /** Alternate between place-value wording and “decimal places” wording (same maths). */
  const useNearestPlaceLanguage = rng() < 0.5;

  const prompt =
    useNearestPlaceLanguage
      ? roundPlace === "tenth"
        ? `Round ${value.toFixed(dp)} to the nearest tenth.`
        : `Round ${value.toFixed(dp)} to the nearest hundredth.`
      : roundPlace === "tenth"
        ? `Round ${value.toFixed(dp)} to one decimal place.`
        : `Round ${value.toFixed(dp)} to two decimal places.`;

  return {
    skillId: "decimal-rounding",
    seed,
    difficulty: inferDifficulty(roundPlace, dp),
    prompt,
    value,
    roundPlace,
    tickValues: ticks,
    correctRounded,
  };
}

export function formatValueDp(value: number, roundPlace: RoundPlace): string {
  const dp = decimalPlacesForRounding(roundPlace);
  return value.toFixed(dp);
}
