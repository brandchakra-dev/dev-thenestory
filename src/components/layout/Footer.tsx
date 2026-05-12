"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Instagram, Youtube,
  Facebook, ArrowUpRight, ChevronRight,
  ArrowUp, Star
} from "lucide-react";

// ─── API Import ────────────────────────────────────────────────
import { citiesApi } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────
interface City {
  _id: string;
  name: string;
  slug: string;
  state: string;
  description?: string;
  url?: string;
  isActive: boolean;
  sortOrder: number;
  propertyCount?: number;
}

// ─── Nav Links (Rent Property section removed) ──────────────────
const navGroups = [
  // {
  //   title: "Buy Property",
  //   links: [
  //     { label: "Flats in Noida",            href: "/flats-noida"           },
  //     { label: "Flats in Gurugram",          href: "/flats-gurugram"         },
  //     { label: "Flats in Greater Noida",     href: "/flats-greater-noida"    },
  //     { label: "Flats in Gaziabad",     href: "/flats-gaziabad"    },
  //     { label: "Villas & Independent Houses",href: "/villas"                 },
  //   ],
  // },
  {
    title: "Resources",
    links: [
      { label: "Compare Projects",       href: "/compare-projects"            },
      { label: "EMI Calculator",             href: "/tools/emi-calculator"   },
      { label:"Budget Calculator",      href:"/tools/budget-calculator"},
      { label: "Blog & Guides",              href: "/blog"                       },
      { label: "YouTube Channel",            href: "https://youtube.com/@the_nestory" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About The Nestory",          href: "/about-us"                      },
      { label: "Contact Us",                 href: "/contact-us"                    },
    ],
  },
];

const socials = [
  { icon: <Youtube size={16} />,   href: "https://www.youtube.com/@the_nestory",  label: "YouTube",   color: "#FF0000" },
  { icon: <Instagram size={16} />, href: "https://www.instagram.com/the_nestory_official/", label: "Instagram", color: "#E1306C" },
  { icon: <Facebook size={16} />,  href: "https://www.facebook.com/thenestoryllp/",  label: "Facebook",  color: "#1877F2" },
];

// ─── ScrollToTop ──────────────────────────────────────────
function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
        hover:-translate-y-1 active:scale-90"
      style={{
        background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
        boxShadow: "0 4px 16px rgba(107,58,31,0.30)",
        color: "#E8D5B0",
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} />
    </button>
  );
}

