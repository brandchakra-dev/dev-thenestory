"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Heart, Share2, Download, ChevronRight,
  BadgeCheck, ArrowRight, Star, BedDouble, Maximize2,
  Building2, CalendarCheck, CheckCircle2, X, ChevronLeft,
  Zap, Award, Home, Navigation, Shield, Clock, Users,
  TrendingUp, Eye, MessageCircle
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────
interface UnitConfig { bhk:string; area:string; price:string; priceRaw:string; floors:string; image:string; }

const project = {
  title:"Dasnac Jewel of Noida",
  builder:"Dasnac Group", builderExp:"25+ years", builderProjects:"18+",
  location:"Sector 75, Noida, Uttar Pradesh",
  price:"₹1.89 Cr – ₹12 Cr", status:"New Launch",
  possession:"December 2026", launchDate:"January 2024",
  rera:"UPRERAPRJ12345", totalUnits:"648", totalTowers:"6",
  totalFloors:"32", totalArea:"12.5 Acres", bhk:"3, 4, 5 BHK",
  description:`Dasnac Jewel of Noida redefines luxury living in Sector 75 — one of Noida's most strategic corridors. Spread across 12.5 acres of lush green landscape, this premium residential development features 6 high-rise towers rising 32 floors each, housing 648 thoughtfully designed apartments.

Every unit is crafted for space, light, and ventilation. Cross-ventilated floor plans ensure natural airflow while floor-to-ceiling glass facades frame panoramic views of the city skyline.

Strategically positioned minutes from the Sector 76 Metro Station and Noida-Greater Noida Expressway — placing corporate parks, schools, hospitals within easy reach.`,

  images:["/property/sobha.webp","/property/godrej.jpg","/property/m3m.webp","/property/prestige-city-siddharth-vihar.webp","/property/sobha.webp"],

  highlights:[
    "Panoramic skyline views from all towers",
    "32-floor high-rise · only 4 units per floor",
    "IGBC Green certified building",
    "1 km from Sector 76 Metro Station",
    "Double-height grand lobby with concierge",
    "Smart home automation in all units",
    "4-level basement parking",
    "Zero water discharge — 100% recycled",
  ],

  specs:[
    { label:"Total Units",  value:"648",           icon:<Home size={13}/>          },
    { label:"BHK Options",  value:"3, 4, 5 BHK",   icon:<BedDouble size={13}/>     },
    { label:"Status",       value:"New Launch",     icon:<Zap size={13}/>           },
    { label:"RERA No.",     value:"UPRERAPRJ12345", icon:<BadgeCheck size={13}/>    },
    { label:"Total Area",   value:"12.5 Acres",     icon:<Maximize2 size={13}/>     },
    { label:"Launch Date",  value:"Jan 2024",       icon:<CalendarCheck size={13}/> },
    { label:"Possession",   value:"Dec 2026",       icon:<CheckCircle2 size={13}/>  },
    { label:"Towers",       value:"6 Towers",       icon:<Building2 size={13}/>     },
  ],

  units:[
    { bhk:"3 BHK",          area:"1,850 sq.ft", price:"₹1.89 Cr", priceRaw:"onwards", floors:"3–20",  image:"/property/godrej.jpg"                        },
    { bhk:"3 BHK",          area:"2,200 sq.ft", price:"₹2.25 Cr", priceRaw:"onwards", floors:"3–32",  image:"/property/m3m.webp"                          },
    { bhk:"4 BHK",          area:"3,100 sq.ft", price:"₹3.20 Cr", priceRaw:"onwards", floors:"10–32", image:"/property/sobha.webp"                        },
    { bhk:"5 BHK",          area:"5,400 sq.ft", price:"₹5.50 Cr", priceRaw:"onwards", floors:"20–32", image:"/property/prestige-city-siddharth-vihar.webp"},
    { bhk:"5 BHK Penthouse",area:"8,500 sq.ft", price:"₹12 Cr",   priceRaw:"onwards", floors:"32",    image:"/property/godrej.jpg"                        },
  ] as UnitConfig[],

  amenities:[
    { label:"Infinity Pool",    icon:"🏊", cat:"Recreation"   },
    { label:"Sky Lounge",       icon:"🌆", cat:"Recreation"   },
    { label:"Gymnasium",        icon:"💪", cat:"Fitness"      },
    { label:"Yoga Deck",        icon:"🧘", cat:"Fitness"      },
    { label:"Jogging Track",    icon:"🏃", cat:"Fitness"      },
    { label:"Clubhouse",        icon:"🏛️", cat:"Social"       },
    { label:"Co-working",       icon:"💻", cat:"Social"       },
    { label:"Kids Play Area",   icon:"🎪", cat:"Kids"         },
    { label:"Mini Theatre",     icon:"🎬", cat:"Entertainment"},
    { label:"24/7 Security",    icon:"🛡️", cat:"Safety"       },
    { label:"CCTV",             icon:"📹", cat:"Safety"       },
    { label:"Power Backup",     icon:"⚡", cat:"Utilities"    },
    { label:"EV Charging",      icon:"🔋", cat:"Utilities"    },
    { label:"Cafeteria",        icon:"☕", cat:"Utilities"    },
    { label:"Salon & Spa",      icon:"💆", cat:"Wellness"     },
    { label:"Golf Simulator",   icon:"⛳", cat:"Recreation"   },
  ],

  nearby:[
    { type:"Metro",    name:"Sector 76 Metro Station",    dist:"0.8 km",  icon:"🚇" },
    { type:"Highway",  name:"Noida Expressway",           dist:"1.2 km",  icon:"🛣️" },
    { type:"Hospital", name:"Fortis Hospital Noida",      dist:"2.1 km",  icon:"🏥" },
    { type:"School",   name:"Amity International School", dist:"1.5 km",  icon:"🏫" },
    { type:"Mall",     name:"The Grand Venice Mall",      dist:"3.0 km",  icon:"🛍️" },
    { type:"Airport",  name:"Hindon Airport",             dist:"18 km",   icon:"✈️" },
    { type:"IT Hub",   name:"Sector 62 IT Hub",           dist:"4.5 km",  icon:"🏢" },
    { type:"Park",     name:"Sector 76 City Park",        dist:"0.5 km",  icon:"🌿" },
  ],

  similar:[
    { title:"Godrej Palm Retreat",    location:"Sector 150, Noida", price:"₹1.34 Cr+", status:"Ready To Move",  image:"/property/godrej.jpg"                        },
    { title:"ATS Knightsbridge",      location:"Sector 124, Noida", price:"₹4.5 Cr+",  status:"Ready To Move",  image:"/property/m3m.webp"                          },
    { title:"Prestige Primrose Hills",location:"Sector 150, Noida", price:"₹1.9 Cr+",  status:"New Launch",     image:"/property/prestige-city-siddharth-vihar.webp" },
  ],
};

