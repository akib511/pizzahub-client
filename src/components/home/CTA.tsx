"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Star } from "lucide-react";
import { fadeUp, slideInRight, staggerContainer, viewportOnce } from "@/lib/motion";

export default function CTA() {
  return (
    <section className="bg-background py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main CTA Container - Compact & Premium */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl"
        >
          {/* Background Glow */}
          <motion.div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-[60px] sm:h-64 sm:w-64"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <div className="relative grid items-center lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Side: Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative z-10 p-5 sm:p-8 lg:p-10"
            >
              {/* Top Badge */}
              <motion.div
                variants={fadeUp}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary sm:text-[10px]"
              >
                <Flame size={12} />
                <span>Hot & Fresh</span>
              </motion.div>

              {/* Heading - Compact */}
              <motion.h2
                variants={fadeUp}
                className="font-[var(--font-heading)] text-2xl font-bold leading-[1.15] text-foreground sm:text-3xl lg:text-4xl"
              >
                Your Next <span className="text-primary">Favorite Slice</span> Is Waiting.
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-2 max-w-sm text-[11px] leading-5 text-muted-foreground sm:mt-3 sm:text-xs sm:leading-6"
              >
                Treat yourself to something delicious, freshly prepared with love and delivered right to your door.
              </motion.p>

              {/* Action Row */}
              <motion.div
                variants={fadeUp}
                className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center"
              >
                <Link
                  href="/menu"
                  className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-xs font-bold text-white transition-all duration-300 hover:bg-primary active:scale-[0.98] sm:w-auto sm:rounded-full sm:h-11"
                >
                  Order Now
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>

              {/* Social Proof / Stars */}
              <motion.div
                variants={fadeUp}
                className="mt-4 flex items-center gap-2 border-t border-border pt-3 sm:mt-5"
              >
                <div className="flex gap-0.5 text-primary">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={10} fill="currentColor" className="sm:size-3" />
                  ))}
                </div>
                <span className="text-[9px] font-medium text-muted-foreground sm:text-[10px]">
                  Loved by 10,000+ foodies
                </span>
              </motion.div>
            </motion.div>

            {/* Right Side: Image */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative h-44 w-full sm:h-56 lg:h-full lg:min-h-[280px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=95"
                alt="Delicious pizza"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Gradient Overlay to blend image with dark background */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:bg-gradient-to-r lg:from-card lg:via-transparent lg:to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
