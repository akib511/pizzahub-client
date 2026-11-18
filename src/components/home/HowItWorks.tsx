"use client";

import { motion } from "framer-motion";
import {
  Search,
  Pizza,
  ShoppingBag,
  Bike,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Menu",
    description:
      "Explore our delicious pizza collection and discover your favorite flavors.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Pizza",
    description:
      "Select your favorite pizza, customize your choices, and get ready to order.",
    icon: Pizza,
  },
  {
    number: "03",
    title: "Place Your Order",
    description:
      "Add your delivery details and place your order in just a few clicks.",
    icon: ShoppingBag,
  },
  {
    number: "04",
    title: "Enjoy Your Pizza",
    description:
      "Sit back, relax, and enjoy delicious pizza delivered right to your doorstep.",
    icon: Bike,
  },
];

export default function HowItWorks() {
  return (
    <section className="overflow-hidden bg-[#100D0B] px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-[3px] text-[#F97316]">
            Simple & Easy
          </span>

          <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            How PizzaHub <span className="text-[#F97316]">Works</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#A8A29E] sm:text-base">
            Your favorite pizza is just a few simple steps away.
            Ordering delicious food has never been easier.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting Line */}
          <div className="absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-transparent via-[#F97316]/50 to-transparent lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-[#F97316]/20 bg-[#1C1715] transition-all duration-300 group-hover:border-[#F97316] group-hover:bg-[#F97316]/10">
                  <Icon
                    size={36}
                    strokeWidth={1.5}
                    className="text-[#F97316] transition-transform duration-300 group-hover:scale-110"
                  />

                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#F97316]/30 bg-[#100D0B] text-xs font-bold text-[#F97316]">
                    {step.number}
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-[#F97316]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[#A8A29E]">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-4 top-10 hidden text-[#F97316]/50 lg:block">
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}