"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, User, Tag, Search, ChevronRight, TrendingUp, Sparkles, BookOpen } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────
const categories = ["All", "Market Trends", "Buying Guide", "Investment", "Legal & Finance", "NRI Corner", "New Launches"];

const featuredPost = {
  slug: "delhi-ncr-real-estate-2025",
  title: "Delhi NCR Real Estate Outlook 2025: What Buyers Must Know Before Investing",
  excerpt: "From rising prices in Sector 150 to the Yamuna Expressway boom — here's the complete ground-level analysis for smart buyers this year.",
  category: "Market Trends",
  author: "Ankit Sharma",
  authorRole: "Senior Analyst",
  date: "12 Jan 2025",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  tag: "Editor's Pick",
};

const posts = [
  {
    slug: "home-loan-guide-2025",
    title: "Complete Home Loan Guide 2025: Rates, Eligibility & Hidden Charges",
    excerpt: "Everything you need to know before applying for a home loan — including what banks don't tell you.",
    category: "Legal & Finance",
    author: "Priya Nair",
    date: "8 Jan 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    slug: "noida-vs-gurugram-investment",
    title: "Noida vs Gurugram: Where Should You Invest in 2025?",
    excerpt: "A data-driven comparison of Delhi NCR's two biggest micro-markets for residential investment.",
    category: "Investment",
    author: "Rahul Mehra",
    date: "5 Jan 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    slug: "nri-property-buying-india",
    title: "NRI Property Buying in India: Rules, Taxes & Best Practices",
    excerpt: "FEMA compliance, TDS rules, POA guidelines — the definitive guide for NRI buyers in 2025.",
    category: "NRI Corner",
    author: "Vikram Singh",
    date: "2 Jan 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
  {
    slug: "first-time-buyer-checklist",
    title: "First-Time Home Buyer Checklist: 20 Things to Verify Before Signing",
    excerpt: "Don't sign anything until you've checked these 20 critical documents, approvals and clauses.",
    category: "Buying Guide",
    author: "Sunita Verma",
    date: "29 Dec 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
  },
  {
    slug: "yamuna-expressway-boom",
    title: "Yamuna Expressway: India's Next Real Estate Hotspot Explained",
    excerpt: "YEIDA plots, Film City, Jewar Airport — why smart money is flowing into this corridor right now.",
    category: "New Launches",
    author: "Ankit Sharma",
    date: "26 Dec 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    slug: "rera-complaints-guide",
    title: "How to File a RERA Complaint: Step-by-Step Guide for Buyers",
    excerpt: "Builder delays, missing amenities, title issues — here's how to use RERA to protect yourself.",
    category: "Legal & Finance",
    author: "Meera Patel",
    date: "22 Dec 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
];

const trendingTopics = [
  "Sector 150 Noida",
  "Home Loan 2025",
  "RERA Rights",
  "Jewar Airport",
  "Ready to Move",
  "Rental Yield",
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Market Trends":  { bg: "#EFF6FF", text: "#2563EB" },
  "Buying Guide":   { bg: "#F0FDF4", text: "#16A34A" },
  "Investment":     { bg: "#FFFBEB", text: "#D97706" },
  "Legal & Finance":{ bg: "#FFF1F2", text: "#E11D48" },
  "NRI Corner":     { bg: "#F5F3FF", text: "#7C3AED" },
  "New Launches":   { bg: "#FDF8F4", text: "#6B3A1F" },
};

function CategoryBadge({ cat }: { cat: string }) {
  const c = categoryColors[cat] ?? { bg: "#F5F5F5", text: "#555" };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {cat}
    </span>
  );
}

// ─── PostCard ──────────────────────────────────────────────
function PostCard({ title, excerpt, category, author, date, readTime, image, slug }: typeof posts[0]) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD]
        shadow-[0_2px_12px_rgba(107,58,31,0.06)]
        hover:shadow-[0_12px_40px_rgba(107,58,31,0.12)]
        hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">

        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <Image src={image} alt={title} fill unoptimized={true}
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <CategoryBadge cat={category} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3 className="font-display font-bold text-[#1C0F05] text-sm sm:text-[15px]
            leading-snug mb-2 line-clamp-2
            group-hover:text-[#6B3A1F] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-[#7A6858] text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{excerpt}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F5EFE8]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A8978A]">
              <User size={11} />
              <span>{author}</span>
              <span className="w-1 h-1 rounded-full bg-[#D4C4B0]" />
              <Clock size={11} />
              <span>{readTime}</span>
            </div>
            <ArrowUpRight size={14}
              className="text-[#6B3A1F] opacity-0 group-hover:opacity-100
                transition-opacity duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── BlogPage ──────────────────────────────────────────────
export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchQ   = query === "" || p.title.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <main className="bg-[hsl(38,45%,97%)] min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#EDE5DD] pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
              bg-[#6B3A1F]/8 border border-[#6B3A1F]/15">
              <BookOpen size={11} className="text-[#6B3A1F]" />
              <span className="text-[#6B3A1F] text-[10px] font-bold tracking-widest uppercase">
                The Nestory Journal
              </span>
            </div>
            <h1 className="font-display font-bold text-[#1C0F05]
              text-3xl sm:text-4xl lg:text-5xl leading-[1.08] tracking-tight mb-3">
              Real Estate Insights &{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                Expert Guides
              </span>
            </h1>
            <p className="text-[#7A6858] text-sm sm:text-base max-w-xl leading-relaxed">
              Market trends, buying guides, legal advice and investment insights — everything you need to make smarter property decisions.
            </p>
          </div>

          {/* Featured post — large horizontal card */}
          <Link href={`/blog/${featuredPost.slug}`}
            className="group block mb-0">
            <div className="relative rounded-t-3xl overflow-hidden h-[280px] sm:h-[340px] lg:h-[400px]">
              <Image src={featuredPost.image} alt={featuredPost.title} fill unoptimized={true}
                className="object-cover group-hover:scale-103 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F05]/80 via-[#1C0F05]/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10 max-w-2xl">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                    bg-[#C9A84C] text-[#1C0F05] text-[10px] font-bold uppercase tracking-wide">
                    <Sparkles size={9} /> {featuredPost.tag}
                  </span>
                  <CategoryBadge cat={featuredPost.category} />
                </div>

                <h2 className="font-display font-bold text-white
                  text-xl sm:text-2xl lg:text-3xl leading-tight mb-3 line-clamp-2">
                  {featuredPost.title}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2 max-w-lg">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <User size={12} />
                    <span>{featuredPost.author}</span>
                    <span>·</span>
                    <Clock size={12} />
                    <span>{featuredPost.readTime}</span>
                    <span>·</span>
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-[#C9A84C] text-xs font-bold
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Read Article <ArrowUpRight size={13} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ══ FILTER BAR ════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EDE5DD]
        shadow-[0_2px_8px_rgba(107,58,31,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold
                  transition-all duration-200 whitespace-nowrap
                  ${activeCategory === cat
                    ? "bg-[#6B3A1F] text-white shadow-[0_2px_8px_rgba(107,58,31,0.30)]"
                    : "bg-[#F5EFE8] text-[#6B5C4E] hover:bg-[#EDE5DD]"
                  }`}>
                {cat}
              </button>
            ))}

            {/* Search */}
            <div className="relative ml-auto flex-shrink-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-8 pr-4 py-1.5 rounded-full text-xs
                  border border-[#EDE5DD] bg-[#FAF8F4]
                  text-[#1C0F05] placeholder:text-[#A8978A]
                  focus:outline-none focus:border-[#6B3A1F] focus:ring-2 focus:ring-[#6B3A1F]/15
                  w-36 sm:w-48 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Posts grid */}
          <div className="lg:col-span-8">

            {/* Result count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#A8978A] text-xs font-medium">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}{" "}
                {activeCategory !== "All" ? `in ${activeCategory}` : ""}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#A8978A] font-medium">
                <TrendingUp size={11} />
                Latest First
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((post, i) => (
                  <PostCard key={i} {...post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F5EFE8] flex items-center justify-center mb-4">
                  <Search size={22} className="text-[#A8978A]" />
                </div>
                <p className="font-bold text-[#1C0F05] text-base mb-1">No articles found</p>
                <p className="text-[#A8978A] text-sm">Try a different search or category</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Trending topics */}
            <div className="bg-white rounded-2xl border border-[#EDE5DD] p-5
              shadow-[0_2px_10px_rgba(107,58,31,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-[#6B3A1F]" />
                <h4 className="font-display font-bold text-[#1C0F05] text-sm">Trending Topics</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map(topic => (
                  <button key={topic}
                    onClick={() => setQuery(topic)}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold
                      bg-[#FAF7F4] text-[#6B5C4E] border border-[#EDE5DD]
                      hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
                      transition-all duration-200">
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories list */}
            <div className="bg-white rounded-2xl border border-[#EDE5DD] p-5
              shadow-[0_2px_10px_rgba(107,58,31,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} className="text-[#6B3A1F]" />
                <h4 className="font-display font-bold text-[#1C0F05] text-sm">Browse Categories</h4>
              </div>
              <div className="space-y-1">
                {categories.filter(c => c !== "All").map(cat => {
                  const count = posts.filter(p => p.category === cat).length;
                  if (!count) return null;
                  return (
                    <button key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl
                        text-xs font-medium transition-all duration-200
                        ${activeCategory === cat
                          ? "bg-[#6B3A1F]/8 text-[#6B3A1F] font-bold"
                          : "text-[#6B5C4E] hover:bg-[#FAF7F4]"
                        }`}>
                      <span>{cat}</span>
                      <span className="flex items-center gap-1">
                        <span className="text-[#A8978A]">{count}</span>
                        <ChevronRight size={12} className="text-[#A8978A]" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA card */}
            <div className="relative rounded-2xl overflow-hidden p-5
              bg-gradient-to-br from-[#1C0F05] via-[#3B1D0D] to-[#6B3A1F]
              shadow-[0_8px_32px_rgba(107,58,31,0.25)]">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full
                border border-[#C9A84C]/15 pointer-events-none" />
              <Sparkles size={18} className="text-[#C9A84C] mb-3" />
              <h4 className="font-display font-bold text-white text-base mb-1.5">
                Get Free Property Advice
              </h4>
              <p className="text-white/55 text-xs leading-relaxed mb-4">
                Talk to an expert today. Zero cost, honest guidance.
              </p>
              <button className="w-full flex items-center justify-center gap-2
                py-2.5 rounded-xl bg-[#C9A84C] text-[#1C0F05]
                font-bold text-xs hover:bg-white
                active:scale-[0.97] transition-all duration-200">
                Book Consultation
                <ArrowUpRight size={13} />
              </button>
            </div>

          </aside>
        </div>
      </div>

    </main>
  );
}