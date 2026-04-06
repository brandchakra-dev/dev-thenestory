"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, CheckCircle2, XCircle, ChevronDown, BarChart2,
  ArrowRight, Sparkles, Building2, Shield, Zap, Trophy,
  X, ExternalLink, Plus, ChevronRight, Star, Search,
} from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────
interface Project {
  id: string; slug: string; name: string; builder: string;
  location: string; image: string;
  status: "New Launch" | "Under Construction" | "Ready To Move";
  price: string; pricePerSqft: string; possession: string;
  rera: string; rating: number; score: number;
  config: string[]; area: string; totalUnits: string;
  floors: string; facing: string; parking: string;
  highlights: string[];
  amenities: Record<string, boolean>;
  nearby: { label: string; dist: string }[];
  builderRating: number; priceAppreciation: string;
}

const PROJECTS: Project[] = [
  {
    id:"p1", slug:"godrej-palm-retreat", name:"Godrej Palm Retreat",
    builder:"Godrej Properties", location:"Sector 150, Noida",
    image:"/property/godrej.jpg", status:"Ready To Move",
    price:"₹1.34 Cr – ₹4.21 Cr", pricePerSqft:"₹6,800", possession:"Dec 2024",
    rera:"UPRERAPRJ123456", rating:4.8, score:92,
    config:["2 BHK","3 BHK","4 BHK"], area:"1,200–3,100 sq.ft",
    totalUnits:"1,890", floors:"G+25", facing:"East/NE", parking:"2 covered",
    highlights:["IGBC Gold Certified","20-acre green cover","Olympic pool"],
    amenities:{"Clubhouse":true,"Pool":true,"Gym":true,"Kids Area":true,
      "Jogging Track":true,"Security":true,"Power Backup":true,
      "EV Charging":true,"Rooftop":false,"Coworking":false},
    nearby:[{label:"Expressway",dist:"0.2 km"},{label:"Metro",dist:"1.4 km"},{label:"DPS School",dist:"2.1 km"}],
    builderRating:4.7, priceAppreciation:"+12% YoY",
  },
  {
    id:"p2", slug:"ace-golfshire", name:"ACE Golfshire",
    builder:"ACE Group", location:"Sector 150, Noida",
    image:"/property/m3m.webp", status:"Ready To Move",
    price:"₹1.31 Cr – ₹2.30 Cr", pricePerSqft:"₹6,400", possession:"Ready Now",
    rera:"UPRERAPRJ654321", rating:4.5, score:86,
    config:["2 BHK","3 BHK"], area:"1,100–2,200 sq.ft",
    totalUnits:"1,200", floors:"G+22", facing:"West/South", parking:"1 covered",
    highlights:["Golf course view","Smart home ready","AC lobby"],
    amenities:{"Clubhouse":true,"Pool":true,"Gym":true,"Kids Area":true,
      "Jogging Track":true,"Security":true,"Power Backup":true,
      "EV Charging":false,"Rooftop":true,"Coworking":false},
    nearby:[{label:"Expressway",dist:"0.4 km"},{label:"Metro",dist:"1.8 km"},{label:"Ryan Intl",dist:"1.5 km"}],
    builderRating:4.3, priceAppreciation:"+9% YoY",
  },
  {
    id:"p3", slug:"dasnac-jewel-of-noida", name:"Dasnac Jewel of Noida",
    builder:"Dasnac Group", location:"Sector 75, Noida",
    image:"/property/sobha.webp", status:"New Launch",
    price:"₹1.89 Cr – ₹12 Cr", pricePerSqft:"₹9,500", possession:"Dec 2027",
    rera:"UPRERAPRJ789012", rating:4.3, score:78,
    config:["3 BHK","4 BHK","Penthouse"], area:"1,800–5,200 sq.ft",
    totalUnits:"450", floors:"G+40", facing:"East/All", parking:"3 covered",
    highlights:["Ultra-luxury","Sky lounge","Private lift"],
    amenities:{"Clubhouse":true,"Pool":true,"Gym":true,"Kids Area":true,
      "Jogging Track":false,"Security":true,"Power Backup":true,
      "EV Charging":true,"Rooftop":true,"Coworking":true},
    nearby:[{label:"Metro",dist:"0.3 km"},{label:"Mall",dist:"3.2 km"},{label:"Hospital",dist:"2.8 km"}],
    builderRating:3.9, priceAppreciation:"+6% YoY",
  },
];

