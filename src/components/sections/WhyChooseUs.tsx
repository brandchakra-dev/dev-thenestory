"use client";

import { ShieldCheck, TrendingUp, Users, Award, HeadphonesIcon, MapPin, ArrowUpRight, Star, Sparkles } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const reasons = [
  { icon: ShieldCheck,      title: "100% Verified",         desc: "Every listing physically verified. No fakes.",        stat: "1,200+", statLabel: "Projects",    accent: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
  { icon: Users,            title: "Dedicated Advisor",     desc: "One expert. From search to registration.",           stat: "18k+",   statLabel: "Clients",      accent: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  { icon: Award,            title: "3 Years of Trust",     desc: "Delhi NCR's most recognized advisory firm.",         stat: "3 Yr",  statLabel: "Experience",   accent: "#d97706", bg: "#fffbeb", border: "#fde68a" },

];

const testimonials = [
  { name: "Rahul Sharma",  role: "Homebuyer, Noida",    text: "Nestory saved me ₹4L on my apartment. Advisor available even on Sunday evenings.", avatar: "RS", rating: 5 },
  { name: "Priya Mehta",   role: "Investor, Gurugram",  text: "Transparent pricing, verified properties. Best real estate experience I've had.",   avatar: "PM", rating: 5 },
  { name: "Arjun Kapoor",  role: "NRI Buyer, Dubai",    text: "Handled everything remotely — shortlisting to registration. Exceptional.",          avatar: "AK", rating: 5 },
  { name: "Arjun Kapoor",  role: "NRI Buyer, Dubai",    text: "Handled everything remotely — shortlisting to registration. Exceptional.",          avatar: "AK", rating: 5 },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-8 lg:py-12 relative overflow-hidden bg-white">


      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4C4B0]/60 to-transparent" />
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#6B3A1F]/3 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#C9A84C]/4 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

         <div className="mb-6 text-center">
            <h2 className="font-display font-bold text-[#1C0F05]
              text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Why Choose{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}
              >
                The Nestory
              </span>
            </h2>
            <p className="text-[#A8978A] text-sm mt-1.5 font-medium">
            Your end-to-end real estate partner
          </p>
          </div>

        {/* ── Reasons Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14 sm:mb-18">
          {reasons.map(({ icon: Icon, title, desc, stat, statLabel, accent, bg, border }, i) => (
            <div key={i}
              className="group relative bg-white rounded-2xl p-5 cursor-pointer
                border border-[#EDE5DD]
                shadow-[0_2px_12px_rgba(107,58,31,0.05)]
                hover:shadow-[0_12px_40px_rgba(107,58,31,0.12)]
                hover:-translate-y-1 transition-all duration-300 overflow-hidden">

              {/* Hover bg tint */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ backgroundColor: bg }} />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg,${accent},transparent)` }} />

              {/* Stat — top right */}
              <div className="absolute top-4 right-4 text-right">
                <p className="font-display font-bold text-base leading-none" style={{ color: accent }}>{stat}</p>
                <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wide mt-0.5">{statLabel}</p>
              </div>

              {/* Icon */}
              <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center mb-4
                transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: bg, border: `1.5px solid ${border}` }}>
                <Icon size={18} style={{ color: accent }} />
              </div>

              {/* Text */}
              <div className="relative z-10 pr-14">
                <h3 className="font-display font-bold text-[#1C0F05] text-sm leading-snug mb-1.5
                  group-hover:text-[#1C0F05]">{title}</h3>
                <p className="text-[#7A6858] text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

{/* ── Testimonials Slider ── */}
<div className="mb-12 sm:mb-16 hidden">

  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
    <h3 className="font-display font-bold text-[#1C0F05] text-xl sm:text-2xl">
      Real People.{" "}
      <span className="text-transparent bg-clip-text"
        style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
        Real Results.
      </span>
    </h3>
    <div className="flex items-center gap-1.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} className="fill-[#C9A84C] text-[#C9A84C]" />
      ))}
      <span className="text-[#1C0F05] font-bold text-sm ml-1">4.9</span>
      <span className="text-[#A8978A] text-xs">/ 2,400+ reviews</span>
    </div>
  </div>

  {/* Slider */}
  <div className="relative">

    {/* Prev */}
    <button className="testimonials-prev absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10
      w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
      border border-[#EDE5DD]
      shadow-[0_2px_12px_rgba(107,58,31,0.12)]
      flex items-center justify-center text-[#6B5C4E]
      hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
      hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
      active:scale-90 transition-all duration-200">
      <ChevronLeft size={18} />
    </button>

    {/* Next */}
    <button className="testimonials-next absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10
      w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white
      border border-[#EDE5DD]
      shadow-[0_2px_12px_rgba(107,58,31,0.12)]
      flex items-center justify-center text-[#6B5C4E]
      hover:bg-[#6B3A1F] hover:text-white hover:border-[#6B3A1F]
      hover:shadow-[0_4px_16px_rgba(107,58,31,0.30)]
      active:scale-90 transition-all duration-200">
      <ChevronRight size={18} />
    </button>

    <Swiper
      modules={[Navigation, Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      navigation={{ nextEl: ".testimonials-next", prevEl: ".testimonials-prev" }}
      breakpoints={{
        0:    { slidesPerView: 1.1,  spaceBetween: 12 },
        480:  { slidesPerView: 1.5,  spaceBetween: 14 },
        640:  { slidesPerView: 2.1,  spaceBetween: 16 },
        1024: { slidesPerView: 3,    spaceBetween: 20 },
      }}
      style={{ padding: "4px 2px 8px" }}
    >
      {testimonials.map(({ name, role, text, avatar, rating }, i) => (
        <SwiperSlide key={i}>
          <div className="bg-white rounded-2xl p-5 border border-[#EDE5DD]
            shadow-[0_2px_10px_rgba(107,58,31,0.05)]
            hover:shadow-[0_10px_32px_rgba(107,58,31,0.10)]
            hover:-translate-y-0.5 transition-all duration-300 h-full">

            <div className="flex gap-0.5 mb-3">
              {[...Array(rating)].map((_, j) => (
                <Star key={j} size={11} className="fill-[#C9A84C] text-[#C9A84C]" />
              ))}
            </div>

            <p className="text-[#4A3728] text-xs leading-relaxed mb-4 italic">"{text}"</p>

            <div className="flex items-center gap-2.5 pt-3.5 border-t border-[#F5EFE8]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center
                text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
                {avatar}
              </div>
              <div>
                <p className="font-bold text-[#1C0F05] text-xs">{name}</p>
                <p className="text-[#A8978A] text-[10px] mt-0.5">{role}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</div>

      </div>
    </section>
  );
}