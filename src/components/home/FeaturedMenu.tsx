import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, ArrowRight } from "lucide-react";

const pizzas = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce and basil.",
    price: 12,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600&q=90",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Classic pepperoni with melted mozzarella.",
    price: 15,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=90",
    tag: "Best Seller",
  },
  {
    id: 3,
    name: "Cheese Lovers",
    description: "A delicious combination of four premium cheeses.",
    price: 14,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=90",
    tag: "Cheesy",
  },
  {
    id: 4,
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken, BBQ sauce and fresh onions.",
    price: 17,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=90",
    tag: "Special",
  },
  {
    id: 5,
    name: "Veggie Supreme",
    description: "Fresh vegetables, olives, mushrooms and cheese.",
    price: 13,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=90",
    tag: "Healthy",
  },
  {
    id: 6,
    name: "Italian Special",
    description: "Authentic Italian flavors with fresh ingredients.",
    price: 18,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=90",
    tag: "Premium",
  },
];

export default function FeaturedMenu() {
  return (
    <section className="bg-[#100D0B] px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-orange-500">
              Our Special Selection
            </p>

            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Our Popular <span className="text-orange-500">Pizzas</span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-stone-400">
              Discover our most loved pizzas, handcrafted with fresh
              ingredients and unforgettable flavors.
            </p>
          </div>

          <Link
            href="/menu"
            className="group flex w-fit items-center gap-2 text-sm font-semibold text-orange-400 transition hover:text-orange-300"
          >
            View All Menu
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Pizza Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1C1715] transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden sm:h-60">
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  {pizza.tag}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-white transition group-hover:text-orange-400">
                    {pizza.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-orange-400">
                    <Star size={14} className="fill-orange-400" />
                    <span>{pizza.rating}</span>
                  </div>
                </div>

                <p className="mt-2 min-h-10 text-sm leading-6 text-stone-400">
                  {pizza.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="text-xl font-extrabold text-orange-400">
                    ${pizza.price}
                  </p>

                  <Link
                    href="/menu"
                    className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-orange-400"
                  >
                    <ShoppingBag size={15} />
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}