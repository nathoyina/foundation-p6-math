"use client";

import { useMemo, useState } from "react";
import { SkillShell } from "@/components/SkillShell";
import { DecimalPlaceChart } from "@/components/visuals/DecimalPlaceChart";
import { usePracticeStreak } from "@/hooks/usePracticeStreak";
import { nextDigitForRounding, roundingTip } from "@/lib/math/explainRounding";
import {
  PLACE_LABELS,
  parseDecimalPlaces,
  roundPlaceToColumn,
  selectableRoundingColumns,
  type DecimalPlace,
} from "@/lib/math/placeValue";
import {
  formatAnswerChoice,
  generateDecimalRounding,
} from "@/lib/questions/generators/decimalRounding";
import {
  validateDecimalRounding,
  validateRoundingPlace,
} from "@/lib/questions/validators";

type Phase = "pick-digit" | "pick-answer" | "done";

export function DecimalRoundingPractice() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const q = useMemo(() => generateDecimalRounding(seed), [seed]);

  const [phase, setPhase] = useState<Phase>("pick-digit");
  const [selectedPlace, setSelectedPlace] = useState<DecimalPlace | null>(null);
  const [placeChecked, setPlaceChecked] = useState(false);
  const [placeCorrect, setPlaceCorrect] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { streak, bump } = usePracticeStreak("p6-streak-decimal-rounding");

  const { columns } = parseDecimalPlaces(q.value, q.sourceDp);
  const selectable = selectableRoundingColumns(columns);

  const answerCorrect =
    selectedAnswer !== null ? validateDecimalRounding(q, selectedAnswer) : false;
  const fullyCorrect = placeCorrect && answerCorrect;

  const nextDigit = nextDigitForRounding(q.value, q.roundPlace);
  const targetPlace = roundPlaceToColumn(q.roundPlace);

  const chartStep: 1 | 2 = phase === "pick-digit" ? 1 : 2;
  const showHighlights = placeCorrect && !submitted;

  function handleCheckPlace() {
    if (selectedPlace === null) return;
    const ok = validateRoundingPlace(q, selectedPlace);
    setPlaceCorrect(ok);
    setPlaceChecked(true);
    if (ok) setPhase("pick-answer");
  }

  function handleCheckAnswer() {
    if (selectedAnswer === null) return;
    const ok = validateDecimalRounding(q, selectedAnswer);
    bump(ok && placeCorrect);
    setSubmitted(true);
    setPhase("done");
  }

  function handleNext() {
    setSeed((s) => s + 9973);
    setPhase("pick-digit");
    setSelectedPlace(null);
    setPlaceChecked(false);
    setPlaceCorrect(false);
    setSelectedAnswer(null);
    setSubmitted(false);
  }

  function resetPlaceTry() {
    setPlaceChecked(false);
    setSelectedPlace(null);
  }

  return (
    <SkillShell
      title="Decimal rounding"
      subtitle="First find which place to round to, then choose the rounded number."
      visual={
        <div className="flex w-full flex-col items-center gap-10">
          <DecimalPlaceChart
            value={q.value}
            sourceDp={q.sourceDp}
            step={chartStep}
            selectablePlaces={selectable}
            selectedPlace={selectedPlace}
            onSelectPlace={(p) => {
              if (phase === "pick-digit" && !placeChecked) setSelectedPlace(p);
            }}
            disabled={phase !== "pick-digit" || placeChecked}
            revealTarget={showHighlights}
            targetPlace={targetPlace}
            highlightDeciding={showHighlights}
          />

          {phase === "pick-answer" || phase === "done" ? (
            <div className="w-full max-w-lg">
              <p className="mb-3 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Step 2: Pick the rounded answer (e.g. 3.47 — not just the one digit you tapped).
              </p>
              <div
                className="grid grid-cols-2 gap-3"
                role="group"
                aria-label="Rounded answer choices"
              >
                {q.answerChoices.map((choice, idx) => {
                  const isSel = selectedAnswer === choice;
                  const isCorrectChoice =
                    submitted && Math.abs(choice - q.correctRounded) < 1e-9;
                  const isWrongSel = submitted && isSel && !answerCorrect;

                  return (
                    <button
                      key={`${idx}-${formatAnswerChoice(choice, q.roundPlace)}`}
                      type="button"
                      disabled={submitted}
                      onClick={() => !submitted && setSelectedAnswer(choice)}
                      className={`rounded-xl border-2 px-4 py-3 text-lg font-semibold tabular-nums transition ${
                        isCorrectChoice
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
                          : isWrongSel
                            ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-100"
                            : isSel
                              ? "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100"
                              : "border-zinc-200 bg-white text-zinc-900 hover:border-sky-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                      } disabled:cursor-default`}
                      aria-pressed={isSel}
                    >
                      {formatAnswerChoice(choice, q.roundPlace)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      }
      sidebar={
        <div className="flex flex-col gap-4">
          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{q.prompt}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Streak: <strong>{streak}</strong>
          </p>

          {phase === "pick-digit" ? (
            <>
              <button
                type="button"
                onClick={handleCheckPlace}
                disabled={selectedPlace === null || placeChecked}
                className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check
              </button>
              {placeChecked && !placeCorrect ? (
                <div
                  role="status"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
                >
                  <p className="font-semibold">Not that digit.</p>
                  <p className="mt-2">
                    Read the question again — does it say <strong>tenth</strong> or{" "}
                    <strong>hundredth</strong> (or one vs two decimal places)? Tap the matching
                    digit.
                  </p>
                  <button
                    type="button"
                    onClick={resetPlaceTry}
                    className="mt-3 text-sm font-semibold text-sky-700 underline dark:text-sky-400"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Read the question, then tap the digit in the place you are rounding to.
                </p>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null || submitted}
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
              {submitted ? (
                <div
                  role="status"
                  className={`rounded-xl border px-3 py-3 text-sm ${
                    fullyCorrect
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                      : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
                  }`}
                >
                  <p className="font-semibold">
                    {fullyCorrect ? "Correct!" : "Not quite."}
                  </p>
                  <p className="mt-2 text-zinc-800 dark:text-zinc-200">
                    Round to the <strong>{PLACE_LABELS[targetPlace]}</strong> →{" "}
                    <strong>{formatAnswerChoice(q.correctRounded, q.roundPlace)}</strong>.
                    Deciding digit:{" "}
                    <strong>{nextDigit}</strong>. {roundingTip(q.roundPlace)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {roundingTip(q.roundPlace)}
                </p>
              )}
            </>
          )}
        </div>
      }
    />
  );
}
