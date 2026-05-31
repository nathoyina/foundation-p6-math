import {
  improperToMixed,
  mixedToImproper as toImproper,
} from "@/lib/math/fractions";
import type { PracticeLevel } from "../level";
import { mulberry32, randInt } from "../rng";
import type { Difficulty, MixedToImproperQuestion } from "../types";

function inferDifficulty(den: number, whole: number): Difficulty {
  if (den > 10 || whole > 4) return "hard";
  if (den > 7 || whole > 3) return "medium";
  return "easy";
}

export function generateMixedToImproper(
  seed: number,
  level: PracticeLevel = "foundation",
): MixedToImproperQuestion {
  const rng = mulberry32(seed);

  if (level === "level2" && rng() < 0.5) {
    const denominator = randInt(rng, 4, 13);
    const whole = randInt(rng, 2, 8);
    const numerator = randInt(rng, 1, denominator - 1);
    const improperNum = whole * denominator + numerator;
    const answerMixed = { whole, num: numerator, den: denominator };

    return {
      skillId: "mixed-to-improper",
      seed,
      level,
      direction: "improper-to-mixed",
      difficulty: "hard",
      prompt: "Write this improper fraction as a mixed number.",
      whole,
      numerator,
      denominator,
      improperNum,
      improperDen: denominator,
      answer: { num: improperNum, den: denominator },
      answerMixed,
    };
  }

  const denominator = randInt(rng, 3, level === "level2" ? 12 : 13);
  const numerator = randInt(rng, 1, denominator);
  const whole = randInt(rng, 1, level === "level2" ? 12 : 6);
  const answer = toImproper(whole, numerator, denominator);

  return {
    skillId: "mixed-to-improper",
    seed,
    level,
    direction: "mixed-to-improper",
    difficulty: inferDifficulty(denominator, whole),
    prompt: "Write this mixed number as an improper fraction.",
    whole,
    numerator,
    denominator,
    answer,
    answerMixed: { whole, num: numerator, den: denominator },
  };
}

export function decomposeImproperForVisual(num: number, den: number) {
  const { whole, num: n, den: d } = improperToMixed(num, den);
  return { whole, numerator: n, denominator: d };
}
