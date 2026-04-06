"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Heart, BadgeCheck, ArrowRight, Search, X,
  ChevronDown, ChevronUp, Grid3x3, List, SlidersHorizontal,
  IndianRupee, Home, BedDouble, CheckCircle2, Filter,
  RotateCcw, Phone, Eye, Maximize2, Star,
  Building2, Car, Layers, Bath,
} from "lucide-react";

import { allProperties, type Property } from "@/lib/realEstateData";

// ── Types ──────────────────────────────────────────────────────────────────
type SortKey = "default" | "price-low" | "price-high" | "newest" | "area";

interface NearMeCoords {
  lat: number;
  lon: number;
  radius: number;
  label: string;
}

// ── Haversine — distance in km between two coordinates ────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── NearMeIcon ─────────────────────────────────────────────────────────────
function NearMeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
    </svg>
  );
}

// ── Config ─────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  "Ready To Move":      { bg: "bg-emerald-50 border border-emerald-200",     text: "text-emerald-700", dot: "bg-emerald-500" },
  "Under Construction": { bg: "bg-amber-50 border border-amber-200",         text: "text-amber-700",   dot: "bg-amber-500"   },
  "New":                { bg: "bg-[#6B3A1F]/10 border border-[#6B3A1F]/20", text: "text-[#6B3A1F]",   dot: "bg-[#6B3A1F]"   },
};

