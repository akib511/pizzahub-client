import {
  Leaf,
  Truck,
  Award,
  Heart,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We use fresh, handpicked ingredients to bring natural flavor to every single slice.",
  },
  {
    id: 2,
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Your favorite pizza arrives hot and fresh at your doorstep, right on time.",
  },
  {
    id: 3,
    icon: Award,
    title: "Best Quality",
    description:
      "Every pizza is crafted with premium ingredients and exceptional attention to detail.",
  },
  {
    id: 4,
    icon: Heart,
    title: "Made with Love",
    description:
      "From our kitchen to your table, every pizza is prepared with passion and care.",
  },
];

export default function WhyChooseUs() {
  return (
    // Section padding same as other sections
    <section className="overflow-hidden bg-[#100D0B] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading - Compact & Matching */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#F97316] sm:text-xs">
              Why PizzaHub
            </span>
            <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-white sm:mt-3 sm:text-3xl lg:text-4xl">
              More Than Just <span className="text-[#F97316]">Great Pizza</span>
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-6 text-stone-400 sm:mt-3 sm:text-sm sm:leading-7">
              We believe great pizza starts with great ingredients, expert
              craftsmanship, and a passion for making every bite special.
            </p>
          </div>
          
          <p className="hidden text-sm text-stone-500 sm:block">
            The PizzaHub Promise
          </p>
        </div>

        {/* Feature Cards Grid - 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-[#1A1716] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-[#211A16] hover:shadow-xl hover:shadow-[#F97316]/5 active:scale-[0.98] sm:rounded-2xl sm:p-5"
              >
                <div>
                  {/* Icon + Number Row */}
                  <div className="mb-4 flex items-center justify-between sm:mb-5">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#F97316]/10 text-[#F97316] transition-all duration-300 group-hover:bg-[#F97316] group-hover:text-white sm:size-12 sm:rounded-xl">
                      <Icon size={20} strokeWidth={2} className="sm:size-6" />
                    </div>

                    <span className="text-2xl font-bold text-white/5 transition-colors group-hover:text-[#F97316]/20 sm:text-3xl">
                      0{feature.id}
                    </span>
                  </div>

                  {/* Text */}
                  <h3 className="text-[15px] font-bold text-white sm:text-base md:text-lg">
                    {feature.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-stone-400 sm:mt-2 sm:text-xs sm:leading-6">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow (Bottom Right) */}
                <div className="mt-3 flex items-center justify-end text-[#F97316] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 sm:mt-4">
                  <ArrowUpRight size={16} className="sm:size-[18px]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}