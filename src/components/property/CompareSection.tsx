"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight, Scale, ArrowUpRight, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  status: string;
  images: ProjectImage[];
  propertyType: string;
  bhk: string[];
  builder?: { name: string; slug: string };
  city?: { name: string; slug: string };
  rating?: number;
}

interface CompareSlide {
  leftId: string;
  rightId: string;
  leftImages: ProjectImage[];
  rightImages: ProjectImage[];
  leftName: string;
  rightName: string;
  leftPrice: string;
  rightPrice: string;
  leftTag: string;
  rightTag: string;
  leftSlug: string;
  rightSlug: string;
  leftBuilder: string;
  rightBuilder: string;
}

// ─── Image Carousel Component ───────────────────────────────
function ImageCarousel({ images, title, side }: { images: ProjectImage[]; title: string; side: "left" | "right" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const validImages = images.filter(img => img?.url && !failedImages.has(img._id));

  if (!validImages.length) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] flex items-center justify-center">
        <Building2 size={32} className="text-[#A8978A]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={validImages.length > 1}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          nextEl: `.swiper-next-${side}-${title.replace(/\s/g, '-')}`,
          prevEl: `.swiper-prev-${side}-${title.replace(/\s/g, '-')}`,
        }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {validImages.map((img, idx) => (
          <SwiperSlide key={img._id || idx}>
            <div className="relative w-full h-full">
              <img
                src={getImageUrl(img.url)}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {validImages.length > 1 && (
        <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[8px] font-medium">
          {currentIndex + 1}/{validImages.length}
        </div>
      )}

      {validImages.length > 1 && (
        <>
          <button
            className={`swiper-prev-${side}-${title.replace(/\s/g, '-')} absolute left-1 top-1/2 -translate-y-1/2 z-20
              w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm text-white 
              flex items-center justify-center hover:bg-black/70 transition-all
              hover:scale-110 active:scale-95`}
          >
            <ChevronLeft size={10} />
          </button>
          <button
            className={`swiper-next-${side}-${title.replace(/\s/g, '-')} absolute right-1 top-1/2 -translate-y-1/2 z-20
              w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm text-white 
              flex items-center justify-center hover:bg-black/70 transition-all
              hover:scale-110 active:scale-95`}
          >
            <ChevronRight size={10} />
          </button>
        </>
      )}
    </div>
  );
}

// ─── CompareCard ─────────────────────────────────────────
function CompareCard({ slide }: { slide: CompareSlide }) {
  return (
    <Link
      href={`/compare-projects?project1=${slide.leftSlug}&project2=${slide.rightSlug}`}
      className="group relative bg-white rounded-2xl overflow-hidden
        border border-[#EDE5DD]
        shadow-[0_2px_12px_rgba(107,58,31,0.07)]
        hover:shadow-[0_12px_40px_rgba(107,58,31,0.14)]
        hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
    >
      {/* Top sheen */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }}
      />

      {/* ── Dual image with carousel ── */}
      <div className="relative flex h-44 sm:h-48 overflow-hidden">

        {/* Left image with carousel */}
        <div className="relative w-1/2 overflow-hidden">
          <ImageCarousel images={slide.leftImages} title={slide.leftName} side="left" />

          {/* A label */}
          <div
            className="absolute top-2 left-2 z-20 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}
          >
            A
          </div>

          {/* Left bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
            <p className="text-white font-display font-bold text-xs leading-tight line-clamp-1 drop-shadow">
              {slide.leftName}
            </p>
            <p className="text-[9px] font-medium mt-0.5 drop-shadow" style={{ color: "rgba(255,255,255,0.6)" }}>
              {slide.leftBuilder}
            </p>
          </div>
        </div>

        {/* VS badge — centre overlap */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none">
          <div
            className="flex items-center justify-center font-black text-[11px] transition-transform duration-300 group-hover:scale-110"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
              color: "#1C0F05",
              boxShadow: "0 0 0 3px #fff, 0 4px 14px rgba(201,168,76,0.50)",
              letterSpacing: "0.04em",
            }}
          >
            VS
          </div>
        </div>

        {/* Right image with carousel */}
        <div className="relative w-1/2 overflow-hidden">
          <ImageCarousel images={slide.rightImages} title={slide.rightName} side="right" />

          {/* B label */}
          <div
            className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}
          >
            B
          </div>

          {/* Right bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-2 z-20 text-right">
            <p className="text-white font-display font-bold text-xs leading-tight line-clamp-1 drop-shadow">
              {slide.rightName}
            </p>
            <p className="text-[9px] font-medium mt-0.5 drop-shadow" style={{ color: "rgba(255,255,255,0.6)" }}>
              {slide.rightBuilder}
            </p>
          </div>
        </div>
      </div>

      {/* ── Price row ── */}
      <div
        className="flex items-center justify-between px-3.5 py-3"
        style={{ borderTop: "1px solid #F5EFE7", borderBottom: "1px solid #F5EFE7" }}
      >
        <div>
          <p className="text-[8px] font-black tracking-[0.18em] uppercase mb-0.5" style={{ color: "#B0A090" }}>
            {slide.leftName}
          </p>
          <p className="font-display font-bold text-sm leading-none" style={{ color: "#1C0F05" }}>
            {slide.leftPrice}
          </p>
        </div>

        {/* Gold divider */}
        <div className="flex flex-col items-center gap-[3px]">
          <div className="w-px h-2.5" style={{ background: "rgba(201,168,76,0.35)" }} />
          <div className="w-[5px] h-[5px] rounded-full" style={{ background: "#C9A84C" }} />
          <div className="w-px h-2.5" style={{ background: "rgba(201,168,76,0.35)" }} />
        </div>

        <div className="text-right">
          <p className="text-[8px] font-black tracking-[0.18em] uppercase mb-0.5" style={{ color: "#B0A090" }}>
            {slide.rightName}
          </p>
          <p className="font-display font-bold text-sm leading-none" style={{ color: "#1C0F05" }}>
            {slide.rightPrice}
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#A8978A" }}>
          <Scale size={11} style={{ color: "#6B3A1F", opacity: 0.6 }} />
          Side-by-side view
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B3A1F] group-hover:gap-2 transition-all duration-200">
          Compare Now
          <ArrowRight size={10} />
        </div>
      </div>
    </Link>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EDE5DD] animate-pulse">
          <div className="h-44 bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main CompareSection ──────────────────────────────────────
