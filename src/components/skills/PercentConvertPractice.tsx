"use client";

import { useState } from "react";
import { SkillShell } from "@/components/SkillShell";
import { PercentGrid } from "@/components/visuals/PercentGrid";
import { usePracticeStreak } from "@/hooks/usePracticeStreak";
import { formatFraction, simplify } from "@/lib/math/fractions";
import { generatePercentConvert } from "@/lib/questions/generators/percentConvert";
import { validatePercentConvert } from "@/lib/questions/validators";
import type { PercentMode } from "@/lib/questions/types";

const MODE_LABELS: Record<PercentMode, string> = {
  "pct-to-decimal": "Percent → decimal",
  "pct-to-fraction": "Percent → simplest fraction",
  "decimal-to-pct": "Decimal → percent",
  "fraction-to-pct": "Fraction → percent",
};

export function PercentConvertPractice() {
  const [mode, setMode] = useState<PercentMode>("pct-to-decimal");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const q = generatePercentConvert(seed, mode);

  const [decimalStr, setDecimalStr] = useState("");
  const [percentStr, setPercentStr] = useState("");
  const [numStr, setNumStr] = useState("");
  const [denStr, setDenStr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { streak, bump } = usePracticeStreak("p6-streak-percent");

  const ok =
    submitted &&
    validatePercentConvert(q, {
      decimalStr,
      percentStr,
      numStr,
      denStr,
    });

  function handleCheck() {
    const valid = validatePercentConvert(q, {
      decimalStr,
      percentStr,
      numStr,
      denStr,
    });
    bump(valid);
    setSubmitted(true);
  }

  function handleNext() {
    setSeed((s) => s + 6841);
    setDecimalStr("");
    setPercentStr("");
    setNumStr("");
    setDenStr("");
    setSubmitted(false);
  }

  function handleModeChange(m: PercentMode) {
    setMode(m);
    setSeed((s) => s + 31);
    setDecimalStr("");
    setPercentStr("");
    setNumStr("");
    setDenStr("");
    setSubmitted(false);
  }

  /** Shaded amount matches the quantity (same as answer %) so it stays consistent across modes. */
  const gridFill = q.percent;

  const reveal = submitted;

  const decimalValue = q.expectedDecimal ?? q.percent / 100;

  return (
    <SkillShell
      title="Percentages, decimals, and fractions"
      subtitle="The hundred square shows parts out of 100."
      visual={
        <div className="flex flex-col items-center gap-6">
          <PercentGrid
            percent={gridFill}
            pulse={reveal && ok}
            labelled={reveal}
          />
          {reveal ? (
            <div className="flex flex-wrap justify-center gap-4 text-center text-sm">
              <div className="rounded-xl bg-violet-100 px-4 py-2 font-semibold text-violet-900 dark:bg-violet-950 dark:text-violet-100">
                {q.percent}%
              </div>
              <div className="rounded-xl bg-zinc-100 px-4 py-2 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {decimalValue.toString()}
              </div>
              <div className="rounded-xl bg-emerald-100 px-4 py-2 font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                {formatFraction(simplify({ num: q.percent, den: 100 }))}
              </div>
            </div>
          ) : null}
        </div>
      }
      sidebar={
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Practice type
            <select
              value={mode}
              onChange={(e) => handleModeChange(e.target.value as PercentMode)}
              disabled={submitted}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
            >
              {(Object.keys(MODE_LABELS) as PercentMode[]).map((m) => (
                <option key={m} value={m}>
                  {MODE_LABELS[m]}
                </option>
              ))}
            </select>
          </label>
          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{q.prompt}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Streak: <strong>{streak}</strong>
          </p>

          {q.mode === "pct-to-decimal" ? (
            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Decimal answer
              <input
                inputMode="decimal"
                value={decimalStr}
                onChange={(e) => !submitted && setDecimalStr(e.target.value)}
                disabled={submitted}
                placeholder="e.g. 0.4"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>
          ) : null}

          {q.mode === "pct-to-fraction" ? (
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
          ) : null}

          {(q.mode === "decimal-to-pct" || q.mode === "fraction-to-pct") && (
            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Percent answer
              <input
                inputMode="decimal"
                value={percentStr}
                onChange={(e) => !submitted && setPercentStr(e.target.value)}
                disabled={submitted}
                placeholder="e.g. 40 or 40%"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCheck}
              disabled={
                submitted ||
                (q.mode === "pct-to-decimal" && !decimalStr.trim()) ||
                (q.mode === "pct-to-fraction" && (!numStr.trim() || !denStr.trim())) ||
                ((q.mode === "decimal-to-pct" || q.mode === "fraction-to-pct") &&
                  !percentStr.trim())
              }
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
                ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                  : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
              }`}
            >
              <p className="font-semibold">{ok ? "Well done!" : "Keep practising."}</p>
              <p className="mt-2 text-zinc-800 dark:text-zinc-200">
                Same amount can be written as <strong>{q.percent}%</strong>, decimal{" "}
                <strong>{decimalValue.toString()}</strong>, or fraction{" "}
                <strong>{formatFraction(simplify({ num: q.percent, den: 100 }))}</strong>.
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Percent means “out of 100”. Match your answer to what you see in the grid.
            </p>
          )}
        </div>
      }
    />
  );
}
