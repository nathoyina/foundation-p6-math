import { generateDecimalRounding } from "./generators/decimalRounding";
import { generateMixedToImproper } from "./generators/mixedToImproper";
import { generatePercentConvert } from "./generators/percentConvert";
import type { PercentMode, Question, SkillId } from "./types";

export function generateQuestion(skill: SkillId, seed: number, percentMode?: PercentMode): Question {
  switch (skill) {
    case "decimal-rounding":
      return generateDecimalRounding(seed);
    case "mixed-to-improper":
      return generateMixedToImproper(seed);
    case "percent-convert":
      return generatePercentConvert(seed, percentMode);
    default: {
      const _exhaustive: never = skill;
      return _exhaustive;
    }
  }
}
