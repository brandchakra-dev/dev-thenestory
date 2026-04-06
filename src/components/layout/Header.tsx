"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, User, Menu, X, ChevronRight, Phone } from "lucide-react";
import logoLight from "../../../public/logo/logo.webp";
import logoDark from "../../../public/logo/logo-black.webp";

import logo from "../../../public/logo/logo.webp";

const navLinks = [
  { label: "Projects",   href: "/projects" },
  { label: "Compare",    href: "/compare-projects" },
  { label: "Properties", href: "/properties" },
  { label: "Insights", href: "/blog" },
];

export default function Header() {
  const pathname  = usePathname();
  const isHome    = pathname === "/";

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeLink,   setActiveLink]   = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close mobile menu on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  /* ── Lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── Dynamic header styles ── */
  const isTransparent = isHome && !scrolled && !mobileOpen;

  const headerBase = `
    fixed top-0 left-0 w-full z-50
    transition-all duration-500 ease-in-out
  `;

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-white/98 backdrop-blur-xl border-b border-champ-200/60";

  const headerShadow = !isTransparent ? "shadow-[0_2px_24px_hsl(20_50%_15%/0.08)]" : "";

  const textColor   = isTransparent ? "text-white"           : "text-warm-900";
  const textHover   = isTransparent ? "hover:text-champ-300" : "hover:text-primary";
  const logoFilter  = isTransparent ? "brightness-0 invert"  : "";

  return (
    <>
      <header className={`${headerBase} ${headerBg} ${headerShadow}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-18">

            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0 relative z-10">
               <div className="relative w-36 h-10">

                  <Image
                    src={logoLight}
                    alt=""
                    fill
                    className={`
                      object-contain transition-opacity duration-300
                      ${isTransparent ? "opacity-100" : "opacity-0"}
                    `}
                  />

                  <Image
                    src={logoDark}
                    alt=""
                    fill
                    className={`
                      object-contain transition-opacity duration-300
                      ${isTransparent ? "opacity-0" : "opacity-100"}
                    `}
                  />

               </div>
             </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 text-sm font-semibold tracking-wide
                    transition-all duration-200 rounded-lg group
                    ${textColor} ${textHover}
                  `}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span className={`
                    absolute bottom-1 left-4 right-4 h-0.5 rounded-full
                    scale-x-0 group-hover:scale-x-100
                    transition-transform duration-300 origin-left
                    ${isTransparent ? "bg-champ-300" : "bg-primary"}
                  `} />
                </Link>
              ))}
            </nav>

            {/* ── Desktop Right Actions ── */}
            <div className="hidden lg:flex items-center gap-2">

              {/* Phone CTA */}
              <a
                href="tel:+91"
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                  transition-all duration-200
                  ${isTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-warm-600 hover:text-primary hover:bg-champ-100"
                  }
                `}
              >
                <Phone size={14} />
                <span>+91 95403 11311</span>
              </a>

              {/* Divider */}
              <div className={`w-px h-6 mx-1 ${isTransparent ? "bg-white/20" : "bg-champ-200"}`} />

              {/* Icon buttons */}
              {[
                { Icon: Heart, label: "Wishlist" },
                { Icon: User,  label: "Account" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className={`
                    p-2.5 rounded-xl transition-all duration-200
                    ${isTransparent
                      ? "text-white hover:bg-white/15"
                      : "text-warm-600 hover:bg-champ-100 hover:text-primary"
                    }
                  `}
                >
                  <Icon size={17} />
                </button>
              ))}

              {/* Post Property CTA */}
              <button
                className={`
                  relative ml-1 px-5 py-2.5 rounded-xl text-sm font-bold
                  overflow-hidden transition-all duration-300
                  ${isTransparent
                    ? "bg-white text-warm-900 hover:bg-champ-100 shadow-md"
                    : "bg-primary text-white hover:bg-brand-700 shadow-[0_4px_14px_hsl(20_60%_27%/0.35)]"
                  }
                  active:scale-95
                `}
              >
                Post Property
              </button>
            </div>

            {/* ── Tablet: show icons + hamburger, hide full nav ── */}
            <div className="flex lg:hidden items-center gap-1.5">

              <button
                aria-label="Wishlist"
                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isTransparent
                    ? "text-white hover:bg-white/15"
                    : "text-warm-600 hover:bg-champ-100"
                  }
                `}
              >
                <Heart size={17} />
              </button>

              <button
                aria-label="Account"
                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isTransparent
                    ? "text-white hover:bg-white/15"
                    : "text-warm-600 hover:bg-champ-100"
                  }
                `}
              >
                <User size={17} />
              </button>

              {/* Post Property — small on tablet */}
              <button
                className={`
                  hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-bold
                  transition-all duration-200 active:scale-95
                  ${isTransparent
                    ? "bg-white text-warm-900"
                    : "bg-primary text-white shadow-[0_4px_14px_hsl(20_60%_27%/0.30)]"
                  }
                `}
              >
                Post Property
              </button>

              {/* Hamburger */}
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isTransparent
                    ? "text-white hover:bg-white/15"
                    : "text-warm-800 hover:bg-champ-100"
                  }
                `}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Champagne bottom border accent on scroll ── */}
        {!isTransparent && (
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-champ-300/60 to-transparent" />
        )}
      </header>

      {/* ══════════════════════════════════════════
          Mobile Drawer — slides in from right
      ══════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer panel */}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-[min(320px,85vw)] z-50
          bg-white flex flex-col
          shadow-[−8px_0_40px_hsl(20_50%_15%/0.15)]
          transition-transform duration-400 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-champ-200">
          <Image src={logo} alt="The Nestory" width={120} height={44} className="w-28 h-auto" />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-warm-600 hover:bg-champ-100 hover:text-primary transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-between
                px-4 py-3.5 rounded-xl
                text-warm-800 font-semibold text-sm
                hover:bg-champ-100 hover:text-primary
                transition-all duration-200 group
              "
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
              <ChevronRight
                size={15}
                className="text-warm-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 py-5 border-t border-champ-200 space-y-3">

          {/* Phone */}
          <a
            href="tel:+91"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-champ-100 text-warm-700 text-sm font-medium hover:bg-champ-200 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone size={14} className="text-primary" />
            </div>
            +91 95403 11311
          </a>

          {/* Post Property */}
          <button
            className="
              w-full py-3.5 rounded-xl bg-primary text-white
              font-bold text-sm tracking-wide
              shadow-[0_4px_16px_hsl(20_60%_27%/0.35)]
              hover:bg-brand-700 active:scale-[0.98]
              transition-all duration-200
            "
            onClick={() => setMobileOpen(false)}
          >
            Post Property
          </button>

          {/* Brand tagline */}
          <p className="text-center text-xs text-warm-400 font-medium pt-1">
            © 2026 The Nestory. Premium Real Estate.
          </p>
        </div>
      </div>
    </>
  );
}