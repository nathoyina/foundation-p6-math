import { mixedToImproper as toImproper } from "@/lib/math/fractions";
import { mulberry32, randInt } from "../rng";
import type { Difficulty, MixedToImproperQuestion } from "../types";

function inferDifficulty(den: number, whole: number): Difficulty {
  if (den > 10 || whole > 4) return "hard";
  if (den > 7 || whole > 3) return "medium";
  return "easy";
}

export function generateMixedToImproper(seed: number): MixedToImproperQuestion {
  const rng = mulberry32(seed);
  const denominator = randInt(rng, 3, 13);
  const numerator = randInt(rng, 1, denominator);
  const whole = randInt(rng, 1, 6);

  const answer = toImproper(whole, numerator, denominator);

  const prompt = "Write this mixed number as an improper fraction.";

  return {
    skillId: "mixed-to-improper",
    seed,
    difficulty: inferDifficulty(denominator, whole),
    prompt,
    whole,
    numerator,
    denominator,
    answer,
  };
}
