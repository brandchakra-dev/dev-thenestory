"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, BookOpen, TrendingUp, Scale, HelpCircle, Wallet, Loader2 } from "lucide-react";

import { blogsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ───────────────────────────────────────────────
interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  coverImageUrl: string;
  publishedAt: string;
  createdAt: string;
}

// ─── Tab Config ───────────────────────────────────────────
const tabs = [
  { label: "News",         icon: <BookOpen size={11} />    },
  { label: "Tax & Legal",  icon: <Scale size={11} />       },
  { label: "Help Guides",  icon: <HelpCircle size={11} />  },
  { label: "Investment",   icon: <TrendingUp size={11} />  },
  { label: "Finance",      icon: <Wallet size={11} />      },
];

// ─── ArticleRow ───────────────────────────────────────────
function ArticleRow({ article }: { article: Blog }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex items-center gap-3 py-3 transition-all duration-200"
      style={{ borderBottom: "1px solid #F0EAE2" }}
    >
      {/* Thumb */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-xl" style={{ width: "76px", height: "54px" }}>
        {article.coverImageUrl ? (
          <img
            src={getImageUrl(article.coverImageUrl)}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] flex items-center justify-center">
            <BookOpen size={20} className="text-[#A8978A]" />
          </div>
        )}
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
          {formatDate(article.publishedAt || article.createdAt)}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={14}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
        style={{ color: "#6B3A1F" }}
      />
    </Link>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y" style={{ borderColor: "#F0EAE2" }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="px-5 py-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-[76px] h-[54px] bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-2 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── BlogSection ─────────────────────────────────────────
export default function BlogSection() {
  const [activeTab, setActiveTab] = useState("News");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogsApi.getAll({ limit: 50 });
        
        console.log('bbb',response)
        let blogsData: Blog[] = [];
        if (response.blogs) {
          blogsData = response.blogs;
        } else if (response.data) {
          blogsData = response.data;
        } else if (Array.isArray(response)) {
          blogsData = response;
        }
        
        setBlogs(blogsData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by active category
  const currentArticles = useMemo(() => {
    if (activeTab === "News") {
      return blogs.filter(blog => blog.category === "News");
    }
    return blogs.filter(blog => blog.category === activeTab);
  }, [blogs, activeTab]);

  // Get 4 articles for the current tab
  const displayArticles = currentArticles.slice(0, 4);

  // Featured image for banner (static - can be made dynamic later)
  const bannerImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  if (error) {
    return null; // Hide section if error
  }

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
                src={bannerImage}
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
                   Buy from Our Portal
                </span>
              </div>

              <h2
                className="font-display font-black leading-tight mb-3"
                style={{ fontSize: "clamp(1.35rem, 3vw, 2rem)", color: "#1C0F05" }}
              >
                Find Your Dream {" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #6B3A1F, #C9A84C)" }}
                >
                  Property
                </span>
              </h2>

              <p className="text-sm leading-relaxed mb-6" style={{ color: "#7A6858", maxWidth: "340px" }}>
              We aim to provide a space that fits your needs and your pockets. Opening Doors to Better Living
              </p>

              {/* Quick stats row */}
              <div className="flex items-center gap-5 mb-7">
                {[
                  { val: "300+", lbl: "Properties Listed" },
                  { val: "100%",   lbl: "Verified by Us" },
                  { val: "", lbl: "NCR Multiple Locations" },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="flex flex-col">
                    <span className="font-display font-black text-lg leading-none" style={{ color: "#6B3A1F" }}>{val}</span>
                    <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wide" style={{ color: "#A8978A" }}>{lbl}</span>
                  </div>
                ))}
              </div>

              <a
                href="/properties"
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
                Browse Properties to Buy
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
                  From Beginner's checklists to Pro Tips, find curated guides for every stage of your property journey.
                </p>
              </div>

              {/* Read all link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 mt-6 font-bold text-xs group"
                style={{ color: "#6B3A1F" }}
              >
                Read realty news, guides & articles
                <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
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
              {loading ? (
                <LoadingSkeleton />
              ) : displayArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y" style={{ borderColor: "#F0EAE2" }}>
                  {displayArticles.map((article, i) => (
                    <div
                      key={article._id}
                      className="px-5 py-1"
                      style={{ borderColor: "#F0EAE2" }}
                    >
                      <ArticleRow article={article} />
                    </div>
                  ))}
                  {/* Fill empty slots if less than 4 articles */}
                  {displayArticles.length < 4 && Array(4 - displayArticles.length).fill(0).map((_, i) => (
                    <div key={`empty-${i}`} className="px-5 py-3 opacity-0">
                      <div className="flex items-center gap-3">
                        <div className="w-[76px] h-[54px]" />
                        <div className="flex-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#A8978A]">
                  No articles found in {activeTab}
                </div>
              )}

              {/* Read all — mobile */}
              <div className="px-5 py-3 sm:hidden" style={{ borderTop: "1px solid #F0EAE2" }}>
                <Link href={`/blog?category=${activeTab}`} className="inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: "#6B3A1F" }}>
                  Read all {activeTab} articles <ArrowRight size={11} />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}