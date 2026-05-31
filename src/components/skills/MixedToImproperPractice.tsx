"use client";

import { useMemo, useState } from "react";
import { SkillShell } from "@/components/SkillShell";
import { MixedFractionMath } from "@/components/math/MixedFractionMath";
import { MixedFractionCircles } from "@/components/visuals/MixedFractionCircles";
import { ImproperFractionLabel } from "@/components/visuals/ImproperFractionLabel";
import { usePracticeStreak } from "@/hooks/usePracticeStreak";
import { formatFraction, simplify } from "@/lib/math/fractions";
import { generateMixedToImproper } from "@/lib/questions/generators/mixedToImproper";
import { LEVEL_LABELS, type PracticeLevel } from "@/lib/questions/level";
import {
  parseFractionInput,
  validateImproperToMixed,
  validateMixedToImproper,
} from "@/lib/questions/validators";

export function MixedToImproperPractice({
  level = "foundation",
}: {
  level?: PracticeLevel;
}) {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const q = useMemo(() => generateMixedToImproper(seed, level), [seed, level]);

  const [wholeStr, setWholeStr] = useState("");
  const [numStr, setNumStr] = useState("");
  const [denStr, setDenStr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const streakKey = `p6-streak-mixed-improper-${level}`;
  const { streak, bump } = usePracticeStreak(streakKey);

  const isImproperToMixed = q.direction === "improper-to-mixed";
  const improperNum = q.improperNum ?? q.answer.num;
  const improperDen = q.improperDen ?? q.answer.den;

  const parsed = parseFractionInput(numStr, denStr);
  const correct = isImproperToMixed
    ? validateImproperToMixed(q, wholeStr, numStr, denStr)
    : parsed
      ? validateMixedToImproper(q, parsed)
      : false;

  function handleCheck() {
    const ok = isImproperToMixed
      ? validateImproperToMixed(q, wholeStr, numStr, denStr)
      : (() => {
          const p = parseFractionInput(numStr, denStr);
          return p ? validateMixedToImproper(q, p) : false;
        })();
    bump(ok);
    setSubmitted(true);
  }

  function handleNext() {
    setSeed((s) => s + 7919);
    setWholeStr("");
    setNumStr("");
    setDenStr("");
    setSubmitted(false);
  }

  const ans = simplify(q.answer);
  const isLevel2 = level === "level2";

  const questionDisplay = isImproperToMixed ? (
    <span className="text-2xl font-bold tabular-nums text-amber-900 dark:text-amber-100">
      {formatFraction({ num: improperNum, den: improperDen })}
    </span>
  ) : (
    <MixedFractionMath
      whole={q.whole}
      numerator={q.numerator}
      denominator={q.denominator}
      size="lg"
      className="text-zinc-900 dark:text-zinc-50"
    />
  );

  return (
    <SkillShell
      title={`Fractions · ${LEVEL_LABELS[level]}`}
      subtitle={
        isLevel2
          ? "Convert using the numbers shown."
          : isImproperToMixed
            ? "Count the wholes in the diagram, then write the mixed number."
            : "Each whole is a full circle; the last circle shows the leftover parts."
      }
      visual={
        isLevel2 ? undefined : (
          <div className="flex flex-col items-center gap-6">
            {isImproperToMixed ? (
              <ImproperFractionLabel num={improperNum} den={improperDen} />
            ) : null}
            <MixedFractionCircles
              whole={q.whole}
              numerator={q.numerator}
              denominator={q.denominator}
              animateBurst={submitted && correct}
            />
          </div>
        )
      }
      sidebar={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {isLevel2 ? (
              <div className="flex flex-wrap items-center gap-3">
                {questionDisplay}
              </div>
            ) : null}
            <p className="text-base text-zinc-700 dark:text-zinc-300">{q.prompt}</p>
            {!isImproperToMixed && !isLevel2 ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 dark:border-zinc-600 dark:bg-zinc-900/60">
                <MixedFractionMath
                  whole={q.whole}
                  numerator={q.numerator}
                  denominator={q.denominator}
                  size="lg"
                  className="text-zinc-900 dark:text-zinc-50"
                />
              </div>
            ) : null}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Streak: <strong>{streak}</strong>
          </p>

          {isImproperToMixed ? (
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Whole
                <input
                  inputMode="numeric"
                  value={wholeStr}
                  onChange={(e) => !submitted && setWholeStr(e.target.value)}
                  disabled={submitted}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Numerator
                <input
                  inputMode="numeric"
                  value={numStr}
                  onChange={(e) => !submitted && setNumStr(e.target.value)}
                  disabled={submitted}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
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
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-600 dark:bg-zinc-900"
                />
              </label>
            </div>
          ) : (
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
          )}

          <button
            type="button"
            onClick={submitted ? handleNext : handleCheck}
            disabled={
              !submitted &&
              (isImproperToMixed
                ? !wholeStr.trim() || !numStr.trim() || !denStr.trim()
                : !numStr.trim() || !denStr.trim())
            }
            className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitted ? "Next question" : "Check"}
          </button>

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
              {isImproperToMixed && q.answerMixed ? (
                <p className="mt-2 text-zinc-800 dark:text-zinc-200">
                  Answer:{" "}
                  <strong>
                    {q.answerMixed.whole} {q.answerMixed.num}/{q.answerMixed.den}
                  </strong>
                  . There are <strong>{q.answerMixed.whole}</strong> full groups of{" "}
                  <strong>{q.answerMixed.den}</strong> in {improperNum}/{improperDen}.
                </p>
              ) : (
                <p className="mt-2 text-zinc-800 dark:text-zinc-200">
                  Answer: <strong>{formatFraction(ans)}</strong>. Think:{" "}
                  <strong>{q.whole}</strong> wholes × <strong>{q.denominator}</strong> parts, plus{" "}
                  <strong>{q.numerator}</strong> extra parts → numerator{" "}
                  <strong>{q.whole * q.denominator + q.numerator}</strong>.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isImproperToMixed
                ? "Tip: divide the numerator by the denominator to find the whole and remainder."
                : "Tip: multiply the whole number by the denominator, then add the numerator."}
            </p>
          )}
        </div>
      }
    />
  );
}
