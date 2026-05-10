"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export type MixedFractionCirclesProps = {
  whole: number;
  numerator: number;
  denominator: number;
  animateBurst?: boolean;
};

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

function Pie({
  cx,
  cy,
  r,
  den,
  shadeCount,
  burst,
}: {
  cx: number;
  cy: number;
  r: number;
  den: number;
  shadeCount: number;
  burst: boolean;
}) {
  const step = 360 / den;
  const slices: ReactNode[] = [];
  for (let i = 0; i < den; i++) {
    const start = -90 + i * step;
    const end = -90 + (i + 1) * step;
    const shaded = i < shadeCount;
    slices.push(
      <motion.path
        key={i}
        d={slicePath(cx, cy, r, start, end)}
        className={
          shaded
            ? "fill-sky-400 stroke-sky-800 dark:fill-sky-500 dark:stroke-sky-950"
            : "fill-zinc-100 stroke-zinc-300 dark:fill-zinc-800 dark:stroke-zinc-600"
        }
        strokeWidth={1.5}
        initial={false}
        animate={
          burst && shaded
            ? { scale: [1, 1.06, 1], opacity: [1, 0.92, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.55 }}
      />,
    );
  }
  return <g>{slices}</g>;
}

export function MixedFractionCircles({
  whole,
  numerator,
  denominator,
  animateBurst,
}: MixedFractionCirclesProps) {
  const r = 44;
  const gap = 20;
  const count = whole + (numerator > 0 ? 1 : 0);
  /** Full coordinate width for all pies (must match viewBox — no cap or circles clip). */
  const contentWidth = Math.max(240, count * (r * 2 + gap) + gap);
  const height = r * 2 + 52;

  const label = `${whole} whole${whole === 1 ? "" : "s"} and ${numerator}/${denominator}`;

  const pies: ReactNode[] = [];
  let idx = 0;

  for (let w = 0; w < whole; w++) {
    const cx = gap + r + idx * (r * 2 + gap);
    idx += 1;
    pies.push(
      <g key={`w-${w}`} transform={`translate(${cx - r}, ${height / 2 - r})`}>
        <Pie cx={r} cy={r} r={r - 2} den={denominator} shadeCount={denominator} burst={!!animateBurst} />
      </g>,
    );
  }

  if (numerator > 0) {
    const cx = gap + r + idx * (r * 2 + gap);
    pies.push(
      <g key="frac" transform={`translate(${cx - r}, ${height / 2 - r})`}>
        <Pie
          cx={r}
          cy={r}
          r={r - 2}
          den={denominator}
          shadeCount={numerator}
          burst={!!animateBurst}
        />
      </g>,
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col items-center gap-3">
      <svg
        width="100%"
        viewBox={`0 0 ${contentWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Mixed number diagram: ${label}`}
        className="h-auto w-full max-w-full"
        style={{ aspectRatio: `${contentWidth} / ${height}` }}
      >
        <rect
          x={2}
          y={2}
          width={contentWidth - 4}
          height={height - 4}
          rx={16}
          className="fill-sky-50 stroke-sky-200 dark:fill-zinc-900 dark:stroke-zinc-700"
        />
        <g>{pies}</g>
      </svg>
      <p className="max-w-md text-center text-sm text-zinc-600 dark:text-zinc-400">
        Each circle is split into <strong>{denominator}</strong> equal parts.
      </p>
    </div>
  );
}
