"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export type PercentGridProps = {
  percent: number;
  pulse?: boolean;
  labelled?: boolean;
};

const COLS = 10;
const ROWS = 10;
const CELL = 28;
const PAD = 12;

export function PercentGrid({ percent, pulse, labelled }: PercentGridProps) {
  const filled = Math.round(Math.min(100, Math.max(0, percent)));
  const innerW = COLS * CELL;
  const innerH = ROWS * CELL;
  const w = innerW + PAD * 2;
  const h = innerH + PAD * 2 + (labelled ? 28 : 0);

  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col;
      const filledCell = index < filled;
      cells.push(
        <rect
          key={index}
          x={PAD + col * CELL + 1}
          y={PAD + row * CELL + 1}
          width={CELL - 2}
          height={CELL - 2}
          rx={3}
          className={
            filledCell
              ? "fill-violet-500 dark:fill-violet-400"
              : "fill-white dark:fill-zinc-950"
          }
        />,
      );
    }
  }

  const gridLines: ReactNode[] = [];
  const baseStroke = "stroke-zinc-700 dark:stroke-zinc-300";
  const majorStroke = "stroke-zinc-900 dark:stroke-zinc-100";

  for (let i = 0; i <= COLS; i++) {
    const x = PAD + i * CELL;
    const isMajor = i % 5 === 0;
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={x}
        x2={x}
        y1={PAD}
        y2={PAD + innerH}
        className={isMajor ? majorStroke : baseStroke}
        strokeWidth={isMajor ? 3 : 2}
        strokeLinecap="square"
      />,
    );
  }
  for (let j = 0; j <= ROWS; j++) {
    const y = PAD + j * CELL;
    const isMajor = j % 5 === 0;
    gridLines.push(
      <line
        key={`h-${j}`}
        x1={PAD}
        x2={PAD + innerW}
        y1={y}
        y2={y}
        className={isMajor ? majorStroke : baseStroke}
        strokeWidth={isMajor ? 3 : 2}
        strokeLinecap="square"
      />,
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      animate={pulse ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <svg
        width={w}
        height={h}
        role="img"
        aria-label={`Hundred square showing ${filled} out of 100 shaded`}
        className="max-w-full drop-shadow-sm"
      >
        <rect
          x={4}
          y={4}
          width={w - 8}
          height={PAD + innerH + 8}
          rx={12}
          className="fill-violet-50 stroke-zinc-700 stroke-[3px] dark:fill-zinc-900 dark:stroke-zinc-400"
        />
        <g>{cells}</g>
        <g aria-hidden>{gridLines}</g>
        {labelled ? (
          <text
            x={w / 2}
            y={h - 10}
            textAnchor="middle"
            className="fill-zinc-700 text-sm font-semibold dark:fill-zinc-200"
          >
            {filled} / 100
          </text>
        ) : null}
      </svg>
    </motion.div>
  );
}
