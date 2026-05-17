import { describe, expect, it } from "vitest";
import { decimalPlacesForRounding } from "@/lib/math/rounding";
import { formatAnswerChoice, generateDecimalRounding } from "./decimalRounding";

function decimalPlacesShownInPrompt(prompt: string): number {
  const match = prompt.match(/Round ([\d.]+)/);
  if (!match) return 0;
  const numStr = match[1];
  if (!numStr.includes(".")) return 0;
  return numStr.split(".")[1]!.length;
}

describe("generateDecimalRounding", () => {
  it("shows at least one more decimal place than the rounding target", () => {
    for (let seed = 0; seed < 300; seed++) {
      const q = generateDecimalRounding(seed);
      const shownDp = decimalPlacesShownInPrompt(q.prompt);
      const targetDp = decimalPlacesForRounding(q.roundPlace);
      expect(shownDp).toBeGreaterThan(targetDp);
    }
  });

  it("always includes the correct rounded value in answer choices", () => {
    for (let seed = 0; seed < 500; seed++) {
      const q = generateDecimalRounding(seed);
      expect(q.answerChoices).toHaveLength(4);
      const hasCorrect = q.answerChoices.some(
        (c) => Math.abs(c - q.correctRounded) < 1e-9,
      );
      expect(hasCorrect).toBe(true);
    }
  });

  it("shows four different labels on the answer buttons", () => {
    for (let seed = 0; seed < 500; seed++) {
      const q = generateDecimalRounding(seed);
      const labels = q.answerChoices.map((c) =>
        formatAnswerChoice(c, q.roundPlace),
      );
      expect(new Set(labels).size).toBe(4);
    }
  });
});
