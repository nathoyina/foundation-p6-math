"use client";

import { motion } from "motion/react";
import { formatValueDp } from "@/lib/questions/generators/decimalRounding";
import type { RoundPlace } from "@/lib/math/rounding";

export type NumberLineProps = {
  ticks: number[];
  exactValue: number;
  roundPlace: RoundPlace;
  selectedTick: number | null;
  onSelectTick: (v: number) => void;
  disabled?: boolean;
  revealCorrect?: boolean;
  correctTick: number;
};

function xForValue(v: number, min: number, max: number, innerW: number): number {
  if (max === min) return innerW / 2;
  return ((v - min) / (max - min)) * innerW;
}

export function NumberLine({
  ticks,
  exactValue,
  roundPlace,
  selectedTick,
  onSelectTick,
  disabled,
  revealCorrect,
  correctTick,
}: NumberLineProps) {
  const min = Math.min(...ticks);
  const max = Math.max(...ticks);
  const padX = 48;
  const innerW = 520;
  const lineY = 56;
  const height = 132;

  const exactX = padX + xForValue(exactValue, min, max, innerW);

  const ariaExact = `Number line from ${formatValueDp(min, roundPlace)} to ${formatValueDp(max, roundPlace)}. Orange marker shows the exact value before rounding.`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={innerW + padX * 2}
        height={height}
        role="img"
        aria-label={ariaExact}
        className="mx-auto max-w-full"
      >
        <rect
          x={0}
          y={0}
          width={innerW + padX * 2}
          height={height}
          rx={16}
          className="fill-sky-50 stroke-sky-200 dark:fill-zinc-900 dark:stroke-zinc-700"
        />

        <text x={padX} y={28} className="fill-zinc-500 text-xs dark:fill-zinc-400">
          {formatValueDp(min, roundPlace)}
        </text>
        <text
          x={padX + innerW}
          y={28}
          textAnchor="end"
          className="fill-zinc-500 text-xs dark:fill-zinc-400"
        >
          {formatValueDp(max, roundPlace)}
        </text>

        <line
          x1={padX}
          y1={lineY}
          x2={padX + innerW}
          y2={lineY}
          stroke="currentColor"
          strokeWidth={2}
          className="text-zinc-700 dark:text-zinc-200"
        />

        {ticks.map((t) => {
          const x = padX + xForValue(t, min, max, innerW);
          const isSel = selectedTick !== null && Math.abs(selectedTick - t) < 1e-9;
          const isAnswer = Math.abs(correctTick - t) < 1e-9;
          const highlight = revealCorrect && isAnswer;
          return (
            <g key={t}>
              <line
                x1={x}
                y1={lineY - 10}
                x2={x}
                y2={lineY + 10}
                stroke="currentColor"
                strokeWidth={2}
                className="text-zinc-600 dark:text-zinc-300"
              />
              <rect
                x={x - 28}
                y={lineY + 14}
                width={56}
                height={44}
                rx={10}
                fill="transparent"
                className={
                  disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                }
                onClick={() => !disabled && onSelectTick(t)}
                onKeyDown={(e) => {
                  if (disabled) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectTick(t);
                  }
                }}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-pressed={isSel}
                aria-label={`Choose ${formatValueDp(t, roundPlace)}`}
              />
              <circle
                cx={x}
                cy={lineY + 36}
                r={isSel || highlight ? 13 : 11}
                className={
                  highlight
                    ? "fill-emerald-500 stroke-emerald-800 pointer-events-none"
                    : isSel
                      ? "fill-sky-500 stroke-sky-800 pointer-events-none"
                      : "fill-white stroke-zinc-400 dark:fill-zinc-900 dark:stroke-zinc-500 pointer-events-none"
                }
                strokeWidth={2}
              />
              <text
                x={x}
                y={lineY + 40}
                textAnchor="middle"
                className="pointer-events-none fill-zinc-900 text-[11px] font-semibold dark:fill-zinc-100"
              >
                {formatValueDp(t, roundPlace)}
              </text>
            </g>
          );
        })}

        <g pointerEvents="none">
          <motion.g
            initial={false}
            animate={{ x: exactX }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <line x1={0} y1={lineY - 26} x2={0} y2={lineY + 16} stroke="#ea580c" strokeWidth={3} />
            <polygon points="-6,-28 6,-28 0,-36" fill="#ea580c" />
            <text
              x={0}
              y={lineY - 36}
              textAnchor="middle"
              className="fill-orange-700 text-xs font-bold dark:fill-orange-300"
            >
              {exactValue}
            </text>
          </motion.g>
        </g>
      </svg>
      <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Tap the value you think is the rounded answer.
      </p>
    </div>
  );
}
