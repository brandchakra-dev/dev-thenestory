"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import {
  MapPin,
  Heart,
  BadgeCheck,
  ArrowRight,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  SlidersHorizontal,
  IndianRupee,
  Home,
  BedDouble,
  CheckCircle2,
  Filter,
  RotateCcw,
  Phone,
  Eye,
  Maximize2,
  Star,
  Building2,
  Car,
  Layers,
  Bath,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { propertiesApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ── Types ──────────────────────────────────────────────────────────────────
interface PropertyImage {
  _id: string;
  url: string;
  isPrimary: boolean;
}

interface Property {
  _id: string;
  title: string;
  slug: string;
  location: string;
  address: string;
  price: number;
  priceLabel: string;
  listingType: "sale" | "lease";
  category: string;
  subCategory: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  floor: string;
  totalFloors: number;
  facing: string;
  furnished: "furnished" | "semi-furnished" | "unfurnished";
  parking: boolean;
  parkingCount: number;
  images: PropertyImage[];
  city?: { name: string; slug: string };
  owner: string;
  ownerType: "owner" | "builder" | "agent";
  ownerPhone: string;
  description: string;
  highlights: string[];
  isVerified: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

type SortKey = "default" | "price-low" | "price-high" | "newest" | "area";

// ── Config ─────────────────────────────────────────────────────────────────
const FURNISHED_CFG: Record<string, { bg: string; text: string }> = {
  furnished: { bg: "bg-emerald-50", text: "text-emerald-700" },
  "semi-furnished": { bg: "bg-amber-50", text: "text-amber-700" },
  unfurnished: { bg: "bg-[#F5EFE8]", text: "text-[#6B5C4E]" },
};

const OWNER_CFG: Record<string, { bg: string; text: string }> = {
  owner: { bg: "bg-[#6B3A1F]/8", text: "text-[#6B3A1F]" },
  builder: { bg: "bg-blue-50", text: "text-blue-700" },
  agent: { bg: "bg-[#F5EFE8]", text: "text-[#6B5C4E]" },
};

const filterSections = [
  { id: "city", title: "City", icon: <MapPin size={13} />, color: "#C9A84C" },
  {
    id: "budget",
    title: "Budget",
    icon: <IndianRupee size={13} />,
    color: "#059669",
  },
  { id: "bhk", title: "BHK", icon: <BedDouble size={13} />, color: "#2563EB" },
  {
    id: "type",
    title: "Property Type",
    icon: <Building2 size={13} />,
    color: "#7C3AED",
  },
  {
    id: "furnished",
    title: "Furnishing",
    icon: <Layers size={13} />,
    color: "#D97706",
  },
  {
    id: "parking",
    title: "Parking",
    icon: <Car size={13} />,
    color: "#6B3A1F",
  },
];

const DEFAULTS: Record<string, string> = {
  city: "All Cities",
  budget: "All Budgets",
  bhk: "All BHK",
  type: "All Types",
  furnished: "All",
  parking: "Any",
};

// ── Image Carousel Component ───────────────────────────────────────────────
function PropertyImageCarousel({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const validImages = images.filter(
    (img) => img?.url && !failedImages.has(img._id)
  );

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
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          nextEl: `.swiper-next-${title.replace(/\s/g, "-")}`,
          prevEl: `.swiper-prev-${title.replace(/\s/g, "-")}`,
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
            className={`swiper-prev-${title.replace(
              /\s/g,
              "-"
            )} absolute left-2 top-1/2 -translate-y-1/2 z-20
              w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white 
              flex items-center justify-center hover:bg-black/70 transition-all
              hover:scale-110 active:scale-95`}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className={`swiper-next-${title.replace(
              /\s/g,
              "-"
            )} absolute right-2 top-1/2 -translate-y-1/2 z-20
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
            .swiper-pagination-${title.replace(/\s/g, "-")} {
              position: absolute !important;
              bottom: 8px !important;
              left: 0 !important;
              right: 0 !important;
              display: flex !important;
              justify-content: center !important;
              gap: 6px !important;
              z-index: 20 !important;
            }
            .swiper-pagination-${title.replace(/\s/g, "-")}
              .swiper-pagination-bullet {
              width: 6px !important;
              height: 6px !important;
              background: rgba(255, 255, 255, 0.6) !important;
              opacity: 1 !important;
              margin: 0 !important;
              transition: all 0.2s ease !important;
            }
            .swiper-pagination-${title.replace(/\s/g, "-")}
              .swiper-pagination-bullet-active {
              width: 16px !important;
              background: #c9a84c !important;
              border-radius: 4px !important;
            }
          `}</style>
          <div className={`swiper-pagination-${title.replace(/\s/g, "-")}`} />
        </div>
      )}
    </div>
  );
}

