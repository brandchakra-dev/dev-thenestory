"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Clock, User, Calendar, Share2, Bookmark,
  BookmarkCheck, Twitter, Linkedin, Link2, ChevronRight,
  TrendingUp, ArrowUpRight, Quote, Eye, Loader2
} from "lucide-react";

import DOMPurify from "dompurify";

import { blogsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ─────────────────────────────────────────────────
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
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImageUrl: string;
  publishedAt: string;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Market Trends":   { bg: "#EFF6FF", text: "#2563EB" },
  "Buying Guide":    { bg: "#F0FDF4", text: "#16A34A" },
  "Investment":      { bg: "#FFFBEB", text: "#D97706" },
  "Legal & Finance": { bg: "#FFF1F2", text: "#E11D48" },
  "NRI Corner":      { bg: "#F5F3FF", text: "#7C3AED" },
  "New Launches":    { bg: "#FDF8F4", text: "#6B3A1F" },
  "News":            { bg: "#EFF6FF", text: "#2563EB" },
  "Tax & Legal":     { bg: "#FFF1F2", text: "#E11D48" },
  "Help Guides":     { bg: "#F0FDF4", text: "#16A34A" },
  "Finance":         { bg: "#FFFBEB", text: "#D97706" },
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
              { icon: <Twitter size={13} />, label: "Twitter / X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}` },
              { icon: <Linkedin size={13} />, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
            ].map(item => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
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

// ─── Loading Skeleton ──────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="bg-[#FDFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-200 rounded-xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-32 bg-gray-200 rounded-xl mb-4" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-48 bg-gray-200 rounded-xl mb-4" />
              <div className="h-48 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function InsightsDetail() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await blogsApi.getOne(slug);
        
        let blogData = null;
        if (response.blog) {
          blogData = response.blog;
        } else if (response.data) {
          blogData = response.data;
        } else {
          blogData = response;
        }
        
        setBlog(blogData);
        
        // Fetch related blogs (same category, exclude current)
        if (blogData?.category) {
          const relatedResponse = await blogsApi.getAll({ 
            category: blogData.category, 
            limit: 3 
          });
          let relatedData = [];
          if (relatedResponse.blogs) {
            relatedData = relatedResponse.blogs.filter((b: any) => b.slug !== slug);
          } else if (relatedResponse.data) {
            relatedData = relatedResponse.data.filter((b: any) => b.slug !== slug);
          }
          setRelatedBlogs(relatedData.slice(0, 3));
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Blog post not found");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [slug]);

  // Helper functions
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views?.toString() || "0";
  };

  // Parse HTML content into sections (simple parsing for demo)
  const parseContentToSections = (content: string) => {
    if (!content) return [];
    
    // Split by h2 tags to create sections
    const sections = [];
    const parts = content.split(/<h2>(.*?)<\/h2>/);
    
    for (let i = 0; i < parts.length; i++) {
      if (i === 0 && parts[0].trim()) {
        sections.push({ type: "intro", text: parts[0].replace(/<[^>]*>/g, '') });
      } else if (i % 2 === 1) {
        sections.push({ type: "heading", text: parts[i] });
        if (parts[i + 1] && parts[i + 1].trim()) {
          sections.push({ type: "paragraph", text: parts[i + 1].replace(/<[^>]*>/g, '') });
        }
      }
    }
    
    return sections;
  };
  

  if (loading) return <LoadingSkeleton />;
  
  if (error || !blog) {
    return (
      <main className="bg-[#FDFAF7] min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="font-bold text-xl text-[#1C0F05] mb-2">Blog Post Not Found</h2>
          <p className="text-[#A8978A] mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B3A1F] text-white rounded-xl font-bold">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const sections = parseContentToSections(blog.content);
  const readingTime = Math.ceil((blog.content?.length || 0) / 1000);
  const cleanHTML = DOMPurify.sanitize(blog.content || "");
  return (
    <>
      <ReadingProgress />

      <main className="bg-[#FDFAF7] min-h-screen">

        {/* ══ BACK NAV ══════════════════════════════════════ */}
        <div className="sticky top-[3px] z-40 bg-white/80 backdrop-blur-md border-b border-[#EDE5DD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/blog"
              className="flex items-center gap-2 text-[#6B5C4E] text-xs font-semibold
                hover:text-[#6B3A1F] transition-colors group">
              <ArrowLeft size={15}
                className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to Blog
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
          <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[82vh] overflow-hidden">
            {blog.coverImageUrl ? (
              <img
                src={getImageUrl(blog.coverImageUrl)}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] flex items-center justify-center">
                <span className="text-4xl text-[#A8978A]">📝</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0602]/85 via-[#0D0602]/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0602]/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
                <div className="flex items-center gap-3 mb-5">
                  {blog.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                      bg-[#C9A84C] text-[#1C0F05] text-[10px] font-black uppercase tracking-widest">
                      ✦ Editor's Pick
                    </span>
                  )}
                  <CategoryBadge cat={blog.category} />
                </div>

                <h1
                  className="font-serif text-white leading-[1.08] tracking-tight mb-4"
                  style={{
                    fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    textShadow: "0 2px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {blog.title}
                </h1>

                <p className="text-white/70 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
                  {blog.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#C9A84C]/60 bg-[#6B3A1F] flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {blog.author?.charAt(0) || "T"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">{blog.author || "The Nestory Team"}</p>
                      <p className="text-white/55 text-[10px]">Real Estate Analyst</p>
                    </div>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex items-center gap-3 text-white/60 text-[11px]">
                    <span className="flex items-center gap-1.5"><Calendar size={11} />{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} />{readingTime} min read</span>
                    <span className="flex items-center gap-1.5"><Eye size={11} />{formatViews(blog.views)} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ══ BODY ══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

            {/* ── Article content ───────────────────────── */}
            <article ref={contentRef} className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                <span className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.2em]">Analysis</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#C9A84C] to-transparent" />
              </div>

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
            </article>

            {/* ── Sidebar ───────────────────────────────── */}
            <aside className="lg:col-span-4">
              <div className="sticky top-20 space-y-6">

                {/* Quick facts */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-sm">
                  <div className="h-1 bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C]" />
                  <div className="p-5">
                    <p className="text-[10px] text-[#C9A84C] font-black uppercase tracking-widest mb-4">
                      Key Takeaways
                    </p>
                    <ul className="space-y-3">
                      {blog.tags && blog.tags.slice(0, 5).map((tag, i) => (
                        <li key={i} className="flex gap-3 text-xs text-[#3D2B1A] leading-relaxed">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6B3A1F]/8 text-[#6B3A1F]
                            flex items-center justify-center text-[10px] font-black mt-0.5">
                            {i + 1}
                          </span>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                    Get personalised advice on which micro-market suits your budget and goals.
                  </p>
                  <button className="w-full flex items-center justify-center gap-2
                    py-3 rounded-xl bg-[#C9A84C] text-[#1C0F05] font-black text-xs
                    hover:bg-white active:scale-[0.97] transition-all duration-200
                    shadow-[0_4px_16px_rgba(201,168,76,0.35)]">
                    Book Free Call <ArrowUpRight size={13} />
                  </button>
                </div>

                {/* Related articles */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-white rounded-2xl border border-[#EDE5DD] p-5 shadow-sm">
                    <p className="text-[#1C0F05] text-sm font-bold mb-4"
                      style={{ fontFamily: "'Georgia', serif" }}>
                      Related Articles
                    </p>
                    <div className="space-y-4">
                      {relatedBlogs.map((r) => (
                        <Link key={r._id} href={`/blog/${r.slug}`}
                          className="flex gap-3 group">
                          <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0">
                            {r.coverImageUrl ? (
                              <img src={getImageUrl(r.coverImageUrl)} alt={r.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#FAF7F4] flex items-center justify-center">
                                <span className="text-xl">📄</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CategoryBadge cat={r.category} />
                            <p className="text-[#1C0F05] text-[11px] font-semibold leading-snug mt-1
                              line-clamp-2 group-hover:text-[#6B3A1F] transition-colors">
                              {r.title}
                            </p>
                            <p className="text-[#A8978A] text-[10px] mt-0.5">
                              {formatDate(r.publishedAt)} · {Math.ceil((r.excerpt?.length || 0) / 500)} min read
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </aside>
          </div>
        </div>

      </main>
    </>
  );
}