import Link from "next/link";
import { ArrowRight, Clock, Flame, Star } from "lucide-react";

const PIZZA_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1800&q=95";

export default function Hero() {
  return (
    <section className="relative flex min-h-[550px] items-center overflow-hidden bg-[#100D0B]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-[center_55%]"
        style={{ backgroundImage: `url('${PIZZA_IMAGE}')` }}
      />

      {/* Desktop Overlay */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#100D0B]/95 via-[#100D0B]/65 to-[#100D0B]/10 md:block" />

      {/* Mobile Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#100D0B]/65 via-[#100D0B]/55 to-[#100D0B]/95 md:hidden" />

      {/* Desktop Bottom Overlay */}
      <div className="absolute inset-0 hidden bg-gradient-to-t from-[#100D0B]/70 via-transparent to-transparent md:block" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-12 md:px-10 lg:px-10">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-black/50 px-4 py-2 backdrop-blur-md sm:mb-8">
            <Flame size={16} className="text-orange-400" />
            <span className="text-[10px] font-bold tracking-[2px] text-orange-400 sm:text-xs">
              THE ART OF PERFECT PIZZA
            </span>
          </div>

          {/* Heading */}
          <h1 className="hero-title text-[42px] font-bold leading-[1.15] text-white sm:text-6xl md:text-7xl lg:text-[85px]">
            Not Just Pizza.
            <span className="mt-2 block text-orange-500">
              Pure Passion.
            </span>
            <span className="mt-2 block">
              Every Slice.
            </span>
            <span className="block">Every Time.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-sm leading-7 text-stone-200 sm:mt-8 sm:text-base sm:leading-8">
            Experience the taste of authentic handcrafted pizza.
            Fresh ingredients, irresistible flavors, and a little
            happiness baked into every single slice.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
            <Link
              href="/menu"
              className="group flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3.5 text-xs font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/30 sm:gap-3 sm:px-7 sm:py-4 sm:text-sm"
            >
              Explore Our Menu
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/menu"
              className="rounded-full border border-white/40 bg-black/30 px-5 py-3.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:border-orange-500 hover:text-orange-400 sm:px-7 sm:py-4 sm:text-sm"
            >
              Discover More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/20 pt-6 sm:mt-14 sm:gap-8 sm:pt-8">
            <div>
              <div className="flex items-center gap-2">
                <Star size={17} className="fill-orange-400 text-orange-400" />
                <span className="text-lg font-bold text-white sm:text-xl">
                  4.9/5
                </span>
              </div>
              <p className="mt-1 text-[11px] text-stone-300 sm:text-xs">
                Customer Rating
              </p>
            </div>

            <div className="h-9 w-px bg-white/20" />

            <div>
              <div className="flex items-center gap-2">
                <Clock size={17} className="text-orange-400" />
                <span className="text-lg font-bold text-white sm:text-xl">
                  30 Min
                </span>
              </div>
              <p className="mt-1 text-[11px] text-stone-300 sm:text-xs">
                Fast Delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Label */}
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