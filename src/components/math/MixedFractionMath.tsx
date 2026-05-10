import type { ComponentPropsWithoutRef } from "react";

export type MixedFractionMathProps = {
  whole: number;
  numerator: number;
  denominator: number;
  /** Larger mixed numbers for prompts */
  size?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

const sizeClasses = {
  sm: { whole: "text-lg", stack: "text-xs min-w-[1.5rem]", bar: "border-t-[1.5px]" },
  md: { whole: "text-2xl", stack: "text-base min-w-[2rem]", bar: "border-t-2" },
  lg: { whole: "text-4xl", stack: "text-xl min-w-[2.75rem]", bar: "border-t-[3px]" },
} as const;

export function mixedFractionAriaLabel(
  whole: number,
  numerator: number,
  denominator: number,
): string {
  return `${whole} and ${numerator} over ${denominator}`;
}

/**
 * Mixed numeral with stacked fraction (whole + numerator/denominator bar).
 */
export function MixedFractionMath({
  whole,
  numerator,
  denominator,
  size = "md",
  className,
  ...rest
}: MixedFractionMathProps) {
  const s = sizeClasses[size];
  const label = mixedFractionAriaLabel(whole, numerator, denominator);

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center gap-1 align-middle ${className ?? ""}`}
      {...rest}
    >
      <span className={`font-semibold tabular-nums tracking-tight ${s.whole}`}>{whole}</span>
      <span
        className={`inline-flex flex-col items-stretch ${s.stack} font-semibold tabular-nums leading-none`}
      >
        <span className="px-1.5 pb-0.5 text-center">{numerator}</span>
        <span
          aria-hidden
          className={`mx-0.5 border-current opacity-90 ${s.bar}`}
        />
        <span className="px-1.5 pt-0.5 text-center">{denominator}</span>
      </span>
    </span>
  );
}
