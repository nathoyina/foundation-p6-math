import { describe, expect, it } from "vitest";
import { decimalPlacesForRounding } from "@/lib/math/rounding";
import { generateDecimalRounding } from "./decimalRounding";

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
});
