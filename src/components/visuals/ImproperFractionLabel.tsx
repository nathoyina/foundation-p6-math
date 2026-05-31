"use client";

import { formatFraction } from "@/lib/math/fractions";

export type ImproperFractionLabelProps = {
  num: number;
  den: number;
};

export function ImproperFractionLabel({ num, den }: ImproperFractionLabelProps) {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 px-8 py-6 dark:border-amber-900 dark:bg-amber-950/40"
      aria-label={`Improper fraction ${num} over ${den}`}
    >
      <span className="text-5xl font-bold tabular-nums text-amber-900 dark:text-amber-100">
        {formatFraction({ num, den })}
      </span>
    </div>
  );
}
