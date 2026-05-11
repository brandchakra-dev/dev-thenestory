"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Heart, Share2, ChevronRight,
  BadgeCheck, ArrowRight, BedDouble, Maximize2,
  Building2, CalendarCheck, CheckCircle2, X, ChevronLeft,
  Zap, Home, Navigation, Shield, Clock, Users,
  TrendingUp, Eye
} from "lucide-react";

import DOMPurify from "dompurify";

import { projectsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

console.log(getImageUrl);

// ─────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────
const statusCls: Record<string, { wrap: string; dot: string }> = {
  "New Launch": { wrap: "bg-[#6B3A1F]/10 border border-[#6B3A1F]/20 text-[#6B3A1F]", dot: "bg-[#6B3A1F]" },
  "Ready To Move": { wrap: "bg-emerald-50 border border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
  "Under Construction": { wrap: "bg-amber-50 border border-amber-200 text-amber-700", dot: "bg-amber-500" },
  "Upcoming": { wrap: "bg-blue-50 border border-blue-200 text-blue-700", dot: "bg-blue-500" },
};

// ─────────────────────────────────────────────────────────
// GALLERY COMPONENT (Dynamic)
// ─────────────────────────────────────────────────────────
function Gallery({ images }: { images: any[] }) {
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
      <div className="rounded-2xl overflow-hidden border border-[#EDE5DD] shadow-md">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden cursor-pointer group"
          onClick={() => setLightbox(true)}>
          <img
            src={imageUrls[active]}
            alt="Project"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-black/55 text-white backdrop-blur-sm border border-white/15">
            <Eye size={11} /> {imageUrls.length} Photos
          </div>

          <button onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/25 text-white hover:bg-white/35 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/25 text-white hover:bg-white/35 transition-all">
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {imageUrls.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-5 bg-[#C9A84C]" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 p-3 bg-[#6B3A1F]/5 border-t border-[#EDE5DD] overflow-x-auto">
          {imageUrls.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 w-[72px] h-[50px] ${active === i ? "ring-2 ring-[#6B3A1F] ring-offset-1 opacity-100" : "opacity-55 hover:opacity-80"}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/93 backdrop-blur-sm" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <X size={18} />
          </button>
          <button onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="relative w-full max-w-4xl mx-16 aspect-video rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={imageUrls[active]} alt="" className="w-full h-full object-cover" />
          </div>
          <button onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/12 border border-white/18 text-white hover:bg-white/20 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// LEAD FORM
// ─────────────────────────────────────────────────────────
function LeadForm({ projectTitle }: { projectTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-[#C9A84C]/30 shadow-lg">
      <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D]">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          <span className="text-[9px] font-black tracking-[0.24em] uppercase text-[#C9A84C]">Free Consultation</span>
        </div>
        <p className="font-black text-white text-lg leading-snug mb-1">
          Get Best Price &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D5B0]">Exclusive Offers</span>
        </p>
        <p className="text-xs text-[#C9A84C]/50 mb-4">Expert callback within 30 minutes</p>
      </div>

      <div className="p-4 bg-white">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={30} className="text-emerald-500" />
            </div>
            <p className="font-black text-base text-[#1C0F05] mb-1">We'll call you shortly!</p>
            <p className="text-xs text-[#A8978A]">Our advisor will reach out within 30 min.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Your Full Name" value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#FAF7F4] border border-[#EDE5DD] focus:ring-2 focus:ring-[#6B3A1F]/15" />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B3A1F]">+91</span>
              <input type="tel" placeholder="Mobile Number" value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none bg-[#FAF7F4] border border-[#EDE5DD] focus:ring-2 focus:ring-[#6B3A1F]/15" />
            </div>
            <button onClick={() => name && phone && setSubmitted(true)}
              className="group relative w-full py-3.5 rounded-xl font-black text-sm overflow-hidden bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] hover:-translate-y-0.5 transition-all shadow-md">
              <span className="relative z-10">Get Free Callback →</span>
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
function Section({ id, title, sub, children }: { id?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-1 h-6 flex-shrink-0 mt-0.5 rounded-full bg-gradient-to-b from-[#6B3A1F] to-[#C9A84C]" />
        <div>
          <h2 className="font-black text-[#1C0F05] text-xl sm:text-2xl leading-tight">{title}</h2>
          {sub && <p className="text-xs font-medium text-[#A8978A] mt-0.5">{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [wished, setWished] = useState(false);
  const [activeBhk, setActiveBhk] = useState("All");

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await projectsApi.getOne(slug);
        
        let projectData = null;
        if (response.project) {
          projectData = response.project;
        } else if (response.data) {
          projectData = response.data;
        } else {
          projectData = response;
        }
        console.log('proje',response);
        
        setProject(projectData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Project not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    console.log("yrl",getImageUrl);
    fetchProject();
  }, [slug]);

  if (loading) return <LoadingSkeleton />;
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(40,40%,97%)] py-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="font-black text-xl text-[#1C0F05] mb-2">Project Not Found</h2>
          <p className="text-[#A8978A] mb-6">{error || "The project you're looking for doesn't exist."}</p>
          <Link href="/projects" className="px-6 py-3 bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-white rounded-xl font-bold">
            Browse All Projects
          </Link>
        </div>
      </div>
    );
  }

  const sc = statusCls[project.status] ?? statusCls["New Launch"];
  const navTabs = [
    { id: "overview", label: "Overview" },
    { id: "floor-plans", label: "Floor Plans" },
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
    { id: "developer", label: "Developer" },
  ];

  const bhkOpts = ["All", ...new Set((project.units || []).map((u: any) => u.bhk?.split(" ")[0] + " BHK").filter(Boolean))];
  const filteredUnits = activeBhk === "All" ? (project.units || []) : (project.units || []).filter((u: any) => u.bhk?.startsWith(activeBhk.replace(" BHK", "")));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(id);
  };

  const cleanHTML = DOMPurify.sanitize(project.description || "");

  return (
    <div className="min-h-screen pb-[72px] lg:pb-0 bg-[hsl(40,40%,97%)] py-20">
      {/* Breadcrumb */}
      <div className="border-b border-[#EDE5DD] bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-1.5 text-xs text-[#A8978A] flex-wrap">
            <Link href="/" className="hover:text-[#6B3A1F]">Home</Link>
            <ChevronRight size={9} />
            <Link href="/projects" className="hover:text-[#6B3A1F]">Projects</Link>
            <ChevronRight size={9} />
            <span className="font-semibold text-[#6B3A1F] truncate">{project.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex gap-5 lg:gap-7 items-start">

          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Title + Price + Gallery */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.wrap}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${sc.dot}`} />
                      {project.status}
                    </span>
                    {project.reraNo && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <BadgeCheck size={10} /> RERA Approved
                      </span>
                    )}
                  </div>
                  <h1 className="font-black text-[#1C0F05] text-xl sm:text-3xl lg:text-4xl leading-tight mb-1.5">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <MapPin size={13} className="text-[#C9A84C] flex-shrink-0" />
                    <span className="text-sm font-medium text-[#7A6858]">{project.location}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#A8978A]">by {project.builder?.name || "Top Builder"}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setWished(!wished)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${wished ? "bg-red-50 border-red-200/60" : "bg-[#6B3A1F]/5 border-[#EDE5DD]"}`}>
                    <Heart size={15} className={wished ? "text-red-500 fill-red-500" : "text-[#6B3A1F]"} />
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#6B3A1F]/5 border border-[#EDE5DD] text-[#6B3A1F]">
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* Price bar */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EDE5DD] shadow-md">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#A8978A] mb-0.5">Starting Price</p>
                  <p className="font-black text-2xl sm:text-3xl leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C]">
                    {project.priceLabel}
                  </p>
                </div>
                <div className="w-px h-10 bg-[#EDE5DD] flex-shrink-0 hidden sm:block" />
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {[
                    ["BHK", project.bhk?.join(", ") || "2, 3, 4 BHK"],
                    ["Possession", project.possessionDate ? new Date(project.possessionDate).getFullYear() : "2026"],
                    ["RERA", project.reraNo || "Applied"]
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[9px] font-black uppercase tracking-wider text-[#A8978A] mb-0.5">{l}</p>
                      <p className="text-xs font-bold text-[#1C0F05]">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                  <a href="tel:+919999999999"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] hover:-translate-y-0.5 transition-all shadow-md">
                    <Phone size={11} /> Get Details
                  </a>
                </div>
              </div>

              <Gallery images={project.images || []} />
            </div>

            {/* Sticky Nav */}
            <div className="sticky top-0 z-30 bg-white/92 backdrop-blur-md border-b border-[#EDE5DD] shadow-sm">
              <div className="flex items-center overflow-x-auto">
                {navTabs.map(({ id, label }) => (
                  <button key={id} onClick={() => scrollTo(id)}
                    className={`relative flex-shrink-0 px-4 sm:px-5 py-4 font-bold text-xs whitespace-nowrap transition-colors ${activeTab === id ? "text-[#6B3A1F]" : "text-[#A8978A] hover:text-[#6B3A1F]"}`}>
                    {label}
                    {activeTab === id && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview */}
            <Section id="overview" title="Project Overview" sub={`${project.totalUnits || 0} units · ${project.totalTowers || 0} towers`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Total Units", value: project.totalUnits || "N/A", icon: <Home size={13} /> },
                  { label: "BHK Options", value: project.bhk?.join(", ") || "2,3,4 BHK", icon: <BedDouble size={13} /> },
                  { label: "Status", value: project.status, icon: <Zap size={13} /> },
                  { label: "RERA No.", value: project.reraNo || "Applied", icon: <BadgeCheck size={13} /> },
                  { label: "Total Area", value: project.totalArea || "N/A", icon: <Maximize2 size={13} /> },
                  { label: "Possession", value: project.possessionDate ? new Date(project.possessionDate).getFullYear() : "2026", icon: <CalendarCheck size={13} /> },
                  { label: "Towers", value: `${project.totalTowers || 0} Towers`, icon: <Building2 size={13} /> },
                  { label: "Floors", value: `${project.totalFloors || 0} Floors`, icon: <Building2 size={13} /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-[#EDE5DD] shadow-sm">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#6B3A1F]/5 text-[#C9A84C]">{icon}</span>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#A8978A] mb-0.5">{label}</p>
                      <p className="text-xs font-black text-[#1C0F05] leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#EDE5DD] shadow-sm mb-5">
                {/* <p className="text-sm leading-relaxed text-[#7A6858]">{project.description || "No description available."}</p> */}
                <div
                className="
                  prose 
                  prose-lg 
                  max-w-none

                  prose-table:border
                  prose-th:border
                  prose-td:border

                  prose-headings:text-[#1C0F05]
                  prose-headings:font-bold

                  prose-p:text-[#3D2B1A]
                  prose-p:leading-8

                  prose-a:text-[#6B3A1F]
                  prose-a:no-underline
                  hover:prose-a:text-[#C9A84C]

                  prose-strong:text-[#1C0F05]

                  prose-li:text-[#3D2B1A]

                  prose-blockquote:border-l-[#C9A84C]
                  prose-blockquote:text-[#6B5C4E]

                  prose-img:rounded-2xl
                  prose-img:shadow-lg

                  prose-code:text-[#6B3A1F]

                  prose-pre:bg-[#1C0F05]
                  prose-pre:text-white
                "
                dangerouslySetInnerHTML={{ __html: cleanHTML }}
              />
              </div>



              {project.highlights && project.highlights.length > 0 && (
                <div className="p-4 sm:p-6 rounded-2xl bg-[#6B3A1F]/5 border border-[#6B3A1F]/10">
                  <p className="font-black text-[10px] uppercase tracking-[0.18em] text-[#6B3A1F] mb-4">Key Highlights</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.highlights.map((h: string) => (
                      <div key={h} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C]">
                          <CheckCircle2 size={9} className="text-white" />
                        </span>
                        <span className="text-xs font-medium text-[#7A6858] leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Floor Plans */}
            {project.units && project.units.length > 0 && (
              <Section id="floor-plans" title="Floor Plans & Configurations" sub="Choose your perfect home">
                <div className="flex flex-wrap gap-2 mb-5">
                  {bhkOpts.map((b: any) => (
                    <button key={b} onClick={() => setActiveBhk(b)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeBhk === b ? "bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] shadow-md" : "bg-white text-[#7A6858] border border-[#EDE5DD]"}`}>
                      {b}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredUnits.map((unit: any, i: number) => (
                    <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] shadow-sm hover:-translate-y-0.5 transition-all">
                      <div className="relative h-40 overflow-hidden">
                      {unit.floorPlan?.url ? (
                        <img
                          src={getImageUrl(unit.floorPlan.url)}
                          alt={unit.bhk}
                          className="w-full h-full object-cover transition-transform group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <Building2 size={32} className="text-[#A8978A]" />
                          <p className="text-xs font-medium text-[#A8978A]">Floor Plan Coming Soon</p>
                        </div>
                      )}
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-black text-lg text-[#1C0F05] leading-none">{unit.price}</p>
                          <p className="text-[10px] font-semibold text-[#A8978A] mt-1">Floors {unit.floors}</p>
                        </div>
                        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] shadow-sm">
                          View Plan <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <Section id="amenities" title="Amenities" sub="World-class facilities for elevated living">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.amenities.map((item: any, i: number) => (
                    <div key={i} className="group flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-white border border-[#EDE5DD] shadow-sm text-center hover:-translate-y-0.5 transition-all">
                      <span className="text-2xl transition-transform group-hover:scale-110">{item.icon || "🏠"}</span>
                      <span className="text-[10px] font-bold text-[#7A6858] leading-snug">{item.label}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#6B3A1F]/5 text-[#A8978A]">{item.cat || "Amenity"}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Location */}
            <Section id="location" title="Location & Connectivity" sub={project.location}>
              <div className="relative rounded-2xl overflow-hidden mb-5 border border-[#EDE5DD] bg-[#FAF7F4]" style={{ height: "200px" }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] shadow-md">
                    <Navigation size={22} className="text-[#E8D5B0]" />
                  </div>
                  <p className="font-bold text-sm text-[#6B3A1F]">{project.location}</p>
                  <a href="https://maps.google.com" target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] text-[#E8D5B0] hover:-translate-y-0.5 transition-all shadow-md">
                    Open in Maps <ArrowRight size={11} />
                  </a>
                </div>
              </div>

              {project.nearby && project.nearby.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.nearby.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#EDE5DD] hover:shadow-md transition-all">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base bg-[#6B3A1F]/5">{item.icon || "📍"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-wider text-[#A8978A] mb-0.5">{item.type}</p>
                        <p className="text-xs font-semibold text-[#1C0F05] truncate">{item.name}</p>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-black px-2 py-1 rounded-lg bg-[#6B3A1F]/5 text-[#6B3A1F]">{item.dist}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Developer */}
            <Section id="developer" title="About Developer" sub={project.builder?.name || "Developer"}>
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#EDE5DD] shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D] shadow-md">
                    <Building2 size={22} className="text-[#E8D5B0]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#1C0F05]">{project.builder?.name || "Premium Developer"}</h3>
                    <p className="text-xs font-medium text-[#A8978A]">Premium Real Estate Developer · NCR</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#7A6858]">
                  {project.builder?.description || `${project.builder?.name || "The developer"} is a renowned real estate developer known for quality construction and timely delivery of premium residential projects.`}
                </p>
              </div>
            </Section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:flex flex-col flex-shrink-0 sticky top-20 rounded-2xl overflow-hidden" style={{ width: "340px" }}>
            <div className="overflow-y-auto flex-1 max-h-[calc(100vh-120px)]">
              <LeadForm projectTitle={project.title} />

              <div className="mt-4 rounded-2xl bg-white border border-[#EDE5DD] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#EDE5DD]">
                  <p className="font-black text-[10px] uppercase tracking-[0.18em] text-[#6B3A1F]">Direct Contact</p>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <a href="tel:+919540311311"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#6B3A1F]/5 border border-[#6B3A1F]/10 hover:bg-[#6B3A1F]/10 transition-colors">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-[#6B3A1F] to-[#3B1D0D]">
                      <Phone size={13} className="text-[#E8D5B0]" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide">Call Us Now</p>
                      <p className="text-sm font-black text-[#1C0F05]">+919540311311</p>
                    </div>
                    <ChevronRight size={13} className="text-[#A8978A] ml-auto" />
                  </a>
                  <a href="https://wa.me/919540311311" target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200/50 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#25D366] text-base">💬</span>
                    <div>
                      <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide">WhatsApp</p>
                      <p className="text-sm font-black text-[#1C0F05]">Chat with Expert</p>
                    </div>
                    <ChevronRight size={13} className="text-[#A8978A] ml-auto" />
                  </a>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#1C0F05] to-[#3B1D0D] p-4 border border-[#C9A84C]/15">
                <p className="font-black text-[9px] uppercase tracking-[0.20em] text-[#C9A84C] mb-3">Why Buy Here</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon: <Shield size={12} />, text: "RERA Registered & Approved" },
                    { icon: <TrendingUp size={12} />, text: "High Appreciation Potential" },
                    { icon: <Clock size={12} />, text: `Possession in ${project.possessionDate ? new Date(project.possessionDate).getFullYear() : "2026"}` },
                    { icon: <Users size={12} />, text: "Trusted by 500+ families" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#C9A84C]/15 text-[#C9A84C]">{icon}</span>
                      <span className="text-xs font-medium text-[#C9A84C]/75">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}