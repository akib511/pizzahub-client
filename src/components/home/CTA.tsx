import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export default function CTA() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-[#302824] bg-[#1C1715]">

        {/* Background Glow */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#F97316]/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[#B52B24]/10 blur-[100px]" />

        <div className="relative grid items-center gap-10 px-7 py-14 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-20">

          {/* Left Content */}
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-2 text-sm text-[#F97316]">
              <Flame size={16} />
              <span>Hot & Fresh, Just for You</span>
            </div>

            <h2 className="font-[var(--font-heading)] text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Your Next
              <span className="block text-[#F97316]">
                Favorite Slice
              </span>
              Is Waiting.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#A8A29E] sm:text-base">
              Life is better with pizza. Treat yourself to something
              delicious, freshly prepared with love and delivered
              right to your doorstep.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-3 rounded-full bg-[#F97316] px-7 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#EA580C] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
              >
                Order Your Pizza
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <span className="text-sm text-[#A8A29E]">
                Freshly made. Always delicious.
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute inset-5 rounded-full bg-[#F97316]/20 blur-[70px]" />

            <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-[#302824] shadow-2xl shadow-black/40">
              <Image
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=95"
                alt="Delicious fresh pizza"
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-3 -left-3 rounded-2xl border border-[#302824] bg-[#100D0B] px-5 py-4 shadow-xl sm:-left-8">
              <p className="text-xs text-[#A8A29E]">
                Made with love
              </p>
              <p className="mt-1 font-semibold text-[#F97316]">
                Every Single Slice
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}