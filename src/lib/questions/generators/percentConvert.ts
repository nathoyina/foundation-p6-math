import { decimalToPercent, percentToDecimal, percentToFraction } from "@/lib/math/percent";
import { simplify } from "@/lib/math/fractions";
import { mulberry32, pick, randInt } from "../rng";
import type {
  Difficulty,
  PercentConvertQuestion,
  PercentMode,
} from "../types";

function inferDifficulty(mode: PercentMode): Difficulty {
  if (mode === "fraction-to-pct") return "hard";
  if (mode === "decimal-to-pct" || mode === "pct-to-fraction") return "medium";
  return "easy";
}

export function generatePercentConvert(
  seed: number,
  mode?: PercentMode,
): PercentConvertQuestion {
  const rng = mulberry32(seed);
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
      difficulty: inferDifficulty(m),
      prompt: `Write ${percent}% as a fraction in its simplest form.`,
      mode: m,
      percent,
      expectedFraction: fr,
    };
  }

  if (m === "decimal-to-pct") {
    const dec = percentToDecimal(percent);
    const decStr =
      Math.abs(dec) >= 0.01 && Math.abs(dec) < 1
        ? dec.toString().replace(/^0/, "0")
        : dec.toFixed(2);
    return {
      skillId: "percent-convert",
      seed,
      difficulty: inferDifficulty(m),
      prompt: `Write the decimal ${decStr} as a percentage.`,
      mode: m,
      percent,
      decimal: dec,
      expectedPercent: decimalToPercent(dec),
    };
  }

  // fraction-to-pct: start from simplified fraction equal to percent/100
  const { num, den } = simplify({ num: percent, den: 100 });
  return {
    skillId: "percent-convert",
    seed,
    difficulty: inferDifficulty(m),
    prompt: `What percentage is ${num}/${den}?`,
    mode: m,
    percent,
    fractionParts: { num, den },
    expectedPercent: percent,
  };
}
