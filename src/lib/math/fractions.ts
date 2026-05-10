export type Fraction = { num: number; den: number };

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function simplify(f: Fraction): Fraction {
  if (f.den === 0) throw new Error("Denominator cannot be zero");
  let num = f.num;
  let den = f.den;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

export function fractionsEqual(a: Fraction, b: Fraction): boolean {
  return a.num * b.den === b.num * a.den;
}

export function mixedToImproper(
  whole: number,
  num: number,
  den: number,
): Fraction {
  if (den <= 0) throw new Error("Invalid denominator");
  const sign = whole < 0 ? -1 : 1;
  const w = Math.abs(whole);
  return simplify({
    num: sign * (w * den + num),
    den,
  });
}

export function formatFraction(f: Fraction): string {
  const s = simplify(f);
  if (s.den === 1) return String(s.num);
  return `${s.num}/${s.den}`;
}
