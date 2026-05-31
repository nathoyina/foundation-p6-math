import {
  decimalPlacesForRounding,
  FOUNDATION_ROUND_PLACES,
  LEVEL2_ROUND_PLACES,
  placeScale,
  roundToPlace,
  type RoundPlace,
} from "@/lib/math/rounding";
import type { PracticeLevel } from "../level";
import { mulberry32, pick, randInt } from "../rng";
import type { DecimalRoundingQuestion, Difficulty } from "../types";

function inferDifficulty(place: RoundPlace, dp: number): Difficulty {
  if (place === "thousandth" || place === "whole") return "hard";
  if (place === "hundredth" && dp >= 3) return "hard";
  if (place === "tenth" && dp >= 3) return "medium";
  return "easy";
}

function snapToRoundPlace(n: number, roundPlace: RoundPlace): number {
  return roundToPlace(n, roundPlace);
}

function finerScaleFor(place: RoundPlace): number {
  return placeScale(place) * 10;
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
  tryAdd(Math.round(value * finerScaleFor(roundPlace)) / finerScaleFor(roundPlace));

  const step = 1 / scale;
  tryAdd(correct + step);
  tryAdd(correct - step);
  if (roundPlace !== "whole") tryAdd(Math.round(value));

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

function minSourceDp(place: RoundPlace): number {
  switch (place) {
    case "whole":
      return 1;
    case "tenth":
      return 2;
    case "hundredth":
      return 3;
    case "thousandth":
      return 4;
  }
}

function promptFor(value: number, dp: number, place: RoundPlace, rng: () => number): string {
  const v = value.toFixed(dp);
  const nearest = rng() < 0.5;
  switch (place) {
    case "whole":
      return nearest
        ? `Round ${v} to the nearest whole number.`
        : `Round ${v} to the nearest ones.`;
    case "tenth":
      return nearest
        ? `Round ${v} to the nearest tenth.`
        : `Round ${v} to one decimal place.`;
    case "hundredth":
      return nearest
        ? `Round ${v} to the nearest hundredth.`
        : `Round ${v} to two decimal places.`;
    case "thousandth":
      return nearest
        ? `Round ${v} to the nearest thousandth.`
        : `Round ${v} to three decimal places.`;
  }
}

/** Level 2: target-place digit is 9 and deciding digit ≥ 5 so rounding carries (9 → 10). */
function generateCarryOverValue(
  rng: () => number,
  roundPlace: RoundPlace,
): { value: number; sourceDp: number } {
  const deciding = randInt(rng, 5, 10);
  const prefix = randInt(rng, 1, 100);
  const intPart = prefix * 10 + 9;

  switch (roundPlace) {
    case "whole": {
      const tail = randInt(rng, 0, 10);
      const value = (intPart * 100 + deciding * 10 + tail) / 100;
      return { value, sourceDp: tail > 0 ? 2 : 1 };
    }
    case "tenth": {
      const k = randInt(rng, 0, 10);
      const t = randInt(rng, 0, 10);
      const value = (intPart * 100000 + 90000 + deciding * 1000 + k * 100 + t * 10) / 100000;
      return { value, sourceDp: t > 0 ? 4 : k > 0 ? 3 : 2 };
    }
    case "hundredth": {
      const k = randInt(rng, 0, 10);
      const value = (intPart * 10000 + 900 + deciding * 10 + k) / 10000;
      return { value, sourceDp: k > 0 ? 4 : 3 };
    }
    case "thousandth": {
      const tenth = randInt(rng, 0, 10);
      const hundredth = randInt(rng, 0, 10);
      const value =
        (intPart * 10000 + tenth * 1000 + hundredth * 100 + 9 * 10 + deciding) / 10000;
      return { value, sourceDp: 4 };
    }
  }
}

function generateFoundationDecimal(
  rng: () => number,
  seed: number,
): DecimalRoundingQuestion {
  const roundPlace = pick(rng, FOUNDATION_ROUND_PLACES);
  const intPart = randInt(rng, 0, 16);
  const minDp = minSourceDp(roundPlace);
  const dp = randInt(rng, minDp, 6);
  const divisor = 10 ** dp;
  const numerator = randInt(rng, 1, divisor - 1);
  const value = intPart + numerator / divisor;

  const correctRounded = roundToPlace(value, roundPlace);
  const answerChoices = buildAnswerChoices(value, roundPlace, correctRounded, rng);

  return {
    skillId: "decimal-rounding",
    seed,
    level: "foundation",
    difficulty: inferDifficulty(roundPlace, dp),
    prompt: promptFor(value, dp, roundPlace, rng),
    value,
    sourceDp: dp,
    roundPlace,
    correctRounded,
    answerChoices,
  };
}

function generateLevel2Decimal(rng: () => number, seed: number): DecimalRoundingQuestion {
  const roundPlace = pick(rng, LEVEL2_ROUND_PLACES);
  const { value, sourceDp } = generateCarryOverValue(rng, roundPlace);
  const dp = Math.max(sourceDp, minSourceDp(roundPlace));
  const displayDp = Math.max(dp, sourceDp);

  const correctRounded = roundToPlace(value, roundPlace);
  const answerChoices = buildAnswerChoices(value, roundPlace, correctRounded, rng);

  return {
    skillId: "decimal-rounding",
    seed,
    level: "level2",
    difficulty: "hard",
    prompt: promptFor(value, displayDp, roundPlace, rng),
    value,
    sourceDp: displayDp,
    roundPlace,
    correctRounded,
    answerChoices,
  };
}

export function generateDecimalRounding(
  seed: number,
  level: PracticeLevel = "foundation",
): DecimalRoundingQuestion {
  const rng = mulberry32(seed);
  if (level === "level2") {
    return generateLevel2Decimal(rng, seed);
  }
  return generateFoundationDecimal(rng, seed);
}

export function formatValueDp(value: number, roundPlace: RoundPlace): string {
  return value.toFixed(decimalPlacesForRounding(roundPlace));
}

export function formatAnswerChoice(value: number, roundPlace: RoundPlace): string {
  return snapToRoundPlace(value, roundPlace).toFixed(decimalPlacesForRounding(roundPlace));
}

export function roundingCausesCarry(value: number, place: RoundPlace): boolean {
  const scale = placeScale(place);
  const before = Math.floor(value * scale) / scale;
  const after = roundToPlace(value, place);
  return after > before + 1e-9;
}
