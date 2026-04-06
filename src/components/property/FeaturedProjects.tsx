"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  ChevronLeft, ChevronRight, MapPin, Tag,
  ArrowRight, Heart, Eye, BadgeCheck, Sparkles
} from "lucide-react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";

// ─── Types ────────────────────────────────────────────────
interface Project {
  title: string;
  location: string;
  price: string;
  status: "New Launch" | "Ready To Move" | "Under Construction";
  image: string;
  tag?: string;
}

// ─── Status config ─────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "New Launch": {
    bg:   "bg-[#6B3A1F]/10 border border-[#6B3A1F]/20",
    text: "text-[#6B3A1F]",
    dot:  "bg-[#6B3A1F]",
  },
  "Ready To Move": {
    bg:   "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
    dot:  "bg-emerald-500",
  },
  "Under Construction": {
    bg:   "bg-amber-50 border border-amber-200",
    text: "text-amber-700",
    dot:  "bg-amber-500",
  },
};

// ─── ProjectCard ───────────────────────────────────────────
function ProjectCard({ title, location, price, status, image }: Project) {
  const cfg = statusConfig[status] ?? statusConfig["Under Construction"];

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden
      border border-[#EDE5DD]
      shadow-[0_2px_12px_rgba(107,58,31,0.07)]
      hover:shadow-[0_12px_40px_rgba(107,58,31,0.14)]
      hover:-translate-y-1 transition-all duration-300 cursor-pointer">

      {/* Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Status badge — top left */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5
          px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm
          ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {status}
        </div>

        {/* Wishlist — top right */}
        <button className="absolute top-3 right-3 w-7 h-7 rounded-full
          bg-white/20 backdrop-blur-sm border border-white/30
          flex items-center justify-center
          hover:bg-white hover:text-[#6B3A1F] transition-all duration-200"
          onClick={(e) => e.stopPropagation()}>
          <Heart size={13} className="text-white group-hover:text-current" />
        </button>

        {/* Price — bottom left over image */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-bold text-sm leading-none drop-shadow-md">{price}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">

        {/* Title */}
        <h3 className="font-display font-bold text-[#1C0F05] text-sm sm:text-[15px]
          leading-snug mb-1.5 line-clamp-1 group-hover:text-[#6B3A1F] transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-[#A8978A] mb-3">
          <MapPin size={11} className="flex-shrink-0 text-[#6B3A1F]/60" />
          <span className="text-xs truncate">{location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EDE5DD]">
          <div className="flex items-center gap-1 text-[10px] text-[#A8978A] font-medium">
            <BadgeCheck size={11} className="text-emerald-500" />
            Verified
          </div>
          <button className="flex items-center gap-1 text-[10px] font-bold
            text-[#6B3A1F] hover:gap-2 transition-all duration-200">
            View Details
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FeaturedProjects ──────────────────────────────────────
export default function FeaturedProjects() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const projects: Project[] = [
    {
      title: "Dasnac Jewel of Noida",
      location: "Sector 75, Noida",
      price: "₹ 1.89 Cr - 12 Cr",
      status: "New Launch",
      image: "/property/sobha.webp",
    },
    {
      title: "Godrej Palm Retreat",
      location: "Sector 150, Noida",
      price: "₹ 1.34 Cr - 4.21 Cr",
      status: "Ready To Move",
      image: "/property/godrej.jpg",
    },
    {
      title: "ACE Golfshire",
      location: "Sector 150, Noida",
      price: "₹ 1.31 Cr - 2.3 Cr",
      status: "Ready To Move",
      image: "/property/m3m.webp",
    },
    {
      title: "Dasnac Westminster",
      location: "Sector 146, Noida",
      price: "₹ 12 Cr+",
      status: "Under Construction",
      image: "/property/prestige-city-siddharth-vihar.webp",
    },
    {
      title: "Dasnac Westminster",
      location: "Sector 146, Noida",
      price: "₹ 12 Cr+",
      status: "Under Construction",
      image: "/property/godrej.jpg",
    },
    {
      title: "Dasnac Westminster",
      location: "Sector 146, Noida",
      price: "₹ 12 Cr+",
      status: "Under Construction",
      image: "/property/sobha.webp",
    },
    {
      title: "Dasnac Westminster",
      location: "Sector 146, Noida",
      price: "₹ 12 Cr+",
      status: "Under Construction",
      image: "/property/prestige-city-siddharth-vihar.webp",
    },
  ];

  return (
    <section className="py-8 sm:py-6 lg:py-8 bg-[hsl(40,40%,97%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">

          <div>
            {/* Eyebrow */}
            <h2 className="font-display font-bold text-[#1C0F05]
              text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Featured Projects{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                Near You
              </span>
            </h2>

            <p className="text-[#A8978A] text-sm mt-1.5 font-medium">
              Trending projects with price, status & location insights.
            </p>
          </div>

          {/* View all — desktop */}
          <button className="hidden sm:inline-flex items-center gap-2 self-end
            px-5 py-2.5 rounded-xl border border-[#EDE5DD] bg-white
            text-[#6B3A1F] font-bold text-sm
            shadow-[0_2px_8px_rgba(107,58,31,0.08)]
            hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
            hover:shadow-[0_4px_16px_rgba(107,58,31,0.25)]
            active:scale-[0.97] transition-all duration-200 flex-shrink-0">
            View All
            <ArrowRight size={15} />
          </button>
        </div>

        {/* ── Carousel ── */}
        <div className="relative">

          {/* Nav buttons */}
          <button
            ref={prevRef}
            className="featured-prev absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
              border border-[#EDE5DD]
              shadow-[0_2px_12px_rgba(107,58,31,0.12)]
              flex items-center justify-center text-[#6B5C4E]
              hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
              hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
              active:scale-90 transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            ref={nextRef}
            className="featured-next absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
              border border-[#EDE5DD]
              shadow-[0_2px_12px_rgba(107,58,31,0.12)]
              flex items-center justify-center text-[#6B5C4E]
              hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
              hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
              active:scale-90 transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{
              nextEl: ".featured-next",
              prevEl: ".featured-prev",
            }}
            breakpoints={{
              0:    { slidesPerView: 1.15, spaceBetween: 12 },
              480:  { slidesPerView: 1.6,  spaceBetween: 14 },
              640:  { slidesPerView: 2.2,  spaceBetween: 16 },
              768:  { slidesPerView: 2.8,  spaceBetween: 18 },
              1024: { slidesPerView: 3.5,  spaceBetween: 20 },
              1280: { slidesPerView: 4,    spaceBetween: 20 },
            }}
            style={{ padding: "4px 2px 8px" }}
          >
            {projects.map((project, index) => (
              <SwiperSlide key={index}>
                <ProjectCard {...project} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View all — mobile */}
        <div className="flex justify-center mt-6 sm:hidden">
          <button className="inline-flex items-center gap-2
            px-6 py-2.5 rounded-xl
            bg-[#6B3A1F] text-white font-bold text-sm
            shadow-[0_4px_16px_rgba(107,58,31,0.30)]
            hover:bg-[#522C16] active:scale-[0.97] transition-all duration-200">
            View All Projects
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  );
}