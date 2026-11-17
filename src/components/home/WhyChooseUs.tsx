
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
    <section className="bg-[#100D0B] px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Why PizzaHub
          </span>
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            More Than Just
            <span className="text-[#F97316]"> Great Pizza</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#A8A29E] sm:text-base">
            We believe great pizza starts with great ingredients, expert
            craftsmanship, and a passion for making every bite special.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group relative overflow-hidden rounded-2xl border border-[#302824] bg-[#1C1715] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#F97316]/50 hover:bg-[#211A16]"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316] transition-all duration-300 group-hover:bg-[#F97316] group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="text-3xl font-bold text-[#302824] transition-colors group-hover:text-[#F97316]/30">
                    0{feature.id}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-[#A8A29E]">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center justify-end text-[#F97316] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
