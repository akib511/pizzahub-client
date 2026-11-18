"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#100D0B]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl">
            🍕
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Pizza<span className="text-orange-500">Hub</span>
            </h1>
            <p className="text-[9px] font-semibold uppercase tracking-[2px] text-stone-500">
              Taste The Happiness
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-stone-400 transition-colors duration-300 hover:text-orange-400"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/cart"
            className="relative text-stone-300 transition hover:text-orange-400"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={21} />
          </Link>

          <Link
            href="/sign-in"
            className="text-sm font-semibold text-stone-300 transition hover:text-white"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/20"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/5 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#100D0B] px-5 py-6 md:hidden">
          <div className="flex flex-col gap-5">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-stone-300 transition hover:text-orange-400"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-stone-300 transition hover:text-orange-400"
            >
              <ShoppingBag size={18} />
              My Cart
            </Link>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
              <Link
                href="/signIn"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-stone-300"
              >
                Sign In
              </Link>

              <Link
                href="/signUp"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}