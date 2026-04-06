"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  Play, Youtube, ChevronLeft, ChevronRight,
  ArrowRight, Eye, Clock, Users, TrendingUp,
  BookOpen, Landmark, BarChart2, Compass, ArrowUpRight,
  Search, X
} from "lucide-react";

import "swiper/css";

// ─── Types ───────────────────────────────────────────────
interface Video {
  id: string;
  title: string;
  views: string;
  duration: string;
  category: string;
  tag?: string;
  date: string;
}

// ─── Data ────────────────────────────────────────────────
const categories = [
  { label: "All",              icon: <Compass size={12} />    },
  { label: "Property Tour",   icon: <Landmark size={12} />   },
  { label: "Market Update",   icon: <BarChart2 size={12} />  },
  { label: "Investment Tips", icon: <TrendingUp size={12} /> },
  { label: "Buyer's Guide",   icon: <BookOpen size={12} />   },
];

const videos: Video[] = [
  { id: "L2z70lLVVMY",      title: "Godrej Palm Retreat — Full Property Tour | Sector 150 Noida", views: "1.2L", duration: "12:34", category: "Property Tour",   tag: "Popular",    date: "Dec 2024" },
  { id: "F760jAH67To",      title: "Top 5 Investment Hotspots in NCR 2024 | Expert Analysis",      views: "87K",  duration: "18:20", category: "Investment Tips", tag: "Trending",   date: "Nov 2024" },
  { id: "CH2ts-nqwhQ",      title: "ACE Golfshire Launch — Sector 150 Noida Walkthrough",          views: "54K",  duration: "9:45",  category: "Property Tour",                      date: "Nov 2024" },
  { id: "L2z70lLVVMY",      title: "Yamuna Expressway — Should You Invest in 2024?",               views: "1.1L", duration: "22:10", category: "Market Update",   tag: "Must Watch", date: "Oct 2024" },
  { id: "mHxXjblKewg",      title: "First Time Home Buyer's Complete Guide — NCR 2024",            views: "2.3L", duration: "31:05", category: "Buyer's Guide",   tag: "Popular",    date: "Oct 2024" },
  { id: "syVtCZHrNKg",      title: "Dasnac Westminster Tower — Luxury Penthouse Walkthrough",      views: "43K",  duration: "14:22", category: "Property Tour",                      date: "Sep 2024" },
  { id: "sgtrIG73nsc",      title: "Greater Noida vs Noida Extension — Complete Comparison",       views: "98K",  duration: "16:48", category: "Market Update",   tag: "Trending",   date: "Sep 2024" },
  { id: "0gcJCa4KAYcqIYzv", title: "RERA Rules Every Buyer Must Know Before Signing",              views: "1.8L", duration: "25:33", category: "Buyer's Guide",                      date: "Aug 2024" },
  { id: "kJA8BJkk57g",      title: "Gurugram Sector 56 — Hidden Gem for Investors",               views: "61K",  duration: "11:19", category: "Investment Tips",                    date: "Aug 2024" },
];

const DEFAULT_HERO = {
  id: "bbehxoGsut0",
  title: "Delhi NCR Real Estate Market Report 2024 — Complete Analysis & Forecast",
  views: "3.1L", duration: "45:12", date: "Dec 2024",
  desc: "Deep dive into NCR's property trends, price movements across Noida, Gurugram, Faridabad & Ghaziabad with expert commentary.",
};

const tagStyle: Record<string, { bg: string; color: string }> = {
  "Popular":    { bg: "rgba(107,58,31,0.12)", color: "#6B3A1F"  },
  "Trending":   { bg: "rgba(201,168,76,0.18)", color: "#8B6914" },
  "Must Watch": { bg: "rgba(220,38,38,0.11)",  color: "#b91c1c" },
  "New":        { bg: "rgba(5,150,105,0.11)",  color: "#059669" },
};

const thumb = (id: string, q: "maxresdefault" | "hqdefault" = "hqdefault") =>
  `https://img.youtube.com/vi/${id}/${q}.jpg`;

