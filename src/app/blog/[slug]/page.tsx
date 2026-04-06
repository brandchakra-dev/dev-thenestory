"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Clock, User, Calendar, Share2, Bookmark,
  BookmarkCheck, Twitter, Linkedin, Link2, ChevronRight,
  TrendingUp, ArrowUpRight, Quote, Eye
} from "lucide-react";

// ─── Mock article data ────────────────────────────────────
const article = {
  slug: "delhi-ncr-real-estate-2025",
  title: "Delhi NCR Real Estate Outlook 2025: What Buyers Must Know Before Investing",
  subtitle: "From rising prices in Sector 150 to the Yamuna Expressway boom — the complete ground-level analysis for smart buyers this year.",
  category: "Market Trends",
  author: {
    name: "Ankit Sharma",
    role: "Senior Real Estate Analyst",
    bio: "Ankit has covered Delhi NCR real estate markets for over 9 years, advising HNI clients and NRIs on strategic property investments across the NCR corridor.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  date: "January 12, 2025",
  readTime: "8 min read",
  views: "12.4k",
  heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=90",
  heroCaption: "The Noida-Greater Noida Expressway has seen a surge in luxury residential launches in late 2024.",
  tag: "Editor's Pick",
  sections: [
    {
      type: "intro",
      text: "The Delhi NCR real estate market entered 2025 with remarkable momentum. After years of sluggish demand and builder defaults, the market has turned a decisive corner — driven by infrastructure upgrades, increased buyer confidence post-RERA, and a new wave of NRI investment fueled by a favorable rupee.",
    },
    {
      type: "heading",
      text: "The Macro Picture: Why 2025 Feels Different",
    },
    {
      type: "paragraph",
      text: "Three structural forces are reshaping NCR real estate in 2025. First, the completion of Delhi-Meerut Expressway and Dwarka Expressway has fundamentally redrawn accessibility maps — localities that once required a 90-minute commute now sit 35 minutes from CP. Second, RERA enforcement has improved dramatically; builder defaults in UP-RERA fell 31% year-on-year in 2024. Third, and most importantly, end-user demand — not speculative buying — is now the primary driver of transactions.",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85",
      caption: "Luxury mid-rise towers in Sector 150, Noida — now one of NCR's most sought-after green addresses.",
      alt: "Luxury apartments Noida Sector 150",
    },
    {
      type: "heading",
      text: "Sector 150, Noida: The Green Address Premium",
    },
    {
      type: "paragraph",
      text: "Sector 150 has emerged as NCR's most talked-about micro-market. With 80% green cover, proximity to the Golf Course, and a cluster of premium developers — ATS, Godrej, Supertech — average rates have crossed ₹9,500/sqft, up from ₹7,200 just 18 months ago. What drives this? It's not just the green quotient; it's the demographic shift. Young professionals earning ₹40–80 LPA are actively choosing Sector 150 over Gurugram's Golf Course Road because of lower entry prices and better resale liquidity.",
    },
    {
      type: "pullquote",
      text: "End-user demand — not speculative buying — is now the primary driver of NCR real estate transactions in 2025.",
    },
    {
      type: "heading",
      text: "Yamuna Expressway: Infrastructure Arbitrage at Scale",
    },
    {
      type: "paragraph",
      text: "The Yamuna Expressway Industrial Development Authority (YEIDA) corridor represents the single biggest infrastructure arbitrage play in NCR today. Jewar International Airport — set for Phase 1 completion by late 2025 — is the anchor catalyst. Residential plots in YEIDA Sectors 18, 20, and 22D are still available in the ₹35,000–55,000/sqyard range, compared to ₹1.2–1.8 lakh/sqyard near Indira Gandhi International Airport.",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85",
      caption: "Aerial view of Yamuna Expressway corridor — India's fastest-developing real estate belt.",
      alt: "Yamuna Expressway aerial view",
    },
    {
      type: "heading",
      text: "Gurugram vs Noida: A Shifting Balance",
    },
    {
      type: "paragraph",
      text: "For the first time in a decade, Noida is registering higher transaction volumes than Gurugram in the ₹1–3 crore segment. The reasons are multiple: better RERA compliance in UP compared to Haryana, superior road and metro connectivity following the Aqua Line expansion, and a growing IT/ITES cluster around Sectors 62, 125, and 135 that generates stable rental demand. Gurugram retains its edge in the ₹5 crore+ luxury segment and for corporates requiring proximity to IGI Airport.",
    },
    {
      type: "pullquote",
      text: "For the first time in a decade, Noida is registering higher transaction volumes than Gurugram in the ₹1–3 crore segment.",
    },
    {
      type: "heading",
      text: "What Buyers Should Watch in H1 2025",
    },
    {
      type: "paragraph",
      text: "Three specific developments will shape buyer decisions in the first half of 2025. The RBI's stance on repo rates — a 25 bps cut is widely expected in April — will directly impact EMI affordability and could unlock a new cohort of fence-sitters. The Union Budget's stance on housing tax deductions (Section 24b limits have been stagnant since 2014) is another pressure point. Finally, the formal YEIDA Master Plan 2041 notification, expected Q2 2025, will clarify land-use zoning along the Expressway and could cause a sharp re-rating of plot values.",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
      caption: "Modern residential complexes along NH-58 — part of the new NCR growth corridor.",
      alt: "Modern residential complexes NCR",
    },
    {
      type: "heading",
      text: "The Verdict: Where Smart Money Is Going",
    },
    {
      type: "paragraph",
      text: "Based on fundamentals, our top three micro-market picks for 2025 are: (1) Sector 150, Noida for end-use buyers in the ₹80L–1.5Cr range seeking immediate possession in a green environment; (2) YEIDA Sectors 18–22 for 5–7 year investment horizon buyers willing to hold land; (3) Dwarka Expressway, Gurugram for professionals prioritising airport proximity with ₹1.5–3Cr budgets. Avoid over-leveraged builder projects in peripheral NCR locations where RERA compliance records are weak.",
    },
  ],
};

const relatedArticles = [
  {
    slug: "noida-vs-gurugram-investment",
    title: "Noida vs Gurugram: Where Should You Invest in 2025?",
    category: "Investment",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
  {
    slug: "yamuna-expressway-boom",
    title: "Yamuna Expressway: India's Next Real Estate Hotspot Explained",
    category: "New Launches",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=80",
  },
  {
    slug: "first-time-buyer-checklist",
    title: "First-Time Buyer Checklist: 20 Things to Verify Before Signing",
    category: "Buying Guide",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Market Trends":   { bg: "#EFF6FF", text: "#2563EB" },
  "Buying Guide":    { bg: "#F0FDF4", text: "#16A34A" },
  "Investment":      { bg: "#FFFBEB", text: "#D97706" },
  "Legal & Finance": { bg: "#FFF1F2", text: "#E11D48" },
  "NRI Corner":      { bg: "#F5F3FF", text: "#7C3AED" },
  "New Launches":    { bg: "#FDF8F4", text: "#6B3A1F" },
};

function CategoryBadge({ cat }: { cat: string }) {
  const c = categoryColors[cat] ?? { bg: "#F5F5F5", text: "#555" };
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {cat}
    </span>
  );
}

// ─── Reading Progress Bar ──────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#EDE5DD]">
      <div
        className="h-full bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Share Popover ─────────────────────────────────────────
function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1800);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EDE5DD]
          bg-white text-[#6B5C4E] text-xs font-semibold
          hover:border-[#6B3A1F] hover:text-[#6B3A1F] transition-all duration-200"
      >
        <Share2 size={13} /> Share
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-44 bg-white border border-[#EDE5DD] rounded-2xl
          shadow-[0_16px_48px_rgba(107,58,31,0.15)] z-30 overflow-hidden">
          <div className="p-1">
            {[
              { icon: <Twitter size={13} />, label: "Twitter / X", href: "#" },
              { icon: <Linkedin size={13} />, label: "LinkedIn", href: "#" },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs
                  text-[#6B5C4E] hover:bg-[#FAF7F4] hover:text-[#6B3A1F] transition-all">
                {item.icon} {item.label}
              </a>
            ))}
            <button onClick={copy}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs
                text-[#6B5C4E] hover:bg-[#FAF7F4] hover:text-[#6B3A1F] transition-all">
              <Link2 size={13} /> {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function InsightsDetail() {
  const [bookmarked, setBookmarked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ReadingProgress />

      <main className="bg-[#FDFAF7] min-h-screen">

        {/* ══ BACK NAV ══════════════════════════════════════ */}
        <div className="sticky top-[3px] z-40 bg-white/80 backdrop-blur-md border-b border-[#EDE5DD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/insights"
              className="flex items-center gap-2 text-[#6B5C4E] text-xs font-semibold
                hover:text-[#6B3A1F] transition-colors group">
              <ArrowLeft size={15}
                className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to Insights
            </Link>
            <div className="flex items-center gap-2">
              <ShareButton />
              <button
                onClick={() => setBookmarked(b => !b)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200
                  ${bookmarked
                    ? "bg-[#6B3A1F] border-[#6B3A1F] text-white"
                    : "border-[#EDE5DD] bg-white text-[#6B5C4E] hover:border-[#6B3A1F] hover:text-[#6B3A1F]"
                  }`}
              >
                {bookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                {bookmarked ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* ══ HERO ══════════════════════════════════════════ */}
        <header className="relative">
          {/* Hero image — full bleed */}
          <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[82vh] overflow-hidden">
            <Image
            unoptimized={true}
              src={article.heroImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
            {/* Layered gradient — dark bottom for text legibility, subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0602]/85 via-[#0D0602]/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0602]/30 to-transparent" />

            {/* Decorative top-right grain overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Hero content */}
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
                {/* Badges row */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                    bg-[#C9A84C] text-[#1C0F05] text-[10px] font-black uppercase tracking-widest">
                    ✦ {article.tag}
                  </span>
                  <CategoryBadge cat={article.category} />
                </div>

                {/* Title */}
                <h1
                  className="font-serif text-white leading-[1.08] tracking-tight mb-4"
                  style={{
                    fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    textShadow: "0 2px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {article.title}
                </h1>

                {/* Subtitle */}
                <p className="text-white/70 text-sm sm:text-base max-w-2xl leading-relaxed mb-6"
                  style={{ fontFamily: "'Georgia', serif" }}>
                  {article.subtitle}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#C9A84C]/60">
                      <Image unoptimized={true} src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">{article.author.name}</p>
                      <p className="text-white/55 text-[10px]">{article.author.role}</p>
                    </div>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex items-center gap-3 text-white/60 text-[11px]">
                    <span className="flex items-center gap-1.5"><Calendar size={11} />{article.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} />{article.readTime}</span>
                    <span className="flex items-center gap-1.5"><Eye size={11} />{article.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caption strip */}
          <div className="bg-[#1C0F05] px-4 sm:px-6 lg:px-8 py-2.5">
            <p className="max-w-4xl mx-auto text-[#A8978A] text-[11px] italic">{article.heroCaption}</p>
          </div>
        </header>

        {/* ══ BODY ══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

            {/* ── Article content ───────────────────────── */}
            <article ref={contentRef} className="lg:col-span-8">

              {/* Decorative drop-cap intro rule */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                <span className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.2em]">Analysis</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#C9A84C] to-transparent" />
              </div>

              <div className="space-y-0">
                {article.sections.map((section, i) => {
                  if (section.type === "intro") {
                    return (
                      <p key={i}
                        className="text-[#2A1A0E] leading-[1.9] mb-8 text-[1.0625rem]"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {/* Drop cap */}
                        <span
                          className="float-left text-[#6B3A1F] font-black leading-none mr-2 mt-1"
                          style={{
                            fontFamily: "'Georgia', serif",
                            fontSize: "4.25rem",
                            lineHeight: "0.82",
                          }}
                        >
                          {section.text![0]}
                        </span>
                        {section.text!.slice(1)}
                      </p>
                    );
                  }

                  if (section.type === "heading") {
                    return (
                      <h2 key={i}
                        className="text-[#1C0F05] font-black mt-10 mb-4 leading-tight"
                        style={{
                          fontFamily: "'Georgia', serif",
                          fontSize: "clamp(1.2rem, 2.2vw, 1.5rem)",
                          borderLeft: "3px solid #C9A84C",
                          paddingLeft: "1rem",
                        }}
                      >
                        {section.text}
                      </h2>
                    );
                  }

                  if (section.type === "paragraph") {
                    return (
                      <p key={i}
                        className="text-[#3D2B1A] leading-[1.9] mb-6 text-[1rem]"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {section.text}
                      </p>
                    );
                  }

                  if (section.type === "image") {
                    return (
                      <figure key={i} className="my-10 -mx-0 sm:-mx-6 lg:-mx-0">
                        <div className="relative w-full rounded-2xl overflow-hidden"
                          style={{ aspectRatio: "16/9" }}>
                          <Image
                          unoptimized={true}
                            src={section.src!}
                            alt={section.alt ?? ""}
                            fill
                            className="object-cover"
                          />
                          {/* Subtle inner shadow */}
                          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] rounded-2xl pointer-events-none" />
                        </div>
                        <figcaption className="mt-3 text-[#A8978A] text-xs italic text-center leading-relaxed">
                          {section.caption}
                        </figcaption>
                      </figure>
                    );
                  }

                  if (section.type === "pullquote") {
                    return (
                      <blockquote key={i}
                        className="my-10 relative"
                      >
                        <div className="absolute -left-1 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#C9A84C] to-[#6B3A1F] rounded-full" />
                        <div className="pl-8 pr-4 py-2">
                          <Quote size={28} className="text-[#C9A84C]/40 mb-2" />
                          <p
                            className="text-[#1C0F05] font-bold leading-snug"
                            style={{
                              fontFamily: "'Georgia', serif",
                              fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                            }}
                          >
                            {section.text}
                          </p>
                        </div>
                      </blockquote>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Article footer rule */}
              <div className="flex items-center gap-4 mt-12 mb-10">
                <div className="h-px flex-1 bg-[#EDE5DD]" />
                <span className="text-[#C9A84C] text-lg">✦</span>
                <div className="h-px flex-1 bg-[#EDE5DD]" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                {["Delhi NCR", "Noida", "Gurugram", "Real Estate 2025", "Yamuna Expressway", "Property Investment"].map(tag => (
                  <span key={tag}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold
                      bg-[#F5EFE8] text-[#6B5C4E] border border-[#EDE5DD]
                      hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
                      cursor-pointer transition-all duration-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author bio card */}
              <div className="rounded-2xl bg-white border border-[#EDE5DD]
                shadow-[0_4px_24px_rgba(107,58,31,0.07)] overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#6B3A1F] via-[#C9A84C] to-[#6B3A1F]" />
                <div className="p-6 sm:p-7 flex gap-5 items-start">
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#EDE5DD]">
                    <Image  unoptimized={true} src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#C9A84C] font-black uppercase tracking-widest mb-0.5">Written by</p>
                    <h3 className="text-[#1C0F05] font-bold text-base mb-0.5"
                      style={{ fontFamily: "'Georgia', serif" }}>
                      {article.author.name}
                    </h3>
                    <p className="text-[#A8978A] text-[11px] font-semibold mb-2">{article.author.role}</p>
                    <p className="text-[#6B5C4E] text-xs leading-relaxed">{article.author.bio}</p>
                  </div>
                </div>
              </div>
            </article>

            {/* ── Sidebar ───────────────────────────────── */}
            <aside className="lg:col-span-4">
              <div className="sticky top-20 space-y-6">

                {/* Quick facts */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden
                  shadow-[0_2px_12px_rgba(107,58,31,0.06)]">
                  <div className="h-1 bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C]" />
                  <div className="p-5">
                    <p className="text-[10px] text-[#C9A84C] font-black uppercase tracking-widest mb-4">
                      Key Takeaways
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Noida transaction volumes now exceed Gurugram in the ₹1–3Cr range",
                        "Sector 150 rates have risen 32% in 18 months to ₹9,500+/sqft",
                        "Jewar Airport Phase 1 completion expected by late 2025",
                        "YEIDA plot prices still 10–15× cheaper than IGI Airport corridor",
                        "RBI rate cut of 25bps expected April 2025",
                      ].map((point, i) => (
                        <li key={i} className="flex gap-3 text-xs text-[#3D2B1A] leading-relaxed">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6B3A1F]/8 text-[#6B3A1F]
                            flex items-center justify-center text-[10px] font-black mt-0.5">
                            {i + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Market data widget */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] p-5
                  shadow-[0_2px_12px_rgba(107,58,31,0.06)]">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-[#6B3A1F]" />
                    <p className="text-[#1C0F05] text-sm font-bold"
                      style={{ fontFamily: "'Georgia', serif" }}>
                      Price Snapshot
                    </p>
                  </div>
                  {[
                    { area: "Sector 150, Noida", price: "₹9,500/sqft", change: "+12%", up: true },
                    { area: "Dwarka Expressway, GGN", price: "₹11,200/sqft", change: "+8%", up: true },
                    { area: "YEIDA Sector 18", price: "₹42k/sqyard", change: "+22%", up: true },
                    { area: "Golf Course Rd, GGN", price: "₹18,400/sqft", change: "+4%", up: true },
                    { area: "Greater Noida West", price: "₹6,800/sqft", change: "-1%", up: false },
                  ].map((row, i) => (
                    <div key={i}
                      className="flex items-center justify-between py-2.5 border-b border-[#F5EFE8] last:border-0">
                      <div>
                        <p className="text-[#1C0F05] text-[11px] font-semibold">{row.area}</p>
                        <p className="text-[#A8978A] text-[10px]">{row.price}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                        ${row.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {row.change}
                      </span>
                    </div>
                  ))}
                  <p className="text-[#C4B4A8] text-[9px] mt-3 italic">
                    *Indicative rates, Q1 2025. Source: NoBroker, 99acres.
                  </p>
                </div>

                {/* CTA */}
                <div className="relative rounded-2xl overflow-hidden p-6
                  bg-gradient-to-br from-[#1C0F05] via-[#2E160A] to-[#6B3A1F]">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full
                    border border-[#C9A84C]/10 -translate-y-12 translate-x-12 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full
                    border border-[#C9A84C]/10 translate-y-8 -translate-x-6 pointer-events-none" />

                  <p className="text-[#C9A84C] text-[10px] font-black uppercase tracking-widest mb-2">
                    Free Consultation
                  </p>
                  <h4 className="text-white font-bold text-lg leading-tight mb-2"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    Talk to a Property Expert Today
                  </h4>
                  <p className="text-white/50 text-xs leading-relaxed mb-5">
                    Get personalised advice on which NCR micro-market suits your budget and goals.
                  </p>
                  <button className="w-full flex items-center justify-center gap-2
                    py-3 rounded-xl bg-[#C9A84C] text-[#1C0F05] font-black text-xs
                    hover:bg-white active:scale-[0.97] transition-all duration-200
                    shadow-[0_4px_16px_rgba(201,168,76,0.35)]">
                    Book Free Call <ArrowUpRight size={13} />
                  </button>
                </div>

                {/* Related — inline sidebar */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] p-5
                  shadow-[0_2px_12px_rgba(107,58,31,0.06)]">
                  <p className="text-[#1C0F05] text-sm font-bold mb-4"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    Related Articles
                  </p>
                  <div className="space-y-4">
                    {relatedArticles.map((r, i) => (
                      <Link key={i} href={`/insights/${r.slug}`}
                        className="flex gap-3 group">
                        <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          <Image unoptimized={true} src={r.image} alt={r.title} fill className="object-cover
                            group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CategoryBadge cat={r.category} />
                          <p className="text-[#1C0F05] text-[11px] font-semibold leading-snug mt-1
                            line-clamp-2 group-hover:text-[#6B3A1F] transition-colors">
                            {r.title}
                          </p>
                          <p className="text-[#A8978A] text-[10px] mt-0.5">{r.readTime} read</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>

        {/* ══ MORE ARTICLES ═════════════════════════════════ */}
        <section className="border-t border-[#EDE5DD] bg-white py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[#C9A84C] text-[10px] font-black uppercase tracking-widest mb-1">
                  Continue Reading
                </p>
                <h2 className="text-[#1C0F05] text-2xl font-bold"
                  style={{ fontFamily: "'Georgia', serif" }}>
                  More from Market Trends
                </h2>
              </div>
              <Link href="/insights"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#6B3A1F]
                  hover:gap-2.5 transition-all duration-200">
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.map((r, i) => (
                <Link key={i} href={`/insights/${r.slug}`}
                  className="group block bg-[#FDFAF7] rounded-2xl overflow-hidden border border-[#EDE5DD]
                    hover:shadow-[0_12px_40px_rgba(107,58,31,0.10)] hover:-translate-y-1
                    transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <Image unoptimized={true} src={r.image} alt={r.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <CategoryBadge cat={r.category} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#1C0F05] text-sm font-bold leading-snug mb-2
                      group-hover:text-[#6B3A1F] transition-colors line-clamp-2"
                      style={{ fontFamily: "'Georgia', serif" }}>
                      {r.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#A8978A] text-[11px] flex items-center gap-1.5">
                        <Clock size={10} /> {r.readTime} read
                      </span>
                      <ArrowUpRight size={14}
                        className="text-[#6B3A1F] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}