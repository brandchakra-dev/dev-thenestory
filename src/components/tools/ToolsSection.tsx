"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  ChevronLeft, ChevronRight, ArrowRight, Sparkles,
  Calculator, TrendingUp, BarChart2, Ruler, Home,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

// ─── Tool config ───────────────────────────────────────────
interface Tool {
  title: string;
  desc: string;
  href: string;
  icon: string;
  gradient: string;
  iconColor: string;
  bgLight: string;
}

const iconMap: Record<string, React.ReactNode> = {
  budget:  <Calculator size={22} />,
  emi:     <TrendingUp size={22} />,
  compare: <BarChart2  size={22} />,
  area:    <Ruler      size={22} />,
  ability: <Home       size={22} />,
};

// ─── ToolCard ──────────────────────────────────────────────
function ToolCard({ title, desc, href, icon, gradient, iconColor, bgLight }: Tool) {
  return (
    <Link href={href} className="group block h-full">
      <div className="relative h-full bg-white rounded-2xl overflow-hidden
        border border-[#EDE5DD]
        shadow-[0_2px_12px_rgba(107,58,31,0.07)]
        hover:shadow-[0_12px_36px_rgba(107,58,31,0.14)]
        hover:-translate-y-1.5 transition-all duration-300 p-5">

        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl ${bgLight} flex items-center justify-center mb-4
          group-hover:scale-110 transition-transform duration-300 ${iconColor}`}>
          {iconMap[icon]}
        </div>

        {/* Text */}
        <h3 className="font-display font-bold text-[#1C0F05] text-[15px] leading-snug mb-1.5
          group-hover:text-[#6B3A1F] transition-colors duration-200">
          {title}
        </h3>
        <p className="text-[#A8978A] text-xs leading-relaxed mb-4">{desc}</p>

        {/* CTA */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold
          ${iconColor} group-hover:gap-2.5 transition-all duration-200`}>
          Try Now
          <ArrowRight size={12} />
        </div>

        {/* Subtle bg decoration */}
        <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full
          ${bgLight} opacity-40 group-hover:opacity-70 transition-opacity duration-300`} />
      </div>
    </Link>
  );
}

// ─── ToolsSection ──────────────────────────────────────────
export default function ToolsSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const tools: Tool[] = [
    {
      title: "Budget Calculator",
      desc:  "Check your home buying affordability in seconds.",
      href:  "/tools/budget-calculator",
      icon:  "budget",
      gradient:  "bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C]",
      iconColor: "text-[#6B3A1F]",
      bgLight:   "bg-[#6B3A1F]/8",
    },
    {
      title: "EMI Calculator",
      desc:  "Estimate your monthly home loan installment easily.",
      href:  "/tools/emi-calculator",
      icon:  "emi",
      gradient:  "bg-gradient-to-r from-emerald-400 to-teal-500",
      iconColor: "text-emerald-600",
      bgLight:   "bg-emerald-50",
    },
    {
      title: "Compare Projects",
      desc:  "Side-by-side comparison to pick what suits you best.",
      href:  "/tools/compare-projects",
      icon:  "compare",
      gradient:  "bg-gradient-to-r from-blue-400 to-indigo-500",
      iconColor: "text-blue-600",
      bgLight:   "bg-blue-50",
    },
    {
      title: "Area Converter",
      desc:  "Convert between sq ft, sq m, acres & more instantly.",
      href:  "/tools/area-converter",
      icon:  "area",
      gradient:  "bg-gradient-to-r from-amber-400 to-orange-500",
      iconColor: "text-amber-600",
      bgLight:   "bg-amber-50",
    },
  ];

  return (
    <section className="py-8 sm:py-6 lg:py-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(38,45%,97%) 0%, hsl(34,35%,93%) 100%)" }}>

      {/* Decorative bg blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full
        bg-[#6B3A1F]/4 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full
        bg-[#C9A84C]/6 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="font-display font-bold text-[#1C0F05]
              text-2xl sm:text-3xl lg:text-4xl leading-tight">
              TheNestory{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                Tools
              </span>
            </h2>

            <p className="text-[#A8978A] text-sm mt-1.5 font-medium">
              Tailored tools for your real estate success.
            </p>
          </div>

          {/* View All — desktop */}
          <button className="hidden sm:inline-flex items-center gap-2 flex-shrink-0
            px-5 py-2.5 rounded-xl border border-[#EDE5DD] bg-white
            text-[#6B3A1F] font-bold text-sm
            shadow-[0_2px_8px_rgba(107,58,31,0.08)]
            hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
            hover:shadow-[0_4px_16px_rgba(107,58,31,0.25)]
            active:scale-[0.97] transition-all duration-200">
            View All
            <ArrowRight size={15} />
          </button>
        </div>

        {/* ── Carousel ── */}
        <div className="relative">

          {/* Nav arrows */}
          <button
            ref={prevRef}
            className="tools-prev absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
              border border-[#EDE5DD]
              shadow-[0_2px_12px_rgba(107,58,31,0.12)]
              flex items-center justify-center text-[#6B5C4E]
              hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
              hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
              active:scale-90 transition-all duration-200">
            <ChevronLeft size={18} />
          </button>

          <button
            ref={nextRef}
            className="tools-next absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
              border border-[#EDE5DD]
              shadow-[0_2px_12px_rgba(107,58,31,0.12)]
              flex items-center justify-center text-[#6B5C4E]
              hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
              hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
              active:scale-90 transition-all duration-200">
            <ChevronRight size={18} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{
              nextEl: ".tools-next",
              prevEl: ".tools-prev",
            }}
            breakpoints={{
              0:    { slidesPerView: 1.2,  spaceBetween: 12 },
              480:  { slidesPerView: 1.8,  spaceBetween: 14 },
              640:  { slidesPerView: 2.2,  spaceBetween: 16 },
              768:  { slidesPerView: 2.8,  spaceBetween: 18 },
              1024: { slidesPerView: 3.5,  spaceBetween: 20 },
              1280: { slidesPerView: 4,    spaceBetween: 20 },
            }}
            style={{ padding: "4px 2px 8px" }}
          >
            {tools.map((tool, i) => (
              <SwiperSlide key={i} style={{ height: "auto" }}>
                <ToolCard {...tool} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All — mobile */}
        <div className="flex justify-center mt-6 sm:hidden">
          <button className="inline-flex items-center gap-2
            px-6 py-2.5 rounded-xl
            bg-[#6B3A1F] text-white font-bold text-sm
            shadow-[0_4px_16px_rgba(107,58,31,0.30)]
            hover:bg-[#522C16] active:scale-[0.97] transition-all duration-200">
            View All Tools
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  );
}