
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="overflow-hidden bg-[#100D0B] px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Image Side */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative h-[350px] overflow-hidden rounded-2xl sm:h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=90"
              alt="Freshly prepared delicious pizza"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Experience Badge */}
          <div className="absolute -bottom-6 -right-2 rounded-2xl border border-[#302824] bg-[#1C1715] px-6 py-5 shadow-xl sm:-right-6">
            <h3 className="text-3xl font-bold text-[#F97316]">100%</h3>
            <p className="mt-1 text-sm text-[#A8A29E]">
              Fresh Ingredients
            </p>
          </div>

          <div className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-[#F97316] sm:-left-6 sm:-top-6" />
        </div>

        {/* Content Side */}
        <div className="pt-5 lg:pt-0">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            About PizzaHub
          </span>

          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            We Make Every
            <span className="block text-[#F97316]">
              Slice Special.
            </span>
          </h2>

          <p className="mt-6 text-sm leading-8 text-[#A8A29E] sm:text-base">
            At PizzaHub, we believe pizza is more than just food. It is about
            bringing people together, sharing happiness, and creating
            unforgettable moments with every bite.
          </p>

          <p className="mt-4 text-sm leading-8 text-[#A8A29E] sm:text-base">
            From carefully selected ingredients to our freshly prepared
            dough, every pizza is made with passion, quality, and love.
          </p>

          {/* Features */}
          <div className="mt-7 space-y-4">
            {[
              "Fresh and premium ingredients",
              "Carefully crafted pizza recipes",
              "Quality you can taste in every bite",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-[#F97316]"
                />
                <span className="text-sm text-white sm:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Button */}
          <Link
            href="/about"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#F97316] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#EA580C] hover:shadow-lg hover:shadow-orange-500/20"
          >
            Discover Our Story
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