// ─── Small Video Row (Up Next panel) ─────────────────────
function VideoRow({ video, active, onClick }: { video: Video; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: active ? "rgba(107,58,31,0.07)" : "transparent",
        border: `1px solid ${active ? "rgba(107,58,31,0.15)" : "transparent"}`,
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "rgba(107,58,31,0.04)" }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
    >
      {/* Thumb */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-lg" style={{ width: "80px", height: "52px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(video.id)} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.40)" }}
        >
          <div className="flex items-center justify-center rounded-full" style={{ width: "26px", height: "26px", background: "rgba(255,0,0,0.90)" }}>
            <Play size={10} style={{ color: "#fff", fill: "#fff", marginLeft: "1px" }} />
          </div>
        </div>
        <div className="absolute bottom-1 right-1 px-1 py-px rounded text-[8px] font-black text-white" style={{ background: "rgba(0,0,0,0.72)" }}>
          {video.duration}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold leading-snug line-clamp-2 transition-colors duration-200" style={{ fontSize: "11px", color: active ? "#6B3A1F" : "#1C0F05" }}>
          {video.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span style={{ fontSize: "9px", color: "#A8978A", fontWeight: 600 }}>{video.views} views</span>
          <span style={{ fontSize: "9px", color: "#C9A84C" }}>·</span>
          <span style={{ fontSize: "9px", color: "#A8978A", fontWeight: 600 }}>{video.date}</span>
        </div>
      </div>

      {active ? (
        <div className="flex-shrink-0 w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, #6B3A1F, #C9A84C)" }} />
      ) : (
        <Play size={10} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: "#6B3A1F", fill: "#6B3A1F" }} />
      )}
    </div>
  );
}