const AMENITY_LIST = ["Clubhouse","Pool","Gym","Kids Area","Jogging Track","Security","Power Backup","EV Charging","Rooftop","Coworking"];

const STATUS_CFG: Record<string,{bg:string;text:string;dot:string}> = {
  "New Launch":         {bg:"bg-[#6B3A1F]/10 border border-[#6B3A1F]/20",text:"text-[#6B3A1F]",   dot:"bg-[#6B3A1F]"},
  "Ready To Move":      {bg:"bg-emerald-50 border border-emerald-200",    text:"text-emerald-700",dot:"bg-emerald-500"},
  "Under Construction": {bg:"bg-amber-50 border border-amber-200",        text:"text-amber-700",  dot:"bg-amber-500"},
};

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

// ─── Project Picker Sheet with Search Autocomplete ───────
function PickerSheet({ onSelect, exclude, onClose, label }: {
  onSelect:(p:Project)=>void; exclude:string[]; onClose:()=>void; label:string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = useMemo(() => {
    const avail = PROJECTS.filter(p => !exclude.includes(p.id));
    if (!searchQuery.trim()) return avail;
    const query = searchQuery.toLowerCase();
    return avail.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.builder.toLowerCase().includes(query) ||
      p.config.some(c => c.toLowerCase().includes(query))
    );
  }, [searchQuery, exclude]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#D4C4B0]"/>
        </div>
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <h3 className="font-display font-bold text-[#1C0F05] text-lg">Choose {label}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5EFE8] flex items-center justify-center">
            <X size={15} className="text-[#6B3A1F]"/>
          </button>
        </div>
        
        {/* Search Input */}
        <div className="px-5 pb-3 flex-shrink-0">
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
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={12} className="text-[#A8978A]" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-[10px] text-[#A8978A] mt-2">
              Found {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        
        <div className="overflow-y-auto flex-1 px-4 pb-6 space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <Search size={32} className="text-[#EDE5DD] mx-auto mb-2" />
              <p className="text-[#A8978A] text-sm">No projects found</p>
              <p className="text-[#A8978A] text-xs mt-1">Try different keywords</p>
            </div>
          ) : (
            filteredProjects.map(p => {
              const sc = STATUS_CFG[p.status];
              return (
                <button key={p.id} onClick={() => { onSelect(p); onClose(); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#EDE5DD]
                    bg-white hover:border-[#6B3A1F] hover:bg-[#FAF8F4] active:scale-[0.98]
                    transition-all duration-200 text-left">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold mb-1 ${sc.bg} ${sc.text}`}>
                      <span className={`w-1 h-1 rounded-full ${sc.dot}`}/>{p.status}
                    </span>
                    <p className="font-bold text-[#1C0F05] text-sm truncate">{p.name}</p>
                    <p className="text-[#A8978A] text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={9}/>{p.location}
                    </p>
                    <p className="text-[#6B3A1F] text-xs font-semibold mt-0.5">{p.price.split("–")[0].trim()}+</p>
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <ScoreRing score={p.score} size={40}/>
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

// ─── Desktop Dropdown with Search ─────────────────────────
function DesktopSelector({ selected, onSelect, exclude, label }: {
  selected:Project|null; onSelect:(p:Project)=>void; exclude:string[]; label:string;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = useMemo(() => {
    const avail = PROJECTS.filter(p => !exclude.includes(p.id));
    if (!searchQuery.trim()) return avail;
    const query = searchQuery.toLowerCase();
    return avail.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.builder.toLowerCase().includes(query)
    );
  }, [searchQuery, exclude]);

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
              <Image src={selected.image} alt={selected.name} fill className="object-cover"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1C0F05] text-sm truncate">{selected.name}</p>
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
            
            {/* Search Input */}
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
            
            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-6">
                  <Search size={24} className="text-[#EDE5DD] mx-auto mb-2" />
                  <p className="text-[#A8978A] text-xs">No projects found</p>
                </div>
              ) : (
                filteredProjects.map(p => (
                  <button key={p.id} onClick={() => { onSelect(p); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF8F4] transition-colors
                      border-b border-[#F5EFE8] last:border-0 text-left">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1C0F05] text-sm truncate">{p.name}</p>
                      <p className="text-[#A8978A] text-[11px] truncate">{p.location}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_CFG[p.status].bg} ${STATUS_CFG[p.status].text}`}>
                      {p.status}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function CompareProjects() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [pA, setPA] = useState<Project|null>(
    PROJECTS.find(p=>p.slug===searchParams.get("project1"))??null
  );
  const [pB, setPB] = useState<Project|null>(
    PROJECTS.find(p=>p.slug===searchParams.get("project2"))??null
  );
  const [tab,        setTab]        = useState<"overview"|"amenities"|"location"|"price">("overview");
  const [sheetFor,   setSheetFor]   = useState<"A"|"B"|null>(null);

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
  const winner = canCompare
    ? pA.score>pB.score ? pA : pB.score>pA.score ? pB : null
    : null;

  return (
    <section className="min-h-screen bg-[hsl(38,45%,97%)]">

      {/* ══════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════ */}
      <div className="sm:hidden">

        {/* Mobile header */}
        <div className="bg-white border-b border-[#EDE5DD] px-4 pt-10 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={16} className="text-[#6B3A1F]"/>
            <span className="text-xs font-bold text-[#6B3A1F] uppercase tracking-widest">Compare</span>
          </div>
          <h1 className="font-display font-bold text-[#1C0F05] text-2xl leading-tight mb-1">
            Compare Projects
          </h1>
          <p className="text-[#A8978A] text-xs">Side-by-side analysis to make a smarter choice</p>
        </div>

        {/* Mobile project selectors */}
        <div className="px-4 py-4 space-y-3">
          {/* Project A selector */}
          {!pA ? (
            <button onClick={() => setSheetFor("A")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#C9A84C]
                bg-[#FDF8F4] active:scale-[0.98] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#F5EFE8] border-2 border-dashed border-[#D4C4B0]
                flex items-center justify-center flex-shrink-0">
                <Plus size={20} className="text-[#6B3A1F]"/>
              </div>
              <div>
                <p className="font-bold text-[#6B3A1F] text-sm">Add Project A</p>
                <p className="text-[#A8978A] text-xs mt-0.5">Tap to search & choose</p>
              </div>
              <ChevronRight size={16} className="text-[#C9A84C] ml-auto"/>
            </button>
          ) : (
            <div className={`rounded-2xl overflow-hidden border-2 
              ${winner?.id===pA.id ? "border-[#C9A84C]" : "border-[#EDE5DD]"}`}>
              <div className="relative h-32">
                <Image src={pA.image} alt={pA.name} fill className="object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0F05]/80 via-[#1C0F05]/20 to-transparent"/>
                {winner?.id===pA.id && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1
                    rounded-full bg-[#C9A84C] text-[#1C0F05] text-[9px] font-black">
                    <Trophy size={9}/> Pick
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm
                  rounded-full px-2 py-0.5 text-white text-[9px] font-bold uppercase tracking-wide">
                  Project A
                </div>
                <button onClick={clearA}
                  className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/20
                    backdrop-blur-sm flex items-center justify-center text-white">
                  <X size={12}/>
                </button>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-sm leading-tight">{pA.name}</p>
                  <p className="text-white/70 text-[10px] flex items-center gap-1">
                    <MapPin size={8}/>{pA.location}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ScoreRing score={pA.score} gold={winner?.id===pA.id} size={44}/>
                  <div>
                    <p className="font-bold text-[#1C0F05] text-xs">{pA.price.split("–")[0].trim()}+</p>
                    <p className="text-[#A8978A] text-[10px]">{pA.possession}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/projects/${pA.slug}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl
                      bg-[#FAF7F4] border border-[#EDE5DD] text-[#6B3A1F] text-[11px] font-bold">
                    Details <ExternalLink size={10}/>
                  </Link>
                  <button onClick={() => setSheetFor("A")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl
                      bg-[#FAF7F4] border border-[#EDE5DD] text-[#6B3A1F] text-[11px] font-bold">
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VS divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#EDE5DD]"/>
            <div className="w-9 h-9 rounded-full bg-[#6B3A1F] flex items-center justify-center
              shadow-[0_4px_12px_rgba(107,58,31,0.28)] flex-shrink-0">
              <span className="text-white text-[10px] font-black">VS</span>
            </div>
            <div className="flex-1 h-px bg-[#EDE5DD]"/>
          </div>

          {/* Project B selector */}
          {!pB ? (
            <button onClick={() => setSheetFor("B")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#D4C4B0]
                bg-[#FAF8F4] active:scale-[0.98] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#F5EFE8] border-2 border-dashed border-[#D4C4B0]
                flex items-center justify-center flex-shrink-0">
                <Plus size={20} className="text-[#A8978A]"/>
              </div>
              <div>
                <p className="font-bold text-[#6B5C4E] text-sm">Add Project B</p>
                <p className="text-[#A8978A] text-xs mt-0.5">Tap to search & choose</p>
              </div>
              <ChevronRight size={16} className="text-[#A8978A] ml-auto"/>
            </button>
          ) : (
            <div className={`rounded-2xl overflow-hidden border-2
              ${winner?.id===pB.id ? "border-[#C9A84C]" : "border-[#EDE5DD]"}`}>
              <div className="relative h-32">
                <Image src={pB.image} alt={pB.name} fill className="object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0F05]/80 via-[#1C0F05]/20 to-transparent"/>
                {winner?.id===pB.id && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1
                    rounded-full bg-[#C9A84C] text-[#1C0F05] text-[9px] font-black">
                    <Trophy size={9}/> Pick
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm
                  rounded-full px-2 py-0.5 text-white text-[9px] font-bold uppercase tracking-wide">
                  Project B
                </div>
                <button onClick={clearB}
                  className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/20
                    backdrop-blur-sm flex items-center justify-center text-white">
                  <X size={12}/>
                </button>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-sm leading-tight">{pB.name}</p>
                  <p className="text-white/70 text-[10px] flex items-center gap-1">
                    <MapPin size={8}/>{pB.location}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ScoreRing score={pB.score} gold={winner?.id===pB.id} size={44}/>
                  <div>
                    <p className="font-bold text-[#1C0F05] text-xs">{pB.price.split("–")[0].trim()}+</p>
                    <p className="text-[#A8978A] text-[10px]">{pB.possession}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/projects/${pB.slug}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl
                      bg-[#FAF7F4] border border-[#EDE5DD] text-[#6B3A1F] text-[11px] font-bold">
                    Details <ExternalLink size={10}/>
                  </Link>
                  <button onClick={() => setSheetFor("B")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl
                      bg-[#FAF7F4] border border-[#EDE5DD] text-[#6B3A1F] text-[11px] font-bold">
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile comparison table */}
        {canCompare && (
          <div className="px-4 pb-32">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4">
              {(["overview","amenities","location","price"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold capitalize transition-all
                    ${tab===t
                      ? "bg-[#6B3A1F] text-white shadow-[0_2px_8px_rgba(107,58,31,0.25)]"
                      : "bg-white text-[#6B5C4E] border border-[#EDE5DD]"}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-[0_2px_12px_rgba(107,58,31,0.05)]">
              <div className="grid grid-cols-2 border-b border-[#F0EBE4]">
                {[pA,pB].map((p,i) => (
                  <Link key={p.id} href={`/projects/${p.slug}`}
                    className={`px-4 py-3 group ${i===0?"border-r border-[#F0EBE4]":""}`}>
                    <p className="font-bold text-[#1C0F05] text-xs truncate group-hover:text-[#6B3A1F]">
                      {p.name}
                    </p>
                    <p className="text-[#C9A84C] text-[9px] font-bold mt-0.5">
                      Score: {p.score}/100
                    </p>
                  </Link>
                ))}
              </div>

              {tab==="overview" && [
                {label:"Builder",  v1:pA.builder,           v2:pB.builder},
                {label:"Config",   v1:pA.config.join(", "),  v2:pB.config.join(", ")},
                {label:"Area",     v1:pA.area,              v2:pB.area},
                {label:"Floors",   v1:pA.floors,            v2:pB.floors},
                {label:"Units",    v1:pA.totalUnits,        v2:pB.totalUnits},
                {label:"Parking",  v1:pA.parking,           v2:pB.parking},
              ].map(({label,v1,v2},i) => (
                <div key={label} className={`grid grid-cols-2 border-b border-[#F5EFE8] last:border-0
                  ${i%2===0?"bg-[#FAF7F4]":""}`}>
                  <div className="px-4 py-3 border-r border-[#F0EBE4]">
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-[#1C0F05]">{v1}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-[#1C0F05]">{v2}</p>
                  </div>
                </div>
              ))}

              {tab==="amenities" && AMENITY_LIST.map((am,i) => (
                <div key={am} className={`grid grid-cols-2 border-b border-[#F5EFE8] last:border-0
                  ${i%2===0?"bg-[#FAF7F4]":""}`}>
                  <div className="px-4 py-3 border-r border-[#F0EBE4] flex items-center gap-2">
                    {pA.amenities[am]
                      ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0"/>
                      : <XCircle      size={14} className="text-red-300 flex-shrink-0"/>}
                    <span className="text-xs text-[#1C0F05]">{am}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center gap-2">
                    {pB.amenities[am]
                      ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0"/>
                      : <XCircle      size={14} className="text-red-300 flex-shrink-0"/>}
                    <span className="text-xs text-[#1C0F05]">{am}</span>
                  </div>
                </div>
              ))}

              {tab==="location" && pA.nearby.map((n,i) => (
                <div key={n.label} className={`grid grid-cols-2 border-b border-[#F5EFE8] last:border-0
                  ${i%2===0?"bg-[#FAF7F4]":""}`}>
                  <div className="px-4 py-3 border-r border-[#F0EBE4]">
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide mb-0.5">{n.label}</p>
                    <p className="text-xs font-bold text-[#6B3A1F]">{n.dist}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide mb-0.5">{n.label}</p>
                    <p className="text-xs font-bold text-[#6B3A1F]">{pB.nearby[i]?.dist}</p>
                  </div>
                </div>
              ))}

              {tab==="price" && [
                {label:"Price",        v1:pA.price,              v2:pB.price},
                {label:"Per sqft",     v1:pA.pricePerSqft,       v2:pB.pricePerSqft},
                {label:"Appreciation", v1:pA.priceAppreciation,  v2:pB.priceAppreciation},
                {label:"Builder ★",    v1:`${pA.builderRating}`, v2:`${pB.builderRating}`},
              ].map(({label,v1,v2},i) => (
                <div key={label} className={`grid grid-cols-2 border-b border-[#F5EFE8] last:border-0
                  ${i%2===0?"bg-[#FAF7F4]":""}`}>
                  <div className="px-4 py-3 border-r border-[#F0EBE4]">
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-[#1C0F05]">{v1}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-[#1C0F05]">{v2}</p>
                  </div>
                </div>
              ))}
            </div>

            {winner && (
              <div className="mt-4 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C0F05] to-[#6B3A1F]
                shadow-[0_8px_24px_rgba(107,58,31,0.28)] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={16} className="text-[#C9A84C]"/>
                  <p className="font-bold text-white text-sm">Nestory Pick</p>
                </div>
                <p className="text-white/70 text-xs mb-3 leading-relaxed">
                  {winner.name} scores {winner.score}/100 — better value, amenities & builder track record.
                </p>
                <Link href={`/projects/${winner.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                    bg-[#C9A84C] text-[#1C0F05] font-bold text-sm active:scale-[0.97] transition-all">
                  View {winner.name} <ArrowRight size={14}/>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Sticky bottom CTA */}
        {canCompare && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EDE5DD]
            px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(107,58,31,0.10)]">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
              bg-[#6B3A1F] text-white font-bold text-sm active:scale-[0.97] transition-all
              shadow-[0_4px_12px_rgba(107,58,31,0.25)]">
              <Shield size={15}/> Book Site Visit
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
              border-2 border-[#6B3A1F] text-[#6B3A1F] font-bold text-sm active:scale-[0.97] transition-all">
              <Zap size={15}/> Get Advice
            </button>
          </div>
        )}

        {/* Bottom sheet picker with search */}
        {sheetFor && (
          <PickerSheet
            onSelect={sheetFor==="A" ? pickA : pickB}
            exclude={sheetFor==="A" ? [pB?.id??""] : [pA?.id??""]}
            onClose={() => setSheetFor(null)}
            label={sheetFor==="A" ? "Project A" : "Project B"}
          />
        )}
      </div>

      {/* ══════════════════════════════════════
          DESKTOP LAYOUT (sm and above)
      ══════════════════════════════════════ */}
      <div className="hidden sm:block py-24 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
              bg-[#6B3A1F]/8 border border-[#6B3A1F]/15">
              <BarChart2 size={11} className="text-[#6B3A1F]"/>
              <span className="text-[#6B3A1F] text-[10px] font-bold tracking-widest uppercase">
                Smart Comparison
              </span>
            </div>
            <h1 className="font-display font-bold text-[#1C0F05] text-4xl lg:text-5xl
              leading-[1.08] tracking-tight mb-3">
              Compare Projects{" "}
              <span className="text-transparent bg-clip-text"
                style={{backgroundImage:"linear-gradient(135deg,#6B3A1F,#C9A84C)"}}>
                Side by Side
              </span>
            </h1>      
          </div>

          {/* Desktop selectors with search */}
          <div className="grid grid-cols-[1fr_44px_1fr] items-center gap-4 mb-8">
            <DesktopSelector selected={pA} onSelect={pickA} exclude={[pB?.id??""]} label="Project A"/>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#6B3A1F] flex items-center justify-center
                shadow-[0_4px_14px_rgba(107,58,31,0.30)] flex-shrink-0">
                <span className="text-white text-[10px] font-black">VS</span>
              </div>
            </div>
            <DesktopSelector selected={pB} onSelect={pickB} exclude={[pA?.id??""]} label="Project B"/>
          </div>

          {/* Desktop empty */}
          {!canCompare && (
            <div className="bg-white rounded-3xl border border-[#EDE5DD] p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F4] border border-[#EDE5DD]
                flex items-center justify-center mx-auto mb-4">
                <BarChart2 size={24} className="text-[#C9A84C]"/>
              </div>
              <h3 className="font-display font-semibold text-[#1C0F05] text-lg mb-2">
                Select 2 projects to compare
              </h3>
              <p className="text-[#A8978A] text-sm mb-4">Click on selectors above to search & choose projects</p>
              <div className="flex flex-wrap justify-center gap-2">
                {PROJECTS.map(p => (
                  <button key={p.id}
                    onClick={() => !pA ? pickA(p) : (!pB && p.id!==pA.id && pickB(p))}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F4]
                      border border-[#EDE5DD] text-xs font-semibold text-[#6B5C4E]
                      hover:border-[#6B3A1F] hover:text-[#6B3A1F] transition-all">
                    <Building2 size={11}/>{p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop compare panel (same as before) */}
          {canCompare && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {([pA,pB] as [Project,Project]).map((p,i) => {
                  const isW = winner?.id===p.id;
                  const sc  = STATUS_CFG[p.status];
                  return (
                    <div key={p.id}
                      className={`bg-white rounded-2xl overflow-hidden transition-all
                        ${isW ? "border-[1.5px] border-[#C9A84C] shadow-[0_8px_28px_rgba(201,168,76,0.18)]"
                              : "border border-[#EDE5DD] shadow-[0_2px_12px_rgba(107,58,31,0.06)]"}`}>
                      <Link href={`/projects/${p.slug}`} className="group relative block h-40 overflow-hidden">
                        <Image src={p.image} alt={p.name} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1C0F05]/65 to-transparent"/>
                        <div className="absolute inset-0 bg-[#1C0F05]/35 opacity-0 group-hover:opacity-100
                          transition-opacity flex items-center justify-center">
                          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white
                            text-[#1C0F05] text-xs font-semibold">
                            <ExternalLink size={12}/> View Details
                          </span>
                        </div>
                        {isW && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1
                            rounded-full bg-[#C9A84C] text-[#1C0F05] text-[9px] font-black z-10">
                            <Trophy size={9}/> Nestory Pick
                          </div>
                        )}
                        <button onClick={(e) => { e.preventDefault(); i===0?clearA():clearB(); }}
                          className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-white/20
                            backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-all">
                          <X size={12}/>
                        </button>
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1 h-1 rounded-full ${sc.dot}`}/>{p.status}
                          </span>
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <Link href={`/projects/${p.slug}`}
                              className="group inline-flex items-center gap-1">
                              <h3 className="font-display font-semibold text-[#1C0F05] text-base
                                group-hover:text-[#6B3A1F] transition-colors">{p.name}</h3>
                              <ArrowRight size={13} className="text-[#6B3A1F] opacity-0 group-hover:opacity-100
                                -translate-x-1 group-hover:translate-x-0 transition-all"/>
                            </Link>
                            <p className="text-[11px] text-[#A8978A] flex items-center gap-1 mt-0.5">
                              <MapPin size={9}/>{p.location}
                            </p>
                          </div>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <ScoreRing score={p.score} gold={isW} size={52}/>
                            <p className="text-[8px] text-[#A8978A] uppercase tracking-wide mt-0.5">Score</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {[
                            {label:"From",     value:p.price.split("–")[0].trim()},
                            {label:"Possess.", value:p.possession},
                            {label:"Rating",   value:`★ ${p.rating}`},
                          ].map(({label,value}) => (
                            <div key={label} className="bg-[#FAF7F4] rounded-xl p-2.5 text-center">
                              <p className="font-semibold text-[#1C0F05] text-[11px] truncate">{value}</p>
                              <p className="text-[9px] text-[#A8978A] uppercase tracking-wide mt-0.5">{label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1.5">
                          {p.highlights.map(h => (
                            <div key={h} className="flex items-center gap-2 text-[11px] text-[#4A3728]">
                              <Sparkles size={10} className="text-[#C9A84C] flex-shrink-0"/>{h}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden">
                <div className="flex border-b border-[#F0EBE4] overflow-x-auto">
                  {(["overview","amenities","location","price"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`relative flex-shrink-0 px-6 py-3.5 text-sm font-semibold capitalize transition-colors
                        ${tab===t ? "text-[#6B3A1F]" : "text-[#888] hover:text-[#555]"}`}>
                      {t}
                      {tab===t && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6B3A1F] rounded-t-full"/>}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-[140px_1fr_1fr] bg-[#FAF7F4] border-b border-[#F0EBE4]">
                  <div className="px-4 py-2.5 border-r border-[#F0EBE4]"/>
                  {[pA,pB].map(p => (
                    <Link key={p.id} href={`/projects/${p.slug}`}
                      className="px-4 py-2.5 border-r border-[#F0EBE4] last:border-0 group
                        flex items-center gap-1.5 hover:bg-[#FDF3E0] transition-colors">
                      <p className="font-semibold text-[#1C0F05] text-xs truncate group-hover:text-[#6B3A1F]">{p.name}</p>
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 text-[#A8978A]"/>
                    </Link>
                  ))}
                </div>
                <div className="divide-y divide-[#F5EFE8]">
                  {tab==="overview" && [
                    {label:"Builder",  v1:pA.builder,          v2:pB.builder},
                    {label:"Config",   v1:pA.config.join(", "),v2:pB.config.join(", ")},
                    {label:"Area",     v1:pA.area,             v2:pB.area},
                    {label:"Floors",   v1:pA.floors,           v2:pB.floors},
                    {label:"Units",    v1:pA.totalUnits,       v2:pB.totalUnits},
                    {label:"Parking",  v1:pA.parking,          v2:pB.parking},
                  ].map(({label,v1,v2},i) => (
                    <div key={label} className={`grid grid-cols-[140px_1fr_1fr] ${i%2===0?"bg-[#FAF7F4]":""}`}>
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <span className="text-[11px] font-semibold text-[#999] uppercase tracking-wide">{label}</span>
                      </div>
                      <div className="px-4 py-3 border-r border-[#F0EBE4] text-sm text-[#1C0F05]">{v1}</div>
                      <div className="px-4 py-3 text-sm text-[#1C0F05]">{v2}</div>
                    </div>
                  ))}
                  {tab==="amenities" && AMENITY_LIST.map((am,i) => (
                    <div key={am} className={`grid grid-cols-[140px_1fr_1fr] ${i%2===0?"bg-[#FAF7F4]":""}`}>
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <span className="text-[11px] font-semibold text-[#999] uppercase tracking-wide">{am}</span>
                      </div>
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        {pA.amenities[am] ? <CheckCircle2 size={15} className="text-emerald-500"/> : <XCircle size={15} className="text-red-300"/>}
                      </div>
                      <div className="px-4 py-3">
                        {pB.amenities[am] ? <CheckCircle2 size={15} className="text-emerald-500"/> : <XCircle size={15} className="text-red-300"/>}
                      </div>
                    </div>
                  ))}
                  {tab==="location" && pA.nearby.map((n,i) => (
                    <div key={n.label} className={`grid grid-cols-[140px_1fr_1fr] ${i%2===0?"bg-[#FAF7F4]":""}`}>
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <span className="text-[11px] font-semibold text-[#999] uppercase tracking-wide">{n.label}</span>
                      </div>
                      <div className="px-4 py-3 border-r border-[#F0EBE4] text-sm font-semibold text-[#6B3A1F]">{n.dist}</div>
                      <div className="px-4 py-3 text-sm font-semibold text-[#6B3A1F]">{pB.nearby[i]?.dist}</div>
                    </div>
                  ))}
                  {tab==="price" && [
                    {label:"Price",       v1:pA.price,             v2:pB.price},
                    {label:"Per sqft",    v1:pA.pricePerSqft,      v2:pB.pricePerSqft},
                    {label:"Apprecn.",    v1:pA.priceAppreciation, v2:pB.priceAppreciation},
                    {label:"Nestory",     v1:`${pA.score}/100`,    v2:`${pB.score}/100`},
                  ].map(({label,v1,v2},i) => (
                    <div key={label} className={`grid grid-cols-[140px_1fr_1fr] ${i%2===0?"bg-[#FAF7F4]":""}`}>
                      <div className="px-4 py-3 border-r border-[#F0EBE4]">
                        <span className="text-[11px] font-semibold text-[#999] uppercase tracking-wide">{label}</span>
                      </div>
                      <div className="px-4 py-3 border-r border-[#F0EBE4] text-sm text-[#1C0F05]">{v1}</div>
                      <div className="px-4 py-3 text-sm text-[#1C0F05]">{v2}</div>
                    </div>
                  ))}
                </div>
                {winner && (
                  <div className="border-t border-[#F0EBE4] bg-gradient-to-r from-[#FDF3E0] to-[#FDF8F4]
                    px-5 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Trophy size={17} className="text-[#C9A84C] flex-shrink-0"/>
                      <div>
                        <p className="font-semibold text-[#1C0F05] text-sm">{winner.name} is the Nestory Pick</p>
                        <p className="text-[#7A6858] text-xs mt-0.5">Score {winner.score}/100 — better overall</p>
                      </div>
                    </div>
                    <Link href={`/projects/${winner.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                        bg-[#6B3A1F] text-white font-semibold text-sm
                        hover:bg-[#522C16] active:scale-[0.97] transition-all flex-shrink-0">
                      View Project <ArrowRight size={13}/>
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center pt-1">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#6B3A1F] text-white
                  font-semibold text-sm shadow-[0_4px_14px_rgba(107,58,31,0.28)]
                  hover:bg-[#522C16] active:scale-[0.97] transition-all">
                  <Shield size={15}/> Book Free Site Visit
                </button>
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-[#6B3A1F]
                  text-[#6B3A1F] font-semibold text-sm hover:bg-[#6B3A1F] hover:text-white
                  active:scale-[0.97] transition-all">
                  <Zap size={15}/> Get Expert Advice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}