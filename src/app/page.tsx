import Link from "next/link";
import { topicBlurbs } from "@/content/copy";

const cards = [
  {
    href: "/decimals/rounding",
    title: "Decimals · Rounding",
    body: topicBlurbs.decimals,
    accent: "from-sky-500 to-blue-600",
  },
  {
    href: "/fractions/mixed-to-improper",
    title: "Fractions · Mixed → improper",
    body: topicBlurbs.fractions,
    accent: "from-amber-500 to-orange-600",
  },
  {
    href: "/percentages/conversions",
    title: "Percentages · Conversions",
    body: topicBlurbs.percentages,
    accent: "from-violet-500 to-fuchsia-600",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white dark:from-zinc-950 dark:via-black dark:to-black">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Primary 6 · Singapore
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Visual practice for fractions, decimals, and percentages
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Every activity opens with a diagram — number lines, fraction circles, and hundred squares —
            so you can see the maths before you tap your answer.
          </p>
        </header>

        <section aria-labelledby="topics-heading" className="grid gap-6 md:grid-cols-3">
          <h2 id="topics-heading" className="sr-only">
            Topics
          </h2>
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col rounded-2xl border border-amber-100 bg-white p-6 shadow-md shadow-amber-100/50 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none"
            >
              <span
                className={`mb-4 inline-flex h-2 w-14 rounded-full bg-gradient-to-r ${c.accent}`}
                aria-hidden
              />
              <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-sky-700 dark:text-zinc-50 dark:group-hover:text-sky-400">
                {c.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {c.body}
              </p>
              <span className="mt-4 text-sm font-semibold text-sky-700 dark:text-sky-400">
                Start →
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
