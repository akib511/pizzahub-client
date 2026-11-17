"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Category = {
  name: string;
  description: string;
  image: string;
  items: string;
  value: string;
};

const CATEGORIES: Category[] = [
  {
    name: "Classic Pizzas",
    description: "Timeless flavors that never disappoint.",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=90",
    items: "Traditional Favorites",
    value: "Classic Pizzas",
  },
  {
    name: "Vegetarian Pizzas",
    description: "Fresh vegetables, colorful and delicious.",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&q=90",
    items: "Fresh & Healthy",
    value: "Vegetarian Pizzas",
  },
  {
    name: "Meat Lovers",
    description: "A delicious combination of your favorite meats.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=90",
    items: "Rich & Flavorful",
    value: "Meat Lovers",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    description: "Unique creations for extraordinary cravings.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=90",
    items: "Chef's Special",
    value: "Specialty / Gourmet Pizzas",
  },
  {
    name: "Sides & Appetizers",
    description: "The perfect little extras for your pizza night.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=90",
    items: "Perfect Sidekicks",
    value: "Sides & Appetizers",
  },
  {
    name: "Beverages & Desserts",
    description: "Sweet endings and refreshing moments.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=90",
    items: "Sweet & Refreshing",
    value: "Beverages & Desserts",
  },
];

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/menu?category=${encodeURIComponent(category.value)}`}
      className="group block h-full"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#302824] bg-[#1C1715] transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316]/50">
        <div className="relative h-56 overflow-hidden sm:h-60">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 28vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
            {category.items}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 p-5">
          <div>
            <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-[#F97316]">
              {category.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#A8A29E]">
              {category.description}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F97316]/40 text-[#F97316] transition-all duration-300 group-hover:bg-[#F97316] group-hover:text-white">
            <span className="text-xl">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeading() {
  return (
    <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <span className="text-sm font-semibold uppercase tracking-[3px] text-[#F97316]">
          Explore Our Categories
        </span>

        <h2
          id="categories-heading"
          className="mt-4 font-[var(--font-heading)] text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
        >
          Find Your Perfect
          <span className="text-[#F97316]"> Flavor.</span>
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#A8A29E] sm:text-base">
          From classic favorites to irresistible specialties, discover the
          perfect taste for every craving.
        </p>
      </div>

      <p className="text-sm text-[#A8A29E]">
        Discover something delicious
      </p>
    </div>
  );
}

export default function PizzaCategories() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="overflow-hidden bg-[#100D0B] px-5 py-20 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        {/* Carousel with outside navigation */}
        <div className="mx-auto max-w-6xl px-14 sm:px-14">
          <Carousel
            opts={{ align: "start", loop: true }}
            className="relative"
          >
            <CarouselContent className="-ml-3">
              {CATEGORIES.map((category) => (
                <CarouselItem
                  key={category.name}
                  className="basis-full pl-3 sm:basis-1/2 lg:basis-1/3"
                >
                  <CategoryCard category={category} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute -left-10 top-1/2 z-20 h-9 w-9 -translate-y-1/2 border-[#F97316]/60 bg-[#1C1715] text-white shadow-lg hover:bg-[#F97316] hover:text-white sm:-left-14 sm:h-11 sm:w-11" />

            <CarouselNext className="absolute -right-10 top-1/2 z-20 h-9 w-9 -translate-y-1/2 border-[#F97316]/60 bg-[#1C1715] text-white shadow-lg hover:bg-[#F97316] hover:text-white sm:-right-14 sm:h-11 sm:w-11" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}