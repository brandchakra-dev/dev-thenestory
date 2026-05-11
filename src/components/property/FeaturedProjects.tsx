"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import {
  ChevronLeft, ChevronRight, MapPin,
  ArrowRight, Heart, BadgeCheck, Sparkles, Building2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ─── API Import ────────────────────────────────────────────────
import { projectsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ────────────────────────────────────────────────
interface ProjectImage {
  _id: string;
  url: string;
  isPrimary: boolean;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  location: string;
  priceLabel: string;
  status: "New Launch" | "Ready To Move" | "Under Construction" | "Upcoming";
  images: ProjectImage[];
  propertyType: string;
  isFeatured: boolean;
  builder?: { name: string; slug: string };
  city?: { name: string; slug: string };
}

// ─── Status config ─────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "New Launch": {
    bg:   "bg-[#6B3A1F]/10 border border-[#6B3A1F]/20",
    text: "text-[#6B3A1F]",
    dot:  "bg-[#6B3A1F]",
  },
  "Ready To Move": {
    bg:   "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
    dot:  "bg-emerald-500",
  },
  "Under Construction": {
    bg:   "bg-amber-50 border border-amber-200",
    text: "text-amber-700",
    dot:  "bg-amber-500",
  },
  "Upcoming": {
    bg:   "bg-blue-50 border border-blue-200",
    text: "text-blue-700",
    dot:  "bg-blue-500",
  },
};

