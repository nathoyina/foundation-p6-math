import { decimalToPercent, percentToDecimal, percentToFraction } from "@/lib/math/percent";
import { simplify } from "@/lib/math/fractions";
import type { PracticeLevel } from "../level";
import { mulberry32, pick, randInt } from "../rng";
import type {
  Difficulty,
  PercentConvertQuestion,
  PercentMode,
} from "../types";

const L2_FRACTIONS: { num: number; den: number }[] = [
  { num: 1, den: 8 },
  { num: 3, den: 8 },
  { num: 1, den: 4 },
  { num: 3, den: 4 },
  { num: 2, den: 5 },
  { num: 3, den: 5 },
  { num: 7, den: 20 },
  { num: 3, den: 20 },
];

function inferDifficulty(mode: PercentMode): Difficulty {
  if (mode === "fraction-to-pct") return "hard";
  if (mode === "decimal-to-pct" || mode === "pct-to-fraction") return "medium";
  return "easy";
}

export function generatePercentConvert(
  seed: number,
  mode?: PercentMode,
  level: PracticeLevel = "foundation",
): PercentConvertQuestion {
  const rng = mulberry32(seed);

  if (level === "foundation") {
    return generateFoundationPercent(rng, seed, mode);
  }
  return generateLevel2Percent(rng, seed, mode);
}

function generateFoundationPercent(
  rng: () => number,
  seed: number,
  mode?: PercentMode,
): PercentConvertQuestion {
  const m =
    mode ??
    pick(rng, [
      "pct-to-decimal",
      "pct-to-fraction",
      "decimal-to-pct",
      "fraction-to-pct",
    ] as const);

  const percent = randInt(rng, 5, 100);

  if (m === "pct-to-decimal") {
    const dec = percentToDecimal(percent);
    return {
      skillId: "percent-convert",
      seed,
      level: "foundation",
      difficulty: inferDifficulty(m),
      prompt: `Write ${percent}% as a decimal.`,
      mode: m,
      percent,
      expectedDecimal: dec,
    };
  }

  if (m === "pct-to-fraction") {
    const fr = percentToFraction(percent);
    return {
      skillId: "percent-convert",
      seed,
      level: "foundation",
      difficulty: inferDifficulty(m),
      prompt: `Write ${percent}% as a fraction in its simplest form.`,
      mode: m,
      percent,
      expectedFraction: fr,
    };
  }

  if (m === "decimal-to-pct") {
    const dec = percentToDecimal(percent);
    return {
      skillId: "percent-convert",
      seed,
      level: "foundation",
      difficulty: inferDifficulty(m),
      prompt: `Write the decimal ${dec.toFixed(2)} as a percentage.`,
      mode: m,
      percent,
      decimal: dec,
      expectedPercent: decimalToPercent(dec),
    };
  }

  const { num, den } = simplify({ num: percent, den: 100 });
  return {
    skillId: "percent-convert",
    seed,
    level: "foundation",
    difficulty: inferDifficulty(m),
    prompt: `What percentage is ${num}/${den}?`,
    mode: m,
    percent,
    fractionParts: { num, den },
    expectedPercent: percent,
  };
}

function generateLevel2Percent(
  rng: () => number,
  seed: number,
  mode?: PercentMode,
): PercentConvertQuestion {
  const m =
    mode ??
    pick(rng, [
      "pct-to-decimal",
      "pct-to-fraction",
      "decimal-to-pct",
      "fraction-to-pct",
    ] as const);

  if (m === "pct-to-decimal") {
    const pct = pick(rng, [125, 150, 175, 200, 250] as const);
    const dec = percentToDecimal(pct);
    return {
      skillId: "percent-convert",
      seed,
      level: "level2",
      difficulty: "hard",
      prompt: `Write ${pct}% as a decimal.`,
      mode: m,
      percent: pct,
      expectedDecimal: dec,
    };
  }

  if (m === "pct-to-fraction") {
    const pct = pick(rng, [35, 45, 125, 150, 225] as const);
    const fr = percentToFraction(pct);
    return {
      skillId: "percent-convert",
      seed,
      level: "level2",
      difficulty: "hard",
      prompt: `Write ${pct}% as a fraction in its simplest form.`,
      mode: m,
      percent: pct,
      expectedFraction: fr,
    };
  }

  if (m === "decimal-to-pct") {
    const fr = pick(rng, L2_FRACTIONS);
    const dec = fr.num / fr.den;
    const pct = decimalToPercent(dec);
    return {
      skillId: "percent-convert",
      seed,
      level: "level2",
      difficulty: "hard",
      prompt: `Write the decimal ${dec} as a percentage.`,
      mode: m,
      percent: pct,
      decimal: dec,
      useFractionBar: true,
      fractionParts: fr,
      expectedPercent: pct,
    };
  }

  const fr = pick(rng, L2_FRACTIONS);
  const pct = decimalToPercent(fr.num / fr.den);
  const { num, den } = simplify(fr);
  return {
    skillId: "percent-convert",
    seed,
    level: "level2",
    difficulty: "hard",
    prompt: `What percentage is ${num}/${den}?`,
    mode: m,
    percent: pct,
    useFractionBar: true,
    fractionParts: { num, den },
    expectedPercent: pct,
  };
}
