"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Heart, BadgeCheck, ArrowRight, Search,
  X, ChevronDown, ChevronUp, Grid3x3, List,
  SlidersHorizontal, IndianRupee, Home, Building2,
  BedDouble, CheckCircle2, Filter, Calendar,
  Award, RotateCcw, Phone, Eye, Maximize2, Star, Zap,
} from "lucide-react";

import { allProjects, type Project } from "@/lib/realEstateData";

// ─── Types ───────────────────────────────────────────────
type SortKey = "default" | "price-low" | "price-high" | "newest";

// ─── Config ───────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "New Launch":         { bg: "bg-[#6B3A1F]/10 border border-[#6B3A1F]/20", text: "text-[#6B3A1F]",   dot: "bg-[#6B3A1F]"   },
  "Ready To Move":      { bg: "bg-emerald-50 border border-emerald-200",     text: "text-emerald-700", dot: "bg-emerald-500" },
  "Under Construction": { bg: "bg-amber-50 border border-amber-200",         text: "text-amber-700",   dot: "bg-amber-500"   },
};

const tagConfig: Record<string, { bg: string; color: string }> = {
  "New":     { bg: "bg-[#6B3A1F]/10",  color: "text-[#6B3A1F]"   },
  "Popular": { bg: "bg-amber-100",      color: "text-amber-800"   },
  "Luxury":  { bg: "bg-[#6B3A1F]",     color: "text-[#E8D5B0]"   },
  "Budget":  { bg: "bg-emerald-50",     color: "text-emerald-700" },
  "Premium": { bg: "bg-blue-50",        color: "text-blue-700"    },
};

