"use client";

export type FractionBarProps = {
  numerator: number;
  denominator: number;
  labelled?: boolean;
};

export function FractionBar({ numerator, denominator, labelled }: FractionBarProps) {
  const parts = Math.min(denominator, 24);
  const shaded = Math.round((numerator / denominator) * parts);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={Math.min(420, parts * 36 + 24)}
        height={72}
        role="img"
        aria-label={`Fraction bar ${numerator} out of ${denominator} shaded`}
        className="max-w-full"
      >
        <rect
          x={4}
          y={4}
          width={Math.min(420, parts * 36 + 24) - 8}
          height={64}
          rx={12}
          className="fill-violet-50 stroke-violet-300 dark:fill-zinc-900 dark:stroke-violet-800"
        />
        {Array.from({ length: parts }, (_, i) => (
          <rect
            key={i}
            x={12 + i * 36}
            y={14}
            width={32}
            height={44}
            rx={4}
            className={
              i < shaded
                ? "fill-violet-500 stroke-violet-800 dark:fill-violet-400"
                : "fill-white stroke-zinc-400 dark:fill-zinc-950 dark:stroke-zinc-600"
            }
            strokeWidth={2}
          />
        ))}
      </svg>
      {labelled ? (
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {numerator}/{denominator}
        </p>
      ) : null}
    </div>
  );
}
