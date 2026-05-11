"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import {
  MapPin, CheckCircle2, XCircle, ChevronDown, BarChart2,
  ArrowRight, Sparkles, Building2, Shield, Zap, Trophy,
  X, ExternalLink, Plus, ChevronRight, Star, Search,
  BedDouble, Maximize2, Calendar, Bath, Car, Layers,
  ChevronLeft, ChevronRight as ChevronRightIcon, Eye, Heart,
  Home, BadgeCheck, CalendarCheck, Users, TrendingUp, Clock
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { projectsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ─────────────────────────────────────────
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
  description?: string;
  amenities?: Array<{ label: string; icon: string; cat: string }>;
  nearby?: Array<{ type: string; name: string; dist: string; icon: string }>;
  units?: Array<{ bhk: string; area: string; price: string; floors: string; image: string }>;
}

const STATUS_CFG: Record<string,{bg:string;text:string;dot:string}> = {
  "New Launch":         {bg:"bg-[#6B3A1F]/10 border border-[#6B3A1F]/20",text:"text-[#6B3A1F]",   dot:"bg-[#6B3A1F]"},
  "Ready To Move":      {bg:"bg-emerald-50 border border-emerald-200",    text:"text-emerald-700",dot:"bg-emerald-500"},
  "Under Construction": {bg:"bg-amber-50 border border-amber-200",        text:"text-amber-700",  dot:"bg-amber-500"},
  "Upcoming":           {bg:"bg-blue-50 border border-blue-200",          text:"text-blue-700",   dot:"bg-blue-500"},
};

// Helper to calculate score
function calculateScore(project: Project): number {
  let score = 70;
  if (project.status === "Ready To Move") score += 10;
  if (project.status === "New Launch") score += 5;
  if (project.reraNo) score += 10;
  if (project.isVerified) score += 5;
  if (project.rating && project.rating >= 4.5) score += 5;
  if (project.highlights && project.highlights.length >= 5) score += 5;
  if (project.totalUnits && project.totalUnits > 500) score += 5;
  return Math.min(score, 100);
}

// ─── Image Carousel Component (Same as ProjectDetailPage) ──────────────────
function ProjectImageCarousel({ images, title }: { images: ProjectImage[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const validImages = images.filter(img => img?.url);

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

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {validImages.length > 1 && (
        <div className="absolute top-3 right-12 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
          {currentIndex + 1}/{validImages.length}
        </div>
      )}

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
            <ChevronRightIcon size={14} />
          </button>
        </>
      )}

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

// ─── Score Ring ───────────────────────────────────────────
function ScoreRing({ score, gold, size=56 }: { score:number; gold?:boolean; size?:number }) {
  const r = size*0.39, c = 2*Math.PI*r;
  const color = gold ? "#C9A84C" : "#6B3A1F";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0EBE4" strokeWidth={size*0.09}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.09}
        strokeDasharray={`${(score/100)*c} ${c}`} strokeLinecap="round"/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size*0.22} fontWeight="600"
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}>
        {score}
      </text>
    </svg>
  );
}

