"use client";

import { useMemo, useState } from "react";
import { SkillShell } from "@/components/SkillShell";
import { NumberLine } from "@/components/visuals/NumberLine";
import { usePracticeStreak } from "@/hooks/usePracticeStreak";
import { nextDigitForRounding, roundingTip } from "@/lib/math/explainRounding";
import { generateDecimalRounding } from "@/lib/questions/generators/decimalRounding";
import { validateDecimalRounding } from "@/lib/questions/validators";

export function DecimalRoundingPractice() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const q = useMemo(() => generateDecimalRounding(seed), [seed]);
  const [selectedTick, setSelectedTick] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { streak, bump } = usePracticeStreak("p6-streak-decimal-rounding");

  const correct =
    selectedTick !== null ? validateDecimalRounding(q, selectedTick) : false;

  const nextDigit = nextDigitForRounding(q.value, q.roundPlace);

  function handleCheck() {
    if (selectedTick === null) return;
    const ok = validateDecimalRounding(q, selectedTick);
    bump(ok);
    setSubmitted(true);
  }

  function handleNext() {
    setSeed((s) => s + 9973);
    setSelectedTick(null);
    setSubmitted(false);
  }

  return (
    <SkillShell
      title="Decimal rounding"
      subtitle="Use the number line to pick the rounded value."
      visual={
        <NumberLine
          ticks={q.tickValues}
          exactValue={q.value}
          roundPlace={q.roundPlace}
          selectedTick={selectedTick}
          onSelectTick={(v) => {
            if (!submitted) setSelectedTick(v);
          }}
          disabled={submitted}
          revealCorrect={submitted}
          correctTick={q.correctRounded}
        />
      }
      sidebar={
        <div className="flex flex-col gap-4">
          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{q.prompt}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Streak: <strong>{streak}</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCheck}
              disabled={selectedTick === null || submitted}
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
              <p className="font-semibold">{correct ? "Nice — correct!" : "Not quite."}</p>
              <p className="mt-2 text-zinc-800 dark:text-zinc-200">
                Rounded answer: <strong>{q.correctRounded}</strong>. The next digit was{" "}
                <strong>{nextDigit}</strong>. {roundingTip(q.roundPlace)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{roundingTip(q.roundPlace)}</p>
          )}
        </div>
      }
    />
  );
}
