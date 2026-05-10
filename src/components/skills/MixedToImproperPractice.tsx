"use client";

import { useMemo, useState } from "react";
import { SkillShell } from "@/components/SkillShell";
import { MixedFractionMath } from "@/components/math/MixedFractionMath";
import { MixedFractionCircles } from "@/components/visuals/MixedFractionCircles";
import { usePracticeStreak } from "@/hooks/usePracticeStreak";
import { formatFraction, simplify } from "@/lib/math/fractions";
import { generateMixedToImproper } from "@/lib/questions/generators/mixedToImproper";
import { parseFractionInput, validateMixedToImproper } from "@/lib/questions/validators";

export function MixedToImproperPractice() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const q = useMemo(() => generateMixedToImproper(seed), [seed]);
  const [numStr, setNumStr] = useState("");
  const [denStr, setDenStr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { streak, bump } = usePracticeStreak("p6-streak-mixed-improper");

  const parsed = parseFractionInput(numStr, denStr);
  const correct = parsed ? validateMixedToImproper(q, parsed) : false;

  function handleCheck() {
    const p = parseFractionInput(numStr, denStr);
    if (!p) return;
    bump(validateMixedToImproper(q, p));
    setSubmitted(true);
  }

  function handleNext() {
    setSeed((s) => s + 7919);
    setNumStr("");
    setDenStr("");
    setSubmitted(false);
  }

  const ans = simplify(q.answer);

  return (
    <SkillShell
      title="Mixed to improper fraction"
      subtitle="Each whole is a full circle; the last circle shows the leftover parts."
      visual={
        <MixedFractionCircles
          whole={q.whole}
          numerator={q.numerator}
          denominator={q.denominator}
          animateBurst={submitted && correct}
        />
      }
      sidebar={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-base text-zinc-700 dark:text-zinc-300">{q.prompt}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 dark:border-zinc-600 dark:bg-zinc-900/60">
              <MixedFractionMath
                whole={q.whole}
                numerator={q.numerator}
                denominator={q.denominator}
                size="lg"
                className="text-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Streak: <strong>{streak}</strong>
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Numerator
              <input
                inputMode="numeric"
                value={numStr}
                onChange={(e) => !submitted && setNumStr(e.target.value)}
                disabled={submitted}
                className="w-28 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>
            <span className="pb-2 text-lg font-semibold text-zinc-500">/</span>
            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Denominator
              <input
                inputMode="numeric"
                value={denStr}
                onChange={(e) => !submitted && setDenStr(e.target.value)}
                disabled={submitted}
                className="w-28 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCheck}
              disabled={submitted || !numStr.trim() || !denStr.trim()}
              className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Next question
            </button>
          </div>
          {submitted ? (
            <div
              role="status"
              className={`rounded-xl border px-3 py-3 text-sm ${
                correct
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                  : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
              }`}
            >
              <p className="font-semibold">{correct ? "Correct!" : "Let’s fix it."}</p>
              <p className="mt-2 text-zinc-800 dark:text-zinc-200">
                Answer: <strong>{formatFraction(ans)}</strong>. Think:{" "}
                <strong>{q.whole}</strong> wholes × <strong>{q.denominator}</strong> parts, plus{" "}
                <strong>{q.numerator}</strong> extra parts → numerator{" "}
                <strong>{q.whole * q.denominator + q.numerator}</strong>.
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Tip: multiply the whole number by the denominator, then add the numerator.
            </p>
          )}
        </div>
      }
    />
  );
}
