"use client";

import { useMemo, useState } from "react";
import { SkillShell } from "@/components/SkillShell";
import { FractionBar } from "@/components/visuals/FractionBar";
import { PercentGrid } from "@/components/visuals/PercentGrid";
import { usePracticeStreak } from "@/hooks/usePracticeStreak";
import { formatFraction, simplify } from "@/lib/math/fractions";
import { generatePercentConvert } from "@/lib/questions/generators/percentConvert";
import { LEVEL_LABELS, type PracticeLevel } from "@/lib/questions/level";
import { validatePercentConvert } from "@/lib/questions/validators";
import type { PercentMode } from "@/lib/questions/types";

const MODE_LABELS: Record<PercentMode, string> = {
  "pct-to-decimal": "Percent → decimal",
  "pct-to-fraction": "Percent → simplest fraction",
  "decimal-to-pct": "Decimal → percent",
  "fraction-to-pct": "Fraction → percent",
};

export function PercentConvertPractice({
  level = "foundation",
}: {
  level?: PracticeLevel;
}) {
  const [mode, setMode] = useState<PercentMode>("pct-to-decimal");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const q = useMemo(
    () => generatePercentConvert(seed, mode, level),
    [seed, mode, level],
  );

  const [decimalStr, setDecimalStr] = useState("");
  const [percentStr, setPercentStr] = useState("");
  const [numStr, setNumStr] = useState("");
  const [denStr, setDenStr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { streak, bump } = usePracticeStreak(`p6-streak-percent-${level}`);

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

  const isLevel2 = level === "level2";
  const gridFill = Math.min(100, Math.round(q.percent));
  const reveal = submitted;
  const decimalValue = q.expectedDecimal ?? q.percent / 100;
  const pctDisplay = q.expectedPercent ?? q.percent;
  const fracDisplay =
    q.expectedFraction ??
    (q.fractionParts ? simplify(q.fractionParts) : simplify({ num: q.percent, den: 100 }));

  return (
    <SkillShell
      title={`Percentages · ${LEVEL_LABELS[level]}`}
      subtitle={
        isLevel2
          ? "Harder fractions, decimals over 1, and percentages above 100%."
          : "The hundred square shows parts out of 100."
      }
      visual={
        isLevel2 ? undefined : (
        <div className="flex flex-col items-center gap-6">
          {q.useFractionBar && q.fractionParts ? (
            <FractionBar
              numerator={q.fractionParts.num}
              denominator={q.fractionParts.den}
              labelled={reveal}
            />
          ) : (
            <PercentGrid percent={gridFill} pulse={reveal && ok} labelled={reveal} />
          )}
          {reveal ? (
            <div className="flex flex-wrap justify-center gap-4 text-center text-sm">
              <div className="rounded-xl bg-violet-100 px-4 py-2 font-semibold text-violet-900 dark:bg-violet-950 dark:text-violet-100">
                {pctDisplay}%
              </div>
              <div className="rounded-xl bg-zinc-100 px-4 py-2 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {decimalValue.toString()}
              </div>
              <div className="rounded-xl bg-emerald-100 px-4 py-2 font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                {formatFraction(fracDisplay)}
              </div>
            </div>
          ) : null}
        </div>
        )
      }
      sidebar={
        <div className="flex flex-col gap-4">
          {level === "foundation" ? (
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
          ) : null}
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
                placeholder={level === "level2" ? "e.g. 1.25" : "e.g. 0.4"}
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
                placeholder="e.g. 40 or 37.5"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>
          )}

          <button
            type="button"
            onClick={submitted ? handleNext : handleCheck}
            disabled={
              !submitted &&
              ((q.mode === "pct-to-decimal" && !decimalStr.trim()) ||
                (q.mode === "pct-to-fraction" && (!numStr.trim() || !denStr.trim())) ||
                ((q.mode === "decimal-to-pct" || q.mode === "fraction-to-pct") &&
                  !percentStr.trim()))
            }
            className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitted ? "Next question" : "Check"}
          </button>

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
                Same amount: <strong>{pctDisplay}%</strong>, decimal{" "}
                <strong>{decimalValue.toString()}</strong>, fraction{" "}
                <strong>{formatFraction(fracDisplay)}</strong>.
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isLevel2
                ? "Work from the numbers in the question."
                : q.useFractionBar
                  ? "Use the fraction bar to help you see the size of the fraction."
                  : "Percent means “out of 100”. Match your answer to what you see in the grid."}
            </p>
          )}
        </div>
      }
    />
  );
}