// ─── Slider VideoCard ─────────────────────────────────────
function VideoCard({ video }: { video: Video }) {
  const [hov, setHov] = useState(false);
  const tag = video.tag ? tagStyle[video.tag] : null;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-[#EDE5DD] transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 2px 12px rgba(107,58,31,0.07)" }}
      onMouseEnter={e => { setHov(true); (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(107,58,31,0.14)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.30)" }}
      onMouseLeave={e => { setHov(false); (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(107,58,31,0.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = "#EDE5DD" }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(video.id)} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full transition-all duration-300" style={{ width: hov ? "46px" : "38px", height: hov ? "46px" : "38px", background: hov ? "#FF0000" : "rgba(255,255,255,0.92)", boxShadow: hov ? "0 6px 22px rgba(255,0,0,0.45)" : "0 3px 12px rgba(0,0,0,0.22)" }}>
            <Play size={hov ? 17 : 14} style={{ color: hov ? "#fff" : "#1C0F05", fill: hov ? "#fff" : "#1C0F05", marginLeft: "2px" }} />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded font-black text-[9px] text-white" style={{ background: "rgba(0,0,0,0.75)" }}>{video.duration}</div>
        {tag && video.tag && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-black text-[8px]" style={{ background: tag.bg, color: tag.color }}>{video.tag}</div>
        )}
      </div>
      <div className="p-3">
        <p className="font-display font-bold text-[#1C0F05] text-xs leading-snug line-clamp-2 group-hover:text-[#6B3A1F] transition-colors mb-2">{video.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 text-[9px] font-semibold text-[#A8978A]"><Eye size={9} /> {video.views}</span>
            <span className="flex items-center gap-1 text-[9px] font-semibold text-[#A8978A]"><Clock size={9} /> {video.duration}</span>
          </div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(107,58,31,0.07)", color: "#6B3A1F" }}>{video.category}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────
export default function YoutubeSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ── Playlist search state ─────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentHero = activeIdx !== null ? videos[activeIdx] : DEFAULT_HERO;

  const handleUpNextClick = (idx: number) => {
    // idx here refers to index in the FULL videos array
    setActiveIdx(idx);
    setIsPlaying(true);
  };

  // Filter playlist by search query
  const playlistVideos = searchQuery.trim()
    ? videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : videos;

  const filtered = activeCategory === "All" ? videos : videos.filter(v => v.category === activeCategory);

  return (
    <section className="py-8 sm:py-6 lg:py-8" style={{ background: "hsl(40,40%,97%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ HEADER ══ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4" style={{ background: "rgba(255,0,0,0.07)", border: "1px solid rgba(255,0,0,0.14)" }}>
              <Youtube size={11} style={{ color: "#FF0000" }} />
              <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.24em", textTransform: "uppercase", color: "#cc0000" }}>YouTube · 500+ Videos</span>
            </div>
            <h2 className="font-display font-bold text-[#1C0F05] text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Property Insights{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>& Expert Advice</span>
            </h2>
            <p className="text-[#A8978A] text-sm mt-1.5 font-medium">Tours, market analysis, investment guides — new videos every week.</p>
          </div>
          <a
            href="https://www.youtube.com/@the_nestory" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 self-end flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.97]"
            style={{ background: "#FF0000", color: "#fff", boxShadow: "0 4px 18px rgba(255,0,0,0.28)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(255,0,0,0.40)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 18px rgba(255,0,0,0.28)" }}
          >
            <Youtube size={15} /> Subscribe
          </a>
        </div>

        {/* ══ MAIN 2-COLUMN BLOCK ══ */}
        <div className="overflow-hidden mb-8 sm:mb-10" style={{ background: "#fff", borderRadius: "24px", border: "1px solid #EDE5DD", boxShadow: "0 4px 32px rgba(107,58,31,0.09)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* ── LEFT: Hero Player ── */}
            <div className="lg:col-span-7 relative">
              {isPlaying ? (
                <iframe
                  key={currentHero.id}
                  className="w-full"
                  style={{ aspectRatio: "16/9", display: "block" }}
                  src={`https://www.youtube.com/embed/${currentHero.id}?autoplay=1&rel=0`}
                  title={currentHero.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="group relative cursor-pointer overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                  onClick={() => setIsPlaying(true)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={currentHero.id}
                    src={thumb(currentHero.id, "maxresdefault")}
                    alt={currentHero.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(175deg, rgba(10,5,2,0) 30%, rgba(10,5,2,0.80) 100%)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110" style={{ width: "68px", height: "68px", background: "rgba(255,0,0,0.92)", boxShadow: "0 8px 36px rgba(255,0,0,0.55)" }}>
                      <Play size={28} style={{ color: "#fff", fill: "#fff", marginLeft: "3px" }} />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded font-black text-[11px] text-white" style={{ background: "rgba(0,0,0,0.72)" }}>{currentHero.duration}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <div className="mb-1 h-[2px] w-8 rounded-full" style={{ background: "#C9A84C" }} />
                    <h3 className="font-display font-black text-white leading-snug line-clamp-2" style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.2rem)" }}>
                      {currentHero.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-white/55"><Eye size={11} /> {currentHero.views}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-white/55"><Clock size={11} /> {currentHero.duration}</span>
                      <span className="text-xs font-semibold text-white/55">{currentHero.date}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Below player — meta */}
              <div className="p-4 sm:p-5" style={{ borderTop: "1px solid #F5EFE7" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2" style={{ background: "rgba(107,58,31,0.08)", border: "1px solid rgba(107,58,31,0.12)" }}>
                      <span style={{ fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B3A1F" }}>
                        {activeIdx !== null ? "▶ Now Playing" : "⭐ Editor's Pick"}
                      </span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed line-clamp-2" style={{ color: "#7A6858", maxWidth: "420px" }}>
                      {"desc" in currentHero
                        ? (currentHero as typeof DEFAULT_HERO).desc
                        : currentHero.title}
                    </p>
                  </div>
                  <a
                    href={`https://youtube.com/watch?v=${currentHero.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "#FF0000", color: "#fff", boxShadow: "0 3px 12px rgba(255,0,0,0.28)" }}
                  >
                    Watch <ArrowUpRight size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Up Next Playlist ── */}
            <div className="lg:col-span-5 flex flex-col" style={{ borderLeft: "1px solid #F5EFE7" }}>

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0" style={{ borderBottom: "1px solid #F5EFE7" }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-black text-[11px] tracking-[0.18em] uppercase" style={{ color: "#A8978A" }}>Up Next</span>
                  <div className="px-2 py-0.5 rounded-full text-[9px] font-black" style={{ background: "rgba(107,58,31,0.07)", color: "#6B3A1F" }}>
                    {playlistVideos.length} video{playlistVideos.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <a href="https://www.youtube.com/@the_nestory" target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-bold flex items-center gap-0.5 hover:gap-1.5 transition-all duration-200" style={{ color: "#6B3A1F" }}>
                  View All <ArrowRight size={10} />
                </a>
              </div>

              {/* ── Search bar ── */}
              <div className="px-3 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid #F5EFE7" }}>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                  style={{
                    background: searchFocused ? "#fff" : "rgba(107,58,31,0.04)",
                    border: `1.5px solid ${searchFocused ? "rgba(107,58,31,0.35)" : "rgba(107,58,31,0.10)"}`,
                    boxShadow: searchFocused ? "0 0 0 3px rgba(107,58,31,0.07)" : "none",
                  }}
                >
                  <Search
                    size={13}
                    style={{
                      color: searchFocused ? "#6B3A1F" : "#A8978A",
                      flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search videos..."
                    className="flex-1 bg-transparent outline-none min-w-0"
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#1C0F05",
                      caretColor: "#6B3A1F",
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                      className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full transition-all duration-150 hover:bg-[#EDE5DD]"
                    >
                      <X size={9} style={{ color: "#A8978A" }} />
                    </button>
                  )}
                </div>

                {/* Category pills under search */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
                  {["All", "Property Tour", "Market Update", "Investment Tips", "Buyer's Guide"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSearchQuery(cat === "All" ? "" : cat)}
                      className="flex-shrink-0 px-2.5 py-1 rounded-full transition-all duration-200"
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        background:
                          (cat === "All" && !searchQuery) || searchQuery === cat
                            ? "linear-gradient(135deg,#6B3A1F,#3B1D0D)"
                            : "rgba(107,58,31,0.06)",
                        color:
                          (cat === "All" && !searchQuery) || searchQuery === cat
                            ? "#FAF6F0"
                            : "#7A6858",
                        border:
                          (cat === "All" && !searchQuery) || searchQuery === cat
                            ? "1px solid transparent"
                            : "1px solid rgba(107,58,31,0.10)",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto px-2 py-2" style={{ maxHeight: "300px" }}>
                {playlistVideos.length > 0 ? (
                  playlistVideos.map((v, i) => {
                    // find original index in full videos array for activeIdx tracking
                    const originalIdx = videos.indexOf(v);
                    return (
                      <VideoRow
                        key={i}
                        video={v}
                        active={activeIdx === originalIdx}
                        onClick={() => handleUpNextClick(originalIdx)}
                      />
                    );
                  })
                ) : (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: "rgba(107,58,31,0.07)" }}
                    >
                      <Search size={16} style={{ color: "#A8978A" }} />
                    </div>
                    <p className="font-bold text-[11px]" style={{ color: "#1C0F05" }}>
                      No videos found
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#A8978A" }}>
                      Try a different keyword
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-3 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200"
                      style={{ background: "rgba(107,58,31,0.08)", color: "#6B3A1F", border: "1px solid rgba(107,58,31,0.12)" }}
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ══ CATEGORY TABS + SLIDER ══ */}
        <div className="flex items-center gap-2 flex-wrap mb-5 hidden">
          {categories.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 active:scale-[0.96]"
              style={
                activeCategory === label
                  ? { background: "linear-gradient(135deg,#6B3A1F,#3B1D0D)", color: "#FAF6F0", boxShadow: "0 3px 12px rgba(107,58,31,0.26)" }
                  : { background: "#fff", color: "#7A6858", border: "1px solid #EDE5DD" }
              }
            >
              {icon} {label}
            </button>
          ))}
          <span className="ml-auto text-[11px] font-semibold" style={{ color: "#A8978A" }}>{filtered.length} video{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="relative hidden">
          <button ref={prevRef} className="yt-slider-prev absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#EDE5DD] shadow-[0_2px_12px_rgba(107,58,31,0.12)] flex items-center justify-center text-[#6B5C4E] hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F] hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)] active:scale-90 transition-all duration-200">
            <ChevronLeft size={18} />
          </button>
          <button ref={nextRef} className="yt-slider-next absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#EDE5DD] shadow-[0_2px_12px_rgba(107,58,31,0.12)] flex items-center justify-center text-[#6B5C4E] hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F] hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)] active:scale-90 transition-all duration-200">
            <ChevronRight size={18} />
          </button>
          <Swiper
            key={activeCategory}
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ nextEl: ".yt-slider-next", prevEl: ".yt-slider-prev" }}
            breakpoints={{
              0:    { slidesPerView: 1.15, spaceBetween: 12 },
              480:  { slidesPerView: 1.7,  spaceBetween: 14 },
              640:  { slidesPerView: 2.2,  spaceBetween: 16 },
              768:  { slidesPerView: 2.8,  spaceBetween: 16 },
              1024: { slidesPerView: 3.5,  spaceBetween: 20 },
              1280: { slidesPerView: 4,    spaceBetween: 20 },
            }}
            style={{ padding: "4px 2px 10px" }}
          >
            {filtered.map((video, i) => (
              <SwiperSlide key={i}><VideoCard video={video} /></SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ══ BOTTOM ══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 hidden">
          <a href="https://www.youtube.com/@the_nestory" target="_blank" rel="noopener noreferrer"
            className="sm:hidden inline-flex items-center gap-2 w-full justify-center px-6 py-3 rounded-xl font-bold text-sm active:scale-[0.97] transition-all"
            style={{ background: "#FF0000", color: "#fff", boxShadow: "0 4px 18px rgba(255,0,0,0.28)" }}>
            <Youtube size={16} /> Subscribe to Our Channel
          </a>
          <a href="https://www.youtube.com/@the_nestory" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EDE5DD] bg-white text-[#6B3A1F] font-bold text-sm shadow-[0_2px_8px_rgba(107,58,31,0.08)] hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F] hover:shadow-[0_4px_16px_rgba(107,58,31,0.25)] active:scale-[0.97] transition-all duration-200">
            View All 500+ Videos <ArrowRight size={15} />
          </a>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(107,58,31,0.06)", border: "1px solid rgba(107,58,31,0.1)" }}>
              <Users size={10} style={{ color: "#6B3A1F" }} /><span className="text-[10px] font-bold" style={{ color: "#6B3A1F" }}>48K+ Subscribers</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(107,58,31,0.06)", border: "1px solid rgba(107,58,31,0.1)" }}>
              <Eye size={10} style={{ color: "#6B3A1F" }} /><span className="text-[10px] font-bold" style={{ color: "#6B3A1F" }}>2.4M+ Views</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}