import Link from "next/link";
import { ArrowLeft, ArrowRight, Pizza, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-16 sm:px-8 lg:px-10">
      {/* Soft glow backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl sm:h-[560px] sm:w-[560px]" />
        <div className="absolute bottom-0 right-[12%] h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl text-center">
        {/* Pizza badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-card shadow-xl shadow-primary/10 sm:h-24 sm:w-24">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
            <Pizza
              className="h-7 w-7 text-primary sm:h-9 sm:w-9"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="hero-script mt-6 text-2xl text-primary sm:text-3xl">
          Oops! Wrong turn.
        </p>

        <h1 className="hero-title mt-1 text-[76px] leading-none text-foreground sm:text-[112px]">
          4<span className="text-primary">0</span>4
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          This page isn’t on the menu.
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
          The page you’re looking for might have been moved, deleted, or never
          existed. Let’s get you back to something delicious.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] sm:w-auto"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Back to Home
          </Link>

          <Link
            href="/menu"
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold text-foreground transition-all duration-300 hover:border-primary hover:text-primary active:scale-[0.98] sm:w-auto"
          >
            Browse Menu
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
          <SearchX size={14} className="text-primary" aria-hidden="true" />
          ERROR 404 · PAGE NOT FOUND
        </div>
      </div>
    </main>
  );
}
