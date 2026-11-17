
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Pizza,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";



type IconProps = { size?: number; className?: string };

function IconSvg({
  size = 18,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function FaFacebookF(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </IconSvg>
  );
}

function FaInstagram(props: IconProps) {
  return (
    <IconSvg {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </IconSvg>
  );
}

function FaXTwitter(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path d="M18 2h3l-7.5 8.6L22.5 22H16l-5-6.5L5 22H2l8-9.2L1.5 2H8l4.5 6z" />
    </IconSvg>
  );
}

function FaYoutube(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.92 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
      <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z" />
    </IconSvg>
  );
}

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const supportLinks = [
  { name: "My Orders", href: "/orders" },
  { name: "My Account", href: "/profile" },
  { name: "FAQs", href: "/faq" },
  { name: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#302824] bg-[#0B0908] px-5 pt-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Footer Main Content */}
        <div className="grid grid-cols-2 gap-10 pb-14 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316] text-white">
                <Pizza size={25} />
              </div>

              <span className="text-2xl font-bold text-white">
                Pizza<span className="text-[#F97316]">Hub</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#A8A29E]">
              Bringing people together with delicious pizza, fresh ingredients,
              and unforgettable flavors. Every slice tells a story.
            </p>

            {/* Social Links */}
           <div className="mt-6 flex items-center gap-3">
  {[
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaXTwitter, href: "#", label: "Twitter" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ].map((social) => {
    const Icon = social.icon;

    return (
      <Link
        key={social.label}
        href={social.href}
        aria-label={social.label}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#302824] text-[#A8A29E] transition-all duration-300 hover:border-[#F97316] hover:bg-[#F97316] hover:text-white"
      >
        <Icon size={18} />
      </Link>
    );
  })}
</div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A8A29E] transition-colors hover:text-[#F97316]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Customer Support
            </h3>

            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A8A29E] transition-colors hover:text-[#F97316]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-6 text-lg font-bold text-white">
              Get In Touch
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin size={19} className="mt-1 shrink-0 text-[#F97316]" />
                <p className="text-sm leading-6 text-[#A8A29E]">
                  Your City, Your Country
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={19} className="shrink-0 text-[#F97316]" />
                <p className="text-sm text-[#A8A29E]">
                  +880 1234-567890
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={19} className="shrink-0 text-[#F97316]" />
                <p className="break-all text-sm text-[#A8A29E]">
                  support@pizzahub.com
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] transition-all hover:gap-3"
            >
              Contact Us
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#302824] py-6 text-center sm:flex-row">
          <p className="text-xs text-[#78716C]">
            © {new Date().getFullYear()} PizzaHub. All rights reserved.
          </p>

          <p className="text-xs text-[#78716C]">
            Made with <span className="text-[#F97316]">♥</span> for Pizza Lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
