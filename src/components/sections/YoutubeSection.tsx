"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  Play, Youtube, ChevronLeft, ChevronRight,
  ArrowRight, Eye, Clock, Users, TrendingUp,
  BookOpen, Landmark, BarChart2, Compass, ArrowUpRight,
  Search, X
} from "lucide-react";

import "swiper/css";

import { videosApi } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────
interface Video {
  _id: string;
  title: string;
  videoId: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: number;
  isEditorPick: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
}

// ─── Data ────────────────────────────────────────────────
const categories = [
  { label: "All",              icon: <Compass size={12} />    },
  { label: "Property Tour",   icon: <Landmark size={12} />   },
  { label: "Market Update",   icon: <BarChart2 size={12} />  },
  { label: "Investment Tips", icon: <TrendingUp size={12} /> },
  { label: "Buyer's Guide",   icon: <BookOpen size={12} />   },
];

const tagStyle: Record<string, { bg: string; color: string }> = {
  "Popular":    { bg: "rgba(107,58,31,0.12)", color: "#6B3A1F"  },
  "Trending":   { bg: "rgba(201,168,76,0.18)", color: "#8B6914" },
  "Must Watch": { bg: "rgba(220,38,38,0.11)",  color: "#b91c1c" },
  "New":        { bg: "rgba(5,150,105,0.11)",  color: "#059669" },
};

const thumb = (videoId: string, quality: "maxresdefault" | "hqdefault" = "hqdefault") =>
  `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

// ─── Small Video Row (Up Next panel) ─────────────────────
function VideoRow({ video, active, onClick }: { video: Video; active: boolean; onClick: () => void }) {
  const formatViews = (views: number) => {
    if (views >= 100000) return `${(views / 100000).toFixed(1)}L`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

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
        <img src={thumb(video.videoId)} alt={video.title} className="w-full h-full object-cover" />
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
          <span style={{ fontSize: "9px", color: "#A8978A", fontWeight: 600 }}>{formatViews(video.views)} views</span>
          <span style={{ fontSize: "9px", color: "#C9A84C" }}>·</span>
          <span style={{ fontSize: "9px", color: "#A8978A", fontWeight: 600 }}>{formatDate(video.createdAt)}</span>
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

// ─── Main Section ─────────────────────────────────────────
export default function YoutubeSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videosApi.getAll({ limit: 50 });
        
        let videosData = [];
        if (response.videos) {
          videosData = response.videos;
        } else if (response.data) {
          videosData = response.data;
        } else if (Array.isArray(response)) {
          videosData = response;
        }
        
        setVideos(videosData);
        
        // Set first video as default if available
        if (videosData.length > 0 && activeIdx === null) {
          setActiveIdx(0);
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);

  // Update active index when videos load
  useEffect(() => {
    if (videos.length > 0 && activeIdx === null) {
      setActiveIdx(0);
    }
  }, [videos, activeIdx]);

  const currentHero = activeIdx !== null && videos[activeIdx] ? videos[activeIdx] : videos[0];
  const editorPickVideo = videos.find(v => v.isEditorPick) || videos[0];

  const handleUpNextClick = (idx: number) => {
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

  const filtered = activeCategory === "All" 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  if (loading || videos.length === 0) {
    return (
      <section className="py-8 sm:py-6 lg:py-8" style={{ background: "hsl(40,40%,97%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-64 bg-gray-200 rounded-2xl mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const formatViews = (views: number) => {
    if (views >= 100000) return `${(views / 100000).toFixed(1)}L`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  return (
    <section className="py-8 sm:py-6 lg:py-8" style={{ background: "hsl(40,40%,97%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ HEADER ══ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4" style={{ background: "rgba(255,0,0,0.07)", border: "1px solid rgba(255,0,0,0.14)" }}>
              <Youtube size={11} style={{ color: "#FF0000" }} />
              <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.24em", textTransform: "uppercase", color: "#cc0000" }}>YouTube · {videos.length}+ Videos</span>
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
              {isPlaying && currentHero ? (
                <iframe
                  key={currentHero.videoId}
                  className="w-full"
                  style={{ aspectRatio: "16/9", display: "block" }}
                  src={`https://www.youtube.com/embed/${currentHero.videoId}?autoplay=1&rel=0`}
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
                  <img
                    key={currentHero?.videoId}
                    src={thumb(currentHero?.videoId, "maxresdefault")}
                    alt={currentHero?.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(175deg, rgba(10,5,2,0) 30%, rgba(10,5,2,0.80) 100%)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110" style={{ width: "68px", height: "68px", background: "rgba(255,0,0,0.92)", boxShadow: "0 8px 36px rgba(255,0,0,0.55)" }}>
                      <Play size={28} style={{ color: "#fff", fill: "#fff", marginLeft: "3px" }} />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded font-black text-[11px] text-white" style={{ background: "rgba(0,0,0,0.72)" }}>{currentHero?.duration}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <div className="mb-1 h-[2px] w-8 rounded-full" style={{ background: "#C9A84C" }} />
                    <h3 className="font-display font-black text-white leading-snug line-clamp-2" style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.2rem)" }}>
                      {currentHero?.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-white/55"><Eye size={11} /> {formatViews(currentHero?.views || 0)}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-white/55"><Clock size={11} /> {currentHero?.duration}</span>
                      <span className="text-xs font-semibold text-white/55">{formatDate(currentHero?.createdAt)}</span>
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
                        {activeIdx !== null ? "▶ Now Playing" : (currentHero?.isEditorPick ? "⭐ Editor's Pick" : "Featured Video")}
                      </span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed line-clamp-2" style={{ color: "#7A6858", maxWidth: "420px" }}>
                      {currentHero?.description || currentHero?.title}
                    </p>
                  </div>
                  <a
                    href={`https://youtube.com/watch?v=${currentHero?.videoId}`}
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
                    const originalIdx = videos.findIndex(video => video._id === v._id);
                    return (
                      <VideoRow
                        key={v._id}
                        video={v}
                        active={activeIdx === originalIdx}
                        onClick={() => handleUpNextClick(originalIdx)}
                      />
                    );
                  })
                ) : (
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

        {/* ══ BOTTOM ══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <a href="https://www.youtube.com/@the_nestory" target="_blank" rel="noopener noreferrer"
            className="sm:hidden inline-flex items-center gap-2 w-full justify-center px-6 py-3 rounded-xl font-bold text-sm active:scale-[0.97] transition-all"
            style={{ background: "#FF0000", color: "#fff", boxShadow: "0 4px 18px rgba(255,0,0,0.28)" }}>
            <Youtube size={16} /> Subscribe to Our Channel
          </a>
          <a href="https://www.youtube.com/@the_nestory" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EDE5DD] bg-white text-[#6B3A1F] font-bold text-sm shadow-[0_2px_8px_rgba(107,58,31,0.08)] hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F] hover:shadow-[0_4px_16px_rgba(107,58,31,0.25)] active:scale-[0.97] transition-all duration-200">
            View All {videos.length}+ Videos <ArrowRight size={15} />
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