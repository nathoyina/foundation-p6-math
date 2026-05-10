import type { RoundPlace } from "@/lib/math/rounding";

export type Difficulty = "easy" | "medium" | "hard";

export type SkillId = "decimal-rounding" | "mixed-to-improper" | "percent-convert";

export type PercentMode =
  | "pct-to-decimal"
  | "pct-to-fraction"
  | "decimal-to-pct"
  | "fraction-to-pct";

export interface BaseQuestion {
  skillId: SkillId;
  seed: number;
  difficulty: Difficulty;
  prompt: string;
}

export interface DecimalRoundingQuestion extends BaseQuestion {
  skillId: "decimal-rounding";
  value: number;
  roundPlace: RoundPlace;
  tickValues: number[];
  correctRounded: number;
}

export interface MixedToImproperQuestion extends BaseQuestion {
  skillId: "mixed-to-improper";
  whole: number;
  numerator: number;
  denominator: number;
  answer: { num: number; den: number };
}

export interface PercentConvertQuestion extends BaseQuestion {
  skillId: "percent-convert";
  mode: PercentMode;
  percent: number;
  decimal?: number;
  fractionParts?: { num: number; den: number };
  expectedDecimal?: number;
  expectedPercent?: number;
  expectedFraction?: { num: number; den: number };
}

export type Question =
  | DecimalRoundingQuestion
  | MixedToImproperQuestion
  | PercentConvertQuestion;
