import {
  decimalPlacesForRounding,
  placeScale,
  roundToPlace,
  type RoundPlace,
} from "@/lib/math/rounding";
import { mulberry32, randInt } from "../rng";
import type { DecimalRoundingQuestion, Difficulty } from "../types";

function inferDifficulty(place: RoundPlace, dp: number): Difficulty {
  if (place === "hundredth" && dp >= 3) return "hard";
  if (place === "tenth" && dp >= 3) return "medium";
  return "easy";
}

function snapToRoundPlace(n: number, roundPlace: RoundPlace): number {
  return roundToPlace(n, roundPlace);
}

function buildAnswerChoices(
  value: number,
  roundPlace: RoundPlace,
  correctRaw: number,
  rng: () => number,
): number[] {
  const scale = placeScale(roundPlace);
  const correct = snapToRoundPlace(correctRaw, roundPlace);
  const pool = new Set<number>([correct]);

  const tryAdd = (n: number) => {
    pool.add(snapToRoundPlace(n, roundPlace));
  };

  tryAdd(Math.floor(value * scale) / scale);

  const finerScale = roundPlace === "tenth" ? 100 : 1000;
  tryAdd(Math.round(value * finerScale) / finerScale);

  const step = 1 / scale;
  tryAdd(correct + step);
  tryAdd(correct - step);
  tryAdd(Math.round(value));

  let nudge = 2;
  while (pool.size < 6 && nudge < 20) {
    tryAdd(correct + nudge * step);
    tryAdd(correct - nudge * step);
    nudge += 1;
  }

  const distractors = [...pool].filter((n) => Math.abs(n - correct) > 1e-9);
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j]!, distractors[i]!];
  }

  const picked = [correct, ...distractors.slice(0, 3)];
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [picked[i], picked[j]] = [picked[j]!, picked[i]!];
  }
  return picked;
}

export function generateDecimalRounding(seed: number): DecimalRoundingQuestion {
  const rng = mulberry32(seed);
  const roundPlace: RoundPlace = rng() < 0.55 ? "tenth" : "hundredth";

  const intPart = randInt(rng, 0, 15);
  const minDp = roundPlace === "tenth" ? 2 : 3;
  const maxDpExclusive = 6;
  const dp = randInt(rng, minDp, maxDpExclusive);
  const divisor = 10 ** dp;
  const numerator = randInt(rng, 1, divisor - 1);
  const value = intPart + numerator / divisor;

  const correctRounded = roundToPlace(value, roundPlace);
  const answerChoices = buildAnswerChoices(value, roundPlace, correctRounded, rng);

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
    sourceDp: dp,
    roundPlace,
    correctRounded,
    answerChoices,
  };
}

export function formatValueDp(value: number, roundPlace: RoundPlace): string {
  const dp = decimalPlacesForRounding(roundPlace);
  return value.toFixed(dp);
}

/** Format a rounded answer for display at the target precision. */
export function formatAnswerChoice(value: number, roundPlace: RoundPlace): string {
  return snapToRoundPlace(value, roundPlace).toFixed(decimalPlacesForRounding(roundPlace));
}
