import Link from "next/link";
import { ArrowRight, Clock, Flame, Star } from "lucide-react";

const PIZZA_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1800&q=95";

export default function Hero() {
  return (
    <section className="relative flex min-h-[440px] items-center overflow-hidden bg-[#100D0B] sm:min-h-[500px] md:min-h-[550px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-[center_55%]"
        style={{ backgroundImage: `url('${PIZZA_IMAGE}')` }}
      />

      {/* Desktop Overlay */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#100D0B]/95 via-[#100D0B]/65 to-[#100D0B]/10 md:block" />

      {/* Mobile Overlay — slightly stronger for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#100D0B]/75 via-[#100D0B]/60 to-[#100D0B]/95 md:hidden" />

      {/* Desktop Bottom Overlay */}
      <div className="absolute inset-0 hidden bg-gradient-to-t from-[#100D0B]/70 via-transparent to-transparent md:block" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12 md:px-10 lg:px-10">
        <div className="max-w-3xl">

          {/* Badge — tighter on mobile */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-black/50 px-3 py-1.5 backdrop-blur-md sm:mb-6 sm:gap-2 sm:px-4 sm:py-2 md:mb-8">
            <Flame size={13} className="text-orange-400 sm:size-4" />
            <span className="text-[9px] font-bold tracking-[1.5px] text-orange-400 sm:text-[11px] sm:tracking-[2px] md:text-xs">
              THE ART OF PERFECT PIZZA
            </span>
          </div>

          {/* Heading — 3 lines on mobile (was 4), compact leading */}
          <h1 className="hero-title text-[30px] font-bold leading-[1.15] text-white min-[380px]:text-[34px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px]">
            Not Just Pizza.
            <span className="block text-orange-500">Pure Passion.</span>
            <span className="mt-0.5 block text-[24px] font-semibold text-white/90 min-[380px]:text-[26px] sm:mt-1 sm:text-3xl md:text-4xl lg:text-5xl">
              Every Slice. Every Time.
            </span>
          </h1>

          {/* Description — 2 lines clamp on mobile */}
          <p className="mt-4 line-clamp-2 max-w-md text-[13px] leading-6 text-stone-200 sm:mt-6 sm:line-clamp-none sm:max-w-xl sm:text-base sm:leading-8 md:mt-8">
            Experience the taste of authentic handcrafted pizza.
            Fresh ingredients, irresistible flavors, and a little
            happiness baked into every single slice.
          </p>

          {/* Buttons — full width mobile, side-by-side desktop */}
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-9">
            <Link
              href="/menu"
              className="group flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-500 px-5 text-sm font-bold text-black transition-all duration-300 hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98] sm:min-h-0 sm:justify-start sm:gap-3 sm:px-7 sm:py-4"
            >
              Explore Our Menu
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 sm:size-[17px]"
              />
            </Link>

            <Link
              href="/menu"
              className="flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-black/30 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-orange-500 hover:text-orange-400 active:scale-[0.98] sm:min-h-0 sm:px-7 sm:py-4"
            >
              Discover More
            </Link>
          </div>

          {/* Stats — compact inline row on mobile */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/20 pt-4 sm:mt-10 sm:gap-8 sm:pt-6 md:mt-14 md:pt-8">
            <div className="flex items-center gap-2 sm:block">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star
                  size={14}
                  className="fill-orange-400 text-orange-400 sm:size-[17px]"
                />
                <span className="text-sm font-bold text-white sm:text-lg md:text-xl">
                  4.9/5
                </span>
              </div>
              <p className="hidden text-[11px] text-stone-300 sm:mt-1 sm:block sm:text-xs">
                Customer Rating
              </p>
            </div>

            <div className="h-8 w-px bg-white/20 sm:h-9" />

            <div className="flex items-center gap-2 sm:block">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock
                  size={14}
                  className="text-orange-400 sm:size-[17px]"
                />
                <span className="text-sm font-bold text-white sm:text-lg md:text-xl">
                  30 Min
                </span>
              </div>
              <p className="hidden text-[11px] text-stone-300 sm:mt-1 sm:block sm:text-xs">
                Fast Delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Label — desktop only */}
      <div className="absolute bottom-8 right-10 hidden text-right md:block">
        <p className="text-xs uppercase tracking-[3px] text-white/70">
          Fresh From Oven
        </p>
        <p className="mt-1 text-lg font-bold text-orange-400">
          Taste the Magic.
        </p>
      </div>
    </section>
  );
}