// ─── Image Carousel Component (Always visible controls) ───
function ProjectImageCarousel({ images, title }: { images: ProjectImage[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  if (!images.length) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] flex items-center justify-center">
        <Building2 size={48} className="text-[#A8978A]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={images.length > 1}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: `.swiper-next-${title.replace(/\s/g, '-')}`,
          prevEl: `.swiper-prev-${title.replace(/\s/g, '-')}`,
        }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        className="w-full h-full"
      >
        {images.map((img, idx) => ( 
          <SwiperSlide key={img._id || idx}>
            <Image
              src={getImageUrl(img.url)}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={true}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Image Counter - Always visible (top right) */}
      {images.length > 1 && (
        <div className="absolute top-3 right-12 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {/* Custom Navigation Arrows - Always visible */}
      {images.length > 1 && (
        <>
          <button
            className={`swiper-prev-${title.replace(/\s/g, '-')} absolute left-2 top-1/2 -translate-y-1/2 z-20
              w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white 
              flex items-center justify-center hover:bg-black/70 transition-all
              hover:scale-110 active:scale-95`}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className={`swiper-next-${title.replace(/\s/g, '-')} absolute right-2 top-1/2 -translate-y-1/2 z-20
              w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white 
              flex items-center justify-center hover:bg-black/70 transition-all
              hover:scale-110 active:scale-95`}
          >
            <ChevronRight size={14} />
          </button>
        </>
      )}

      {/* Custom Pagination Dots Container - Always visible */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20">
          <style jsx global>{`
            .swiper-pagination-${title.replace(/\s/g, '-')} {
              position: absolute !important;
              bottom: 8px !important;
              left: 0 !important;
              right: 0 !important;
              display: flex !important;
              justify-content: center !important;
              gap: 6px !important;
              z-index: 20 !important;
            }
            .swiper-pagination-${title.replace(/\s/g, '-')} .swiper-pagination-bullet {
              width: 6px !important;
              height: 6px !important;
              background: rgba(255,255,255,0.6) !important;
              opacity: 1 !important;
              margin: 0 !important;
              transition: all 0.2s ease !important;
            }
            .swiper-pagination-${title.replace(/\s/g, '-')} .swiper-pagination-bullet-active {
              width: 16px !important;
              background: #C9A84C !important;
              border-radius: 4px !important;
            }
          `}</style>
          <div className={`swiper-pagination-${title.replace(/\s/g, '-')}`} />
        </div>
      )}
    </div>
  );
}

// ─── ProjectCard (Dynamic) ───────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const cfg = statusConfig[project.status] ?? statusConfig["Under Construction"];

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <div className="relative bg-white rounded-2xl overflow-hidden
        border border-[#EDE5DD]
        shadow-[0_2px_12px_rgba(107,58,31,0.07)]
        hover:shadow-[0_12px_40px_rgba(107,58,31,0.14)]
        hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">

        {/* Image with Carousel */}
        <div className="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
          <ProjectImageCarousel images={project.images} title={project.title} />

          {/* Status badge — top left */}
          <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5
            px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm
            ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {project.status}
          </div>

          {/* Wishlist — top right */}
          <button 
            className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full
              bg-white/20 backdrop-blur-sm border border-white/30
              flex items-center justify-center
              hover:bg-white hover:text-[#6B3A1F] transition-all duration-200"
            onClick={(e) => e.preventDefault()}>
            <Heart size={13} className="text-white group-hover:text-current" />
          </button>

          {/* Price — bottom left over image */}
          <div className="absolute bottom-3 left-3 z-20">
            <p className="text-white font-bold text-sm leading-none drop-shadow-md">
              {project.priceLabel}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">

          {/* Title */}
          <h3 className="font-display font-bold text-[#1C0F05] text-sm sm:text-base
            leading-snug mb-1.5 line-clamp-1 group-hover:text-[#6B3A1F] transition-colors">
            {project.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-[#A8978A] mb-3">
            <MapPin size={11} className="flex-shrink-0 text-[#6B3A1F]/60" />
            <span className="text-xs truncate">{project.location}</span>
          </div>

          {/* Builder Info */}
          {project.builder && (
            <div className="flex items-center gap-1 mb-2 text-[10px] text-[#A8978A]">
              <Building2 size={10} />
              <span>{project.builder.name}</span>
            </div>
          )}

          {/* Property Type */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#6B3A1F]/8 text-[#6B3A1F]">
              {project.propertyType}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#EDE5DD]">
            <div className="flex items-center gap-1 text-[10px] text-[#A8978A] font-medium">
              <BadgeCheck size={11} className="text-emerald-500" />
              Verified Project
            </div>
            <button className="flex items-center gap-1 text-[10px] font-bold
              text-[#6B3A1F] hover:gap-2 transition-all duration-200">
              View Details
              <ArrowRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FeaturedProjects Component ──────────────────────────────────────
export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Fetch featured projects from API
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getFeatured();
        
        let featuredProjects = [];
        if (response.projects) {
          featuredProjects = response.projects;
        } else if (response.data) {
          featuredProjects = response.data;
        } else if (Array.isArray(response)) {
          featuredProjects = response;
        }

        console.log('img',response)
        
        setProjects(featuredProjects);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch featured projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  // Show error state
  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-[hsl(40,40%,97%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#6B3A1F] text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[hsl(40,40%,97%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">

          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-[#C9A84C]" />
              <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wider">
                Handpicked For You
              </span>
            </div>
            
            <h2 className="font-display font-bold text-[#1C0F05]
              text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Featured Projects{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                Near You
              </span>
            </h2>

            <p className="text-[#A8978A] text-sm mt-1.5 font-medium max-w-lg">
              Discover the most popular real estate projects with detailed insights on pricing, status, and prime locations.
            </p>
          </div>

          {/* View all — desktop */}
          <Link 
            href="/projects"
            className="hidden sm:inline-flex items-center gap-2 self-end
              px-5 py-2.5 rounded-xl border border-[#EDE5DD] bg-white
              text-[#6B3A1F] font-bold text-sm
              shadow-[0_2px_8px_rgba(107,58,31,0.08)]
              hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
              hover:shadow-[0_4px_16px_rgba(107,58,31,0.25)]
              active:scale-[0.97] transition-all duration-200 flex-shrink-0">
            View All Projects
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* ── Loading State ── */}
        {loading && <LoadingSkeleton />}

        {/* ── Carousel ── */}
        {!loading && projects.length > 0 && (
          <div className="relative">

            {/* Main Carousel Navigation Arrows - Always visible */}
            {projects.length > 4 && (
              <>
                <button
                  ref={prevRef}
                  className="featured-prev absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20
                    w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
                    border border-[#EDE5DD]
                    shadow-[0_2px_12px_rgba(107,58,31,0.12)]
                    flex items-center justify-center text-[#6B5C4E]
                    hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
                    hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
                    active:scale-90 transition-all duration-200"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  ref={nextRef}
                  className="featured-next absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20
                    w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
                    border border-[#EDE5DD]
                    shadow-[0_2px_12px_rgba(107,58,31,0.12)]
                    flex items-center justify-center text-[#6B5C4E]
                    hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
                    hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
                    active:scale-90 transition-all duration-200"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={16}
              autoplay={{ 
                delay: 4000, 
                disableOnInteraction: false, 
                pauseOnMouseEnter: true 
              }}
              navigation={projects.length > 4 ? {
                nextEl: ".featured-next",
                prevEl: ".featured-prev",
              } : false}
              breakpoints={{
                0:    { slidesPerView: 1.15, spaceBetween: 12 },
                480:  { slidesPerView: 1.6,  spaceBetween: 14 },
                640:  { slidesPerView: 2.2,  spaceBetween: 16 },
                768:  { slidesPerView: 2.8,  spaceBetween: 18 },
                1024: { slidesPerView: 3.2,  spaceBetween: 20 },
                1280: { slidesPerView: 4,    spaceBetween: 24 },
              }}
              style={{ padding: "4px 2px 8px" }}
            >
              {projects.map((project) => (
                <SwiperSlide key={project._id}>
                  <ProjectCard project={project} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* No projects state */}
        {!loading && projects.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F4] border border-[#EDE5DD] flex items-center justify-center mx-auto mb-3">
              <Building2 size={24} className="text-[#A8978A]" />
            </div>
            <p className="text-[#1C0F05] font-medium">No featured projects available</p>
            <p className="text-sm text-[#A8978A] mt-1">Check back later for new projects</p>
          </div>
        )}

        {/* View all — mobile */}
        {!loading && projects.length > 0 && (
          <div className="flex justify-center mt-8 sm:hidden">
            <Link 
              href="/projects"
              className="inline-flex items-center gap-2
                px-6 py-2.5 rounded-xl
                bg-[#6B3A1F] text-white font-bold text-sm
                shadow-[0_4px_16px_rgba(107,58,31,0.30)]
                hover:bg-[#522C16] active:scale-[0.97] transition-all duration-200">
              View All Projects
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}