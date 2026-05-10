/** Mulberry32 — deterministic PRNG from seed (for reproducible questions). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng: () => number, min: number, maxExclusive: number): number {
  return min + Math.floor(rng() * (maxExclusive - min));
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[randInt(rng, 0, items.length)]!;
}
