import type { RoundPlace } from "@/lib/math/rounding";
import type { PracticeLevel } from "./level";

export type Difficulty = "easy" | "medium" | "hard";

export type SkillId = "decimal-rounding" | "mixed-to-improper" | "percent-convert";

export type PercentMode =
  | "pct-to-decimal"
  | "pct-to-fraction"
  | "decimal-to-pct"
  | "fraction-to-pct";

export type FractionDirection = "mixed-to-improper" | "improper-to-mixed";

export interface BaseQuestion {
  skillId: SkillId;
  seed: number;
  difficulty: Difficulty;
  level: PracticeLevel;
  prompt: string;
}

export interface DecimalRoundingQuestion extends BaseQuestion {
  skillId: "decimal-rounding";
  value: number;
  sourceDp: number;
  roundPlace: RoundPlace;
  correctRounded: number;
  answerChoices: number[];
}

export interface MixedToImproperQuestion extends BaseQuestion {
  skillId: "mixed-to-improper";
  direction: FractionDirection;
  whole: number;
  numerator: number;
  denominator: number;
  /** Set when direction is improper-to-mixed. */
  improperNum?: number;
  improperDen?: number;
  answer: { num: number; den: number };
  answerMixed?: { whole: number; num: number; den: number };
}

export interface PercentConvertQuestion extends BaseQuestion {
  skillId: "percent-convert";
  mode: PercentMode;
  /** For hundred-grid shading; may be non-integer at level 2. */
  percent: number;
  /** Use fraction bar instead of grid when true. */
  useFractionBar?: boolean;
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
