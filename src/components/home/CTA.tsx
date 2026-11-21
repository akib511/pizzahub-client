import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Star } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-[#100D0B] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Container - Compact & Premium */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#14110F] sm:rounded-3xl">
          
          {/* Background Glow */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F97316]/15 blur-[60px] sm:h-64 sm:w-64" />
          
          <div className="relative grid items-center lg:grid-cols-[1.1fr_0.9fr]">
            
            {/* Left Side: Content */}
            <div className="relative z-10 p-5 sm:p-8 lg:p-10">
              
              {/* Top Badge */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#F97316] sm:text-[10px]">
                <Flame size={12} />
                <span>Hot & Fresh</span>
              </div>

              {/* Heading - Compact */}
              <h2 className="font-[var(--font-heading)] text-2xl font-bold leading-[1.15] text-white sm:text-3xl lg:text-4xl">
                Your Next <span className="text-[#F97316]">Favorite Slice</span> Is Waiting.
              </h2>

              <p className="mt-2 max-w-sm text-[11px] leading-5 text-stone-400 sm:mt-3 sm:text-xs sm:leading-6">
                Treat yourself to something delicious, freshly prepared with love and delivered right to your door.
              </p>

              {/* Action Row */}
              <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
                <Link
                  href="/menu"
                  className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#F97316] px-5 text-xs font-bold text-white transition-all duration-300 hover:bg-[#EA580C] active:scale-[0.98] sm:w-auto sm:rounded-full sm:h-11"
                >
                  Order Now
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Social Proof / Stars */}
              <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3 sm:mt-5">
                <div className="flex gap-0.5 text-[#F97316]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={10} fill="currentColor" className="sm:size-3" />
                  ))}
                </div>
                <span className="text-[9px] font-medium text-stone-400 sm:text-[10px]">
                  Loved by 10,000+ foodies
                </span>
              </div>

            </div>

            {/* Right Side: Image */}
            <div className="relative h-44 w-full sm:h-56 lg:h-full lg:min-h-[280px]">
              <Image
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=95"
                alt="Delicious pizza"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              
              {/* Gradient Overlay to blend image with dark background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#14110F] lg:via-transparent lg:to-transparent" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}