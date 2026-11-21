import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="overflow-hidden bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          
          {/* Image Side */}
          <div className="relative mx-auto w-full max-w-[520px]">
            
            
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=90"
                alt="Freshly prepared delicious pizza"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-5 right-2 rounded-xl border border-border bg-card px-4 py-3 shadow-xl sm:-bottom-6 sm:right-6 sm:rounded-2xl sm:px-6 sm:py-5">
              <h3 className="text-2xl font-bold text-primary sm:text-3xl">
                100%
              </h3>
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground sm:mt-1 sm:text-xs">
                Fresh Ingredients
              </p>
            </div>

            {/* Decorative Border - Small mobile friendly */}
            <div className="absolute -left-2 -top-2 size-16 rounded-tl-2xl border-l-2 border-t-2 border-primary sm:-left-4 sm:-top-4 sm:size-24 sm:rounded-tl-3xl" />
          </div>

          {/* Content Side */}
          <div className="pt-4 lg:pt-0">
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-primary sm:text-xs">
              About PizzaHub
            </span>

            <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold leading-tight text-foreground sm:mt-3 sm:text-3xl lg:text-4xl">
              We Make Every
              <span className="block text-primary">
                Slice Special.
              </span>
            </h2>

            <p className="mt-3 text-xs leading-6 text-muted-foreground sm:mt-5 sm:text-sm sm:leading-7">
              At PizzaHub, we believe pizza is more than just food. It is about
              bringing people together, sharing happiness, and creating
              unforgettable moments with every bite.
            </p>

            <p className="mt-2 text-xs leading-6 text-muted-foreground sm:mt-3 sm:text-sm sm:leading-7">
              From carefully selected ingredients to our freshly prepared
              dough, every pizza is made with passion, quality, and love.
            </p>

            {/* Features */}
            <div className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-4">
              {[
                "Fresh and premium ingredients",
                "Carefully crafted pizza recipes",
                "Quality you can taste in every bite",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 sm:gap-3">
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-primary sm:size-5"
                  />
                  <span className="text-[13px] font-medium text-foreground/90 sm:text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <Link
              href="/about"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-xs font-bold text-white transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] sm:mt-8 sm:h-auto sm:gap-3 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              Discover Our Story
              <ArrowRight size={15} className="sm:size-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}