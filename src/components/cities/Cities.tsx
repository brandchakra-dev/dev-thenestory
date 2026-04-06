"use client";

import Image from "next/image";
import { ArrowUpRight, MapPin, Building2 } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────
const cities = [
  { name: "Delhi / NCR",       properties: "185,000", image: "/cities/delhi_m.jpg",         featured: true  },
  { name: "Gurugram",          properties: "45,000",  image: "/cities/gurugram_new.jpg",       featured: true  },
  { name: "Noida",             properties: "29,000",  image: "/cities/noida.jpg",          featured: false },
  { name: "Greater Noida",     properties: "39,000",  image: "/cities/greater_noida.jpg",  featured: false },
  { name: "Faridabad",         properties: "53,000",  image: "/cities/faridabad.png",      featured: false },
  { name: "Ghaziabad",         properties: "39,000",  image: "/cities/ghaziabad.jpeg",     featured: false },
  { name: "Yamuna Expressway", properties: "34,000",  image: "/cities/yamuna_express.jpg", featured: false },
];

const stats = [
  { value: "7+",       label: "Cities"         },
  { value: "4,24,000+",label: "Listings"       },
  { value: "1,200+",   label: "Projects"       },
  { value: "18,000+",  label: "Clients Served" },
];

// ─── Large Featured Card ───────────────────────────────────
function FeaturedCityCard({ name, properties, image }: typeof cities[0]) {
  return (
    <div className="group relative rounded-3xl overflow-hidden cursor-pointer
      aspect-[4/5] sm:aspect-[3/4]
      shadow-[0_8px_32px_rgba(107,58,31,0.18)]
      hover:shadow-[0_20px_60px_rgba(107,58,31,0.28)]
      hover:-translate-y-1 transition-all duration-500">

      <Image src={image} alt={name} fill
        className="object-cover group-hover:scale-108 transition-transform duration-700" />

      {/* Multi-layer gradient */}
      <div className="absolute inset-0 bg-gradient-to-t
        from-[#1C0F05]/90 via-[#1C0F05]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br
        from-[#6B3A1F]/10 via-transparent to-transparent" />

      {/* Top badge */}
      <div className="absolute top-4 left-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
          bg-white/15 backdrop-blur-md border border-white/20
          text-white text-[10px] font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          Featured
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full
        bg-white/15 backdrop-blur-md border border-white/20
        flex items-center justify-center
        opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
        transition-all duration-300">
        <ArrowUpRight size={14} className="text-white" />
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[#C9A84C] text-[10px] font-bold tracking-widest uppercase mb-1">
          {properties}+ Properties
        </p>
        <h3 className="font-display font-bold text-white text-xl sm:text-2xl leading-tight">
          {name}
        </h3>
        {/* Explore line */}
        <div className="flex items-center gap-2 mt-3 overflow-hidden">
          <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/60 to-transparent" />
          <span className="text-[#C9A84C] text-[10px] font-bold tracking-widest uppercase
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Small City Row ────────────────────────────────────────
function SmallCityCard({ name, properties, image }: typeof cities[0]) {
  return (
    <div className="group flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer
      border border-transparent
      hover:border-[#EDE5DD] hover:bg-white
      hover:shadow-[0_4px_20px_rgba(107,58,31,0.09)]
      transition-all duration-300">

      {/* Image */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0
        shadow-[0_2px_8px_rgba(107,58,31,0.12)]">
        <Image src={image} alt={name} fill
          className="object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-display font-bold text-[#1C0F05] text-sm truncate
          group-hover:text-[#6B3A1F] transition-colors duration-200">
          {name}
        </h3>
        <div className="flex items-center gap-1 mt-0.5">
          <Building2 size={10} className="text-[#6B3A1F]/40" />
          <p className="text-[#A8978A] text-[11px] font-medium">{properties}+ Properties</p>
        </div>
      </div>
    </div>
  );
}

// ─── CitiesSection ────────────────────────────────────────
export default function CitiesSection() {
  const featured = cities.filter(c => c.featured);
  const rest     = cities.filter(c => !c.featured);

  return (
    <section className="py-8 sm:py-6 lg:py-8 relative overflow-hidden bg-[hsl(38,45%,97%)]">

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px
        bg-gradient-to-r from-transparent via-[#D4C4B0]/60 to-transparent" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full
        bg-[#6B3A1F]/4 blur-3xl pointer-events-none" />
      <div className="absolute top-20 -left-20 w-56 h-56 rounded-full
        bg-[#C9A84C]/5 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-2xl mb-10 sm:mb-14">

          {/* Eyebrow */}

          <h2 className="font-display font-bold text-[#1C0F05]
              text-2xl sm:text-3xl lg:text-4xl leading-tight">
            Cities Where{" "}     
            <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                We Excel
              </span>
          </h2>
        </div>
        

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">

          {/* LEFT — 2 featured large cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-5">
            {featured.map((city, i) => (
              <FeaturedCityCard key={i} {...city} />
            ))}
          </div>

          {/* RIGHT — stats + small city list */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
            {/* Small city cards list */}
            <div className="bg-white rounded-3xl border border-[#EDE5DD]
              shadow-[0_2px_16px_rgba(107,58,31,0.06)] p-2 sm:p-3 flex-1">

              {/* List header */}
              <div className="flex items-center justify-between px-3 py-2 mb-1">
                <span className="text-[11px] font-bold text-[#A8978A] uppercase tracking-widest">
                  All Locations
                </span>
                <button className="inline-flex items-center gap-1
                  text-[11px] font-bold text-[#6B3A1F]
                  hover:gap-1.5 transition-all duration-200">
                  View All <ArrowUpRight size={11} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 divide-y divide-[#FAF8F4]">
                {rest.map((city, i) => (
                  <SmallCityCard key={i} {...city} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}