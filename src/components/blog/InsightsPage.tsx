"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Clock, User, Tag, Search, ChevronRight, TrendingUp, Sparkles, BookOpen } from "lucide-react";

import { blogsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ──────────────────────────────────────────────────
interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  tags: string[];
  coverImageUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string;
  views: number;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

// ─── Categories (from backend) ──────────────────────────────
const ALL_CATEGORIES = [
  "All",
  "News",
  "Tax & Legal",
  "Help Guides",
  "Investment",
  "Finance"
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  "News":  { bg: "#EFF6FF", text: "#2563EB" },
  "Tax & Legal":   { bg: "#F0FDF4", text: "#16A34A" },
  "Help Guides":     { bg: "#FFFBEB", text: "#D97706" },
  "Investment":{ bg: "#FFF1F2", text: "#E11D48" },
  "Finance":     { bg: "#F5F3FF", text: "#7C3AED" },
};

const trendingTopics = [
  "Sector 150 Noida",
  "Home Loan 2025",
  "RERA Rights",
  "Jewar Airport",
  "Ready to Move",
  "Rental Yield",
];

const getReadTime = (html?: string) => {

  if (!html || typeof html !== "string") {
    return "1 min read";
  }

  const text = html.replace(/<[^>]+>/g, "");

  const words = text.trim().split(/\s+/).length;

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
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
function PostCard({  title,
  excerpt,
  category,
  author,
  publishedAt,
  coverImageUrl,
  slug,
  content, }: Blog ) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };


  return (
    <Link href={`/blog/${slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD]
        shadow-[0_2px_12px_rgba(107,58,31,0.06)]
        hover:shadow-[0_12px_40px_rgba(107,58,31,0.12)]
        hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">

        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          {coverImageUrl ? (
            <img 
              src={getImageUrl(coverImageUrl)} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] flex items-center justify-center">
              <BookOpen size={32} className="text-[#A8978A]" />
            </div>
          )}
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
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8978A]">
            <User size={11} />
            <span>{author || "The Nestory Team"}</span>

            <span className="w-1 h-1 rounded-full bg-[#D4C4B0]" />

            <Clock size={11} />
            <span>{getReadTime(content || excerpt)}</span>

            <span className="w-1 h-1 rounded-full bg-[#D4C4B0]" />

            <span>{formatDate(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] animate-pulse">
          <div className="h-44 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main BlogPage ─────────────────────────────────────────
export default function InsightsPage() {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogsApi.getAll({ limit: 50 });

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

  // Read category from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && ALL_CATEGORIES.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  // Featured post (first featured blog or first blog)
  const featuredPost = useMemo(() => {
    const featured = blogs.find(b => b.isFeatured);
    return featured || blogs[0];
  }, [blogs]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    let filtered = blogs.filter(b => b.isPublished !== false);
    
    if (activeCategory !== "All") {
      filtered = filtered.filter(b => b.category === activeCategory);
    }
    if (query) {
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(query.toLowerCase())
      );
    }
    // Exclude featured post from list if it's the featured one

    if (
      featuredPost &&
      activeCategory === "All" &&
      !query
    ) {
      filtered = filtered.filter(
        b => b._id !== featuredPost._id
      );
    }
    return filtered;
  }, [blogs, activeCategory, query, featuredPost]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach(blog => {
      if (blog.isPublished !== false) {
        counts[blog.category] = (counts[blog.category] || 0) + 1;
      }
    });
    return counts;
  }, [blogs]);

  if (loading) {
    return (
      <main className="bg-[hsl(38,45%,97%)] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  if (error || blogs.length === 0) {
    return (
      <main className="bg-[hsl(38,45%,97%)] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-red-500" />
          </div>
          <h2 className="font-display font-bold text-xl text-[#1C0F05] mb-2">No blog posts found</h2>
          <p className="text-[#A8978A] text-sm mb-6">{error || "Check back later for new articles."}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-[#6B3A1F] text-white rounded-xl font-bold">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

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
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`}
              className="group block mb-0">
              <div className="relative rounded-t-3xl overflow-hidden h-[280px] sm:h-[340px] lg:h-[400px]">
                {featuredPost.coverImageUrl ? (
                  <img 
                    src={getImageUrl(featuredPost.coverImageUrl)} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] flex items-center justify-center">
                    <BookOpen size={64} className="text-[#A8978A]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F05]/80 via-[#1C0F05]/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10 max-w-2xl">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    {featuredPost.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                        bg-[#C9A84C] text-[#1C0F05] text-[10px] font-bold uppercase tracking-wide">
                        <Sparkles size={9} /> Editor's Pick
                      </span>
                    )}
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
                      <span>{featuredPost.author || "The Nestory Team"}</span>
                      <span>·</span>
                      <Clock size={12} />
                      <span>
                          {getReadTime(
                            featuredPost.content || featuredPost.excerpt
                          )}
                        </span>
                      <span>·</span>
                      <span>{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 text-[#C9A84C] text-xs font-bold
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Read Article <ArrowUpRight size={13} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ══ FILTER BAR ════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EDE5DD]
        shadow-[0_2px_8px_rgba(107,58,31,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            {ALL_CATEGORIES.map(cat => (
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
                {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}{" "}
                {activeCategory !== "All" ? `in ${activeCategory}` : ""}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#A8978A] font-medium">
                <TrendingUp size={11} />
                Latest First
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post._id} {...post} />
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
                {ALL_CATEGORIES.filter(c => c !== "All").map(cat => {
                  const count = categoryCounts[cat] || 0;
                  if (count === 0) return null;
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}