// ── SidebarSection ─────────────────────────────────────────────────────────
function SidebarSection({
  section,
  value,
  onChange,
  options,
  index,
}: {
  section: (typeof filterSections)[0];
  value: string;
  onChange: (v: string) => void;
  options: string[];
  index: number;
}) {
  const [open, setOpen] = useState(index < 3);
  const isFiltered = value !== options[0];

  return (
    <div className="border-b border-[#F0EAE2] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-5 hover:bg-[#6B3A1F]/[0.03] transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
            style={{
              background: `${section.color}15`,
              color: section.color,
              border: `1px solid ${section.color}20`,
            }}
          >
            {section.icon}
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-bold text-[11px] tracking-[0.12em] uppercase text-[#1C0F05]">
              {section.title}
            </span>
            {isFiltered && (
              <span
                className="text-[9px] font-semibold"
                style={{ color: section.color }}
              >
                ✓ {value}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isFiltered && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: section.color }}
            />
          )}
          {open ? (
            <ChevronUp size={13} className="text-[#6B3A1F]" />
          ) : (
            <ChevronDown size={13} className="text-[#A8978A]" />
          )}
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
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all hover:translate-x-0.5"
                style={{
                  background: active ? `${section.color}10` : "transparent",
                  border: `1px solid ${
                    active ? `${section.color}25` : "transparent"
                  }`,
                }}
              >
                <span className="relative w-3 h-3 flex-shrink-0">
                  <span
                    className="absolute inset-0 rounded-full transition-all"
                    style={{
                      background: active
                        ? section.color
                        : "rgba(107,58,31,0.15)",
                      transform: active ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                </span>
                <span
                  className="text-xs flex-1 transition-colors"
                  style={{
                    color: active ? section.color : "#7A6858",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {opt}
                </span>
                {active && (
                  <CheckCircle2 size={11} style={{ color: section.color }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PropertyCard with Carousel (Sale Only) ─────────────────────────────────
function PropertyCard({
  property,
  view,
}: {
  property: Property;
  view: "grid" | "list";
}) {
  const [wished, setWished] = useState(false);
  const fc = FURNISHED_CFG[property.furnished] ?? FURNISHED_CFG["unfurnished"];
  const oc = OWNER_CFG[property.ownerType] ?? OWNER_CFG["agent"];

  const formattedDate = new Date(property.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  // LIST VIEW with Carousel
  if (view === "list") {
    return (
      <Link
        href={`/properties/${property.slug}`}
        className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] flex flex-col sm:flex-row transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(107,58,31,0.12)] hover:border-[#E8D5B0] block"
      >
        {/* Image Section with Carousel */}
        <div className="relative w-full sm:w-56 lg:w-64 h-64 sm:h-auto flex-shrink-0 overflow-hidden">
          <PropertyImageCarousel
            images={property.images}
            title={property.title}
          />

          {/* Listing Type Badge - Always Sale */}
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[9px] font-black bg-[#6B3A1F] text-[#E8D5B0]">
            For Sale
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWished(!wished);
            }}
            className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 ${
              wished
                ? "bg-red-50/90 border border-red-200"
                : "bg-white/25 border border-white/30"
            }`}
          >
            <Heart
              size={13}
              className={wished ? "text-red-500 fill-red-500" : "text-white"}
            />
          </button>

          {/* View Count */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold bg-black/45 text-white/90 backdrop-blur-sm">
            <Eye size={8} />
            {property.views?.toLocaleString() || 0}
          </div>

          {/* Price on Image */}
          <div className="absolute bottom-3 left-3 z-20">
            <p className="text-white font-black text-sm leading-none drop-shadow-md">
              {property.priceLabel}
            </p>
            <p className="text-white/60 text-[8px] mt-0.5">Price</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            {/* Title */}
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-[#1C0F05] text-base leading-snug line-clamp-1 group-hover:text-[#6B3A1F] transition-colors">
                  {property.title}
                </h3>
                <p className="text-[11px] text-[#A8978A] mt-0.5">
                  {property.location}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-display font-black text-xl leading-none text-[#1C0F05]">
                  {property.priceLabel}
                </p>
                <p className="text-[9px] text-[#A8978A] font-medium mt-0.5">
                  Price
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin size={11} className="text-[#C9A84C] flex-shrink-0" />
              <span className="text-xs font-medium text-[#7A6858]">
                {property.address || property.location}
              </span>
            </div>

            {/* Key Specs */}
            <div className="flex flex-wrap gap-2 mb-3">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                  <BedDouble size={10} />
                  {property.bedrooms} BHK
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                <Maximize2 size={10} />
                {property.area} {property.areaUnit}
              </div>
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                  <Bath size={10} />
                  {property.bathrooms} Bath
                </div>
              )}
              {property.parking && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                  <Car size={10} />
                  Parking
                </div>
              )}
            </div>

            {/* Furnished & Facing */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span
                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${fc.bg} ${fc.text}`}
              >
                {property.furnished === "furnished"
                  ? "Furnished"
                  : property.furnished === "semi-furnished"
                  ? "Semi-Furnished"
                  : "Unfurnished"}
              </span>
              <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F4] text-[#6B5C4E]">
                {property.facing || "East"} facing
              </span>
            </div>

            {/* Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {property.highlights.slice(0, 2).map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1 text-[9px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60"
                  >
                    <Sparkles size={8} className="text-[#C9A84C]" />
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-[#F0EAE2]">
            <div className="flex items-center gap-2">
              {property.isVerified && (
                <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <BadgeCheck size={10} /> Verified
                </div>
              )}
              <div
                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl ${oc.bg} ${oc.text}`}
              >
                {property.ownerType === "owner"
                  ? "Owner"
                  : property.ownerType === "builder"
                  ? "Builder"
                  : "Agent"}
              </div>
              <span className="text-[9px] text-[#A8978A]">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${property.ownerPhone}`;
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[11px] border border-[#EDE5DD] bg-white text-[#6B3A1F] hover:bg-[#6B3A1F] hover:text-white transition-all"
              >
                <Phone size={10} /> Call
              </button>
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[11px] bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] shadow-md">
                View Details <ArrowRight size={10} />
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
      href={`/properties/${property.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(107,58,31,0.13)] hover:border-[#E8D5B0] block"
    >
      {/* Image Section with Carousel */}
      <div className="relative h-52 overflow-hidden">
        <PropertyImageCarousel
          images={property.images}
          title={property.title}
        />

        {/* Listing Type Badge - Always Sale */}
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[9px] font-black bg-[#6B3A1F] text-[#E8D5B0]">
          Sale
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWished(!wished);
          }}
          className={`absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 ${
            wished
              ? "bg-red-50/90 border border-red-200"
              : "bg-white/22 border border-white/30"
          }`}
        >
          <Heart
            size={12}
            className={wished ? "text-red-500 fill-red-500" : "text-white"}
          />
        </button>

        {/* Price on Image */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <p className="text-white font-black text-sm drop-shadow-md">
            {property.priceLabel}
          </p>
          <p className="text-white/60 text-[9px] mt-0.5">Price</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-[#1C0F05] text-sm line-clamp-1 mb-0.5 group-hover:text-[#6B3A1F] transition-colors">
          {property.title}
        </h3>
        <p className="text-[10px] text-[#A8978A] mb-1.5 truncate">
          {property.location}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">
              <BedDouble size={9} />
              {property.bedrooms} BHK
            </span>
          )}
          <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">
            <Maximize2 size={9} />
            {property.area} {property.areaUnit}
          </span>
          <span
            className={`text-[9px] font-bold px-2 py-1 rounded-lg ${fc.bg} ${fc.text}`}
          >
            {property.furnished === "furnished"
              ? "Furnished"
              : property.furnished === "semi-furnished"
              ? "Semi"
              : "Unfurnished"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#EDE5DD]">
          <div className="flex items-center gap-1.5">
            {property.isVerified ? (
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                <BadgeCheck size={10} /> Verified
              </div>
            ) : (
              <span className="text-[9px] text-[#A8978A]">
                {property.ownerType === "owner" ? "Owner" : "Agent"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B3A1F] group-hover:gap-2 transition-all">
            Details <ArrowRight size={10} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────
function LoadingSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] animate-pulse"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-56 h-52 bg-gray-200" />
              <div className="flex-1 p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-8 bg-gray-200 rounded w-16" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] animate-pulse"
        >
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ ...DEFAULTS });
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [view, setView] = useState<"grid" | "list">("list");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Dynamic filter options
  const [cityOptions, setCityOptions] = useState<string[]>(["All Cities"]);
  const [typeOptions, setTypeOptions] = useState<string[]>(["All Types"]);
  const [bhkOptions, setBhkOptions] = useState<string[]>(["All BHK"]);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getAll({
          limit: 100,
          isActive: true,
        });

        console.log(response);

        let propertiesData: Property[] = [];
        if (response.properties) {
          propertiesData = response.properties;
        } else if (response.data) {
          propertiesData = response.data;
        } else if (Array.isArray(response)) {
          propertiesData = response;
        }

        setProperties(propertiesData);

        // Extract filter options
        const cities = [
          "All Cities",
          ...new Set(
            propertiesData.map((p: any) => p.city?.name).filter(Boolean)
          ),
        ];
        const types = [
          "All Types",
          ...new Set(
            propertiesData.map((p: any) => p.subCategory).filter(Boolean)
          ),
        ];
        const bhks = [
          "All BHK",
          ...new Set(
            propertiesData
              .map((p: any) => `${p.bedrooms} BHK`)
              .filter((b) => b !== "0 BHK")
          ),
        ];

        setCityOptions(cities as string[]);
        setTypeOptions(types as string[]);
        setBhkOptions(bhks as string[]);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Read URL params
  useEffect(() => {
    const cityParam = searchParams.get("city");
    const qParam = searchParams.get("q");
    const typeParam = searchParams.get("type");
    const budgetParam = searchParams.get("budget");
    const bhkParam = searchParams.get("bhk");
    const furnishedParam = searchParams.get("furnished");
    const parkingParam = searchParams.get("parking");

    if (cityParam) setFilters((prev) => ({ ...prev, city: cityParam }));
    if (qParam) setSearch(qParam);
    if (typeParam) setFilters((prev) => ({ ...prev, type: typeParam }));
    if (budgetParam) setFilters((prev) => ({ ...prev, budget: budgetParam }));
    if (bhkParam) setFilters((prev) => ({ ...prev, bhk: bhkParam }));
    if (furnishedParam)
      setFilters((prev) => ({ ...prev, furnished: furnishedParam }));
    if (parkingParam)
      setFilters((prev) => ({ ...prev, parking: parkingParam }));
  }, [searchParams]);

  const setFilter = (id: string, val: string) => {
    setFilters((f) => ({ ...f, [id]: val }));
    setVisibleCount(6);
  };

  const hasFilters =
    Object.entries(filters).some(([k, v]) => v !== DEFAULTS[k]) ||
    search !== "";
  const activeCount = Object.entries(filters).filter(
    ([k, v]) => v !== DEFAULTS[k]
  ).length;

  const clearAll = () => {
    setFilters({ ...DEFAULTS });
    setSearch("");
    setVisibleCount(6);
  };

  // Filter and sort properties - Only Sale
  const filtered = useMemo(() => {
    let list = [...properties];

    // ✅ Only show sale properties
    list = list.filter((p) => p.listingType === "sale");

    // Search filter
    if (search) {
      list = list.filter((p) =>
        [p.title, p.location, p.address, p.owner].some((f) =>
          f?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // City filter
    if (filters.city !== "All Cities") {
      list = list.filter(
        (p) => p.city?.name?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Property type filter
    if (filters.type !== "All Types") {
      list = list.filter((p) => p.subCategory === filters.type);
    }

    // Furnished filter
    if (filters.furnished !== "All") {
      list = list.filter(
        (p) => p.furnished === filters.furnished.toLowerCase()
      );
    }

    // Parking filter
    if (filters.parking === "With Parking")
      list = list.filter((p) => p.parking);
    if (filters.parking === "Without Parking")
      list = list.filter((p) => !p.parking);

    // BHK filter
    if (filters.bhk !== "All BHK") {
      const bhkNum = parseInt(filters.bhk);
      list = list.filter((p) => p.bedrooms === bhkNum);
    }

    // Budget filter
    const priceInCr = (price: number) => price / 10000000;
    if (filters.budget === "Under ₹50 L")
      list = list.filter((p) => priceInCr(p.price) < 0.5);
    if (filters.budget === "₹50 L – ₹1 Cr")
      list = list.filter(
        (p) => priceInCr(p.price) >= 0.5 && priceInCr(p.price) < 1
      );
    if (filters.budget === "₹1–2 Cr")
      list = list.filter(
        (p) => priceInCr(p.price) >= 1 && priceInCr(p.price) < 2
      );
    if (filters.budget === "₹2–5 Cr")
      list = list.filter(
        (p) => priceInCr(p.price) >= 2 && priceInCr(p.price) < 5
      );
    if (filters.budget === "₹5 Cr+")
      list = list.filter((p) => priceInCr(p.price) >= 5);

    // Sorting
    if (sortKey === "price-low") list.sort((a, b) => a.price - b.price);
    if (sortKey === "price-high") list.sort((a, b) => b.price - a.price);
    if (sortKey === "newest")
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sortKey === "area") list.sort((a, b) => b.area - a.area);

    return list;
  }, [properties, filters, search, sortKey]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const filterOptionsMap: Record<string, string[]> = {
    city: cityOptions,
    budget: [
      "All Budgets",
      "Under ₹50 L",
      "₹50 L – ₹1 Cr",
      "₹1–2 Cr",
      "₹2–5 Cr",
      "₹5 Cr+",
    ],
    bhk: bhkOptions,
    type: typeOptions,
    furnished: ["All", "Furnished", "Semi-Furnished", "Unfurnished"],
    parking: ["Any", "With Parking", "Without Parking"],
  };

  const SidebarContent = () => (
    <>
      {filterSections.map((sec, i) => (
        <SidebarSection
          key={sec.id}
          section={sec}
          value={filters[sec.id]}
          onChange={(v) => setFilter(sec.id, v)}
          options={filterOptionsMap[sec.id]}
          index={i}
        />
      ))}
    </>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(40,40%,97%)]">
        <div className="text-center py-12 bg-red-50 rounded-2xl p-8 max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#6B3A1F] text-white rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(40,40%,97%)]">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24">
        <div className="flex gap-5 lg:gap-7 items-start">
          {/* Sidebar */}
          <aside
            className="hidden lg:flex flex-col flex-shrink-0 sticky top-20 rounded-2xl overflow-hidden"
            style={{
              width: "260px",
              background: "#fff",
              border: "1px solid #EDE5DD",
              boxShadow: "0 6px 28px rgba(107,58,31,0.10)",
            }}
          >
            <div className="px-5 py-4 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D] border-b border-[#C9A84C]/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#C9A84C]/15 border border-[#C9A84C]/20">
                    <SlidersHorizontal size={14} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Filters</p>
                    <p className="text-[9px] mt-0.5 text-[#C9A84C]/65">
                      {activeCount > 0
                        ? `${activeCount} active`
                        : "All properties"}
                    </p>
                  </div>
                </div>
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-red-500/15 text-red-300 border border-red-500/20 hover:scale-105 transition-transform"
                  >
                    <RotateCcw size={8} /> Reset
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto flex-1 max-h-[calc(100vh-220px)]">
              <SidebarContent />
            </div>
            <div className="p-4 border-t border-[#F0EAE2]">
              <button
                onClick={clearAll}
                className="group w-full py-3 rounded-xl font-bold text-xs transition-all hover:-translate-y-0.5 active:scale-[0.97] relative overflow-hidden"
                style={{
                  background: hasFilters
                    ? "linear-gradient(135deg,#6B3A1F,#3B1D0D)"
                    : "rgba(107,58,31,0.07)",
                  color: hasFilters ? "#E8D5B0" : "#A8978A",
                  boxShadow: hasFilters
                    ? "0 4px 14px rgba(107,58,31,0.28)"
                    : "none",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  {hasFilters ? (
                    <>
                      <RotateCcw size={11} /> Clear All · {filtered.length}{" "}
                      Results
                    </>
                  ) : (
                    "No Filters Applied"
                  )}
                </span>
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-[#1C0F05] text-xl sm:text-2xl">
                  Properties for Sale
                </h2>
                <p className="text-[#A8978A] text-sm mt-1">
                  {filtered.length} properties available
                </p>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#EDE5DD]">
              {/* Mobile layout (visible below lg) */}
              <div className="lg:hidden flex flex-col gap-3">
                {/* Search input */}
                <div className="relative w-fullhidden sm:block">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8978A]"
                  />
                  <input
                    type="text"
                    placeholder="Search property, society or location…"
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
                    {activeCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[8px] font-black text-white flex items-center justify-center">
                        {activeCount}
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
                      <option value="area">Largest Area</option>
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
                    placeholder="Search property, society or location…"
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
                    <option value="default"> Relevance</option>
                    <option value="price-low"> Price: Low → High</option>
                    <option value="price-high"> Price: High → Low</option>
                    <option value="newest"> Newest First</option>
                    <option value="area"> Largest Area</option>
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

            {/* Cards */}
            {loading ? (
              <LoadingSkeleton view={view} />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#EDE5DD] text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[#6B3A1F]/8 to-[#C9A84C]/8">
                  <Search size={26} className="text-[#6B3A1F]" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#1C0F05] mb-2">
                  No properties found
                </h3>
                <p className="text-sm mb-6 text-[#A8978A]">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-white"
                >
                  <RotateCcw size={13} /> Clear All Filters
                </button>
              </div>
            ) : view === "list" ? (
              <div className="flex flex-col gap-4">
                {visible.map((p) => (
                  <PropertyCard key={p._id} property={p} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {visible.map((p) => (
                  <PropertyCard key={p._id} property={p} view="grid" />
                ))}
              </div>
            )}

            {/* Load more */}
            {filtered.length > 0 && hasMore && (
              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] shadow-md hover:-translate-y-0.5 transition-all"
                >
                  Load More Properties (
                  {Math.min(6, filtered.length - visibleCount)} more)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebar(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 flex flex-col overflow-hidden rounded-r-2xl bg-white">
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D]">
              <p className="font-bold text-sm text-white">
                Filters ({activeCount})
              </p>
              <button
                onClick={() => setMobileSidebar(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.08] text-white/55"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
            <div className="p-4 border-t border-[#F0EAE2]">
              <button
                onClick={() => setMobileSidebar(false)}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0]"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
