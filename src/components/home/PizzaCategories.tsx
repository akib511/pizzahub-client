"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Category = {
  name: string;
  description: string;
  image: string;
  items: string;
  value: string;
};

interface Pizza {
  _id: string;
  name: string;
  category: string;
  image: string;
  available: boolean;
  status: string;
  createdAt?: string;
}

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

const normalizeCategory = (category: string) => {
  return category.toLowerCase().trim();
};

const matchesCategory = (pizzaCategory: string, value: string) => {
  const category = normalizeCategory(pizzaCategory);

  if (value === "Classic Pizzas") {
    return category === "classic pizzas" || category === "classic";
  }

  if (value === "Vegetarian Pizzas") {
    return category === "vegetarian pizzas" || category === "vegetarian";
  }

  if (value === "Specialty / Gourmet Pizzas") {
    return (
      category === "specialty / gourmet pizzas" ||
      category === "specialty" ||
      category === "gourmet"
    );
  }

  if (value === "Beverages & Desserts") {
    return category.includes("beverage") || category.includes("dessert");
  }

  return category === normalizeCategory(value);
};

function CategoryCard({
  category,
  image,
}: {
  category: Category;
  image: string;
}) {
  return (
    <Link
      href={`/menu?category=${encodeURIComponent(category.value)}`}
      className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#100D0B]"
    >
      <div className="relative h-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#1A1716] transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:shadow-2xl hover:shadow-[#F97316]/10 active:scale-[0.98] sm:rounded-2xl">
        
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden sm:h-48">
          <img
            src={image}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient Overlay - Deeper on mobile for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1716] via-black/30 to-transparent sm:via-black/20" />

          {/* Floating Pill Tag */}
          <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/90 backdrop-blur-md sm:px-3 sm:text-[11px]">
            {category.items}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-white transition-colors group-hover:text-[#F97316] sm:text-base">
              {category.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-[11px] leading-[1.4] text-stone-400 sm:text-xs sm:leading-5">
              {category.description}
            </p>
          </div>

          {/* Arrow Icon - Cleaner on mobile */}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#F97316]/20 bg-[#F97316]/5 text-[#F97316] transition-all duration-300 group-hover:bg-[#F97316] group-hover:text-white sm:size-9">
            <ArrowUpRight size={16} strokeWidth={2.5} className="sm:hidden" />
            <ArrowRight size={15} className="hidden sm:block" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeading() {
  return (
    <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[3px] text-[#F97316] sm:text-xs">
          <span className="h-1 w-1 rounded-full bg-[#F97316]"></span>
          Explore Our Categories
        </span>
        <h2
          id="categories-heading"
          className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-white sm:mt-3 sm:text-3xl lg:text-4xl"
        >
          Find Your <span className="text-[#F97316]">Flavor.</span>
        </h2>
        <p className="mt-2 max-w-xl text-xs leading-5 text-stone-400 sm:mt-3 sm:text-sm sm:leading-7">
          From classic favorites to irresistible specialties, discover the
          perfect taste for every craving.
        </p>
      </div>
    </div>
  );
}

export default function PizzaCategories() {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/menu");
        if (!response.ok) throw new Error("Failed to load category images");
        const data: Pizza[] = await response.json();

        const availablePizzas = data
          .filter(
            (pizza) =>
              pizza.status?.toLowerCase() === "approved" &&
              pizza.available === true &&
              pizza.image
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );

        const images: Record<string, string> = {};
        CATEGORIES.forEach((category) => {
          const matchingPizza = availablePizzas.find((pizza) =>
            matchesCategory(pizza.category, category.value)
          );
          if (matchingPizza) {
            images[category.value] = matchingPizza.image;
          }
        });

        setCategoryImages(images);
      } catch (error) {
        console.error("Failed to load category images:", error);
      }
    };

    fetchCategoryImages();
  }, []);

  return (
    <section
      aria-labelledby="categories-heading"
      className="overflow-hidden bg-[#100D0B] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading />

        {/* 
          GRID LAYOUT: 
          Mobile: Horizontal Scroll (Snap) -> 1.2 cards visible (indicates more content)
          Tablet: 2 cols
          Desktop: 3 cols (2 rows for 6 items)
        */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <div 
              key={category.name} 
              className="w-[85vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <CategoryCard
                category={category}
                image={categoryImages[category.value] || category.image}
              />
            </div>
          ))}
        </div>

        {/* Swipe Hint for Mobile only */}
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-stone-500 sm:hidden">
          <span className="h-px w-8 bg-stone-700"></span>
          Swipe to explore
          <span className="h-px w-8 bg-stone-700"></span>
        </div>
        
      </div>
    </section>
  );
}