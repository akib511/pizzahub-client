"use client";

import { motion } from "framer-motion";
import {
  Search,
  Pizza,
  ShoppingBag,
  Bike,
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
    <section className="overflow-hidden bg-[#100D0B] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#F97316] sm:text-xs">
              Simple & Easy
            </span>
            <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-white sm:mt-3 sm:text-3xl lg:text-4xl">
              How PizzaHub <span className="text-[#F97316]">Works</span>
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-6 text-stone-400 sm:mt-3 sm:text-sm sm:leading-7">
              Your favorite pizza is just a few simple steps away.
              Ordering delicious food has never been easier.
            </p>
          </div>
        </div>

        {/* Steps Layout */}
        <div className="relative mt-10 sm:mt-0">
          
          {/* Desktop Connecting Line */}
          <div className="absolute left-[10%] right-[10%] top-10 hidden h-px bg-gradient-to-r from-transparent via-[#F97316]/30 to-transparent lg:block" />

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLeft = index % 2 === 0; 

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex items-center gap-4 sm:flex-col sm:items-center sm:gap-0"
                >
                  {/* Mobile Zig-Zag Layout */}
                  <div className={`flex w-full items-center gap-4 sm:contents ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    
                    {/* Icon & Number */}
                    <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#F97316]/20 bg-[#1A1716] text-[#F97316] shadow-lg shadow-black/50 transition-all duration-300 group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-white sm:mb-6 sm:h-16 sm:w-16">
                      <Icon size={24} strokeWidth={2} className="sm:size-7" />
                      
                      <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border border-[#F97316]/30 bg-[#100D0B] text-[9px] font-bold text-[#F97316] sm:-right-2 sm:-top-2 sm:h-7 sm:w-7 sm:text-[10px]">
                        {step.number}
                      </span>
                    </div>

                    {index !== steps.length - 1 && (
                      <div className={`absolute top-14 h-[calc(100%+2.5rem)] w-px border-l-2 border-dashed border-white/[0.08] sm:hidden ${
                        isLeft ? 'left-7' : 'right-7'
                      }`} />
                    )}

                    {/* Text Content */}
                    <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right sm:text-center'} sm:text-center`}>
                      <div className={`inline-block rounded-xl border border-white/[0.04] bg-[#1A1716]/50 p-3 sm:border-0 sm:bg-transparent sm:p-0`}>
                        <h3 className="text-[15px] font-semibold text-white transition-colors group-hover:text-[#F97316] sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-[11px] leading-5 text-stone-400 sm:mx-auto sm:mt-2 sm:max-w-xs sm:text-xs sm:leading-6">
                          {step.description}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}