import Link from "next/link";
import type { ReactNode } from "react";

export function SkillShell({
  title,
  subtitle,
  visual,
  sidebar,
}: {
  title: string;
  subtitle?: string;
  visual?: ReactNode;
  sidebar: ReactNode;
}) {
  const compact = visual == null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/80 via-white to-white dark:from-zinc-950 dark:via-black dark:to-black">
      <header className="border-b border-amber-200/80 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-lg px-2 py-1 text-sm font-medium text-sky-700 hover:bg-sky-50 hover:underline dark:text-sky-400 dark:hover:bg-sky-950/40"
          >
            Home
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
            /
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </header>
      {compact ? (
        <div className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
          <main className="rounded-2xl border border-amber-100 bg-white/95 p-5 shadow-md shadow-amber-100/30 dark:border-zinc-800 dark:bg-zinc-950">
            {sidebar}
          </main>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 lg:flex-row lg:items-start">
          <section
            aria-labelledby="visual-heading"
            className="flex min-h-[42vh] flex-1 flex-col justify-center rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none lg:min-h-[min(72vh,840px)]"
          >
            <h2 id="visual-heading" className="sr-only">
              Visual model
            </h2>
            {visual}
          </section>
          <aside className="w-full shrink-0 rounded-2xl border border-amber-100 bg-white/95 p-5 shadow-md shadow-amber-100/30 dark:border-zinc-800 dark:bg-zinc-950 lg:w-[400px]">
            {sidebar}
          </aside>
        </div>
      )}
    </div>
  );
}