const FURNISHED_CFG: Record<string, { bg: string; text: string }> = {
  "Furnished":      { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Semi-Furnished": { bg: "bg-amber-50",   text: "text-amber-700"   },
  "Unfurnished":    { bg: "bg-[#F5EFE8]",  text: "text-[#6B5C4E]"  },
};

const OWNER_CFG: Record<string, { bg: string; text: string }> = {
  "Owner":   { bg: "bg-[#6B3A1F]/8", text: "text-[#6B3A1F]" },
  "Builder": { bg: "bg-blue-50",      text: "text-blue-700"   },
  "Agent":   { bg: "bg-[#F5EFE8]",   text: "text-[#6B5C4E]"  },
};

const tagColorMap: Record<string, string> = {
  "Luxury":       "bg-[#C9A84C] text-[#1C0F05]",
  "Budget":       "bg-emerald-500 text-white",
  "Premium":      "bg-blue-500 text-white",
  "Owner Direct": "bg-purple-500 text-white",
  "Popular":      "bg-amber-100 text-amber-800",
  "New":          "bg-[#6B3A1F]/10 text-[#6B3A1F]",
};

const filterSections = [
  { id: "listing",   title: "Looking For",   icon: <Home size={13} />,        color: "#6B3A1F", options: ["All", "Sale", "Rent"] },
  { id: "city",      title: "City",          icon: <MapPin size={13} />,      color: "#C9A84C", options: ["All Cities", "Noida", "Gurugram", "Greater Noida", "Ghaziabad", "Faridabad"] },
  { id: "budget",    title: "Budget",        icon: <IndianRupee size={13} />, color: "#059669", options: ["All Budgets", "Under ₹50 L", "₹50 L – ₹1 Cr", "₹1–2 Cr", "₹2–5 Cr", "₹5 Cr+"] },
  { id: "bhk",       title: "BHK",           icon: <BedDouble size={13} />,   color: "#2563EB", options: ["All BHK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  { id: "type",      title: "Property Type", icon: <Building2 size={13} />,   color: "#7C3AED", options: ["All Types", "Apartment", "Villa", "Builder Floor", "Plot", "Penthouse", "Studio"] },
  { id: "furnished", title: "Furnishing",    icon: <Layers size={13} />,      color: "#D97706", options: ["All", "Furnished", "Semi-Furnished", "Unfurnished"] },
  { id: "parking",   title: "Parking",       icon: <Car size={13} />,         color: "#6B3A1F", options: ["Any", "With Parking", "Without Parking"] },
];

const DEFAULTS: Record<string, string> = {
  listing: "All", city: "All Cities", budget: "All Budgets",
  bhk: "All BHK", type: "All Types", furnished: "All", parking: "Any",
};

// ── SidebarSection ─────────────────────────────────────────────────────────
function SidebarSection({
  section, value, onChange, index,
}: {
  section: typeof filterSections[0];
  value: string;
  onChange: (v: string) => void;
  index: number;
}) {
  const [open, setOpen] = useState(index < 3);
  const isFiltered = value !== section.options[0];

  return (
    <div className="border-b border-[#F0EAE2] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-5 hover:bg-[#6B3A1F]/[0.03] transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
            style={{ background: `${section.color}15`, color: section.color, border: `1px solid ${section.color}20` }}
          >
            {section.icon}
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-bold text-[11px] tracking-[0.12em] uppercase text-[#1C0F05]">{section.title}</span>
            {isFiltered && (
              <span className="text-[9px] font-semibold" style={{ color: section.color }}>✓ {value}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isFiltered && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: section.color }} />}
          {open ? <ChevronUp size={13} className="text-[#6B3A1F]" /> : <ChevronDown size={13} className="text-[#A8978A]" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-1">
          {section.options.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all hover:translate-x-0.5"
                style={{
                  background: active ? `${section.color}10` : "transparent",
                  border: `1px solid ${active ? `${section.color}25` : "transparent"}`,
                }}
              >
                <span className="relative w-3 h-3 flex-shrink-0">
                  <span
                    className="absolute inset-0 rounded-full transition-all"
                    style={{
                      background: active ? section.color : "rgba(107,58,31,0.15)",
                      transform: active ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                  {active && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: section.color }} />
                  )}
                </span>
                <span
                  className="text-xs flex-1 transition-colors"
                  style={{ color: active ? section.color : "#7A6858", fontWeight: active ? 700 : 500 }}
                >
                  {opt}
                </span>
                {active && <CheckCircle2 size={11} style={{ color: section.color }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PropertyCard ───────────────────────────────────────────────────────────
function PropertyCard({ property, view }: { property: Property; view: "grid" | "list" }) {
  const [wished, setWished] = useState(false);
  const sc = STATUS_CFG[property.status]    ?? STATUS_CFG["Ready To Move"];
  const fc = FURNISHED_CFG[property.furnished] ?? FURNISHED_CFG["Unfurnished"];
  const oc = OWNER_CFG[property.ownerType]  ?? OWNER_CFG["Agent"];

  if (view === "list") {
    return (
      <Link
        href={`/properties/${property.slug}`}
        className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] flex flex-col sm:flex-row transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(107,58,31,0.12)] hover:border-[#E8D5B0] block"
        style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.06)" }}
      >
        {/* Image */}
        <div className="relative w-full sm:w-56 lg:w-64 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={property.image} alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black ${
            property.listingType === "Rent" ? "bg-blue-500 text-white" : "bg-[#6B3A1F] text-[#E8D5B0]"
          }`}>
            For {property.listingType}
          </div>
          {property.tag && (
            <div className={`absolute top-3 right-10 px-2.5 py-0.5 rounded-full text-[8px] font-black ${tagColorMap[property.tag] ?? "bg-white/90 text-[#6B3A1F]"}`}>
              {property.tag}
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 active:scale-90 ${
              wished ? "bg-red-50/90 border border-red-200" : "bg-white/25 border border-white/30"
            }`}
          >
            <Heart size={13} className={wished ? "text-red-500 fill-red-500" : "text-white"} />
          </button>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold bg-black/45 text-white/90 backdrop-blur-sm">
            <Eye size={8} />{property.views}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-[#1C0F05] text-base leading-snug line-clamp-1 group-hover:text-[#6B3A1F] transition-colors">
                  {property.title}
                </h3>
                {property.society && (
                  <p className="text-[11px] text-[#A8978A] mt-0.5">{property.society}</p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-display font-black text-xl leading-none text-[#1C0F05]">{property.price}</p>
                <p className="text-[9px] text-[#A8978A] font-medium mt-0.5">{property.priceLabel}</p>
              </div>
            </div>

            {property.rating !== undefined && (
              <div className="flex items-center gap-1 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} className={i < Math.floor(property.rating!) ? "text-[#C9A84C] fill-[#C9A84C]" : "text-[#E8D5B0]"} />
                ))}
                <span className="text-[9px] font-bold text-[#A8978A] ml-0.5">{property.rating}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-3">
              <MapPin size={11} className="text-[#C9A84C] flex-shrink-0" />
              <span className="text-xs font-medium text-[#7A6858]">{property.location}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {property.bhk > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                  <BedDouble size={10} />{property.bhk} BHK
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                <Maximize2 size={10} />{property.area}
              </div>
              {property.bhk > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                  <Bath size={10} />{property.baths} Bath
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                <Layers size={10} />{property.floor}
              </div>
              {property.parking && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#6B3A1F]/[0.06] text-[#6B3A1F] text-[10px] font-semibold">
                  <Car size={10} />Parking
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${fc.bg} ${fc.text}`}>
                {property.furnished}
              </span>
              <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                <span className={`w-1 h-1 rounded-full ${sc.dot}`} />{property.status}
              </span>
              <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F4] text-[#6B5C4E]">
                {property.facing} facing
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {property.highlights.slice(0, 2).map((h) => (
                <span key={h} className="inline-flex items-center gap-1 text-[9px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                  <span className="text-[#C9A84C] text-[7px]">✦</span>{h}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-[#F0EAE2]">
            <div className="flex items-center gap-2">
              {property.verified && (
                <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <BadgeCheck size={10} /> Verified
                </div>
              )}
              <div className={`text-[10px] font-bold px-2.5 py-1 rounded-xl ${oc.bg} ${oc.text}`}>
                {property.ownerType}
              </div>
              <span className="text-[9px] text-[#A8978A]">
                {property.postedDays === 1 ? "Today" : property.postedDays < 7 ? `${property.postedDays}d ago` : "1w ago"}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href="tel:+919999999999"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[11px] border border-[#EDE5DD] bg-white text-[#6B3A1F] hover:-translate-y-0.5 transition-all"
              >
                <Phone size={10} /> Call
              </a>
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[11px] bg-[#6B3A1F] text-white group-hover:bg-[#522C16] transition-colors">
                View Details <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // GRID VIEW
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(107,58,31,0.13)] hover:border-[#E8D5B0] block"
      style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.06)" }}
    >
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.image} alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black ${
          property.listingType === "Rent" ? "bg-blue-500 text-white" : "bg-[#6B3A1F] text-[#E8D5B0]"
        }`}>
          {property.listingType}
        </div>
        {property.tag && (
          <div className={`absolute top-3 right-10 px-2 py-0.5 rounded-full text-[8px] font-black ${tagColorMap[property.tag] ?? "bg-white/90 text-[#6B3A1F]"}`}>
            {property.tag}
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 active:scale-90 ${
            wished ? "bg-red-50/90 border border-red-200" : "bg-white/22 border border-white/30"
          }`}
        >
          <Heart size={12} className={wished ? "text-red-500 fill-red-500" : "text-white"} />
        </button>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-black text-sm drop-shadow-md">{property.price}</p>
          <p className="text-white/60 text-[9px] mt-0.5">{property.priceLabel}</p>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-[#1C0F05] text-sm line-clamp-1 mb-0.5 group-hover:text-[#6B3A1F] transition-colors">
          {property.title}
        </h3>
        {property.society && (
          <p className="text-[10px] text-[#A8978A] mb-1.5 truncate">{property.society}</p>
        )}
        {property.rating !== undefined && (
          <div className="flex items-center gap-0.5 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={8} className={i < Math.floor(property.rating!) ? "text-[#C9A84C] fill-[#C9A84C]" : "text-[#E8D5B0]"} />
            ))}
            <span className="text-[9px] font-bold text-[#A8978A] ml-1">{property.rating}</span>
          </div>
        )}
        <div className="flex items-center gap-1 mb-2.5">
          <MapPin size={10} className="text-[#C9A84C] flex-shrink-0" />
          <span className="text-xs truncate text-[#7A6858]">{property.location}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {property.bhk > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">
              <BedDouble size={9} />{property.bhk} BHK
            </span>
          )}
          <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">
            <Maximize2 size={9} />{property.area}
          </span>
          <span className={`text-[9px] font-bold px-2 py-1 rounded-lg ${fc.bg} ${fc.text}`}>
            {property.furnished}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#EDE5DD]">
          <div className="flex items-center gap-1.5">
            {property.verified
              ? <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600"><BadgeCheck size={10} /> Verified</div>
              : <span className="text-[9px] text-[#A8978A]">{property.ownerType}</span>
            }
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B3A1F] group-hover:gap-2 transition-all">
            View <ArrowRight size={10} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const searchParams = useSearchParams();

  const [filters, setFilters]           = useState({ ...DEFAULTS });
  const [search, setSearch]             = useState("");
  const [sortKey, setSortKey]           = useState<SortKey>("default");
  const [view, setView]                 = useState<"grid" | "list">("list");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [listingTab, setListingTab]     = useState<"All" | "Sale" | "Rent">("All");

  // Near Me state — stores parsed coordinates from URL
  const [nearMeCoords, setNearMeCoords] = useState<NearMeCoords | null>(null);

  // Read URL params on mount / param change
  useEffect(() => {
    const cityParam    = searchParams.get("city");
    const qParam       = searchParams.get("q");
    const listingParam = searchParams.get("listing");
    const nearMe       = searchParams.get("nearme");
    const lat          = searchParams.get("lat");
    const lon          = searchParams.get("lon");
    const radius       = searchParams.get("radius");

    if (cityParam)              setFilters((prev) => ({ ...prev, city: cityParam }));
    if (qParam)                 setSearch(qParam);
    if (listingParam === "sale") setListingTab("Sale");
    if (listingParam === "rent") setListingTab("Rent");

    // Near Me — store parsed coords
    if (nearMe === "true" && lat && lon) {
      setNearMeCoords({
        lat:    parseFloat(lat),
        lon:    parseFloat(lon),
        radius: radius ? parseFloat(radius) : 3,
        label:  qParam ?? "Near Me",
      });
    }
  }, [searchParams]);

  const setFilter = (id: string, val: string) => {
    setFilters((f) => ({ ...f, [id]: val }));
    setVisibleCount(6);
  };

  const hasFilters   = Object.entries(filters).some(([k, v]) => v !== DEFAULTS[k]) || search !== "" || nearMeCoords !== null;
  const activeCount  = Object.entries(filters).filter(([k, v]) => v !== DEFAULTS[k]).length + (nearMeCoords ? 1 : 0);

  const clearAll = () => {
    setFilters({ ...DEFAULTS });
    setSearch("");
    setVisibleCount(6);
    setListingTab("All");
    setNearMeCoords(null);
  };

  // ── Filtered list ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...allProperties];

    // ① Near Me radius filter — only applied if property has lat/lon
// Inside filtered useMemo, after the nearMeCoords filter
if (nearMeCoords) {
  console.log("Near Me Coords:", nearMeCoords);
  console.log("Properties with coordinates:");
  list.forEach(p => {
    if (p.lat && p.lon) {
      const dist = haversineKm(nearMeCoords.lat, nearMeCoords.lon, p.lat, p.lon);
      console.log(`${p.title}: ${dist.toFixed(2)} km - ${dist <= nearMeCoords.radius ? "IN" : "OUT"}`);
    }
  });
}

    // ② Standard filters
    const lt = listingTab !== "All" ? listingTab : filters.listing !== "All" ? filters.listing : null;
    if (lt) list = list.filter((p) => p.listingType === lt);

    if (search) {
      list = list.filter((p) =>
        [p.title, p.location, p.society ?? "", p.owner].some((f) =>
          f.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (filters.city     !== "All Cities")   list = list.filter((p) => p.city         === filters.city);
    if (filters.type     !== "All Types")    list = list.filter((p) => p.propertyType === filters.type);
    if (filters.furnished !== "All")         list = list.filter((p) => p.furnished    === filters.furnished);
    if (filters.parking  === "With Parking")    list = list.filter((p) =>  p.parking);
    if (filters.parking  === "Without Parking") list = list.filter((p) => !p.parking);
    if (filters.bhk      !== "All BHK")     list = list.filter((p) => p.bhk === parseInt(filters.bhk));

    if (filters.budget === "Under ₹50 L")    list = list.filter((p) => p.priceRaw < 0.5);
    if (filters.budget === "₹50 L – ₹1 Cr") list = list.filter((p) => p.priceRaw >= 0.5 && p.priceRaw < 1);
    if (filters.budget === "₹1–2 Cr")        list = list.filter((p) => p.priceRaw >= 1  && p.priceRaw < 2);
    if (filters.budget === "₹2–5 Cr")        list = list.filter((p) => p.priceRaw >= 2  && p.priceRaw < 5);
    if (filters.budget === "₹5 Cr+")         list = list.filter((p) => p.priceRaw >= 5);

    if (sortKey === "price-low")  list.sort((a, b) => a.priceRaw - b.priceRaw);
    if (sortKey === "price-high") list.sort((a, b) => b.priceRaw - a.priceRaw);
    if (sortKey === "newest")     list.sort((a, b) => a.postedDays - b.postedDays);
    if (sortKey === "area")       list.sort((a, b) => b.areaRaw - a.areaRaw);

    return list;
  }, [filters, search, sortKey, listingTab, nearMeCoords]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const SidebarContent = () => (
    <>
      {filterSections.map((sec, i) => (
        <SidebarSection
          key={sec.id}
          section={sec}
          value={(filters as Record<string, string>)[sec.id]}
          onChange={(v) => setFilter(sec.id, v)}
          index={i}
        />
      ))}
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[hsl(40,40%,97%)]">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24">
        <div className="flex gap-5 lg:gap-7 items-start">

          {/* ── Sidebar ── */}
          <aside
            className="hidden lg:flex flex-col flex-shrink-0 sticky top-20 rounded-2xl overflow-hidden"
            style={{ width: "260px", background: "#fff", border: "1px solid #EDE5DD", boxShadow: "0 6px 28px rgba(107,58,31,0.10)" }}
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
                      {activeCount > 0 ? `${activeCount} active` : "All properties"}
                    </p>
                  </div>
                </div>
                {hasFilters && (
                  <button onClick={clearAll} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-red-500/15 text-red-300 border border-red-500/20 hover:scale-105 transition-transform">
                    <RotateCcw size={8} /> Reset
                  </button>
                )}
              </div>
              {hasFilters && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/[0.06]">
                  {nearMeCoords && (
                    <button
                      onClick={() => setNearMeCoords(null)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold bg-[#C9A84C]/15 text-[#E8D5B0] border border-[#C9A84C]/20 hover:scale-105 transition-transform"
                    >
                      Near Me <X size={7} />
                    </button>
                  )}
                  {Object.entries(filters).map(([k, v]) =>
                    v !== DEFAULTS[k] ? (
                      <button key={k} onClick={() => setFilter(k, DEFAULTS[k])}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold bg-[#C9A84C]/15 text-[#E8D5B0] border border-[#C9A84C]/20 hover:scale-105 transition-transform">
                        {v} <X size={7} />
                      </button>
                    ) : null
                  )}
                </div>
              )}
            </div>
            <div className="overflow-y-auto flex-1 max-h-[calc(100vh-220px)]">
              <SidebarContent />
            </div>
            <div className="p-4 border-t border-[#F0EAE2]">
              <button
                onClick={clearAll}
                className="group w-full py-3 rounded-xl font-bold text-xs transition-all hover:-translate-y-0.5 active:scale-[0.97] relative overflow-hidden"
                style={{
                  background:  hasFilters ? "linear-gradient(135deg,#6B3A1F,#3B1D0D)" : "rgba(107,58,31,0.07)",
                  color:       hasFilters ? "#E8D5B0" : "#A8978A",
                  boxShadow:   hasFilters ? "0 4px 14px rgba(107,58,31,0.28)" : "none",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  {hasFilters ? <><RotateCcw size={11} /> Clear All · {filtered.length} Results</> : "No Filters Applied"}
                </span>
                {hasFilters && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
              </button>
            </div>
          </aside>

          {/* ── Content ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Sale / Rent tabs */}
            <div className="flex gap-1 p-1 bg-white rounded-2xl border border-[#EDE5DD]" style={{ boxShadow: "0 2px 10px rgba(107,58,31,0.06)" }}>
              {(["All", "Sale", "Rent"] as const).map((t) => (
                <button key={t} onClick={() => { setListingTab(t); setVisibleCount(6); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    listingTab === t
                      ? "bg-[#6B3A1F] text-white shadow-[0_4px_12px_rgba(107,58,31,0.25)]"
                      : "text-[#7A6858] hover:text-[#6B3A1F]"
                  }`}>
                  {t === "All" ? "All Properties" : `For ${t}`}
                </button>
              ))}
            </div>

            {/* ── Near Me active banner ── */}
            {nearMeCoords && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold bg-[#6B3A1F]/[0.06] border-[#6B3A1F]/20 text-[#6B3A1F]">
                <div className="flex items-center gap-2">
                  <NearMeIcon size={14} />
                  <span>
                    Showing properties within{" "}
                    <strong>{nearMeCoords.radius} km</strong> of{" "}
                    <strong>{nearMeCoords.label}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setNearMeCoords(null)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#6B3A1F]/10 transition-colors text-[#A8978A] hover:text-[#6B3A1F]"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#EDE5DD]" style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.06)" }}>
              <div className="relative flex-1 group/s">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8978A] group-focus-within/s:text-[#6B3A1F] transition-colors" />
                <input
                  type="text"
                  placeholder="Search property, society or location…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(6); }}
                  className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#6B3A1F]/15 transition-all"
                  style={{ background: "hsl(38,45%,97%)", border: "1px solid #EDE5DD", color: "#1C0F05" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#6B3A1F]/10 transition-colors">
                    <X size={11} className="text-[#A8978A]" />
                  </button>
                )}
              </div>

              <div className="relative flex-shrink-0">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="appearance-none pl-4 pr-9 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-all"
                  style={{ background: "hsl(38,45%,97%)", border: "1px solid #EDE5DD", color: "#6B3A1F", minWidth: "160px" }}
                >
                  <option value="default">✨ Relevance</option>
                  <option value="price-low">💰 Price: Low → High</option>
                  <option value="price-high">💰 Price: High → Low</option>
                  <option value="newest">🆕 Recently Posted</option>
                  <option value="area">📐 Area: Largest First</option>
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B3A1F]" />
              </div>

              <button
                onClick={() => setMobileSidebar(true)}
                className="lg:hidden relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs flex-shrink-0 bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] active:scale-[0.97] transition-all"
                style={{ boxShadow: "0 3px 12px rgba(107,58,31,0.25)" }}
              >
                <Filter size={13} /> Filters
                {activeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1 p-1 rounded-xl flex-shrink-0 bg-[hsl(38,45%,97%)] border border-[#EDE5DD]">
                {(["list", "grid"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className="p-2.5 rounded-lg transition-all"
                    style={{
                      background: view === v ? "#fff" : "transparent",
                      boxShadow:  view === v ? "0 1px 6px rgba(107,58,31,0.12)" : "none",
                      color:      view === v ? "#6B3A1F" : "#A8978A",
                    }}>
                    {v === "grid" ? <Grid3x3 size={15} /> : <List size={15} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-bold text-[#1C0F05]">
                {filtered.length}{" "}
                <span className="font-medium text-[#A8978A]">
                  {listingTab === "Rent" ? "rentals" : listingTab === "Sale" ? "properties for sale" : "properties"} found
                  {nearMeCoords && <span className="text-[#6B3A1F] font-semibold"> near you</span>}
                </span>
              </p>
              {hasFilters && (
                <button onClick={clearAll} className="group/c text-xs font-bold flex items-center gap-1 text-[#A8978A] hover:text-red-500 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50">
                  <RotateCcw size={10} className="group-hover/c:-rotate-180 transition-transform duration-300" /> Clear all
                </button>
              )}
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#EDE5DD] text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[#6B3A1F]/8 to-[#C9A84C]/8">
                  <Search size={26} className="text-[#6B3A1F]" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#1C0F05] mb-2">No properties found</h3>
                <p className="text-sm mb-6 max-w-xs text-[#A8978A]">
                  {nearMeCoords
                    ? `No properties found within ${nearMeCoords.radius} km. Try clearing the near me filter.`
                    : "Try adjusting your filters or search term."
                  }
                </p>
                <button onClick={clearAll} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#6B3A1F] text-white hover:-translate-y-0.5 transition-all" style={{ boxShadow: "0 4px 16px rgba(107,58,31,0.28)" }}>
                  <RotateCcw size={13} /> Clear All Filters
                </button>
              </div>
            ) : view === "list" ? (
              <div className="flex flex-col gap-4">
                {visible.map((p) => <PropertyCard key={p.id} property={p} view="list" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {visible.map((p) => <PropertyCard key={p.id} property={p} view="grid" />)}
              </div>
            )}

            {/* Load more */}
            {filtered.length > 0 && (
              <div className="flex flex-col items-center gap-3 pt-2">
                {hasMore && (
                  <>
                    <p className="text-sm font-medium text-[#A8978A]">
                      Showing {visibleCount} of {filtered.length} properties
                    </p>
                    <div className="w-full max-w-xs h-1.5 rounded-full overflow-hidden bg-[#6B3A1F]/10">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(visibleCount / filtered.length) * 100}%`, background: "linear-gradient(to right,#6B3A1F,#C9A84C)" }}
                      />
                    </div>
                    <button
                      onClick={() => setVisibleCount((c) => c + 6)}
                      className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-1 active:scale-[0.97] relative overflow-hidden bg-[#6B3A1F] text-[#E8D5B0]"
                      style={{ boxShadow: "0 8px 28px rgba(107,58,31,0.28)" }}
                    >
                      <span className="relative z-10 flex items-center gap-2.5">
                        Load More Properties
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold bg-white/15">
                          {Math.min(6, filtered.length - visibleCount)}
                        </span>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </>
                )}
                {!hasMore && visibleCount > 6 && (
                  <div className="flex items-center justify-center gap-3 py-4 w-full">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6B3A1F]/15" />
                    <p className="text-xs font-semibold text-[#A8978A] px-3">All {filtered.length} properties shown</p>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6B3A1F]/15" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
          <div
            className="absolute left-0 top-0 bottom-0 w-80 flex flex-col overflow-hidden rounded-r-2xl bg-white"
            style={{ boxShadow: "8px 0 40px rgba(0,0,0,0.20)", animation: "slideIn 0.26s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D] border-b border-[#C9A84C]/15">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#C9A84C]/15 border border-[#C9A84C]/20">
                  <Filter size={14} className="text-[#C9A84C]" />
                </div>
                <p className="font-bold text-sm text-white">
                  Filters {activeCount > 0 && <span className="text-[#C9A84C]">({activeCount})</span>}
                </p>
              </div>
              <button onClick={() => setMobileSidebar(false)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.08] text-white/55 hover:bg-white/15 transition-colors">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto"><SidebarContent /></div>
            <div className="p-4 flex-shrink-0 border-t border-[#F0EAE2]">
              <button
                onClick={() => setMobileSidebar(false)}
                className="group w-full py-3.5 rounded-xl font-bold text-sm bg-[#6B3A1F] text-[#E8D5B0] transition-all hover:-translate-y-0.5 active:scale-[0.97] relative overflow-hidden"
                style={{ boxShadow: "0 4px 16px rgba(107,58,31,0.28)" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Show {filtered.length} Results <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
      `}</style>
    </div>
  );
}