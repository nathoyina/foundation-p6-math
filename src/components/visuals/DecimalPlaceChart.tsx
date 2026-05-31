"use client";

import { decidingColumn, parseDecimalPlaces, type DecimalPlace } from "@/lib/math/placeValue";
import type { PracticeLevel } from "@/lib/questions/level";

export type DecimalPlaceChartProps = {
  value: number;
  sourceDp: number;
  level: PracticeLevel;
  step: 1 | 2;
  selectedPlace: DecimalPlace | null;
  onSelectPlace: (place: DecimalPlace) => void;
  selectablePlaces: DecimalPlace[];
  disabled?: boolean;
  revealTarget?: boolean;
  targetPlace: DecimalPlace;
  highlightDeciding?: boolean;
};

export function DecimalPlaceChart({
  value,
  sourceDp,
  level,
  step,
  selectedPlace,
  onSelectPlace,
  selectablePlaces,
  disabled,
  revealTarget,
  targetPlace,
  highlightDeciding,
}: DecimalPlaceChartProps) {
  const { wholePart, columns, digits } = parseDecimalPlaces(value, sourceDp);
  const deciding = decidingColumn(targetPlace);
  const wholeDigits = wholePart.split("");
  const onesSelectable =
    level === "level2" && selectablePlaces.includes("ones") && step === 1;

  function digitCell(
    digit: string,
    col: DecimalPlace,
    canSelect: boolean,
  ) {
    const isSelected = selectedPlace === col;
    const isTarget = revealTarget && col === targetPlace;
    const isDeciding = highlightDeciding && col === deciding;

    const digitClass = isTarget
      ? "rounded-lg bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500 dark:bg-emerald-950 dark:text-emerald-100"
      : isDeciding
        ? "rounded-lg bg-amber-50 text-amber-900 ring-2 ring-inset ring-amber-400 dark:bg-amber-950/50 dark:text-amber-100"
        : canSelect && isSelected
          ? "rounded-lg bg-sky-100 text-sky-900 ring-2 ring-sky-500 dark:bg-sky-950 dark:text-sky-100"
          : "rounded-lg text-zinc-900 dark:text-zinc-50";

    const inner = (
      <span className="flex flex-col items-center">
        <span
          className={`flex min-w-[2.75rem] items-center justify-center px-1 py-2 text-3xl font-bold tabular-nums ${digitClass}`}
        >
          {digit}
        </span>
        {isDeciding && highlightDeciding ? (
          <span className="mt-1 text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-300">
            Look here
          </span>
        ) : (
          <span className="mt-1 h-[14px]" aria-hidden />
        )}
      </span>
    );

    if (canSelect) {
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectPlace(col)}
          className="rounded-lg outline-none transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-zinc-800"
          aria-pressed={isSelected}
          aria-label={`Select digit ${digit}`}
        >
          {inner}
        </button>
      );
    }
    return <span aria-hidden>{inner}</span>;
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {step === 1 ? (
          <>
            Step 1: Tap the <strong>digit</strong> in the place you are rounding to (not the answer
            yet).
          </>
        ) : (
          <>
            Step 2: Green = digit you are rounding to. Amber = digit you look at next. Then pick
            the rounded answer below.
          </>
        )}
      </p>

      <div
        className="inline-flex items-end gap-0 rounded-2xl border-2 border-sky-200 bg-white px-3 py-4 shadow-sm dark:border-sky-900 dark:bg-zinc-950"
        role="group"
        aria-label={`Decimal ${wholePart} point ${columns.map((c) => digits[c]).join("")}`}
      >
        {wholeDigits.map((d, i) => {
          const isOnesDigit = i === wholeDigits.length - 1;
          const canSelectOnes = onesSelectable && isOnesDigit;
          return (
            <span key={`w-${i}`} className="flex items-end">
              {digitCell(d, "ones", canSelectOnes)}
            </span>
          );
        })}

        {columns.length > 0 ? (
          <span className="px-0.5 pb-2 text-3xl font-bold text-zinc-500 dark:text-zinc-400" aria-hidden>
            .
          </span>
        ) : null}

        {columns.map((col) => {
          const canSelect =
            selectablePlaces.includes(col) && step === 1 && col !== "ones";
          return (
            <span key={col} className="flex items-end">
              {digitCell(digits[col] ?? "0", col, canSelect)}
            </span>
          );
        })}
      </div>

      {step === 1 ? (
        <p className="max-w-md text-center text-xs text-zinc-500 dark:text-zinc-400">
          Read the question — does it say <strong>whole number</strong>, <strong>tenth</strong>,{" "}
          <strong>hundredth</strong>, or <strong>thousandth</strong>? Tap the matching digit.
        </p>
      ) : null}
    </div>
  );
}