// ─── Footer ───────────────────────────────────────────────
export default function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await citiesApi.getAll();
        
        let citiesData = [];
        if (response.cities) {
          citiesData = response.cities;
        } else if (response.data) {
          citiesData = response.data;
        } else if (Array.isArray(response)) {
          citiesData = response;
        }

        // Sort by sortOrder (ascending)
        const sortedCities = [...citiesData]
          .filter(city => city.isActive !== false)
          .sort((a, b) => {
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
              return a.sortOrder - b.sortOrder;
            }
            return a.name.localeCompare(b.name);
          });

        setCities(sortedCities);
      } catch (err) {
        console.error("Failed to fetch cities for footer:", err);
        // Fallback to static cities if API fails
        const fallbackCities = [
          "Delhi", "Noida", "Greater Noida", "Gurugram",
          "Faridabad", "Ghaziabad", "Yamuna Expressway", "Dwarka",
        ].map((name, index) => ({ _id: `fallback-${index}`, name, slug: name.toLowerCase().replace(/ /g, '-'), state: '', isActive: true, sortOrder: index }));
        setCities(fallbackCities);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <footer style={{ background: "hsl(38,45%,97%)" }}>

      {/* ── Top border rule ── */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(107,58,31,0.18) 30%, rgba(201,168,76,0.28) 55%, transparent)" }}
      />

      {/* ══ CTA STRIP ══ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(105deg, #1C0F05 0%, #3B1D0D 50%, #1C0F05 100%)",
        }}
      >
        {/* Ambient orbs */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(107,58,31,0.25) 0%, transparent 70%)" }} />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#C9A84C" }}>
                Free Consultation
              </p>
              <h3 className="font-display font-black text-white text-xl sm:text-2xl leading-tight">
                Ready to find your dream home?
              </h3>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="tel:+919540311311"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm
                  transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                  color: "#1C0F05",
                  boxShadow: "0 4px 18px rgba(201,168,76,0.35)",
                }}
              >
                <Phone size={14} /> Call Now
              </a>
              <a
                href="/contact-us"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm border
                  transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.80)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                Get Free Advice <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN FOOTER BODY ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 lg:pt-16 pb-8">

        {/* Top row: brand col + nav cols + new rating/contact col */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-x-6 gap-y-10 mb-12 lg:mb-14">

          {/* ── Brand Column ── */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-3">
            {/* Logo */}
            <div className="mb-4">
              <h2
                className="font-display font-black leading-none tracking-tight"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", color: "#1C0F05" }}
              >
                The{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #6B3A1F, #C9A84C)" }}
                >
                  Nestory
                </span>
              </h2>
              <div
                className="mt-1.5 h-[2px] w-10 rounded-full"
                style={{ background: "linear-gradient(90deg, #6B3A1F, rgba(201,168,76,0.4))" }}
              />
            </div>

            {/* Tagline */}
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#7A6858", maxWidth: "260px" }}>
              NCR's most trusted real estate advisory. We guarantee verified listings, unbiased advice, end-to-end support.
            </p>

            {/* We Serve section - DYNAMIC CITIES */}
            <div
              className="py-3 px-4 rounded-xl mb-5"
              style={{
                background: "rgba(107,58,31,0.04)",
                border: "1px solid rgba(107,58,31,0.09)",
              }}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span
                  className="font-black tracking-[0.18em] uppercase mr-1 flex-shrink-0"
                  style={{ fontSize: "8px", color: "#6B3A1F" }}
                >
                  We Serve
                </span>
                <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                  {loadingCities ? (
                    // Loading skeleton for cities
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <span key={i} className="inline-block w-16 h-3 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </>
                  ) : (
                    cities.map((city, i) => (
                      <span key={city._id} className="flex items-center gap-1">
                        <a
                          href={`/projects?city=${encodeURIComponent(city.name)}`}
                          className="text-[10px] font-semibold transition-colors duration-200 hover:text-[#6B3A1F]"
                          style={{ color: "#A8978A" }}
                        >
                          {city.name}
                        </a>
                        {i < cities.length - 1 && (
                          <span style={{ color: "rgba(201,168,76,0.45)", fontSize: "8px" }}>·</span>
                        )}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Nav Columns (Buy, Resources, Company) ── */}
          {navGroups.map((group) => (
            <div key={group.title} className="lg:col-span-2 col-span-1">
              <h4
                className="font-black tracking-[0.18em] uppercase mb-4"
                style={{ fontSize: "9px", color: "#6B3A1F" }}
              >
                {group.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
                      style={{ color: "#7A6858" }}
                    >
                      <ChevronRight
                        size={10}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0"
                        style={{ color: "#C9A84C" }}
                      />
                      <span className="group-hover:text-[#6B3A1F] transition-colors duration-200">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Rating + Contact + Social Column ── */}
          <div className="lg:col-span-3 col-span-2">
            {/* Contact info */}
            <div className="flex flex-col gap-3 mb-6">
              {[
                { icon: <Phone size={12} />,  text: "+91 9540 311 311",          href: "tel:+919540311311"          },
                { icon: <Mail size={12} />,   text: "info@thenestory.in",       href: "mailto:info@thenestory.in" },
                { icon: <MapPin size={12} />, text: "Head Office : Office No. 106 Tower D&E, Golden I, Techzone 4, Amrapali Leisure Valley, Greater Noida, Uttar Pradesh 201009", href: "Techzone 4, Amrapali Leisure Valley, Greater Noida"},
                { icon: <MapPin size={12} />, text: "Branch Office : Plot No. 636 Ground Floor, Sector 5 Vasundhra ", href: "Plot No. 636 Ground Floor, Sector 5 Vasundhra"},
              ].map(({ icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  className="group inline-flex items-start gap-2.5 transition-colors duration-200"
                >
                  <span
                    className="flex-shrink-0 mt-0.5 transition-colors duration-200 group-hover:text-[#6B3A1F]"
                    style={{ color: "#C9A84C" }}
                  >
                    {icon}
                  </span>
                  <span
                    className="text-xs font-medium leading-snug transition-colors duration-200 group-hover:text-[#6B3A1F]"
                    style={{ color: "#7A6858" }}
                  >
                    {text}
                  </span>
                </a>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {socials.map(({ icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: hoveredSocial === label ? color + "15" : "rgba(107,58,31,0.07)",
                    border: `1px solid ${hoveredSocial === label ? color + "35" : "rgba(107,58,31,0.10)"}`,
                    color: hoveredSocial === label ? color : "#6B3A1F",
                    boxShadow: hoveredSocial === label ? `0 4px 14px ${color}25` : "none",
                  }}
                  onMouseEnter={() => setHoveredSocial(label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5"
          style={{ borderTop: "1px solid rgba(107,58,31,0.09)" }}
        >
          {/* Copyright */}
          <p className="text-[11px] font-medium text-center sm:text-left" style={{ color: "#B0A090" }}>
            © {new Date().getFullYear()} Nestory Realtech LLP · All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {["Privacy Policy", "Terms of Use", "Cookie Policy", "Sitemap"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-4">
                <a
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-[11px] font-medium transition-colors duration-200 hover:text-[#6B3A1F]"
                  style={{ color: "#B0A090" }}
                >
                  {item}
                </a>
                {i < arr.length - 1 && (
                  <span style={{ color: "rgba(107,58,31,0.18)", fontSize: "10px" }}>|</span>
                )}
              </span>
            ))}
          </div>

          {/* Scroll to top */}
          <div className="flex-shrink-0">
            <ScrollToTop />
          </div>
        </div>

      </div>

      {/* ── Very bottom brand watermark ── */}
      <div
        className="py-3 text-center"
        style={{ borderTop: "1px solid rgba(107,58,31,0.06)" }}
      >
        <p
          className="font-display font-black tracking-[0.35em] uppercase select-none"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
            backgroundImage: "linear-gradient(135deg, rgba(107,58,31,0.06), rgba(201,168,76,0.08), rgba(107,58,31,0.05))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
          }}
        >
          THE NESTORY
        </p>
      </div>

    </footer>
  );
}