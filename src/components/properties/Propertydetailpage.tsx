"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Heart, Share2, Download, ChevronRight,
  BadgeCheck, ArrowRight, Star, BedDouble, Maximize2,
  Building2, CalendarCheck, CheckCircle2, X, ChevronLeft,
  Shield, Clock, Users, TrendingUp, Eye, Layers,
  Car, Bath, Zap, Home, Navigation, Tag, Sparkles,
  Wifi, Wind, Droplets, AlertCircle
} from "lucide-react";

import { propertiesApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ─────────────────────────────────────────────────
interface PropertyImage {
  _id: string;
  url: string;
  isPrimary: boolean;
}

interface Property {
  amenities: never[];
  status: any;
  _id: string;
  title: string;
  slug: string;
  location: string;
  address: string;
  price: number;
  priceLabel: string;
  listingType: "sale" | "rent" | "lease";
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
  reraNo?: string;
  society?: string;
  ageOfProperty?: string;
  balconies?: number;
  possessionDate?: string;
  pricePerSqft?: number;
}

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  "Ready To Move": { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Under Construction": { bg: "bg-amber-50 border border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  "New Launch": { bg: "bg-[#6B3A1F]/10 border border-[#6B3A1F]/20", text: "text-[#6B3A1F]", dot: "bg-[#6B3A1F]" },
};

// ─── Gallery Component ──────────────────────────────────────────────
function Gallery({ images }: { images: PropertyImage[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  
  const imageUrls = images.map(img => getImageUrl(img.url));

  const prev = () => setActive(a => (a - 1 + imageUrls.length) % imageUrls.length);
  const next = () => setActive(a => (a + 1) % imageUrls.length);

  if (!imageUrls.length) {
    return (
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] h-64 flex items-center justify-center">
        <Building2 size={48} className="text-[#A8978A]" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-[#EDE5DD]" style={{ boxShadow: "0 4px 24px rgba(107,58,31,0.10)" }}>
        <div className="relative overflow-hidden cursor-pointer group" style={{ aspectRatio: "21/9" }} onClick={() => setLightbox(true)}>
          <img src={imageUrls[active]} alt="Property" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-black/55 text-white backdrop-blur-sm border border-white/15">
            <Eye size={11} /> {imageUrls.length} Photos
          </div>

          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/25 text-white hover:bg-white/35 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/25 text-white hover:bg-white/35 transition-all">
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {imageUrls.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-5 bg-[#C9A84C]" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 p-3 bg-[#FAF7F4] border-t border-[#EDE5DD] overflow-x-auto">
          {imageUrls.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all w-[72px] h-[50px] ${active === i ? "ring-2 ring-[#6B3A1F] ring-offset-1 opacity-100" : "opacity-55 hover:opacity-80"}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/93 backdrop-blur-sm" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <X size={18} />
          </button>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="relative w-full max-w-4xl mx-16 aspect-video rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={imageUrls[active]} alt="" className="w-full h-full object-cover" />
          </div>
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
}

// ─── Lead Form ────────────────────────────────────────────
function LeadForm({ owner, ownerType, propertyTitle }: { owner: string; ownerType: string; propertyTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState<"callback" | "visit">("callback");

  return (
    <div className="rounded-2xl overflow-hidden border border-[#D4C4B0]" style={{ boxShadow: "0 8px 32px rgba(107,58,31,0.18)" }}>
      <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D]">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          <span className="text-[9px] font-black tracking-[0.24em] uppercase text-[#C9A84C]">{ownerType} Listing</span>
        </div>
        <p className="font-display font-black text-white text-lg leading-snug mb-1">
          Contact{" "}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#E8D5B0,#C9A84C)" }}>
            {owner?.split(" ")[0] || "Owner"}
          </span>
        </p>
        <p className="text-xs text-[#C9A84C]/60 mb-4">Response within 30 minutes</p>
      </div>

      <div className="flex border-b border-[#EDE5DD]">
        {(["callback", "visit"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-xs font-bold capitalize transition-colors relative ${tab === t ? "text-[#6B3A1F]" : "text-[#A8978A] hover:text-[#6B5C4E]"}`}>
            {t === "callback" ? "📞 Get Callback" : "🏠 Schedule Visit"}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B3A1F] rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <p className="font-display font-bold text-[#1C0F05] text-base mb-1">{tab === "callback" ? "We'll call you shortly!" : "Visit scheduled!"}</p>
            <p className="text-xs text-[#A8978A]">{tab === "callback" ? "Owner will call within 30 min." : "Owner will confirm timing via WhatsApp."}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Your Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#FAF7F4] border border-[#EDE5DD] text-[#1C0F05] focus:ring-2 focus:ring-[#6B3A1F]/15 transition-all placeholder:text-[#C9B8A8]" />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B3A1F]">+91</span>
              <input type="tel" placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none bg-[#FAF7F4] border border-[#EDE5DD] text-[#1C0F05] focus:ring-2 focus:ring-[#6B3A1F]/15 transition-all placeholder:text-[#C9B8A8]" />
            </div>
            {tab === "visit" && <input type="date" className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#FAF7F4] border border-[#EDE5DD] text-[#1C0F05] focus:ring-2 focus:ring-[#6B3A1F]/15 transition-all" />}
            <button onClick={() => name && phone && setSubmitted(true)} className="group relative w-full py-3.5 rounded-xl font-black text-sm overflow-hidden bg-[#6B3A1F] text-[#E8D5B0] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200" style={{ boxShadow: "0 4px 16px rgba(107,58,31,0.30)" }}>
              <span className="relative z-10">{tab === "callback" ? "Get Free Callback →" : "Schedule Site Visit →"}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────
function Section({ id, title, sub, children }: { id?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-1 h-6 flex-shrink-0 mt-0.5 rounded-full" style={{ background: "linear-gradient(to bottom,#6B3A1F,#C9A84C)" }} />
        <div>
          <h2 className="font-display font-bold text-[#1C0F05] text-xl sm:text-2xl leading-tight">{title}</h2>
          {sub && <p className="text-xs font-medium text-[#A8978A] mt-0.5">{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[hsl(40,40%,97%)] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-200 rounded-xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl" />
              <div className="h-48 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-96 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Bar ───────────────────────────────────────────
function MobileBar({ owner, ownerType, propertyTitle }: { owner: string; ownerType: string; propertyTitle: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#EDE5DD] px-4 py-3 flex items-center gap-3" style={{ boxShadow: "0 -4px 20px rgba(107,58,31,0.10)" }}>
        <a href={`tel:${owner}`} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-[#EDE5DD] text-[#6B3A1F] hover:bg-[#FAF7F4] transition-colors">
          <Phone size={14} /> Call Owner
        </a>
        <button onClick={() => setOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-[#6B3A1F] text-[#E8D5B0]" style={{ boxShadow: "0 4px 14px rgba(107,58,31,0.28)" }}>
          Get Details
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden bg-white" style={{ animation: "slideUp 0.28s cubic-bezier(0.22,1,0.36,1)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE5DD]">
              <p className="font-display font-bold text-[#1C0F05]">Contact {owner?.split(" ")[0] || "Owner"}</p>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF7F4] text-[#6B3A1F]">
                <X size={15} />
              </button>
            </div>
            <div className="p-4 pb-8">
              <LeadForm owner={owner} ownerType={ownerType} propertyTitle={propertyTitle} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await propertiesApi.getOne(slug);

        let propertyData = null;
        if (response.property) {
          propertyData = response.property;
        } else if (response.data) {
          propertyData = response.data;
        } else {
          propertyData = response;
        }

        setProperty(propertyData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError("Property not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  if (loading) return <LoadingSkeleton />;
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(40,40%,97%)] py-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="font-black text-xl text-[#1C0F05] mb-2">Property Not Found</h2>
          <p className="text-[#A8978A] mb-6">{error || "The property you're looking for doesn't exist."}</p>
          <Link href="/properties" className="px-6 py-3 bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-white rounded-xl font-bold">
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  const sc = STATUS_CFG[property.status] ?? STATUS_CFG["Ready To Move"];
  const navTabs = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(id);
  };

  // Prepare specs array
  const specifications = [
    { label: "Bedrooms", value: `${property.bedrooms} BHK`, icon: <BedDouble size={13} /> },
    { label: "Bathrooms", value: `${property.bathrooms} Baths`, icon: <Bath size={13} /> },
    { label: "Area", value: `${property.area} ${property.areaUnit}`, icon: <Maximize2 size={13} /> },
    { label: "Floor", value: property.floor || `Ground`, icon: <Layers size={13} /> },
    { label: "Facing", value: property.facing || "East", icon: <Navigation size={13} /> },
    { label: "Parking", value: property.parking ? `${property.parkingCount} Covered` : "No Parking", icon: <Car size={13} /> },
    { label: "Furnished", value: property.furnished === "furnished" ? "Fully Furnished" : property.furnished === "semi-furnished" ? "Semi-Furnished" : "Unfurnished", icon: <Home size={13} /> },
    { label: "Age", value: property.ageOfProperty || "New", icon: <CalendarCheck size={13} /> },
  ];

  // Prepare amenities array from boolean fields
  const amenitiesList = (property.amenities || []) as Array<{
    label: string;
    icon: string;
    category: string;
  }>;

  // Prepare nearby places
  const nearbyPlaces = [
    { type: "Metro", name: "Nearest Metro Station", distance: "1.5 km", icon: "🚇" },
    { type: "Highway", name: "Expressway", distance: "0.5 km", icon: "🛣️" },
    { type: "School", name: "International School", distance: "2 km", icon: "🏫" },
    { type: "Hospital", name: "Multi-speciality Hospital", distance: "3 km", icon: "🏥" },
    { type: "Mall", name: "Shopping Mall", distance: "4 km", icon: "🛍️" },
    { type: "Park", name: "City Park", distance: "1 km", icon: "🌿" },
  ];

  return (
    <div className="min-h-screen pb-[72px] lg:pb-0 bg-[hsl(40,40%,97%)] py-20">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#EDE5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#A8978A] whitespace-nowrap">
            {[["Home", "/"], ["Properties", "/properties"], [property.city?.name || "Noida", `/properties?city=${property.city?.name}`]].map(([l, h]) => (
              <span key={h} className="flex items-center gap-1.5 flex-shrink-0">
                <Link href={h} className="hover:text-[#6B3A1F] transition-colors">{l}</Link>
                <ChevronRight size={9} />
              </span>
            ))}
            <span className="font-semibold text-[#6B3A1F] truncate">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex gap-5 lg:gap-7 items-start">

          {/* ── Left Content ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Title block */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${sc.dot}`} />{property.status || "Ready To Move"}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${property.listingType === "rent" ? "bg-blue-500 text-white" : "bg-[#6B3A1F] text-[#E8D5B0]"}`}>
                      For {property.listingType === "rent" ? "Rent" : "Sale"}
                    </span>
                    {property.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <BadgeCheck size={10} /> Verified
                      </span>
                    )}
                    {property.reraNo && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <BadgeCheck size={10} /> RERA Registered
                      </span>
                    )}
                  </div>
                  <h1 className="font-display font-bold text-[#1C0F05] text-xl sm:text-3xl leading-tight mb-1">{property.title}</h1>
                  {property.society && <p className="text-sm font-semibold text-[#A8978A] mb-1">{property.society}</p>}
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#C9A84C] flex-shrink-0" />
                    <span className="text-sm font-medium text-[#7A6858]">{property.address || property.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setWished(!wished)} className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:scale-105 ${wished ? "bg-red-50 border-red-200" : "bg-[#FAF7F4] border-[#EDE5DD]"}`}>
                    <Heart size={15} className={wished ? "text-red-500 fill-red-500" : "text-[#6B3A1F]"} />
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FAF7F4] border border-[#EDE5DD] text-[#6B3A1F] hover:scale-105 transition-all">
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* Price bar */}
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white border border-[#EDE5DD]" style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.07)" }}>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#A8978A] mb-0.5">{property.listingType === "rent" ? "Monthly Rent" : "Sale Price"}</p>
                  <p className="font-display font-black text-2xl sm:text-3xl leading-none text-[#1C0F05]">{property.priceLabel}</p>
                  {property.pricePerSqft && <p className="text-xs text-[#A8978A] mt-0.5">₹{property.pricePerSqft}/sq.ft</p>}
                </div>
                <div className="w-px h-12 bg-[#EDE5DD] hidden sm:block" />
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {[
                    { l: "BHK", v: `${property.bedrooms} BHK` },
                    { l: "Area", v: `${property.area} ${property.areaUnit}` },
                    { l: "Floor", v: property.floor || "Ground" },
                    { l: "Facing", v: property.facing || "East" },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#A8978A] mb-0.5">{l}</p>
                      <p className="text-xs font-bold text-[#1C0F05]">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                  <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border border-[#EDE5DD] bg-white text-[#6B3A1F] hover:-translate-y-0.5 transition-all">
                    <Download size={11} /> Details
                  </button>
                  <a href={`tel:${property.ownerPhone}`} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-black text-xs bg-[#6B3A1F] text-[#E8D5B0] hover:-translate-y-0.5 transition-all" style={{ boxShadow: "0 4px 14px rgba(107,58,31,0.28)" }}>
                    <Phone size={11} /> Call Owner
                  </a>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <Gallery images={property.images || []} />

            {/* Sticky nav */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EDE5DD]" style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.06)" }}>
              <div className="flex items-center overflow-x-auto scrollbar-hide">
                {navTabs.map(({ id, label }) => (
                  <button key={id} onClick={() => scrollTo(id)} className={`relative flex-shrink-0 px-4 sm:px-5 py-4 font-bold text-xs whitespace-nowrap transition-colors ${activeTab === id ? "text-[#6B3A1F]" : "text-[#A8978A] hover:text-[#6B3A1F]"}`}>
                    {label}
                    {activeTab === id && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full bg-[#6B3A1F]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview */}
            <Section id="overview" title="Property Overview">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {specifications.map(({ label, value, icon }) => (
                  <div key={label} className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-[#EDE5DD] hover:-translate-y-0.5 transition-all" style={{ boxShadow: "0 2px 10px rgba(107,58,31,0.05)" }}>
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#6B3A1F]/8 text-[#C9A84C]">{icon}</span>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#A8978A] mb-0.5">{label}</p>
                      <p className="text-xs font-bold text-[#1C0F05] leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#EDE5DD] mb-5" style={{ boxShadow: "0 2px 10px rgba(107,58,31,0.05)" }}>
                <p className="text-sm leading-relaxed text-[#5A4A3A]">{property.description || "No description available."}</p>
              </div>

              {property.highlights && property.highlights.length > 0 && (
                <div className="p-4 sm:p-6 rounded-2xl bg-[#FAF7F4] border border-[#EDE5DD]">
                  <p className="font-bold text-[10px] uppercase tracking-[0.18em] text-[#6B3A1F] mb-4">Key Highlights</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.highlights.map((h: string) => (
                      <div key={h} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                          <CheckCircle2 size={9} className="text-white" />
                        </span>
                        <span className="text-xs font-medium text-[#5A4A3A] leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Details */}
            <Section id="details" title="Property Details" sub="Complete specification breakdown">
              <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden mb-5" style={{ boxShadow: "0 2px 10px rgba(107,58,31,0.05)" }}>
                {specifications.map((spec, i) => (
                  <div key={spec.label} className={`grid grid-cols-2 border-b border-[#F5EFE8] last:border-0 ${i % 2 === 0 ? "bg-[#FAF7F4]" : ""}`}>
                    <div className="flex items-center gap-2.5 px-4 py-3 border-r border-[#F5EFE8]">
                      <span className="text-[#C9A84C] flex-shrink-0">{spec.icon}</span>
                      <span className="text-[11px] font-semibold text-[#A8978A] uppercase tracking-wide">{spec.label}</span>
                    </div>
                    <div className="px-4 py-3">
                      <span className="text-sm font-semibold text-[#1C0F05]">{spec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Amenities */}
            <Section id="amenities" title="Amenities" sub={`${amenitiesList.length} amenities`}>
                {amenitiesList.length === 0 ? (
                  <p className="text-sm text-[#A8978A] text-center py-8">No amenities listed.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {amenitiesList.map((a, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 p-3.5 rounded-2xl text-center bg-white border border-[#EDE5DD] hover:border-[#C9A84C] hover:-translate-y-0.5 transition-all" style={{ boxShadow: "0 2px 10px rgba(107,58,31,0.05)" }}>
                        <span className="text-2xl">{a.icon || "🏠"}</span>
                        <div>
                          <span className="text-[10px] font-bold leading-snug text-[#1C0F05] block">{a.label}</span>
                          {a.category && <span className="text-[9px] text-[#A8978A]">{a.category}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

            {/* Location */}
            <Section id="location" title="Location & Nearby" sub={property.address || property.location}>
              <div className="relative rounded-2xl overflow-hidden mb-5 border border-[#EDE5DD]" style={{ height: "180px", background: "#F5EFE8" }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#6B3A1F]" style={{ boxShadow: "0 4px 14px rgba(107,58,31,0.28)" }}>
                    <Navigation size={22} className="text-[#E8D5B0]" />
                  </div>
                  <p className="font-bold text-sm text-[#6B3A1F]">{property.location}</p>
                  <a href="https://maps.google.com" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-[#6B3A1F] text-[#E8D5B0] hover:-translate-y-0.5 transition-all" style={{ boxShadow: "0 4px 12px rgba(107,58,31,0.25)" }}>
                    Open in Maps <ArrowRight size={11} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyPlaces.map(n => (
                  <div key={n.name} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#EDE5DD] hover:border-[#C9A84C] hover:shadow-[0_4px_16px_rgba(107,58,31,0.08)] transition-all">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base bg-[#FAF7F4]">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#A8978A] mb-0.5">{n.type}</p>
                      <p className="text-xs font-semibold text-[#1C0F05] truncate">{n.name}</p>
                    </div>
                    <span className="flex-shrink-0 text-[10px] font-black px-2 py-1 rounded-lg bg-[#FAF7F4] text-[#6B3A1F]">{n.distance}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Owner Card */}
            <Section title="Listed By">
              <div className="bg-white rounded-2xl border border-[#EDE5DD] p-5" style={{ boxShadow: "0 2px 10px rgba(107,58,31,0.05)" }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-black" style={{ background: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                    {property.owner?.split(" ").map((n: string) => n[0]).join("") || "O"}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#1C0F05] text-base">{property.owner || "Property Owner"}</h3>
                    <p className="text-xs text-[#A8978A] mt-0.5">{property.ownerType === "owner" ? "Owner" : property.ownerType === "builder" ? "Builder" : "Agent"} · Direct Listing</p>
                  </div>
                  <div className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold ${property.ownerType === "owner" ? "bg-[#6B3A1F]/8 text-[#6B3A1F]" : "bg-blue-50 text-blue-700"}`}>
                    {property.ownerType === "owner" ? "Owner" : property.ownerType === "builder" ? "Builder" : "Agent"}
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={`tel:${property.ownerPhone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border border-[#EDE5DD] text-[#6B3A1F] hover:bg-[#FAF7F4] transition-colors">
                    <Phone size={13} /> {property.ownerPhone}
                  </a>
                  <a href="https://wa.me/919999999999" target="_blank" className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg bg-[#25D366]">
                    💬
                  </a>
                </div>
              </div>
            </Section>
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="hidden lg:flex flex-col flex-shrink-0 sticky top-20 gap-4" style={{ width: "340px" }}>
            <LeadForm owner={property.owner} ownerType={property.ownerType} propertyTitle={property.title} />

            <div className="rounded-2xl bg-white border border-[#EDE5DD] overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(107,58,31,0.08)" }}>
              <div className="px-4 py-3 border-b border-[#EDE5DD]">
                <p className="font-bold text-[10px] uppercase tracking-[0.18em] text-[#6B3A1F]">Direct Contact</p>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <a href={`tel:${property.ownerPhone}`} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD] hover:bg-[#F5EFE8] transition-colors">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#6B3A1F]">
                    <Phone size={13} className="text-[#E8D5B0]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide">Owner Direct</p>
                    <p className="text-sm font-black text-[#1C0F05]">{property.ownerPhone}</p>
                  </div>
                  <ChevronRight size={13} className="text-[#A8978A] ml-auto flex-shrink-0" />
                </a>
                <a href="https://wa.me/919999999999" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200/50 hover:bg-emerald-50/80 transition-colors">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#25D366] text-base">💬</span>
                  <div>
                    <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide">WhatsApp</p>
                    <p className="text-sm font-black text-[#1C0F05]">Chat with Owner</p>
                  </div>
                  <ChevronRight size={13} className="text-[#A8978A] ml-auto flex-shrink-0" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-[#D4C4B0]" style={{ background: "linear-gradient(135deg,#1C0F05,#3B1D0D)", boxShadow: "0 8px 32px rgba(107,58,31,0.22)" }}>
              <p className="font-bold text-[9px] uppercase tracking-[0.20em] text-[#C9A84C] mb-3">Why This Property</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: <Shield size={12} />, text: property.reraNo ? "RERA Registered & Verified" : "Verified Listing" },
                  { icon: <TrendingUp size={12} />, text: "Great Investment Potential" },
                  { icon: <Clock size={12} />, text: property.possessionDate ? `Possession: ${new Date(property.possessionDate).getFullYear()}` : "Ready to Move" },
                  { icon: <Users size={12} />, text: "Direct Owner — No Brokerage" },
                  { icon: <BadgeCheck size={12} />, text: "Nestory Verified Property" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#C9A84C]/15 text-[#C9A84C]">{icon}</span>
                    <span className="text-xs font-medium text-[#C9A84C]/70">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <MobileBar owner={property.owner} ownerType={property.ownerType} propertyTitle={property.title} />

      <style>{`
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}