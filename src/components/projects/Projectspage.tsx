"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import {
  MapPin, Heart, BadgeCheck, ArrowRight, Search,
  X, ChevronDown, ChevronUp, Grid3x3, List,
  SlidersHorizontal, IndianRupee, Home, Building2,
  BedDouble, CheckCircle2, Filter, Calendar,
  Award, RotateCcw, Phone, Eye, Maximize2, Star, Zap,
  ChevronLeft, ChevronRight, Sparkles, Shield
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { projectsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ───────────────────────────────────────────────
interface ProjectImage {
  _id: string;
  url: string;
  isPrimary: boolean;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  location: string;
  priceLabel: string;
  status: "New Launch" | "Ready To Move" | "Under Construction" | "Upcoming";
  images: ProjectImage[];
  propertyType: string;
  bhk: string[];
  builder?: { name: string; slug: string };
  city?: { name: string; slug: string };
  reraNo?: string;
  isVerified?: boolean;
  views?: number;
  rating?: number;
  highlights?: string[];
  possessionDate?: string;
  totalUnits?: number;
  area?: string;
  totalTowers?: number;
  totalFloors?: number;
}

type SortKey = "default" | "price-low" | "price-high" | "newest";

// ─── Config ───────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "New Launch": { bg: "bg-[#6B3A1F]/10 border border-[#6B3A1F]/20", text: "text-[#6B3A1F]", dot: "bg-[#6B3A1F]" },
  "Ready To Move": { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Under Construction": { bg: "bg-amber-50 border border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  "Upcoming": { bg: "bg-blue-50 border border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
};

const filterSections = [
  { id: "city", title: "City", icon: <MapPin size={14} />, color: "#6B3A1F" },
  { id: "status", title: "Property Status", icon: <Zap size={14} />, color: "#C9A84C" },
  { id: "budget", title: "Budget", icon: <IndianRupee size={14} />, color: "#059669" },
  { id: "bhk", title: "BHK", icon: <BedDouble size={14} />, color: "#2563EB" },
  { id: "type", title: "Property Type", icon: <Home size={14} />, color: "#8B6914" },
];

const DEFAULTS = {
  city: "All Cities", status: "All", budget: "All Budgets",
  bhk: "All BHK", type: "All Types",
};

// ─── Image Carousel Component ───────────────────────────────
function ProjectImageCarousel({ images, title }: { images: ProjectImage[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const validImages = images.filter(img => img?.url && !failedImages.has(img._id));

  if (!validImages.length) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] flex items-center justify-center">
        <Building2 size={48} className="text-[#A8978A]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={validImages.length > 1}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          nextEl: `.swiper-next-${title.replace(/\s/g, '-')}`,
          prevEl: `.swiper-prev-${title.replace(/\s/g, '-')}`,
        }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {validImages.map((img, idx) => (
          <SwiperSlide key={img._id || idx}>
            <div className="relative w-full h-full">
              <img
                src={getImageUrl(img.url)}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="absolute top-3 right-12 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
          {currentIndex + 1}/{validImages.length}
        </div>
      )}

      {/* Navigation Arrows */}
      {validImages.length > 1 && (
        <>
          <button
            className={`swiper-prev-${title.replace(/\s/g, '-')} absolute left-2 top-1/2 -translate-y-1/2 z-20
              w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white 
              flex items-center justify-center hover:bg-black/70 transition-all
              hover:scale-110 active:scale-95`}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className={`swiper-next-${title.replace(/\s/g, '-')} absolute right-2 top-1/2 -translate-y-1/2 z-20
              w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white 
              flex items-center justify-center hover:bg-black/70 transition-all
              hover:scale-110 active:scale-95`}
          >
            <ChevronRight size={14} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20">
          <style jsx global>{`
            .swiper-pagination-${title.replace(/\s/g, '-')} {
              position: absolute !important;
              bottom: 8px !important;
              left: 0 !important;
              right: 0 !important;
              display: flex !important;
              justify-content: center !important;
              gap: 6px !important;
              z-index: 20 !important;
            }
            .swiper-pagination-${title.replace(/\s/g, '-')} .swiper-pagination-bullet {
              width: 6px !important;
              height: 6px !important;
              background: rgba(255,255,255,0.6) !important;
              opacity: 1 !important;
              margin: 0 !important;
              transition: all 0.2s ease !important;
            }
            .swiper-pagination-${title.replace(/\s/g, '-')} .swiper-pagination-bullet-active {
              width: 16px !important;
              background: #C9A84C !important;
              border-radius: 4px !important;
            }
          `}</style>
          <div className={`swiper-pagination-${title.replace(/\s/g, '-')}`} />
        </div>
      )}
    </div>
  );
}

// ─── SidebarSection ───────────────────────────────────────
function SidebarSection({
  section, value, onChange, options, index
}: {
  section: typeof filterSections[0];
  value: string;
  onChange: (v: string) => void;
  options: string[];
  index: number;
}) {
  const [open, setOpen] = useState(index < 2);
  const isFiltered = value !== options[0];

  return (
    <div className="border-b border-[#F0EAE2] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-5 transition-colors duration-200 hover:bg-[#6B3A1F]/[0.03] group"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
            style={{ background: `${section.color}15`, color: section.color, border: `1px solid ${section.color}20` }}
          >
            {section.icon}
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-black text-[11px] tracking-[0.16em] uppercase text-[#1C0F05]">{section.title}</span>
            {isFiltered && (
              <span className="text-[9px] font-semibold" style={{ color: section.color }}>✓ {value}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isFiltered && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: section.color }} />}
          {open ? <ChevronUp size={13} className="text-[#6B3A1F]" /> : <ChevronDown size={13} className="text-[#A8978A]" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-1">
          {options.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200 hover:translate-x-0.5"
                style={{
                  background: active ? `${section.color}10` : "transparent",
                  border: `1px solid ${active ? `${section.color}25` : "transparent"}`,
                }}
              >
                <span className="relative w-3 h-3 flex-shrink-0">
                  <span
                    className="absolute inset-0 rounded-full transition-all duration-200"
                    style={{
                      background: active ? section.color : "rgba(107,58,31,0.15)",
                      transform: active ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                </span>
                <span
                  className="text-xs flex-1 transition-colors duration-200"
                  style={{ color: active ? section.color : "#7A6858", fontWeight: active ? 700 : 500 }}
                >
                  {opt}
                </span>
                {active && <CheckCircle2 size={12} style={{ color: section.color }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ProjectCard with Carousel ──────────────────────────────────────────
function ProjectCard({ project, view }: { project: Project; view: "grid" | "list" }) {
  const [wished, setWished] = useState(false);
  const cfg = statusConfig[project.status] ?? statusConfig["New Launch"];
  const possessionText = project.possessionDate ? new Date(project.possessionDate).getFullYear() : "2026";

  // Amenities icons mapping
  const getAmenityIcon = (highlight: string) => {
    if (highlight.toLowerCase().includes("pool")) return <span className="text-[#C9A84C]">🏊</span>;
    if (highlight.toLowerCase().includes("gym")) return <span className="text-[#C9A84C]">💪</span>;
    if (highlight.toLowerCase().includes("park")) return <span className="text-[#C9A84C]">🌳</span>;
    if (highlight.toLowerCase().includes("security")) return <Shield size={10} className="text-[#C9A84C]" />;
    if (highlight.toLowerCase().includes("club")) return <span className="text-[#C9A84C]">🏛️</span>;
    return <Sparkles size={10} className="text-[#C9A84C]" />;
  };

  if (view === "list") {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] flex flex-col sm:flex-row transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#6B3A1F]/10 block"
      >
        {/* Image Section with Carousel */}
        <div className="relative w-full sm:w-56 md:w-64 lg:w-72 h-64 sm:h-auto flex-shrink-0 overflow-hidden">
          <ProjectImageCarousel images={project.images} title={project.title} />

          {/* Status Badge */}
          <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-sm ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
            {project.status}
          </div>

          {/* Wishlist Button */}
          <button
            className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm ${wished ? "bg-red-50/90 border border-red-200/60" : "bg-white/25 border border-white/30"
              }`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
          >
            <Heart size={13} className={wished ? "text-red-500 fill-red-500" : "text-white"} />
          </button>

          {/* View Count */}
          {project.views && (
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold bg-black/50 text-white/90 backdrop-blur-sm">
              <Eye size={8} /> {project.views.toLocaleString()}
            </div>
          )}

          {/* Price on Image */}
          <div className="absolute bottom-3 left-3 z-20">
            <p className="text-white font-black text-sm leading-none drop-shadow-md">{project.priceLabel}</p>
            <p className="text-white/60 text-[8px] mt-0.5">* onwards</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            {/* Title & Builder */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-[#1C0F05] text-base sm:text-lg leading-snug line-clamp-1 group-hover:text-[#6B3A1F] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[10px] font-semibold mt-1 text-[#B0A090] flex items-center gap-1">
                  <Building2 size={10} className="text-[#C9A84C]" /> by {project.builder?.name || "Top Builder"}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-display font-black text-lg sm:text-xl leading-none text-[#1C0F05]">{project.priceLabel}</p>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#A8978A] mt-0.5">onwards</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin size={11} className="text-[#C9A84C] flex-shrink-0" />
              <span className="text-xs font-medium text-[#7A6858] line-clamp-1">{project.location}</span>
            </div>

            {/* Key Specs Grid - BHK hataya, RERA dala */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {/* Area */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#6B3A1F]/[0.04]">
                <Maximize2 size={11} className="text-[#C9A84C]" />
                <div>
                  <p className="text-[8px] font-semibold text-[#A8978A]">Area</p>
                  <p className="text-[10px] font-bold text-[#1C0F05]">{project.area || "1500+ sq.ft"}</p>
                </div>
              </div>
              {/* Possession */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#6B3A1F]/[0.04]">
                <Calendar size={11} className="text-[#C9A84C]" />
                <div>
                  <p className="text-[8px] font-semibold text-[#A8978A]">Possession</p>
                  <p className="text-[10px] font-bold text-[#1C0F05]">{possessionText}</p>
                </div>
              </div>
              {/* Property Type */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#6B3A1F]/[0.04]">
                <Home size={11} className="text-[#C9A84C]" />
                <div>
                  <p className="text-[8px] font-semibold text-[#A8978A]">Type</p>
                  <p className="text-[10px] font-bold text-[#1C0F05]">{project.propertyType}</p>
                </div>
              </div>
              {/* RERA - Naya dala */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#6B3A1F]/[0.04]">
                <BadgeCheck size={11} className="text-emerald-500" />
                <div>
                  <p className="text-[8px] font-semibold text-[#A8978A]">RERA</p>
                  <p className="text-[10px] font-bold text-emerald-600">{project.reraNo ? "Approved" : "Applied"}</p>
                </div>
              </div>
            </div>

            {/* Highlights / Amenities Tags - Additional Info */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.highlights.slice(0, 3).map((h) => (
                  <div key={h} className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50/50 border border-amber-100">
                    {getAmenityIcon(h)}
                    <span className="text-[8px] font-medium text-amber-800">{h}</span>
                  </div>
                ))}
                {project.highlights.length > 3 && (
                  <span className="text-[8px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    +{project.highlights.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Project Stats - Additional Info */}
            {(project.totalUnits || project.totalTowers || project.totalFloors) && (
              <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-gradient-to-r from-[#6B3A1F]/5 to-transparent">
                {project.totalUnits && (
                  <div className="flex items-center gap-1">
                    <Building2 size={10} className="text-[#C9A84C]" />
                    <span className="text-[9px] font-semibold text-[#1C0F05]">{project.totalUnits} Units</span>
                  </div>
                )}
                {project.totalTowers && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">🏢</span>
                    <span className="text-[9px] font-semibold text-[#1C0F05]">{project.totalTowers} Towers</span>
                  </div>
                )}
                {project.totalFloors && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">📐</span>
                    <span className="text-[9px] font-semibold text-[#1C0F05]">{project.totalFloors} Floors</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 pt-3 mt-2 border-t border-[#F0EAE2]">
            <div className="flex items-center gap-2 flex-wrap">
              {project.reraNo && (
                <div className="flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  <BadgeCheck size={9} /> RERA
                </div>
              )}
              <div className="text-[9px] font-semibold px-2 py-1 rounded-full bg-[#6B3A1F]/[0.06] text-[#7A6858]">
                {project.city?.name || "Noida"}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[11px] bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0]">
                View Details
                <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // GRID VIEW with Carousel
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#6B3A1F]/15 block"
    >
      {/* Image Section with Carousel */}
      <div className="relative h-52 overflow-hidden">
        <ProjectImageCarousel images={project.images} title={project.title} />

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-sm ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
          {project.status}
        </div>

        {/* Wishlist Button */}
        <button
          className={`absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm ${wished ? "bg-red-50/90 border border-red-200/60" : "bg-white/22 border border-white/30"
            }`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
        >
          <Heart size={12} className={wished ? "text-red-500 fill-red-500" : "text-white"} />
        </button>

        {/* Price on Image */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <p className="text-white font-black text-sm drop-shadow-md">{project.priceLabel}</p>
          <p className="text-white/50 text-[8px] mt-0.5 truncate">by {project.builder?.name || "Top Builder"}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-display font-bold text-[#1C0F05] text-sm leading-snug mb-1 line-clamp-1 group-hover:text-[#6B3A1F] transition-colors">
          {project.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mb-2.5">
          <MapPin size={10} className="text-[#C9A84C] flex-shrink-0" />
          <span className="text-xs truncate text-[#7A6858]">{project.location}</span>
        </div>

        {/* Key Specs - BHK hataya */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {/* Area */}
          <div className="text-center p-1.5 rounded-lg bg-[#6B3A1F]/[0.04]">
            <Maximize2 size={9} className="text-[#C9A84C] mx-auto mb-0.5" />
            <p className="text-[8px] font-bold text-[#1C0F05]">{project.area?.split(" ")[0] || "1500"}</p>
            <p className="text-[6px] text-[#A8978A]">sq.ft</p>
          </div>
          {/* Possession */}
          <div className="text-center p-1.5 rounded-lg bg-[#6B3A1F]/[0.04]">
            <Calendar size={9} className="text-[#C9A84C] mx-auto mb-0.5" />
            <p className="text-[8px] font-bold text-[#1C0F05]">{possessionText}</p>
            <p className="text-[6px] text-[#A8978A]">possession</p>
          </div>
          {/* RERA */}
          <div className="text-center p-1.5 rounded-lg bg-[#6B3A1F]/[0.04]">
            <BadgeCheck size={9} className="text-emerald-500 mx-auto mb-0.5" />
            <p className="text-[8px] font-bold text-emerald-600">{project.reraNo ? "RERA" : "NA"}</p>
            <p className="text-[6px] text-[#A8978A]">approved</p>
          </div>
        </div>

        {/* RERA Badge */}
        {project.reraNo && (
          <div className="flex items-center gap-1 mb-2">
            <BadgeCheck size={9} className="text-emerald-500" />
            <span className="text-[7px] font-semibold text-emerald-600">RERA Registered</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EDE5DD]">
          {project.views ? (
            <div className="flex items-center gap-1">
              <Eye size={8} className="text-[#A8978A]" />
              <span className="text-[8px] text-[#A8978A]">{project.views.toLocaleString()} views</span>
            </div>
          ) : <span />}
          <div className="flex items-center gap-1 text-[9px] font-black text-[#6B3A1F] group-hover:gap-2 transition-all">
            Details <ArrowRight size={9} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ProjectsPage ─────────────────────────────────────────
export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ ...DEFAULTS });
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [view, setView] = useState<"grid" | "list">("list");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const [cityOptions, setCityOptions] = useState<string[]>(["All Cities"]);
  const [statusOptions, setStatusOptions] = useState<string[]>(["All"]);
  const [typeOptions, setTypeOptions] = useState<string[]>(["All Types"]);
  const [bhkOptions, setBhkOptions] = useState<string[]>(["All BHK"]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getAll({ limit: 100 });

        let projectsData: any[] = [];
        if (response.projects) {
          projectsData = response.projects;
        } else if (response.data) {
          projectsData = response.data;
        } else if (Array.isArray(response)) {
          projectsData = response;
        }

        setProjects(projectsData);

        // Extract unique filter options
        const cities = ["All Cities", ...new Set(projectsData.map((p) => p.city?.name).filter(Boolean))];
        const statuses = ["All", ...new Set(projectsData.map((p) => p.status).filter(Boolean))];
        const types = ["All Types", ...new Set(projectsData.map((p) => p.propertyType).filter(Boolean))];
        const bhks = ["All BHK", ...new Set(projectsData.flatMap((p) => p.bhk || []).filter(Boolean))];

        setCityOptions(cities as string[]);
        setStatusOptions(statuses as string[]);
        setTypeOptions(types as string[]);
        setBhkOptions(bhks as string[]);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ─── Read URL params on mount and when they change ───
  useEffect(() => {
    const cityParam = searchParams.get("city");
    const qParam = searchParams.get("q");
    const statusParam = searchParams.get("status");
    const typeParam = searchParams.get("type");
    const budgetParam = searchParams.get("budget");
    const bhkParam = searchParams.get("bhk");

    if (cityParam && cityParam !== "All Cities") {
      setFilters((prev) => ({ ...prev, city: cityParam }));
    }
    if (qParam) {
      setSearch(qParam);
    }
    if (statusParam && statusParam !== "All") {
      setFilters((prev) => ({ ...prev, status: statusParam }));
    }
    if (typeParam && typeParam !== "All Types") {
      setFilters((prev) => ({ ...prev, type: typeParam }));
    }
    if (budgetParam && budgetParam !== "All Budgets") {
      setFilters((prev) => ({ ...prev, budget: budgetParam }));
    }
    if (bhkParam && bhkParam !== "All BHK") {
      setFilters((prev) => ({ ...prev, bhk: bhkParam }));
    }
  }, [searchParams]);

  // ─── Sync URL params when filters change ───
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.city !== "All Cities") params.set("city", filters.city);
    if (filters.status !== "All") params.set("status", filters.status);
    if (filters.type !== "All Types") params.set("type", filters.type);
    if (filters.budget !== "All Budgets") params.set("budget", filters.budget);
    if (filters.bhk !== "All BHK") params.set("bhk", filters.bhk);
    if (search) params.set("q", search);

    const newUrl = params.toString() ? `/projects?${params.toString()}` : "/projects";
    window.history.replaceState(null, "", newUrl);
  }, [filters, search]);

  const setFilter = (id: string, val: string) => {
    setFilters((f) => ({ ...f, [id]: val }));
    setVisibleCount(6);
  };

  const hasFilters = Object.entries(filters).some(([k, v]) => v !== DEFAULTS[k as keyof typeof DEFAULTS]) || search !== "";
  const activeFiltersCount = Object.entries(filters).filter(([k, v]) => v !== DEFAULTS[k as keyof typeof DEFAULTS]).length;

  const clearAll = () => {
    setFilters({ ...DEFAULTS });
    setSearch("");
    setVisibleCount(6);
  };

  const filtered = useMemo(() => {
    let list = [...projects];

    if (search) {
      list = list.filter((p) =>
        [p.title, p.location, p.builder?.name].some((f) =>
          f?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (filters.city !== "All Cities") list = list.filter((p) => p.city?.name === filters.city);
    if (filters.status !== "All") list = list.filter((p) => p.status === filters.status);
    if (filters.type !== "All Types") list = list.filter((p) => p.propertyType === filters.type);
    if (filters.bhk !== "All BHK") list = list.filter((p) => p.bhk?.includes(filters.bhk));

    if (filters.budget === "Under ₹1 Cr") list = list.filter((p) => parsePriceToCr(p.priceLabel) < 1);
    if (filters.budget === "₹1–2 Cr") list = list.filter((p) => parsePriceToCr(p.priceLabel) >= 1 && parsePriceToCr(p.priceLabel) < 2);
    if (filters.budget === "₹2–5 Cr") list = list.filter((p) => parsePriceToCr(p.priceLabel) >= 2 && parsePriceToCr(p.priceLabel) < 5);
    if (filters.budget === "₹5 Cr+") list = list.filter((p) => parsePriceToCr(p.priceLabel) >= 5);

    if (sortKey === "price-low") list.sort((a, b) => parsePriceToCr(a.priceLabel) - parsePriceToCr(b.priceLabel));
    if (sortKey === "price-high") list.sort((a, b) => parsePriceToCr(b.priceLabel) - parsePriceToCr(a.priceLabel));

    return list;
  }, [projects, filters, search, sortKey]);

  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const SidebarContent = () => (
    <>
      <SidebarSection section={filterSections[0]} value={filters.city} onChange={(v) => setFilter("city", v)} options={cityOptions} index={0} />
      <SidebarSection section={filterSections[1]} value={filters.status} onChange={(v) => setFilter("status", v)} options={statusOptions} index={1} />
      <SidebarSection section={filterSections[2]} value={filters.budget} onChange={(v) => setFilter("budget", v)} options={["All Budgets", "Under ₹1 Cr", "₹1–2 Cr", "₹2–5 Cr", "₹5 Cr+"]} index={2} />
      <SidebarSection section={filterSections[3]} value={filters.bhk} onChange={(v) => setFilter("bhk", v)} options={bhkOptions} index={3} />
      <SidebarSection section={filterSections[4]} value={filters.type} onChange={(v) => setFilter("type", v)} options={typeOptions} index={4} />
    </>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(40,40%,97%)" }}>
        <div className="text-center py-12 bg-red-50 rounded-2xl p-8 max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#6B3A1F] text-white rounded-lg text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(40,40%,97%)" }}>
      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-24">
        <div className="flex gap-5 lg:gap-7 items-start">

          {/* LEFT SIDEBAR */}
          <aside
            className="hidden lg:flex flex-col flex-shrink-0 sticky top-20 rounded-2xl overflow-hidden"
            style={{ width: "268px", background: "#fff", border: "1px solid #EDE5DD", boxShadow: "0 6px 28px rgba(107,58,31,0.10)" }}
          >
            <div className="px-5 py-4 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D] border-b border-[#C9A84C]/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#C9A84C]/15 border border-[#C9A84C]/20">
                    <SlidersHorizontal size={14} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-white leading-none">Filters</p>
                    <p className="text-[9px] mt-0.5 text-[#C9A84C]/65">
                      {activeFiltersCount > 0 ? `${activeFiltersCount} active` : "All projects"}
                    </p>
                  </div>
                </div>
                {hasFilters && (
                  <button onClick={clearAll} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-red-500/15 text-red-300 border border-red-500/20 hover:scale-105 transition-transform">
                    <RotateCcw size={8} /> Reset
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto flex-1 max-h-[calc(100vh-220px)]">
              <SidebarContent />
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-[#1C0F05] text-xl sm:text-2xl">
                Our Projects
              </h2>
              <p className="text-[#A8978A] text-sm mt-1">
                {filtered.length} projects available
              </p>
            </div>
          </div>

            {/* Toolbar - Properties page style */}
            <div className="flex flex-col gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#EDE5DD]">
              
              {/* Mobile layout (visible below lg) */}
              <div className="lg:hidden flex flex-col gap-3">
                {/* Search input */}
                <div className="relative w-full">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8978A]"
                  />
                  <input
                    type="text"
                    placeholder="Search project, builder or location…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setVisibleCount(6);
                    }}
                    className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#6B3A1F]/15"
                    style={{
                      background: "hsl(38,45%,97%)",
                      border: "1px solid #EDE5DD",
                      color: "#1C0F05",
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X
                        size={11}
                        className="text-[#A8978A] hover:text-[#6B3A1F]"
                      />
                    </button>
                  )}
                </div>

                {/* Filter + Sort row */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileSidebar(true)}
                    className="relative flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] shadow-md"
                  >
                    <SlidersHorizontal size={13} /> Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[8px] font-black text-white flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <div className="flex-1 relative">
                    <select
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value as SortKey)}
                      className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer"
                      style={{
                        background: "hsl(38,45%,97%)",
                        border: "1px solid #EDE5DD",
                        color: "#6B3A1F",
                      }}
                    >
                      <option value="default">Relevance</option>
                      <option value="price-low">Price: Low → High</option>
                      <option value="price-high">Price: High → Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <ChevronDown
                      size={11}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B3A1F]"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop layout (visible from lg up) */}
              <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-3">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8978A]"
                  />
                  <input
                    type="text"
                    placeholder="Search project, builder or location…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setVisibleCount(6);
                    }}
                    className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#6B3A1F]/15"
                    style={{
                      background: "hsl(38,45%,97%)",
                      border: "1px solid #EDE5DD",
                      color: "#1C0F05",
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X size={11} className="text-[#A8978A]" />
                    </button>
                  )}
                </div>

                <div className="relative flex-shrink-0">
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="appearance-none pl-4 pr-9 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer"
                    style={{
                      background: "hsl(38,45%,97%)",
                      border: "1px solid #EDE5DD",
                      color: "#6B3A1F",
                      minWidth: "160px",
                    }}
                  >
                    <option value="default">Relevance</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown
                    size={11}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B3A1F]"
                  />
                </div>

                {/* View toggle (grid/list) - desktop only */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(38,45%,97%)] border border-[#EDE5DD]">
                  {(["list", "grid"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="p-2.5 rounded-lg transition-all"
                      style={{
                        background: view === v ? "#fff" : "transparent",
                        color: view === v ? "#6B3A1F" : "#A8978A",
                      }}
                    >
                      {v === "grid" ? (
                        <Grid3x3 size={15} />
                      ) : (
                        <List size={15} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Count */}
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-bold text-[#1C0F05]">
                {filtered.length} <span className="font-medium text-[#A8978A]">projects found</span>
              </p>
            </div>

            {/* Cards */}
            {loading ? (
              <LoadingSkeleton />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#EDE5DD] text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[#6B3A1F]/8 to-[#C9A84C]/8">
                  <Search size={26} className="text-[#6B3A1F]" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#1C0F05] mb-2">No projects found</h3>
                <p className="text-sm mb-6 text-[#A8978A]">Try adjusting your filters or search term.</p>
                <button onClick={clearAll} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#FAF6F0]">
                  <RotateCcw size={13} /> Clear All Filters
                </button>
              </div>
            ) : view === "list" ? (
              <div className="flex flex-col gap-4">
                {visibleProjects.map((p) => <ProjectCard key={p._id} project={p} view="list" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {visibleProjects.map((p) => <ProjectCard key={p._id} project={p} view="grid" />)}
              </div>
            )}

            {/* Load More */}
            {filtered.length > 0 && hasMore && (
              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0]"
                >
                  Load More Projects ({Math.min(6, filtered.length - visibleCount)} more)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 flex flex-col overflow-hidden rounded-r-2xl bg-white">
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D]">
              <p className="font-black text-sm text-white">Filters ({activeFiltersCount})</p>
              <button onClick={() => setMobileSidebar(false)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.08] text-white/55">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto"><SidebarContent /></div>
            <div className="p-4 border-t border-[#F0EAE2]">
              <button onClick={() => setMobileSidebar(false)} className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0]">
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function parsePriceToCr(priceLabel: string): number {
  if (!priceLabel) return 0;
  const match = priceLabel.match(/₹([\d.]+)\s*Cr/i);
  if (match) return parseFloat(match[1]);
  return 0;
}