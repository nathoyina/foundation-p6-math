import Link from "next/link";
import { topicBlurbs } from "@/content/copy";

const topics = [
  {
    foundationHref: "/decimals/rounding",
    level2Href: "/decimals/rounding/level-2",
    title: "Decimals · Rounding",
    body: topicBlurbs.decimals,
    level2: topicBlurbs.decimalsLevel2,
    accent: "from-sky-500 to-blue-600",
  },
  {
    foundationHref: "/fractions/mixed-to-improper",
    level2Href: "/fractions/mixed-to-improper/level-2",
    title: "Fractions · Mixed ↔ improper",
    body: topicBlurbs.fractions,
    level2: topicBlurbs.fractionsLevel2,
    accent: "from-amber-500 to-orange-600",
  },
  {
    foundationHref: "/percentages/conversions",
    level2Href: "/percentages/conversions/level-2",
    title: "Percentages · Conversions",
    body: topicBlurbs.percentages,
    level2: topicBlurbs.percentagesLevel2,
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
            Every activity opens with a diagram. Start with <strong>Foundation</strong> to build
            concepts, then try <strong>Level 2</strong> for harder questions.
          </p>
        </header>

        <section aria-labelledby="topics-heading" className="grid gap-6 md:grid-cols-3">
          <h2 id="topics-heading" className="sr-only">
            Topics
          </h2>
          {topics.map((c) => (
            <article
              key={c.foundationHref}
              className="flex flex-col rounded-2xl border border-amber-100 bg-white p-6 shadow-md shadow-amber-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none"
            >
              <span
                className={`mb-4 inline-flex h-2 w-14 rounded-full bg-gradient-to-r ${c.accent}`}
                aria-hidden
              />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {c.body}
              </p>
              <div className="mt-5 flex flex-col gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <Link
                  href={c.foundationHref}
                  className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:hover:bg-sky-950"
                >
                  Foundation →
                </Link>
                <Link
                  href={c.level2Href}
                  className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  Level 2 →
                </Link>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.level2}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