// ─── Picker Sheet with Search ─────────────────────────────
function PickerSheet({ onSelect, exclude, onClose, label, projects }: {
  onSelect:(p:Project)=>void; exclude:string[]; onClose:()=>void; label:string;
  projects: Project[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = useMemo(() => {
    const avail = projects.filter(p => !exclude.includes(p._id));
    if (!searchQuery.trim()) return avail;
    const query = searchQuery.toLowerCase();
    return avail.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.builder?.name?.toLowerCase().includes(query) ||
      p.bhk?.some(b => b.toLowerCase().includes(query))
    );
  }, [searchQuery, exclude, projects]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-[#D4C4B0]"/>
        </div>
        <div className="flex items-center justify-between px-5 pb-3">
          <h3 className="font-display font-bold text-[#1C0F05] text-lg">Choose {label}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5EFE8] flex items-center justify-center">
            <X size={15} className="text-[#6B3A1F]"/>
          </button>
        </div>
        
        <div className="px-5 pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A]" />
            <input
              type="text"
              autoFocus
              placeholder="Search by name, location, builder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE5DD] bg-[#FAF8F4] text-sm outline-none focus:border-[#6B3A1F] focus:ring-2 focus:ring-[#6B3A1F]/20"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 px-4 pb-6 space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <Search size={32} className="text-[#EDE5DD] mx-auto mb-2" />
              <p className="text-[#A8978A] text-sm">No projects found</p>
            </div>
          ) : (
            filteredProjects.map(p => {
              const sc = STATUS_CFG[p.status];
              const primaryImage = p.images?.find(img => img.isPrimary) || p.images?.[0];
              return (
                <button key={p._id} onClick={() => { onSelect(p); onClose(); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#EDE5DD]
                    bg-white hover:border-[#6B3A1F] hover:bg-[#FAF8F4] active:scale-[0.98]
                    transition-all duration-200 text-left">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    {primaryImage ? (
                      <img src={getImageUrl(primaryImage.url)} alt={p.title} className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full bg-[#F5EFE8] flex items-center justify-center">
                        <Building2 size={24} className="text-[#A8978A]"/>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold mb-1 ${sc.bg} ${sc.text}`}>
                      <span className={`w-1 h-1 rounded-full ${sc.dot}`}/>{p.status}
                    </span>
                    <p className="font-bold text-[#1C0F05] text-sm truncate">{p.title}</p>
                    <p className="text-[#A8978A] text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={9}/>{p.location}
                    </p>
                    <p className="text-[#6B3A1F] text-xs font-semibold mt-0.5">{p.priceLabel}</p>
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <ScoreRing score={calculateScore(p)} size={40}/>
                    <p className="text-[8px] text-[#A8978A] mt-0.5">Score</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Dropdown ─────────────────────────────────────
function DesktopSelector({ selected, onSelect, exclude, label, projects }: {
  selected:Project|null; onSelect:(p:Project)=>void; exclude:string[]; label:string;
  projects: Project[];
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = useMemo(() => {
    const avail = projects.filter(p => !exclude.includes(p._id));
    if (!searchQuery.trim()) return avail;
    const query = searchQuery.toLowerCase();
    return avail.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.builder?.name?.toLowerCase().includes(query)
    );
  }, [searchQuery, exclude, projects]);

  const primaryImage = selected?.images?.find(img => img.isPrimary) || selected?.images?.[0];

  return (
    <div className="relative hidden sm:block">
      <button onClick={() => { setOpen(v=>!v); setSearchQuery(""); }}
        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all
          ${selected
            ? "border-[#6B3A1F] bg-white shadow-[0_2px_12px_rgba(107,58,31,0.08)]"
            : "border-dashed border-[#D4C4B0] bg-[#FAF8F4] hover:border-[#6B3A1F]/60"}`}>
        {selected ? (
          <>
            <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
              {primaryImage ? (
                <img src={getImageUrl(primaryImage.url)} alt={selected.title} className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full bg-[#F5EFE8] flex items-center justify-center">
                  <Building2 size={18} className="text-[#A8978A]"/>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1C0F05] text-sm truncate">{selected.title}</p>
              <p className="text-[#A8978A] text-[11px] flex items-center gap-1 mt-0.5 truncate">
                <MapPin size={9}/>{selected.location}
              </p>
            </div>
            <ChevronDown size={15} className={`text-[#A8978A] flex-shrink-0 transition-transform ${open?"rotate-180":""}`}/>
          </>
        ) : (
          <>
            <div className="w-11 h-11 rounded-xl bg-[#F0EBE4] flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-[#A8978A]"/>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#6B3A1F]">{label}</p>
              <p className="text-[11px] text-[#A8978A] mt-0.5">Click to search & select</p>
            </div>
            <Search size={14} className="text-[#6B3A1F] ml-auto"/>
          </>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)}/>
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDE5DD]
            rounded-2xl shadow-[0_12px_40px_rgba(107,58,31,0.15)] z-40 overflow-hidden">
            <div className="p-3 border-b border-[#F0EBE4]">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A]" />
                <input
                  type="text"
                  autoFocus
                  placeholder={`Search ${label} by name, location, builder...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EDE5DD] bg-[#FAF8F4] text-sm outline-none focus:border-[#6B3A1F]"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-6">
                  <Search size={24} className="text-[#EDE5DD] mx-auto mb-2" />
                  <p className="text-[#A8978A] text-xs">No projects found</p>
                </div>
              ) : (
                filteredProjects.map(p => {
                  const img = p.images?.find(i => i.isPrimary) || p.images?.[0];
                  return (
                    <button key={p._id} onClick={() => { onSelect(p); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF8F4] transition-colors
                        border-b border-[#F5EFE8] last:border-0 text-left">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        {img ? (
                          <img src={getImageUrl(img.url)} alt={p.title} className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-full h-full bg-[#F5EFE8] flex items-center justify-center">
                            <Building2 size={14} className="text-[#A8978A]"/>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1C0F05] text-sm truncate">{p.title}</p>
                        <p className="text-[#A8978A] text-[11px] truncate">{p.location}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_CFG[p.status].bg} ${STATUS_CFG[p.status].text}`}>
                        {p.status}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[hsl(38,45%,97%)] py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_44px_1fr] gap-4 mb-8">
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="hidden lg:block w-10 h-10 bg-gray-200 rounded-full animate-pulse mx-auto" />
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Project Compare Card ─────────────────────────────────
function ProjectCompareCard({ project, isWinner, onClear, score }: { 
  project: Project; isWinner: boolean; onClear: () => void; score: number;
}) {
  const sc = STATUS_CFG[project.status];
  const bhkText = project.bhk?.slice(0, 3).join(", ") || "2, 3, 4 BHK";
  const possessionYear = project.possessionDate ? new Date(project.possessionDate).getFullYear() : "2026";
  
  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all ${isWinner ? "border-2 border-[#C9A84C] shadow-[0_8px_28px_rgba(201,168,76,0.18)]" : "border border-[#EDE5DD] shadow-[0_2px_12px_rgba(107,58,31,0.06)]"}`}>
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <ProjectImageCarousel images={project.images || []} title={project.title} />
        
        {isWinner && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C9A84C] text-[#1C0F05] text-[9px] font-black shadow-md">
            <Trophy size={10}/> Nestory Pick
          </div>
        )}
        
        <button onClick={onClear} className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-all">
          <X size={12}/>
        </button>
        
        <div className="absolute bottom-3 left-3 z-20">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${sc.bg} ${sc.text}`}>
            <span className={`w-1 h-1 rounded-full ${sc.dot}`}/>{project.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <Link href={`/projects/${project.slug}`} className="group inline-flex items-center gap-1">
              <h3 className="font-display font-bold text-[#1C0F05] text-base sm:text-lg group-hover:text-[#6B3A1F] transition-colors line-clamp-1">
                {project.title}
              </h3>
              <ArrowRight size={14} className="text-[#6B3A1F] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"/>
            </Link>
            <p className="text-[11px] text-[#A8978A] flex items-center gap-1 mt-1">
              <Building2 size={10} className="text-[#C9A84C]"/> by {project.builder?.name || "Top Builder"}
            </p>
          </div>
          <ScoreRing score={score} gold={isWinner} size={52}/>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          <div className="bg-[#FAF7F4] rounded-xl p-2 text-center">
            <p className="font-black text-[#1C0F05] text-[11px] truncate">{project.priceLabel?.split("–")[0]}+</p>
            <p className="text-[8px] text-[#A8978A] uppercase">Price</p>
          </div>
          <div className="bg-[#FAF7F4] rounded-xl p-2 text-center">
            <p className="font-black text-[#1C0F05] text-[11px]">{possessionYear}</p>
            <p className="text-[8px] text-[#A8978A] uppercase">Possession</p>
          </div>
          <div className="bg-[#FAF7F4] rounded-xl p-2 text-center">
            <p className="font-black text-[#1C0F05] text-[11px]">★ {project.rating || 4.0}</p>
            <p className="text-[8px] text-[#A8978A] uppercase">Rating</p>
          </div>
        </div>
        
        {project.highlights && project.highlights.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {project.highlights.slice(0, 2).map(h => (
              <div key={h} className="flex items-center gap-2 text-[10px] text-[#4A3728]">
                <Sparkles size={10} className="text-[#C9A84C] flex-shrink-0"/>{h}
              </div>
            ))}
          </div>
        )}
        
        <Link href={`/projects/${project.slug}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] font-bold text-[11px] hover:-translate-y-0.5 transition-all">
          View Full Details <Eye size={12}/>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function CompareProjects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pA, setPA] = useState<Project|null>(null);
  const [pB, setPB] = useState<Project|null>(null);
  const [tab, setTab] = useState<"overview"|"amenities"|"location"|"price">("overview");
  const [sheetFor, setSheetFor] = useState<"A"|"B"|null>(null);
  const [mobileView, setMobileView] = useState<"cards"|"compare">("cards");

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getAll({ limit: 50 });
        
        let projectsData = [];
        if (response.projects) {
          projectsData = response.projects;
        } else if (response.data) {
          projectsData = response.data;
        } else if (Array.isArray(response)) {
          projectsData = response;
        }

        console.log('proje',response);

        setAllProjects(projectsData);

        const slug1 = searchParams.get("project1");
        const slug2 = searchParams.get("project2");
        
        if (slug1) {
          const found = projectsData.find((p: Project) => p.slug === slug1);
          if (found) setPA(found);
        }
        if (slug2) {
          const found = projectsData.find((p: Project) => p.slug === slug2);
          if (found) setPB(found);
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchParams]);

  const syncUrl = useCallback((key:"project1"|"project2", slug:string|null) => {
    const q = new URLSearchParams(searchParams.toString());
    if (slug) q.set(key,slug); else q.delete(key);
    const s = q.toString();
    router.replace(`/compare-projects${s?`?${s}`:""}`,{scroll:false});
  },[router,searchParams]);

  const pickA = (p:Project) => { setPA(p); syncUrl("project1",p.slug); };
  const pickB = (p:Project) => { setPB(p); syncUrl("project2",p.slug); };
  const clearA = () => { setPA(null); syncUrl("project1",null); };
  const clearB = () => { setPB(null); syncUrl("project2",null); };

  const canCompare = pA && pB;
  const scoreA = pA ? calculateScore(pA) : 0;
  const scoreB = pB ? calculateScore(pB) : 0;
  const winner = canCompare ? (scoreA > scoreB ? pA : scoreB > scoreA ? pB : null) : null;

  // Amenities list for comparison - dynamic from projects
  const getAllAmenities = () => {
    const amenitiesSet = new Set<string>();
    if (pA?.amenities) pA.amenities.forEach(a => amenitiesSet.add(a.label));
    if (pB?.amenities) pB.amenities.forEach(a => amenitiesSet.add(a.label));
    return Array.from(amenitiesSet);
  };

  const getAmenityStatus = (project: Project | null, amenityLabel: string) => {
    if (!project?.amenities) return false;
    return project.amenities.some(a => a.label === amenityLabel);
  };

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(38,45%,97%)]">
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
    <section className="min-h-screen bg-[hsl(38,45%,97%)] py-8 sm:py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-[#6B3A1F]/8 border border-[#6B3A1F]/15">
            <BarChart2 size={11} className="text-[#6B3A1F]"/>
            <span className="text-[#6B3A1F] text-[10px] font-bold tracking-widest uppercase">Smart Comparison</span>
          </div>
          <h1 className="font-display font-bold text-[#1C0F05] text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Compare Projects{" "}
            <span className="text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(135deg,#6B3A1F,#C9A84C)"}}>
              Side by Side
            </span>
          </h1>
          <p className="text-[#A8978A] text-sm mt-3">Select two projects to see detailed comparison</p>
        </div>

        {/* Mobile View Toggle */}
        {canCompare && (
          <div className="flex lg:hidden justify-center gap-2 mb-4">
            <button onClick={() => setMobileView("cards")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mobileView === "cards" ? "bg-[#6B3A1F] text-white" : "bg-white text-[#6B3A1F] border border-[#EDE5DD]"}`}>
              Project Cards
            </button>
            <button onClick={() => setMobileView("compare")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mobileView === "compare" ? "bg-[#6B3A1F] text-white" : "bg-white text-[#6B3A1F] border border-[#EDE5DD]"}`}>
              Compare Table
            </button>
          </div>
        )}

        {/* Desktop Selectors */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_60px_1fr] gap-6 mb-10">
          <DesktopSelector selected={pA} onSelect={pickA} exclude={[pB?._id ?? ""]} label="Project A" projects={allProjects}/>
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-black">VS</span>
            </div>
          </div>
          <DesktopSelector selected={pB} onSelect={pickB} exclude={[pA?._id ?? ""]} label="Project B" projects={allProjects}/>
        </div>

        {/* Mobile Selectors */}
        <div className="lg:hidden space-y-4 mb-6">
          {/* Project A */}
          {!pA ? (
            <button onClick={() => setSheetFor("A")} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-[#C9A84C] bg-[#FDF8F4]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F5EFE8] flex items-center justify-center">
                  <Plus size={20} className="text-[#6B3A1F]"/>
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#6B3A1F]">Select Project A</p>
                  <p className="text-xs text-[#A8978A]">Tap to search</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#C9A84C]"/>
            </button>
          ) : (
            <div className={`rounded-2xl overflow-hidden border-2 ${winner?._id === pA._id ? "border-[#C9A84C]" : "border-[#EDE5DD]"}`}>
              <div className="relative h-32">
                <ProjectImageCarousel images={pA.images || []} title={pA.title} />
                {winner?._id === pA._id && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A84C] text-[#1C0F05] text-[8px] font-black">
                    <Trophy size={8}/> Pick
                  </div>
                )}
                <button onClick={clearA} className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                  <X size={12}/>
                </button>
                <div className="absolute bottom-3 left-3 z-20">
                  <p className="text-white font-bold text-sm">{pA.title}</p>
                  <p className="text-white/70 text-[10px] flex items-center gap-1"><MapPin size={8}/>{pA.location}</p>
                </div>
              </div>
              <div className="bg-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ScoreRing score={scoreA} gold={winner?._id === pA._id} size={44}/>
                  <div>
                    <p className="font-bold text-[#1C0F05] text-xs">{pA.priceLabel}</p>
                    <p className="text-[#A8978A] text-[10px]">{pA.possessionDate ? new Date(pA.possessionDate).getFullYear() : "2026"}</p>
                  </div>
                </div>
                <button onClick={() => setSheetFor("A")} className="px-3 py-1.5 rounded-xl bg-[#FAF7F4] text-[#6B3A1F] text-[11px] font-bold">Change</button>
              </div>
            </div>
          )}

          {/* VS Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#EDE5DD]"/>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] flex items-center justify-center">
              <span className="text-white text-[9px] font-black">VS</span>
            </div>
            <div className="flex-1 h-px bg-[#EDE5DD]"/>
          </div>

          {/* Project B */}
          {!pB ? (
            <button onClick={() => setSheetFor("B")} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-[#D4C4B0] bg-[#FAF8F4]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F5EFE8] flex items-center justify-center">
                  <Plus size={20} className="text-[#A8978A]"/>
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#6B5C4E]">Select Project B</p>
                  <p className="text-xs text-[#A8978A]">Tap to search</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#A8978A]"/>
            </button>
          ) : (
            <div className={`rounded-2xl overflow-hidden border-2 ${winner?._id === pB._id ? "border-[#C9A84C]" : "border-[#EDE5DD]"}`}>
              <div className="relative h-32">
                <ProjectImageCarousel images={pB.images || []} title={pB.title} />
                {winner?._id === pB._id && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A84C] text-[#1C0F05] text-[8px] font-black">
                    <Trophy size={8}/> Pick
                  </div>
                )}
                <button onClick={clearB} className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                  <X size={12}/>
                </button>
                <div className="absolute bottom-3 left-3 z-20">
                  <p className="text-white font-bold text-sm">{pB.title}</p>
                  <p className="text-white/70 text-[10px] flex items-center gap-1"><MapPin size={8}/>{pB.location}</p>
                </div>
              </div>
              <div className="bg-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ScoreRing score={scoreB} gold={winner?._id === pB._id} size={44}/>
                  <div>
                    <p className="font-bold text-[#1C0F05] text-xs">{pB.priceLabel}</p>
                    <p className="text-[#A8978A] text-[10px]">{pB.possessionDate ? new Date(pB.possessionDate).getFullYear() : "2026"}</p>
                  </div>
                </div>
                <button onClick={() => setSheetFor("B")} className="px-3 py-1.5 rounded-xl bg-[#FAF7F4] text-[#6B3A1F] text-[11px] font-bold">Change</button>
              </div>
            </div>
          )}
        </div>

        {!canCompare && (
          <div className="bg-white rounded-3xl border border-[#EDE5DD] p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F4] border border-[#EDE5DD] flex items-center justify-center mx-auto mb-4">
              <BarChart2 size={28} className="text-[#C9A84C]"/>
            </div>
            <h3 className="font-display font-semibold text-[#1C0F05] text-lg mb-2">Select 2 projects to compare</h3>
            <p className="text-[#A8978A] text-sm">Click on selectors above to search & choose projects</p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {allProjects.slice(0, 6).map(p => (
                <button key={p._id} onClick={() => !pA ? pickA(p) : (!pB && p._id !== pA?._id && pickB(p))}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD] text-xs font-semibold text-[#6B5C4E] hover:border-[#6B3A1F] hover:text-[#6B3A1F] transition-all">
                  <Building2 size={11}/>{p.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison View */}
        {canCompare && (
          <div className="mt-6 sm:mt-8">
            {/* Winner Banner */}
            {winner && (
              <div className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1C0F05] to-[#6B3A1F] shadow-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                      <Trophy size={24} className="text-[#C9A84C]"/>
                    </div>
                    <div>
                      <p className="font-bold text-white text-base sm:text-lg">{winner.title} is the Nestory Pick</p>
                      <p className="text-[#C9A84C]/80 text-xs sm:text-sm">Score {winner._id === pA._id ? scoreA : scoreB}/100 — Better value, amenities & builder track record</p>
                    </div>
                  </div>
                  <Link href={`/projects/${winner.slug}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] text-[#1C0F05] font-bold text-sm hover:bg-[#B8983A] transition-all">
                    View Project <ArrowRight size={14}/>
                  </Link>
                </div>
              </div>
            )}

            {/* Desktop Cards View */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-6 mb-8">
              <ProjectCompareCard project={pA} isWinner={winner?._id === pA._id} onClear={clearA} score={scoreA}/>
              <ProjectCompareCard project={pB} isWinner={winner?._id === pB._id} onClear={clearB} score={scoreB}/>
            </div>

            {/* Mobile Cards View */}
            {mobileView === "cards" && (
              <div className="lg:hidden space-y-4 mb-6">
                <ProjectCompareCard project={pA} isWinner={winner?._id === pA._id} onClear={clearA} score={scoreA}/>
                <ProjectCompareCard project={pB} isWinner={winner?._id === pB._id} onClear={clearB} score={scoreB}/>
              </div>
            )}

            {/* Comparison Table */}
            {(mobileView === "compare" || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
              <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg">
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-[#FAF7F4] border-b border-[#F0EBE4]">
                  <div className="px-4 py-3 border-r border-[#F0EBE4]">
                    <p className="text-[10px] font-bold text-[#A8978A] uppercase">Feature</p>
                  </div>
                  <div className="px-4 py-3 border-r border-[#F0EBE4]">
                    <p className="font-semibold text-[#1C0F05] text-sm">{pA.title}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-semibold text-[#1C0F05] text-sm">{pB.title}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#F0EBE4] overflow-x-auto">
                  {(["overview", "amenities", "location", "price"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`relative flex-shrink-0 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold capitalize transition-colors ${tab === t ? "text-[#6B3A1F]" : "text-[#888] hover:text-[#555]"}`}>
                      {t}
                      {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B3A1F] rounded-t-full"/>}
                    </button>
                  ))}
                </div>

                {/* Overview Tab */}
                {tab === "overview" && (
                  <div className="divide-y divide-[#F5EFE8]">
                    {[
                      { label: "Builder", v1: pA.builder?.name || "N/A", v2: pB.builder?.name || "N/A" },
                      { label: "Configurations", v1: pA.bhk?.join(", ") || "N/A", v2: pB.bhk?.join(", ") || "N/A" },
                      { label: "Property Type", v1: pA.propertyType, v2: pB.propertyType },
                      { label: "Area", v1: pA.area || "N/A", v2: pB.area || "N/A" },
                      { label: "Total Units", v1: pA.totalUnits?.toString() || "N/A", v2: pB.totalUnits?.toString() || "N/A" },
                      { label: "Towers", v1: pA.totalTowers?.toString() || "N/A", v2: pB.totalTowers?.toString() || "N/A" },
                      { label: "Floors", v1: pA.totalFloors?.toString() || "N/A", v2: pB.totalFloors?.toString() || "N/A" },
                      { label: "RERA", v1: pA.reraNo || "Applied", v2: pB.reraNo || "Applied" },
                      { label: "Rating", v1: `★ ${pA.rating || 4.0}`, v2: `★ ${pB.rating || 4.0}` },
                      { label: "Views", v1: `${pA.views?.toLocaleString() || 0} views`, v2: `${pB.views?.toLocaleString() || 0} views` },
                    ].map(({ label, v1, v2 }, i) => (
                      <div key={label} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-[#FAF7F4]"}`}>
                        <div className="px-4 py-3 border-r border-[#F0EBE4]">
                          <p className="text-[10px] font-bold text-[#A8978A] uppercase">{label}</p>
                        </div>
                        <div className="px-4 py-3 border-r border-[#F0EBE4]">
                          <p className="text-xs sm:text-sm text-[#1C0F05]">{v1}</p>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-xs sm:text-sm text-[#1C0F05]">{v2}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Amenities Tab */}
                {tab === "amenities" && (
                  <div className="divide-y divide-[#F5EFE8]">
                    {getAllAmenities().map((amenity, i) => (
                      <div key={amenity} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-[#FAF7F4]"}`}>
                        <div className="px-4 py-3 border-r border-[#F0EBE4]">
                          <p className="text-[10px] font-bold text-[#A8978A] uppercase">{amenity}</p>
                        </div>
                        <div className="px-4 py-3 border-r border-[#F0EBE4]">
                          {getAmenityStatus(pA, amenity) ? (
                            <CheckCircle2 size={18} className="text-emerald-500"/>
                          ) : (
                            <XCircle size={18} className="text-red-300"/>
                          )}
                        </div>
                        <div className="px-4 py-3">
                          {getAmenityStatus(pB, amenity) ? (
                            <CheckCircle2 size={18} className="text-emerald-500"/>
                          ) : (
                            <XCircle size={18} className="text-red-300"/>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Location Tab */}
                {tab === "location" && (
                  <div className="divide-y divide-[#F5EFE8]">
                    <div className="grid grid-cols-3 bg-white">
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <p className="text-[10px] font-bold text-[#A8978A] uppercase">Location</p>
                      </div>
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <p className="text-xs sm:text-sm text-[#1C0F05]">{pA.location}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs sm:text-sm text-[#1C0F05]">{pB.location}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 bg-[#FAF7F4]">
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <p className="text-[10px] font-bold text-[#A8978A] uppercase">City</p>
                      </div>
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <p className="text-xs sm:text-sm text-[#1C0F05]">{pA.city?.name || "N/A"}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs sm:text-sm text-[#1C0F05]">{pB.city?.name || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Tab */}
                {tab === "price" && (
                  <div className="divide-y divide-[#F5EFE8]">
                    {[
                      { label: "Price", v1: pA.priceLabel, v2: pB.priceLabel },
                      { label: "Possession", v1: pA.possessionDate ? new Date(pA.possessionDate).getFullYear() : "2026", v2: pB.possessionDate ? new Date(pB.possessionDate).getFullYear() : "2026" },
                      { label: "Nestory Score", v1: `${scoreA}/100`, v2: `${scoreB}/100` },
                    ].map(({ label, v1, v2 }, i) => (
                      <div key={label} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-[#FAF7F4]"}`}>
                        <div className="px-4 py-3 border-r border-[#F0EBE4]">
                          <p className="text-[10px] font-bold text-[#A8978A] uppercase">{label}</p>
                        </div>
                        <div className="px-4 py-3 border-r border-[#F0EBE4]">
                          <p className="text-xs sm:text-sm text-[#1C0F05] font-semibold">{v1}</p>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-xs sm:text-sm text-[#1C0F05] font-semibold">{v2}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA Buttons */}
        {canCompare && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 pt-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all">
              <Shield size={16}/> Book Free Site Visit
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#6B3A1F] text-[#6B3A1F] font-semibold text-sm hover:bg-[#6B3A1F] hover:text-white transition-all">
              <Zap size={16}/> Get Expert Advice
            </button>
          </div>
        )}
      </div>

      {/* Mobile Picker Sheet */}
      {sheetFor && (
        <PickerSheet
          onSelect={sheetFor === "A" ? pickA : pickB}
          exclude={sheetFor === "A" ? [pB?._id ?? ""] : [pA?._id ?? ""]}
          onClose={() => setSheetFor(null)}
          label={sheetFor === "A" ? "Project A" : "Project B"}
          projects={allProjects}
        />
      )}
    </section>
  );
}