const filterSections = [
  { id: "city",       title: "City",            icon: <MapPin size={14} />,      color: "#6B3A1F", options: ["All Cities", "Noida", "Gurugram", "Greater Noida", "Ghaziabad", "Faridabad", "Yamuna Expressway"] },
  { id: "status",     title: "Property Status", icon: <Zap size={14} />,         color: "#C9A84C", options: ["All", "New Launch", "Ready To Move", "Under Construction"] },
  { id: "budget",     title: "Budget",          icon: <IndianRupee size={14} />, color: "#059669", options: ["All Budgets", "Under ₹1 Cr", "₹1–2 Cr", "₹2–5 Cr", "₹5 Cr+"] },
  { id: "bhk",        title: "BHK",             icon: <BedDouble size={14} />,   color: "#2563EB", options: ["All BHK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  { id: "type",       title: "Property Type",   icon: <Home size={14} />,        color: "#8B6914", options: ["All Types", "Apartment", "Villa", "Builder Floor", "Plot", "Penthouse"] },
  { id: "amenities",  title: "Amenities",       icon: <Award size={14} />,       color: "#C9A84C", options: ["All Amenities", "Swimming Pool", "Gym", "Park", "Security", "Club House"] },
  { id: "possession", title: "Possession",      icon: <Calendar size={14} />,    color: "#6B3A1F", options: ["All", "Ready to Move", "Within 1 Year", "Within 2 Years", "Within 3 Years"] },
];

const DEFAULTS: Record<string, string> = {
  city: "All Cities", status: "All", budget: "All Budgets",
  bhk: "All BHK", type: "All Types", amenities: "All Amenities", possession: "All",
};

// ─── SidebarSection ───────────────────────────────────────
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
          {section.options.map((opt) => {
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
                  {active && <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: section.color }} />}
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

// ─── ProjectCard ──────────────────────────────────────────
function ProjectCard({ project, view }: { project: Project; view: "grid" | "list" }) {
  const [wished, setWished] = useState(false);
  const cfg = statusConfig[project.status] ?? statusConfig["New Launch"];
  const tag = project.tag ? tagConfig[project.tag] : null;

  if (view === "list") {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] flex flex-col sm:flex-row transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#6B3A1F]/10 hover:border-amber-200/50 block"
        style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.08)" }}
      >
        {/* Image */}
        <div className="relative w-full sm:w-56 md:w-64 lg:w-72 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image} alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-sm ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
            {project.status}
          </div>

          {tag && project.tag && (
            <div className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black ${tag.bg} ${tag.color}`}>
              {project.tag}
            </div>
          )}

          <button
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-sm ${
              wished ? "bg-red-50/90 border border-red-200/60" : "bg-white/25 border border-white/30"
            }`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
          >
            <Heart size={13} className={wished ? "text-red-500 fill-red-500" : "text-white"} />
          </button>

          {project.views && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold bg-black/45 text-white/90 backdrop-blur-sm">
              <Eye size={8} /> {project.views}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-[#1C0F05] text-base sm:text-lg leading-snug line-clamp-1 group-hover:text-[#6B3A1F] transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-[11px] font-semibold mt-0.5 text-[#B0A090] flex items-center gap-1">
                  <Building2 size={10} className="text-[#C9A84C]" /> by {project.builder}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-display font-black text-lg sm:text-xl leading-none text-[#1C0F05]">{project.price}</p>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#A8978A] mt-0.5">onwards</p>
              </div>
            </div>

            {project.rating !== undefined && (
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} className={i < Math.floor(project.rating!) ? "text-[#C9A84C] fill-[#C9A84C]" : "text-[#E8D5B0]"} />
                ))}
                <span className="text-[9px] font-bold text-[#A8978A] ml-0.5">{project.rating}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-3">
              <MapPin size={11} className="text-[#C9A84C] flex-shrink-0" />
              <span className="text-xs font-medium text-[#7A6858]">{project.location}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { l: project.bhk, i: <BedDouble size={9} /> },
                { l: project.area, i: <Maximize2 size={9} /> },
                ...(project.possession ? [{ l: `📅 ${project.possession}`, i: null }] : []),
                ...(project.totalUnits ? [{ l: `🏢 ${project.totalUnits} units`, i: null }] : []),
              ].map(({ l, i }) => (
                <div key={l} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">
                  {i && <span className="text-[#C9A84C]">{i}</span>}{l}
                </div>
              ))}
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {project.highlights.slice(0, 2).map((h) => (
                  <span key={h} className="inline-flex items-center gap-1 text-[9px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                    <span className="text-[#C9A84C] text-[7px]">✦</span> {h}
                  </span>
                ))}
              </div>
            )}

            {project.reraNo && (
              <p className="flex items-center gap-1.5 text-[9px] font-semibold text-[#A8978A]">
                <BadgeCheck size={10} className="text-emerald-500" /> RERA: {project.reraNo}
              </p>
            )}
          </div>

          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 pt-3 mt-3 border-t border-[#F0EAE2]">
            <div className="flex items-center gap-2 flex-wrap">
              {project.verified && (
                <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <BadgeCheck size={11} /> Verified
                </div>
              )}
              <div className="text-[10px] font-semibold px-2.5 py-1 rounded-xl bg-[#6B3A1F]/[0.06] text-[#7A6858]">
                {project.propertyType}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href="tel:+919999999999"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[11px] border border-[#EDE5DD] bg-white text-[#6B3A1F] hover:-translate-y-0.5 transition-all duration-200"
              >
                <Phone size={10} /> Call
              </a>
              <div
                className="group/btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[11px] bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0]"
                style={{ boxShadow: "0 4px 14px rgba(107,58,31,0.28)" }}
              >
                View Details
                <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
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
      href={`/projects/${project.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#6B3A1F]/15 hover:border-amber-200/50 block"
      style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.06)" }}
    >
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image} alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-sm ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
          {project.status}
        </div>

        {tag && project.tag && (
          <div className={`absolute top-3 right-10 px-2.5 py-0.5 rounded-full text-[8px] font-black ${tag.bg} ${tag.color}`}>
            {project.tag}
          </div>
        )}

        <button
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm ${
            wished ? "bg-red-50/90 border border-red-200/60" : "bg-white/22 border border-white/30"
          }`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
        >
          <Heart size={12} className={wished ? "text-red-500 fill-red-500" : "text-white"} />
        </button>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-black text-sm drop-shadow-md">{project.price}</p>
          <p className="text-white/60 text-[9px] mt-0.5">by {project.builder}</p>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-[#1C0F05] text-sm leading-snug mb-1 line-clamp-1 group-hover:text-[#6B3A1F] transition-colors duration-200">
          {project.title}
        </h3>

        {project.rating !== undefined && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={8} className={i < Math.floor(project.rating!) ? "text-[#C9A84C] fill-[#C9A84C]" : "text-[#E8D5B0]"} />
            ))}
            <span className="text-[9px] font-bold text-[#A8978A] ml-0.5">{project.rating}</span>
          </div>
        )}

        <div className="flex items-center gap-1 mb-2.5">
          <MapPin size={10} className="text-[#C9A84C] flex-shrink-0" />
          <span className="text-xs truncate text-[#7A6858]">{project.location}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">{project.bhk}</span>
          <span className="text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">{project.area}</span>
          {project.possession && (
            <span className="text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#6B3A1F]/[0.06] text-[#6B3A1F]">📅 {project.possession}</span>
          )}
        </div>

        {project.highlights?.[0] && (
          <p className="text-[9px] font-semibold mb-2.5 text-amber-800 flex items-center gap-1">
            <span className="text-[#C9A84C]">✦</span> {project.highlights[0]}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#EDE5DD]">
          {project.verified
            ? <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600"><BadgeCheck size={10} /> Verified</div>
            : <span />
          }
          <div className="flex items-center gap-1 text-[10px] font-black text-[#6B3A1F] group-hover:gap-2 transition-all duration-200">
            View Details <ArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── ProjectsPage ─────────────────────────────────────────
export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({ ...DEFAULTS });
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [view, setView] = useState<"grid" | "list">("list");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const cityParam = searchParams.get("city");
    const qParam = searchParams.get("q");
    if (cityParam) setFilters((prev) => ({ ...prev, city: cityParam }));
    if (qParam) setSearch(qParam);
  }, [searchParams]);

  const setFilter = (id: string, val: string) => { setFilters((f) => ({ ...f, [id]: val })); setVisibleCount(6); };
  const hasFilters = Object.entries(filters).some(([k, v]) => v !== DEFAULTS[k]) || search !== "";
  const activeFiltersCount = Object.entries(filters).filter(([k, v]) => v !== DEFAULTS[k]).length;
  const clearAll = () => { setFilters({ ...DEFAULTS }); setSearch(""); setVisibleCount(6); };

  const filtered = useMemo(() => {
    let list = [...allProjects];
    if (search) list = list.filter((p) => [p.title, p.location, p.builder].some((f) => f.toLowerCase().includes(search.toLowerCase())));
    if (filters.city !== "All Cities") list = list.filter((p) => p.city === filters.city);
    if (filters.status !== "All") list = list.filter((p) => p.status === filters.status);
    if (filters.type !== "All Types") list = list.filter((p) => p.propertyType === filters.type);
    if (filters.bhk !== "All BHK") list = list.filter((p) => p.bhk.includes(filters.bhk.replace(" BHK", "")));
    if (filters.budget === "Under ₹1 Cr") list = list.filter((p) => p.priceRaw < 1);
    if (filters.budget === "₹1–2 Cr") list = list.filter((p) => p.priceRaw >= 1 && p.priceRaw < 2);
    if (filters.budget === "₹2–5 Cr") list = list.filter((p) => p.priceRaw >= 2 && p.priceRaw < 5);
    if (filters.budget === "₹5 Cr+") list = list.filter((p) => p.priceRaw >= 5);
    if (sortKey === "price-low") list.sort((a, b) => a.priceRaw - b.priceRaw);
    if (sortKey === "price-high") list.sort((a, b) => b.priceRaw - a.priceRaw);
    return list;
  }, [filters, search, sortKey]);

  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const SidebarContent = () => (
    <>
      {filterSections.map((sec, i) => (
        <SidebarSection
          key={sec.id} section={sec}
          value={(filters as Record<string, string>)[sec.id]}
          onChange={(v) => setFilter(sec.id, v)}
          index={i}
        />
      ))}
    </>
  );

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
                      {activeFiltersCount > 0 ? `${activeFiltersCount} active` : "All properties"}
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

            <div className="overflow-y-auto flex-1 max-h-[calc(100vh-220px)] scrollbar-thin scrollbar-thumb-[#6B3A1F]/15 scrollbar-track-transparent">
              <SidebarContent />
            </div>

            <div className="p-4 border-t border-[#F0EAE2]">
              <button
                onClick={clearAll}
                className="group w-full py-3 rounded-xl font-black text-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] relative overflow-hidden"
                style={{
                  background: hasFilters ? "linear-gradient(135deg,#6B3A1F,#3B1D0D)" : "rgba(107,58,31,0.07)",
                  color: hasFilters ? "#E8D5B0" : "#A8978A",
                  boxShadow: hasFilters ? "0 4px 14px rgba(107,58,31,0.28)" : "none",
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

          {/* RIGHT CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Toolbar */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#EDE5DD]"
              style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.06)" }}
            >
              <div className="relative flex-1 group/s">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8978A] transition-colors group-focus-within/s:text-[#6B3A1F]" />
                <input
                  type="text"
                  placeholder="Search project, builder or location…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(6); }}
                  className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#6B3A1F]/15 transition-all duration-200"
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
                  className="appearance-none pl-4 pr-9 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-all duration-200"
                  style={{ background: "hsl(38,45%,97%)", border: "1px solid #EDE5DD", color: "#6B3A1F", minWidth: "150px" }}
                >
                  <option value="default">✨ Relevance</option>
                  <option value="price-low">💰 Price: Low → High</option>
                  <option value="price-high">💰 Price: High → Low</option>
                  <option value="newest">🆕 Newest First</option>
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B3A1F]" />
              </div>

              <button
                onClick={() => setMobileSidebar(true)}
                className="lg:hidden relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs flex-shrink-0 bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] active:scale-[0.97] transition-all"
                style={{ boxShadow: "0 3px 12px rgba(107,58,31,0.25)" }}
              >
                <Filter size={13} /> Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1 p-1 rounded-xl flex-shrink-0 bg-[hsl(38,45%,97%)] border border-[#EDE5DD]">
                {(["list", "grid"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className="p-2.5 rounded-lg transition-all duration-200"
                    style={{
                      background: view === v ? "#fff" : "transparent",
                      boxShadow: view === v ? "0 1px 6px rgba(107,58,31,0.12)" : "none",
                      color: view === v ? "#6B3A1F" : "#A8978A",
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
                <span className="font-medium text-[#A8978A]">project{filtered.length !== 1 ? "s" : ""} found</span>
              </p>
              {hasFilters && (
                <button onClick={clearAll} className="group/c text-xs font-bold flex items-center gap-1 text-[#A8978A] hover:text-red-500 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50">
                  <RotateCcw size={10} className="transition-transform duration-300 group-hover/c:-rotate-180" /> Clear all
                </button>
              )}
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#EDE5DD] text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[#6B3A1F]/8 to-[#C9A84C]/8">
                  <Search size={26} className="text-[#6B3A1F]" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#1C0F05] mb-2">No projects found</h3>
                <p className="text-sm mb-6 max-w-xs text-[#A8978A]">Try adjusting your filters or search term.</p>
                <button onClick={clearAll} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#FAF6F0] hover:-translate-y-0.5 transition-all" style={{ boxShadow: "0 4px 16px rgba(107,58,31,0.28)" }}>
                  <RotateCcw size={13} /> Clear All Filters
                </button>
              </div>
            ) : view === "list" ? (
              <div className="flex flex-col gap-4">
                {visibleProjects.map((p) => <ProjectCard key={p.id} project={p} view="list" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {visibleProjects.map((p) => <ProjectCard key={p.id} project={p} view="grid" />)}
              </div>
            )}

            {/* Load More */}
            {filtered.length > 0 && (
              <div className="flex flex-col items-center gap-3 pt-2">
                {hasMore && (
                  <>
                    <p className="text-sm font-medium text-[#A8978A]">Showing {visibleCount} of {filtered.length} projects</p>
                    <div className="w-full max-w-xs h-1.5 rounded-full overflow-hidden bg-[#6B3A1F]/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C] transition-all duration-500"
                        style={{ width: `${(visibleCount / filtered.length) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={() => setVisibleCount((c) => c + 6)}
                      className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] relative overflow-hidden bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0]"
                      style={{ boxShadow: "0 8px 28px rgba(107,58,31,0.28)" }}
                    >
                      <span className="relative z-10 flex items-center gap-2.5">
                        Load More Projects
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black bg-white/15">
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
                    <p className="text-xs font-semibold text-[#A8978A] px-3">All {filtered.length} projects loaded</p>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6B3A1F]/15" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
          <div
            className="absolute left-0 top-0 bottom-0 w-80 flex flex-col overflow-hidden rounded-r-2xl"
            style={{ background: "#fff", boxShadow: "8px 0 40px rgba(0,0,0,0.20)", animation: "slideIn 0.26s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D] border-b border-[#C9A84C]/15">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#C9A84C]/15 border border-[#C9A84C]/20">
                  <Filter size={14} className="text-[#C9A84C]" />
                </div>
                <p className="font-black text-sm text-white">
                  Filters {activeFiltersCount > 0 && <span className="text-[#C9A84C]">({activeFiltersCount})</span>}
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
                className="group w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] transition-all hover:-translate-y-0.5 active:scale-[0.97] relative overflow-hidden"
                style={{ boxShadow: "0 4px 16px rgba(107,58,31,0.28)" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Show {filtered.length} Results
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
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