export default function CompareSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  
  const [compareSlides, setCompareSlides] = useState<CompareSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectsForCompare = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getAll({ limit: 20 });
        
        let projectsData: Project[] = [];
        if (response.projects) {
          projectsData = response.projects;
        } else if (response.data) {
          projectsData = response.data;
        } else if (Array.isArray(response)) {
          projectsData = response;
        }

        if (projectsData.length < 2) {
          setCompareSlides([]);
          setLoading(false);
          return;
        }

        // Create random comparison pairs
        const slides: CompareSlide[] = [];
        const shuffled = [...projectsData];
        
        // Shuffle array for random pairs
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Create up to 6 comparison slides
        const maxSlides = Math.min(6, Math.floor(shuffled.length / 2));
        
        for (let i = 0; i < maxSlides; i++) {
          const left = shuffled[i * 2];
          const right = shuffled[i * 2 + 1];
          
          if (!left || !right) continue;
          
          slides.push({
            leftId: left._id,
            rightId: right._id,
            leftImages: left.images || [],
            rightImages: right.images || [],
            leftName: left.title,
            rightName: right.title,
            leftPrice: left.priceLabel,
            rightPrice: right.priceLabel,
            leftTag: left.location,
            rightTag: right.location,
            leftSlug: left.slug,
            rightSlug: right.slug,
            leftBuilder: left.builder?.name || "Top Builder",
            rightBuilder: right.builder?.name || "Top Builder",
          });
        }
        
        setCompareSlides(slides);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects for compare:", err);
        setError("Failed to load comparisons");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsForCompare();
  }, []);

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-6 lg:py-8" style={{ background: "linear-gradient(135deg, hsl(38,45%,97%) 0%, hsl(34,35%,93%) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="font-display font-bold text-[#1C0F05] text-2xl sm:text-3xl lg:text-4xl leading-tight">
                Compare{" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                  Projects
                </span>
              </h2>
              <p className="text-[#A8978A] text-sm mt-1.5 font-medium">Easily compare top properties to find your perfect match.</p>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (compareSlides.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-6 lg:py-8" style={{ background: "linear-gradient(135deg, hsl(38,45%,97%) 0%, hsl(34,35%,93%) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">

          <div>
            <h2 className="font-display font-bold text-[#1C0F05]
              text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Compare{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}
              >
                Projects
              </span>
            </h2>
            <p className="text-[#A8978A] text-sm mt-1.5 font-medium">
              Easily compare top properties to find your perfect match.
            </p>
          </div>

          {/* View All — desktop */}
          <Link
            href="/compare-projects"
            className="hidden sm:inline-flex items-center gap-2 self-end
              px-5 py-2.5 rounded-xl border border-[#EDE5DD] bg-white
              text-[#6B3A1F] font-bold text-sm
              shadow-[0_2px_8px_rgba(107,58,31,0.08)]
              hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
              hover:shadow-[0_4px_16px_rgba(107,58,31,0.25)]
              active:scale-[0.97] transition-all duration-200 flex-shrink-0"
          >
            View All
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* ── Carousel ── */}
        <div className="relative">

          {/* Prev button */}
          <button
            ref={prevRef}
            className="compare-prev absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10
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

          {/* Next button */}
          <button
            ref={nextRef}
            className="compare-next absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10
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

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{
              nextEl: ".compare-next",
              prevEl: ".compare-prev",
            }}
            breakpoints={{
              0:    { slidesPerView: 1.15, spaceBetween: 12 },
              480:  { slidesPerView: 1.6,  spaceBetween: 14 },
              640:  { slidesPerView: 2.2,  spaceBetween: 16 },
              768:  { slidesPerView: 2.8,  spaceBetween: 18 },
              1024: { slidesPerView: 3.5,  spaceBetween: 20 },
              1280: { slidesPerView: 4,    spaceBetween: 20 },
            }}
            style={{ padding: "4px 2px 8px" }}
          >
            {compareSlides.map((slide, i) => (
              <SwiperSlide key={`${slide.leftId}-${slide.rightId}-${i}`}>
                <CompareCard slide={slide} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All — mobile */}
        <div className="flex justify-center mt-6 sm:hidden">
          <Link
            href="/compare-projects"
            className="inline-flex items-center gap-2
              px-6 py-2.5 rounded-xl
              bg-[#6B3A1F] text-white font-bold text-sm
              shadow-[0_4px_16px_rgba(107,58,31,0.30)]
              hover:bg-[#522C16] active:scale-[0.97] transition-all duration-200"
          >
            View All Projects
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}