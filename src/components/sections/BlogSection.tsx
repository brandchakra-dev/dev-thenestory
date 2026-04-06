"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, BookOpen, TrendingUp, Scale, HelpCircle, Wallet } from "lucide-react";

// ─── Types ───────────────────────────────────────────────
interface Article {
  id: number;
  title: string;
  date: string;
  image: string;
  category: string;
}

// ─── Tab Config ───────────────────────────────────────────
const tabs = [
  { label: "News",         icon: <BookOpen size={11} />    },
  { label: "Tax & Legal",  icon: <Scale size={11} />       },
  { label: "Help Guides",  icon: <HelpCircle size={11} />  },
  { label: "Investment",   icon: <TrendingUp size={11} />  },
  { label: "Finance",      icon: <Wallet size={11} />      },
];

// ─── Articles Data with Unsplash Images ───────────────────
const articles: Record<string, Article[]> = {
  "News": [
    { id: 1,  title: "Noida Authority launches mega housing scheme for 2025",         date: "Jan 15, 2025", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",  category: "News" },
    { id: 2,  title: "NCR property prices surge 18% in Q4 2024 — key hotspots",       date: "Jan 10, 2025", image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",  category: "News" },
    { id: 3,  title: "Yamuna Expressway emerges as fastest-growing real estate belt",  date: "Jan 05, 2025", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",  category: "News" },
    { id: 4,  title: "New metro corridor to boost Faridabad property demand by 30%",  date: "Dec 28, 2024", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",  category: "News" },
  ],
  "Tax & Legal": [
    { id: 5,  title: "New GST rule on home loans — all you need to know",             date: "Jan 12, 2025", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Tax & Legal" },
    { id: 6,  title: "Stamp duty changes in UP 2025 — complete buyer's guide",        date: "Jan 08, 2025", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Tax & Legal" },
    { id: 7,  title: "RERA complaint process simplified — step by step guide",        date: "Dec 30, 2024", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Tax & Legal" },
    { id: 8,  title: "Section 80C benefits on home loans — maximise your savings",    date: "Dec 22, 2024", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Tax & Legal" },
  ],
  "Help Guides": [
    { id: 9,  title: "First time buyer in NCR? Here's your complete 2025 checklist",  date: "Jan 14, 2025", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Help Guides" },
    { id: 10, title: "Resale vs new launch — which is better for you?",               date: "Jan 06, 2025", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Help Guides" },
    { id: 11, title: "How to verify a property before buying — 10-point check",       date: "Dec 25, 2024", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c045d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Help Guides" },
    { id: 12, title: "Builder floor vs apartment — pros, cons & hidden costs",        date: "Dec 18, 2024", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Help Guides" },
  ],
  "Investment": [
    { id: 13, title: "Top 5 sectors in Noida for highest rental yield in 2025",       date: "Jan 13, 2025", image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Investment" },
    { id: 14, title: "Gurugram vs Noida — where should you invest in 2025?",          date: "Jan 07, 2025", image: "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Investment" },
    { id: 15, title: "Commercial vs residential — which gives better ROI?",           date: "Dec 27, 2024", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Investment" },
    { id: 16, title: "Pre-launch investment strategy — risks & rewards explained",    date: "Dec 20, 2024", image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Investment" },
  ],
  "Finance": [
    { id: 17, title: "Home loan at lowest rate in 2025 — compare top banks",          date: "Jan 11, 2025", image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Finance" },
    { id: 18, title: "How credit score affects your home loan eligibility",           date: "Jan 03, 2025", image: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Finance" },
    { id: 19, title: "Balance transfer — when does it make sense for your loan?",     date: "Dec 29, 2024", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Finance" },
    { id: 20, title: "Down payment strategies — how much is ideal for NCR homes?",   date: "Dec 16, 2024", image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",   category: "Finance" },
  ],
};

// ─── ArticleRow ───────────────────────────────────────────
function ArticleRow({ article }: { article: Article }) {
  return (
    <a
      href="#"
      className="group flex items-center gap-3 py-3 transition-all duration-200"
      style={{ borderBottom: "1px solid #F0EAE2" }}
    >
      {/* Thumb */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-xl" style={{ width: "76px", height: "54px" }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />
        {/* Fallback gradient if image missing */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8D5B0]/40 to-[#6B3A1F]/20 mix-blend-overlay pointer-events-none rounded-xl" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-display font-bold leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[#6B3A1F]"
          style={{ fontSize: "12px", color: "#1C0F05" }}
        >
          {article.title}
        </p>
        <p className="text-[10px] font-semibold mt-1" style={{ color: "#A8978A" }}>
          {article.date}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={14}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
        style={{ color: "#6B3A1F" }}
      />
    </a>
  );
}

// ─── BlogSection ─────────────────────────────────────────
export default function BlogSection() {
  const [activeTab, setActiveTab] = useState("News");
  const currentArticles = articles[activeTab] ?? [];

  return (
    <section className="py-8 sm:py-6 lg:py-8" style={{ background: "hsl(40,40%,97%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ TOP BANNER ROW: image left + promo right ══ */}
        <div
          className="relative overflow-hidden rounded-2xl mb-6"
          style={{
            boxShadow: "0 4px 32px rgba(107,58,31,0.10)",
            border: "1px solid #EDE5DD",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[220px] sm:min-h-[260px]">

            {/* Left: Feature image */}
            <div className="relative lg:col-span-6 overflow-hidden" style={{ minHeight: "200px" }}>
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern apartment interior"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
              />
              
              {/* Fallback warm gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #E8D5B0 0%, #C9A84C40 40%, #6B3A1F30 100%)",
                }}
              />

              {/* Brand watermark */}
              <div
                className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide"
                style={{
                  background: "rgba(255,255,255,0.82)",
                  color: "#6B3A1F",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(107,58,31,0.12)",
                }}
              >
                The Nestory
              </div>

              {/* Right fade */}
              <div
                className="absolute inset-y-0 right-0 w-16 pointer-events-none hidden lg:block"
                style={{ background: "linear-gradient(90deg, transparent, #ffffff)" }}
              />
            </div>

            {/* Right: Promo content */}
            <div
              className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8 bg-white"
            >
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 self-start"
                style={{
                  background: "rgba(107,58,31,0.07)",
                  border: "1px solid rgba(107,58,31,0.12)",
                }}
              >
                <span style={{ fontSize: "8px", fontWeight: 900, letterSpacing: "0.26em", textTransform: "uppercase", color: "#6B3A1F" }}>
                  Rent a Home
                </span>
              </div>

              <h2
                className="font-display font-black leading-tight mb-3"
                style={{ fontSize: "clamp(1.35rem, 3vw, 2rem)", color: "#1C0F05" }}
              >
                Rental Homes for{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #6B3A1F, #C9A84C)" }}
                >
                  Everyone
                </span>
              </h2>

              <p className="text-sm leading-relaxed mb-6" style={{ color: "#7A6858", maxWidth: "340px" }}>
                Explore from Apartments, Builder Floors, Villas and more across NCR — all verified, zero brokerage.
              </p>

              {/* Quick stats row */}
              <div className="flex items-center gap-5 mb-7">
                {[
                  { val: "12K+", lbl: "Rental Listings" },
                  { val: "₹0",   lbl: "Brokerage"       },
                  { val: "48hr", lbl: "Move-in Ready"    },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="flex flex-col">
                    <span className="font-display font-black text-lg leading-none" style={{ color: "#6B3A1F" }}>{val}</span>
                    <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wide" style={{ color: "#A8978A" }}>{lbl}</span>
                  </div>
                ))}
              </div>

              <a
                href="/rent"
                className="inline-flex items-center gap-2.5 self-start px-6 py-3 rounded-xl font-black text-sm
                  transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] group"
                style={{
                  background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
                  color: "#FAF6F0",
                  boxShadow: "0 4px 18px rgba(107,58,31,0.30)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(107,58,31,0.45)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 18px rgba(107,58,31,0.30)" }}
              >
                Explore Renting
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* ══ BOTTOM ROW: left title + right tabbed articles ══ */}
        <div
          className="overflow-hidden rounded-2xl bg-white"
          style={{
            border: "1px solid #EDE5DD",
            boxShadow: "0 4px 24px rgba(107,58,31,0.07)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* Left — editorial label */}
            <div
              className="lg:col-span-3 flex flex-col justify-between px-6 py-6 sm:px-7 sm:py-7"
              style={{ borderRight: "1px solid #F0EAE2" }}
            >
              <div>
                {/* Eyebrow */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(107,58,31,0.07), rgba(201,168,76,0.05))",
                    border: "1px solid rgba(107,58,31,0.10)",
                  }}
                >
                  <BookOpen size={9} style={{ color: "#C9A84C" }} />
                  <span style={{ fontSize: "8px", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B3A1F" }}>
                    Insights
                  </span>
                </div>

                <h3
                  className="font-display font-black leading-snug mb-3"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "#1C0F05" }}
                >
                  Best Advice by Our{" "}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #6B3A1F, #C9A84C)" }}
                  >
                    Top Editors
                  </span>
                </h3>

                <p className="text-xs leading-relaxed" style={{ color: "#A8978A" }}>
                  From Beginner's checklists to Pro Tips — curated guides for every stage of your property journey.
                </p>
              </div>

              {/* Read all link */}
              <a
                href="/blog"
                className="inline-flex items-center gap-1.5 mt-6 font-bold text-xs group"
                style={{ color: "#6B3A1F" }}
              >
                Read realty news, guides & articles
                <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right — tabs + articles */}
            <div className="lg:col-span-9 flex flex-col">

              {/* Tab bar */}
              <div
                className="flex items-center gap-0 overflow-x-auto scrollbar-hide flex-shrink-0"
                style={{ borderBottom: "1px solid #F0EAE2" }}
              >
                {tabs.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className="relative flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-3.5 font-bold text-xs transition-all duration-200 whitespace-nowrap"
                    style={{ color: activeTab === label ? "#6B3A1F" : "#A8978A" }}
                  >
                    <span style={{ color: activeTab === label ? "#C9A84C" : "#C9A84C66" }}>
                      {icon}
                    </span>
                    {label}
                    {/* Active underline */}
                    {activeTab === label && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                        style={{ background: "linear-gradient(90deg, #6B3A1F, #C9A84C)" }}
                      />
                    )}
                  </button>
                ))}

                {/* Arrow nav hint — desktop */}
                <div className="ml-auto pr-4 hidden sm:flex items-center">
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-colors"
                    style={{ background: "rgba(107,58,31,0.07)", color: "#6B3A1F" }}
                  >
                    <ChevronRight size={13} />
                  </div>
                </div>
              </div>

              {/* Articles grid — 2 cols × 2 rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y" style={{ borderColor: "#F0EAE2" }}>
                {currentArticles.slice(0, 4).map((article, i) => (
                  <div
                    key={article.id}
                    className="px-5 py-1"
                    style={{ borderColor: "#F0EAE2" }}
                  >
                    <ArticleRow article={article} />
                  </div>
                ))}
              </div>

              {/* Read all — mobile */}
              <div className="px-5 py-3 sm:hidden" style={{ borderTop: "1px solid #F0EAE2" }}>
                <a href="/blog" className="inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: "#6B3A1F" }}>
                  Read all {activeTab} articles <ArrowRight size={11} />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}