// ─────────────────────────────────────────────────────────
// STATUS CONFIG  — using Tailwind classes only
// ─────────────────────────────────────────────────────────
const statusCls: Record<string,{wrap:string;dot:string}> = {
  "New Launch":         { wrap:"bg-brand-50 border border-brand-200 text-brand-600",   dot:"bg-brand-600"   },
  "Ready To Move":      { wrap:"bg-emerald-50 border border-emerald-200 text-emerald-700", dot:"bg-emerald-500" },
  "Under Construction": { wrap:"bg-amber-50 border border-amber-200 text-amber-700",   dot:"bg-amber-400"   },
};

// ─────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────
function Gallery({ images }: { images: string[] }) {
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setActive(a => (a - 1 + images.length) % images.length);
  const next = () => setActive(a => (a + 1) % images.length);

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-border shadow-card">
        {/* Main image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden cursor-pointer group"
          onClick={() => setLightbox(true)}>
          <Image src={images[active]} alt="Project" fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>

          {/* Photo count */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-black/55 text-white backdrop-blur-sm border border-white/15">
            <Eye size={11}/> {images.length} Photos
          </div>

          {/* Nav arrows */}
          <button onClick={e=>{e.stopPropagation();prev()}}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/25 text-white hover:bg-white/35 transition-all">
            <ChevronLeft size={16}/>
          </button>
          <button onClick={e=>{e.stopPropagation();next()}}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/25 text-white hover:bg-white/35 transition-all">
            <ChevronRight size={16}/>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {images.map((_,i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${active===i ? "w-5 bg-champ-300" : "w-1.5 bg-white/50"}`}/>
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 p-3 bg-brand-50/30 border-t border-border overflow-x-auto">
          {images.map((img,i) => (
            <button key={i} onClick={()=>setActive(i)}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 w-[72px] h-[50px] ${active===i ? "ring-2 ring-brand-600 ring-offset-1 opacity-100" : "opacity-55 hover:opacity-80"}`}>
              <Image src={img} alt="" fill className="object-cover"/>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/93 backdrop-blur-sm"
          onClick={()=>setLightbox(false)}>
          <button onClick={()=>setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <X size={18}/>
          </button>
          <button onClick={e=>{e.stopPropagation();prev()}}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <ChevronLeft size={20}/>
          </button>
          <div className="relative w-full max-w-4xl mx-16 aspect-video rounded-2xl overflow-hidden"
            onClick={e=>e.stopPropagation()}>
            <Image src={images[active]} alt="" fill className="object-cover"/>
          </div>
          <button onClick={e=>{e.stopPropagation();next()}}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <ChevronRight size={20}/>
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// LEAD FORM
// ─────────────────────────────────────────────────────────
function LeadForm() {
  const [name,      setName]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-champ-400/30 shadow-luxury">
      {/* Dark header */}
      <div className="px-5 pt-5 pb-4 bg-luxury-gradient">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-champ-300 animate-pulse"/>
          <span className="text-[9px] font-black tracking-[0.24em] uppercase text-champ-300">Free Consultation</span>
        </div>
        <p className="font-display font-black text-white text-lg leading-snug mb-1">
          Get Best Price &{" "}
          <span className="text-gradient-champagne">Exclusive Offers</span>
        </p>
        <p className="text-xs text-champ-300/50 mb-4">Expert callback within 30 minutes</p>
        <div className="flex items-center gap-4">
          {[["🔒","Safe"],["⚡","Quick"],["✅","No Spam"]].map(([ic,lb]) => (
            <div key={lb} className="flex items-center gap-1">
              <span className="text-[11px]">{ic}</span>
              <span className="text-[9px] font-semibold text-champ-300/55">{lb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="p-4 bg-card">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={30} className="text-emerald-500"/>
            </div>
            <p className="font-display font-black text-foreground text-base mb-1">We'll call you shortly!</p>
            <p className="text-xs text-muted-foreground">Our advisor will reach out within 30 min.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Your Full Name" value={name}
              onChange={e=>setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-muted/50 border border-border text-foreground focus:ring-2 focus:ring-brand-600/15 transition-all placeholder:text-muted-foreground"/>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-600">+91</span>
              <input type="tel" placeholder="Mobile Number" value={phone}
                onChange={e=>setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none bg-muted/50 border border-border text-foreground focus:ring-2 focus:ring-brand-600/15 transition-all placeholder:text-muted-foreground"/>
            </div>
            <button onClick={()=>name&&phone&&setSubmitted(true)}
              className="group relative w-full py-3.5 rounded-xl font-black text-sm overflow-hidden bg-cta-gradient text-champ-300 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 shadow-glow">
              <span className="relative z-10">Get Free Callback →</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
            </button>
            <button className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-border text-brand-600 hover:bg-brand-50 transition-colors">
              <Download size={12}/> Download Brochure
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────
function Section({ id, title, sub, children }: { id?:string; title:string; sub?:string; children:React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-1 h-6 flex-shrink-0 mt-0.5 rounded-full bg-premium-gradient"/>
        <div>
          <h2 className="font-display font-black text-foreground text-xl sm:text-2xl leading-tight">{title}</h2>
          {sub && <p className="text-xs font-medium text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// MOBILE BOTTOM BAR
// ─────────────────────────────────────────────────────────
function MobileBar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card border-t border-border px-4 py-3 flex items-center gap-3 shadow-card-hover">
        <a href="tel:+919999999999"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-border text-brand-600 hover:bg-brand-50 transition-colors">
          <Phone size={14}/> Call
        </a>
        <button onClick={()=>setOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-cta-gradient text-champ-300 shadow-glow">
          Get Best Price
        </button>
        <a href="https://wa.me/919999999999" target="_blank"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-[#25D366] hover:scale-105 transition-transform flex-shrink-0">
          💬
        </a>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setOpen(false)}/>
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden bg-card animate-slide-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <p className="font-display font-black text-foreground">Get Free Callback</p>
              <button onClick={()=>setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-50 text-brand-600"><X size={15}/></button>
            </div>
            <div className="p-4 pb-8"><LeadForm/></div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [wished,    setWished]    = useState(false);
  const [activeBhk, setActiveBhk] = useState("All");

  const sc = statusCls[project.status] ?? statusCls["New Launch"];
  const navTabs = [
    { id:"overview",    label:"Overview"    },
    { id:"floor-plans", label:"Floor Plans" },
    { id:"amenities",   label:"Amenities"   },
    { id:"location",    label:"Location"    },
    { id:"developer",   label:"Developer"   },
  ];

  const bhkOpts      = ["All", ...Array.from(new Set(project.units.map(u => u.bhk.split(" ")[0]+" BHK")))];
  const filteredUnits = activeBhk==="All" ? project.units : project.units.filter(u=>u.bhk.startsWith(activeBhk.replace(" BHK","")));

  const scrollTo = (id:string) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
    setActiveTab(id);
  };

  return (

    <div className="min-h-screen pb-[72px] lg:pb-0 bg-background py-20">

      {/* ── Breadcrumb ── */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap min-w-0">
            {[["Home","/"],["Projects","/projects"],["Noida","/projects?city=Noida"]].map(([label,href]) => (
              <span key={href} className="flex items-center gap-1.5 flex-shrink-0">
                <Link href={href} className="hover:text-brand-600 transition-colors">{label}</Link>
                <ChevronRight size={9}/>
              </span>
            ))}
            <span className="font-semibold text-brand-600 truncate">{project.title}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
       
        <div className="flex gap-5 lg:gap-7 items-start">


          {/* ════ Left CONTENT ════ */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Title + Price + Gallery */}
            <div className="flex flex-col gap-4">
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.wrap}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${sc.dot}`}/>{project.status}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <BadgeCheck size={10}/> RERA Approved
                    </span>
                  </div>
                  <h1 className="font-display font-black text-foreground text-xl sm:text-3xl lg:text-4xl leading-tight mb-1.5">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <MapPin size={13} className="text-champ-500 flex-shrink-0"/>
                    <span className="text-sm font-medium text-warm-500 truncate">{project.location}</span>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">by {project.builder}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={()=>setWished(!wished)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-90 ${wished?"bg-red-50 border-red-200/60":"bg-brand-50 border-border"}`}>
                    <Heart size={15} className={wished?"text-red-500 fill-red-500":"text-brand-600"}/>
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-50 border border-border text-brand-600 hover:scale-105 transition-all">
                    <Share2 size={15}/>
                  </button>
                </div>
              </div>

              {/* Price bar */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-card">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">Starting Price</p>
                  <p className="font-display font-black text-2xl sm:text-3xl leading-none text-gradient">
                    {project.price}
                  </p>
                </div>
                <div className="w-px h-10 bg-border flex-shrink-0 hidden sm:block"/>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {[["BHK",project.bhk],["Possession",project.possession],["RERA",project.rera]].map(([l,v]) => (
                    <div key={l}>
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">{l}</p>
                      <p className="text-xs font-bold text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                  <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border border-border bg-card text-brand-600 hover:-translate-y-0.5 transition-all">
                    <Download size={11}/> Brochure
                  </button>
                  <a href="tel:+919999999999"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-black text-xs bg-cta-gradient text-champ-300 hover:-translate-y-0.5 transition-all shadow-glow">
                    <Phone size={11}/> Get Details
                  </a>
                </div>
              </div>

              <Gallery images={project.images}/> 
            </div>

            {/* Sticky Nav Here Define */}

            <div className="sticky top-0 z-30 bg-card/92 backdrop-blur-md border-b border-border shadow-card">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center overflow-x-auto">
                  {navTabs.map(({id,label}) => (
                    <button key={id} onClick={()=>scrollTo(id)}
                      className={`relative flex-shrink-0 px-4 sm:px-5 py-4 font-bold text-xs whitespace-nowrap transition-colors duration-200 ${activeTab===id ? "text-brand-600" : "text-muted-foreground hover:text-brand-600"}`}>
                      {label}
                      {activeTab===id && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full bg-premium-gradient"/>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Overview ── */}
            <Section id="overview" title="Project Overview" sub={`${project.totalUnits} units · ${project.totalTowers} towers · ${project.totalArea}`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {project.specs.map(({label,value,icon}) => (
                  <div key={label} className="flex flex-col gap-2 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-card hover:-translate-y-0.5 transition-all duration-200">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-50 text-champ-500">{icon}</span>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-xs font-black text-foreground leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-card mb-5">
                {project.description.split("\n\n").map((p,i) => (
                  <p key={i} className="text-sm leading-relaxed text-warm-600 mb-3 last:mb-0">{p}</p>
                ))}
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-brand-50/60 border border-brand-100">
                <p className="font-black text-[10px] uppercase tracking-[0.18em] text-brand-600 mb-4">Key Highlights</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.highlights.map(h => (
                    <div key={h} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-premium-gradient">
                        <CheckCircle2 size={9} className="text-white"/>
                      </span>
                      <span className="text-xs font-medium text-warm-600 leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* ── Floor Plans ── */}
            <Section id="floor-plans" title="Floor Plans & Configurations" sub="Choose your perfect home">
              <div className="flex flex-wrap gap-2 mb-5">
                {bhkOpts.map(b => (
                  <button key={b} onClick={()=>setActiveBhk(b)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.97] ${activeBhk===b ? "bg-cta-gradient text-champ-300 shadow-glow" : "bg-card text-warm-500 border border-border hover:border-brand-200"}`}>
                    {b}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredUnits.map((unit,i) => (
                  <div key={i} className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <Image src={unit.image} alt={unit.bhk} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"/>
                      <div className="absolute bottom-3 left-3">
                        <p className="font-display font-black text-white text-lg leading-none">{unit.bhk}</p>
                        <p className="text-white/65 text-xs mt-0.5">{unit.area}</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-display font-black text-lg text-foreground leading-none">{unit.price}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground mt-1">Floors {unit.floors} · {unit.priceRaw}</p>
                      </div>
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-cta-gradient text-champ-300 hover:-translate-y-0.5 transition-all shadow-glow">
                        View Plan <ArrowRight size={11}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Amenities ── */}
            <Section id="amenities" title="Amenities" sub="World-class facilities for elevated living">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.amenities.map(({label,icon,cat}) => (
                  <div key={label} className="group flex flex-col items-center gap-2 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-card text-center hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
                    <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{icon}</span>
                    <span className="text-[10px] font-bold text-warm-700 leading-snug">{label}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-50 text-muted-foreground">{cat}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Location ── */}
            <Section id="location" title="Location & Connectivity" sub={project.location}>
              <div className="relative rounded-2xl overflow-hidden mb-5 border border-border bg-champ-100" style={{height:"200px"}}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cta-gradient shadow-glow">
                    <Navigation size={22} className="text-champ-300"/>
                  </div>
                  <p className="font-bold text-sm text-brand-600">Sector 75, Noida</p>
                  <a href="https://maps.google.com" target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-cta-gradient text-champ-300 hover:-translate-y-0.5 transition-all shadow-glow">
                    Open in Maps <ArrowRight size={11}/>
                  </a>
                </div>
                {/* Grid lines via Tailwind pattern */}
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{backgroundImage:"linear-gradient(hsl(var(--brand-600)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--brand-600)) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.nearby.map(({type,name,dist,icon}) => (
                  <div key={name} className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-200">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base bg-brand-50">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">{type}</p>
                      <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                    </div>
                    <span className="flex-shrink-0 text-[10px] font-black px-2 py-1 rounded-lg bg-brand-50 text-brand-600">{dist}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Developer ── */}
            <Section id="developer" title="About Developer" sub={project.builder}>
              <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-card">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-cta-gradient shadow-glow">
                    <Building2 size={22} className="text-champ-300"/>
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-foreground">{project.builder}</h3>
                    <p className="text-xs font-medium text-muted-foreground">Premium Real Estate Developer · NCR</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[["Experience",project.builderExp],["Projects",project.builderProjects],["Cities","5+"]].map(([label,value]) => (
                    <div key={label} className="flex flex-col items-center p-3 rounded-xl bg-brand-50 border border-brand-100 text-center">
                      <p className="font-display font-black text-xl text-brand-600">{value}</p>
                      <p className="text-[8px] font-black uppercase tracking-wide text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-warm-600">
                  Dasnac Group is one of NCR's most respected real estate developers, known for crafting luxury residences that blend world-class architecture with sustainable living. With over 25 years of experience and 18+ delivered projects, Dasnac has established itself as a benchmark for quality and trust across Noida and Greater Noida.
                </p>
              </div>
            </Section>

            {/* ── Similar Projects ── */}
            <Section title="Similar Projects" sub="You might also like these">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.similar.map(p => {
                  const psc = statusCls[p.status]??statusCls["New Launch"];
                  return (
                    <Link key={p.title}
                      href={`/projects/${p.title.toLowerCase().replace(/\s+/g,"-")}`}
                      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:-translate-y-1 hover:shadow-card-hover hover:border-champ-400/40 transition-all duration-300 block">
                      <div className="relative h-36 overflow-hidden">
                        <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"/>
                        <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold ${psc.wrap}`}>
                          <span className={`w-1 h-1 rounded-full ${psc.dot}`}/>{p.status}
                        </span>
                        <p className="absolute bottom-2.5 left-2.5 text-white font-black text-sm drop-shadow-md">{p.price}</p>
                      </div>
                      <div className="p-3.5">
                        <h4 className="font-display font-bold text-sm text-foreground mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{p.title}</h4>
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-champ-500"/>
                          <span className="text-[10px] text-muted-foreground">{p.location}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Section>

          </div>{/* end LEFT */}

          {/* ════ Right SIDEBAR — sticky ════  */}
          <aside className="hidden lg:flex flex-col flex-shrink-0 sticky top-20 rounded-2xl overflow-hidden"
            style={{ width:"340px", boxShadow:"0 6px 28px rgba(107,58,31,0.10)" }}>
            
            <div className="overflow-y-auto flex-1 max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-[#6B3A1F]/15 scrollbar-track-transparent">           
             
              <LeadForm/>
              {/* Contact */}
              <div className="mt-4 rounded-2xl bg-card border border-border shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-black text-[10px] uppercase tracking-[0.18em] text-brand-600">Direct Contact</p>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <a href="tel:+919999999999"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 border border-brand-100 hover:bg-brand-100 transition-colors">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-cta-gradient">
                      <Phone size={13} className="text-champ-300"/>
                    </span>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Call Us Now</p>
                      <p className="text-sm font-black text-foreground">+91 99999 99999</p>
                    </div>
                    <ChevronRight size={13} className="text-muted-foreground ml-auto flex-shrink-0"/>
                  </a>
                  <a href="https://wa.me/919999999999" target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200/50 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#25D366] text-base">💬</span>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">WhatsApp</p>
                      <p className="text-sm font-black text-foreground">Chat with Expert</p>
                    </div>
                    <ChevronRight size={13} className="text-muted-foreground ml-auto flex-shrink-0"/>
                  </a>
                </div>
              </div>

              {/* Why buy */}
              <div className="mt-4 rounded-2xl bg-luxury-gradient p-4 border border-champ-400/15">
                <p className="font-black text-[9px] uppercase tracking-[0.20em] text-champ-300 mb-3">Why Buy Here</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon:<Shield size={12}/>,    text:"RERA Registered & Approved"   },
                    { icon:<TrendingUp size={12}/>, text:"18% appreciation in 2 years"  },
                    { icon:<Clock size={12}/>,      text:"Possession in Dec 2026"        },
                    { icon:<Users size={12}/>,      text:"500+ families already booked"  },
                  ].map(({icon,text}) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-champ-300/15 text-champ-300">{icon}</span>
                      <span className="text-xs font-medium text-champ-300/75">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </aside>

        </div>
      </div>

      <MobileBar/>
    </div>
  );
}