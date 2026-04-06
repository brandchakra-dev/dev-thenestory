"use client"

import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { ChevronLeft, ChevronRight, ArrowRight, Scale, ArrowUpRight } from "lucide-react"
import Image from "next/image"

import "swiper/css"
import "swiper/css/navigation"

// ─── Types ────────────────────────────────────────────────
interface CompareSlide {
  leftImage: string
  rightImage: string
  leftName: string
  rightName: string
  leftPrice: string
  rightPrice: string
  leftTag: string
  rightTag: string
  link: string
}

// ─── Data ────────────────────────────────────────────────
const slides: CompareSlide[] = [
  {
    leftImage:  "/property/compare/ace.webp",
    rightImage: "/property/compare/irish.avif",
    leftName:   "ACE Group",
    rightName:  "Irish Infrastructure",
    leftPrice:  "₹2.16 Cr*",
    rightPrice: "₹1.32 Cr*",
    leftTag:    "Sector 12, Noida",
    rightTag:   "Sector 78, Gurugram",
    link: "#",
  },
  {
    leftImage:  "/property/compare/ACE-Divino.jpg",
    rightImage: "/property/compare/crc.jpg",
    leftName:   "ACE Divino",
    rightName:  "CRC Joyous",
    leftPrice:  "₹1.24 Cr*",
    rightPrice: "₹1.3 Cr*",
    leftTag:    "Greater Noida West",
    rightTag:   "Noida Extension",
    link: "#",
  },
  {
    leftImage:  "/property/compare/ace.webp",
    rightImage: "/property/compare/irish.avif",
    leftName:   "ACE Group",
    rightName:  "Irish Infrastructure",
    leftPrice:  "₹2.16 Cr*",
    rightPrice: "₹1.32 Cr*",
    leftTag:    "Sector 12, Noida",
    rightTag:   "Sector 78, Gurugram",
    link: "#",
  },
  {
    leftImage:  "/property/compare/ACE-Divino.jpg",
    rightImage: "/property/compare/crc.jpg",
    leftName:   "ACE Divino",
    rightName:  "CRC Joyous",
    leftPrice:  "₹1.24 Cr*",
    rightPrice: "₹1.3 Cr*",
    leftTag:    "Greater Noida West",
    rightTag:   "Noida Extension",
    link: "#",
  },
  {
    leftImage:  "/property/compare/ACE-Divino.jpg",
    rightImage: "/property/compare/crc.jpg",
    leftName:   "ACE Divino",
    rightName:  "CRC Joyous",
    leftPrice:  "₹1.24 Cr*",
    rightPrice: "₹1.3 Cr*",
    leftTag:    "Greater Noida West",
    rightTag:   "Noida Extension",
    link: "#",
  },
]

// ─── CompareCard ─────────────────────────────────────────
function CompareCard({ slide }: { slide: CompareSlide }) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden
      border border-[#EDE5DD]
      shadow-[0_2px_12px_rgba(107,58,31,0.07)]
      hover:shadow-[0_12px_40px_rgba(107,58,31,0.14)]
      hover:-translate-y-1 transition-all duration-300 cursor-pointer">

      {/* Top sheen */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }}
      />

      {/* ── Dual image ── */}
      <div className="relative flex h-44 sm:h-48 overflow-hidden">

        {/* Left image */}
        <div className="relative w-1/2 overflow-hidden">
          <Image
            src={slide.leftImage} alt={slide.leftName} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* A label */}
          <div
            className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}
          >
            A
          </div>

          {/* Left bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white font-display font-bold text-xs leading-tight line-clamp-1 drop-shadow">
              {slide.leftName}
            </p>
            <p className="text-[10px] font-medium mt-0.5 drop-shadow" style={{ color: "rgba(255,255,255,0.6)" }}>
              {slide.leftTag}
            </p>
          </div>
        </div>

        {/* VS badge — centre overlap */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
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

        {/* Right image */}
        <div className="relative w-1/2 overflow-hidden">
          <Image
            src={slide.rightImage} alt={slide.rightName} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* B label */}
          <div
            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}
          >
            B
          </div>

          {/* Right bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-right">
            <p className="text-white font-display font-bold text-xs leading-tight line-clamp-1 drop-shadow">
              {slide.rightName}
            </p>
            <p className="text-[10px] font-medium mt-0.5 drop-shadow" style={{ color: "rgba(255,255,255,0.6)" }}>
              {slide.rightTag}
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
        <button className="flex items-center gap-1 text-[10px] font-bold
          text-[#6B3A1F] hover:gap-2 transition-all duration-200">
          Compare Now
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  )
}

// ─── CompareSection ──────────────────────────────────────
export default function CompareSection() {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="py-8 sm:py-6 lg:py-8" style={{ background: "linear-gradient(135deg, hsl(38,45%,97%) 0%, hsl(34,35%,93%) 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
          <button className="hidden sm:inline-flex items-center gap-2 self-end
            px-5 py-2.5 rounded-xl border border-[#EDE5DD] bg-white
            text-[#6B3A1F] font-bold text-sm
            shadow-[0_2px_8px_rgba(107,58,31,0.08)]
            hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
            hover:shadow-[0_4px_16px_rgba(107,58,31,0.25)]
            active:scale-[0.97] transition-all duration-200 flex-shrink-0">
            View All
            <ArrowRight size={15} />
          </button>
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
            {slides.map((slide, i) => (
              <SwiperSlide key={i}>
                <CompareCard slide={slide} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All — mobile */}
        <div className="flex justify-center mt-6 sm:hidden">
          <button className="inline-flex items-center gap-2
            px-6 py-2.5 rounded-xl
            bg-[#6B3A1F] text-white font-bold text-sm
            shadow-[0_4px_16px_rgba(107,58,31,0.30)]
            hover:bg-[#522C16] active:scale-[0.97] transition-all duration-200">
            View All Projects
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  )
}