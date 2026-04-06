"use client";

import Image from "next/image";
import { ArrowUpRight, BadgeCheck, Sofa, ChefHat, Star } from "lucide-react";

// ─── SponsoredSection ────────────────────────────────────
export default function SponsoredSection() {
  return (
    <section className="py-8 sm:py-6 lg:py-8" style={{ background: "hsl(40,40%,97%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Sponsored label ── */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background: "rgba(107,58,31,0.07)",
              border: "1px solid rgba(107,58,31,0.12)",
            }}
          >
            <BadgeCheck size={9} style={{ color: "#C9A84C" }} />
            <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B3A1F" }}>
              Ad
            </span>
          </div>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(107,58,31,0.12), transparent)" }} />
        </div>

        {/* ══ MAIN BANNER ══ */}
        <a
          href="#"
          className="group relative block w-full overflow-hidden cursor-pointer"
          style={{
            borderRadius: "20px",
            boxShadow: "0 8px 48px rgba(107,58,31,0.14), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* ── 3-column layout: product | brand | product ── */}
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: "1fr auto 1fr",
              minHeight: "clamp(160px, 19vw, 230px)",
              background: "#F7F1E8",
            }}
          >

            {/* ══ LEFT — Wardrobe card ══ */}
            <div className="relative flex overflow-hidden">
              {/* Photo — left half */}
              <div className="relative w-[42%] flex-shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern wardrobe interior"
                  className="w-full h-full object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
                />
                {/* Right edge fade */}
                <div
                  className="absolute inset-y-0 right-0 w-10 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, #F7F1E8)" }}
                />
              </div>

              {/* Info — right half */}
              <div className="flex flex-col justify-center px-3 sm:px-5 py-4 flex-1">
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "rgba(107,58,31,0.09)" }}
                >
                  <Sofa size={14} style={{ color: "#6B3A1F" }} />
                </div>

                {/* Product name */}
                <p style={{ fontSize: "clamp(7px, 0.85vw, 10px)", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(107,58,31,0.5)", marginBottom: "2px" }}>
                  Custom
                </p>
                <h3
                  className="font-display font-black leading-none"
                  style={{ fontSize: "clamp(13px, 1.9vw, 22px)", color: "#1C0F05" }}
                >
                  Wardrobe
                </h3>

                {/* USPs */}
                <div className="flex flex-col gap-1 mt-2.5 mb-3">
                  {["Factory Direct", "10-Yr Warranty", "No Middlemen"].map((usp) => (
                    <div key={usp} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#C9A84C" }} />
                      <span style={{ fontSize: "clamp(7px, 0.78vw, 9.5px)", color: "#7A6858", fontWeight: 600 }}>{usp}</span>
                    </div>
                  ))}
                </div>

                {/* Price chip */}
                <div
                  className="inline-flex flex-col px-3 py-2 rounded-xl self-start"
                  style={{ background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)" }}
                >
                  <span style={{ fontSize: "clamp(6px, 0.7vw, 8px)", color: "rgba(232,213,176,0.65)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Starting at
                  </span>
                  <span
                    className="font-display font-black leading-none"
                    style={{ fontSize: "clamp(12px, 1.7vw, 20px)", color: "#E8D5B0" }}
                  >
                    ₹54,000
                  </span>
                </div>
              </div>
            </div>

            {/* ══ CENTER — Brand pillar ══ */}
            <div
              className="relative flex flex-col items-center justify-center px-5 sm:px-8 py-5 z-10"
              style={{
                background: "linear-gradient(175deg, #1C0F05 0%, #3B1D0D 50%, #1C0F05 100%)",
                minWidth: "clamp(130px, 18vw, 220px)",
                boxShadow: "inset -1px 0 0 rgba(201,168,76,0.10), inset 1px 0 0 rgba(201,168,76,0.10)",
              }}
            >
              {/* Top gold line */}
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
              />
              {/* Bottom gold line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
              />

              {/* Star rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={8} style={{ color: "#C9A84C", fill: "#C9A84C" }} />
                ))}
              </div>

              {/* Brand name */}
              <div className="text-center">
                <p style={{ fontSize: "clamp(7px, 0.8vw, 10px)", color: "rgba(232,213,176,0.4)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "4px" }}>
                  Est. 2015
                </p>
                <h2
                  className="font-display font-black leading-[0.95] tracking-tight text-center"
                  style={{ fontSize: "clamp(16px, 2.4vw, 30px)" }}
                >
                  <span style={{ color: "#E8D5B0" }}>Elegant</span>
                  <br />
                  <span style={{ color: "#C9A84C" }}>Stories</span>
                </h2>
                {/* Thin rule */}
                <div
                  className="mx-auto mt-2 mb-2"
                  style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.35)" }}
                />
                <p style={{ fontSize: "clamp(7px, 0.75vw, 9px)", color: "rgba(232,213,176,0.38)", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.6 }}>
                  Interior Design
                </p>
              </div>

              {/* Tagline */}
              <p
                className="text-center mt-3 italic"
                style={{
                  fontSize: "clamp(7px, 0.8vw, 10px)",
                  color: "rgba(232,213,176,0.42)",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  maxWidth: "140px",
                }}
              >
                "Transforming spaces across Delhi & NCR"
              </p>

              {/* CTA */}
              <div
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black transition-all duration-300 group-hover:gap-2"
                style={{
                  fontSize: "clamp(7px, 0.78vw, 9px)",
                  background: "rgba(201,168,76,0.14)",
                  border: "1px solid rgba(201,168,76,0.28)",
                  color: "#C9A84C",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Free Quote <ArrowUpRight size={8} />
              </div>
            </div>

            {/* ══ RIGHT — Modular Kitchen card ══ */}
            <div className="relative flex overflow-hidden flex-row-reverse">
              {/* Photo — right half */}
              <div className="relative w-[42%] flex-shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modular kitchen design"
                  className="w-full h-full object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
                />
                {/* Left edge fade */}
                <div
                  className="absolute inset-y-0 left-0 w-10 pointer-events-none"
                  style={{ background: "linear-gradient(270deg, transparent, #F7F1E8)" }}
                />
              </div>

              {/* Info — left half */}
              <div className="flex flex-col justify-center px-3 sm:px-5 py-4 flex-1 items-end text-right">
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "rgba(107,58,31,0.09)" }}
                >
                  <ChefHat size={14} style={{ color: "#6B3A1F" }} />
                </div>

                <p style={{ fontSize: "clamp(7px, 0.85vw, 10px)", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(107,58,31,0.5)", marginBottom: "2px" }}>
                  Modular
                </p>
                <h3
                  className="font-display font-black leading-none"
                  style={{ fontSize: "clamp(13px, 1.9vw, 22px)", color: "#1C0F05" }}
                >
                  Kitchen
                </h3>

                <div className="flex flex-col gap-1 mt-2.5 mb-3 items-end">
                  {["Factory Direct", "10-Yr Warranty", "No Middlemen"].map((usp) => (
                    <div key={usp} className="flex items-center gap-1.5">
                      <span style={{ fontSize: "clamp(7px, 0.78vw, 9.5px)", color: "#7A6858", fontWeight: 600 }}>{usp}</span>
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#C9A84C" }} />
                    </div>
                  ))}
                </div>

                {/* Price chip */}
                <div
                  className="inline-flex flex-col px-3 py-2 rounded-xl items-end"
                  style={{ background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)" }}
                >
                  <span style={{ fontSize: "clamp(6px, 0.7vw, 8px)", color: "rgba(232,213,176,0.65)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Starting at
                  </span>
                  <span
                    className="font-display font-black leading-none"
                    style={{ fontSize: "clamp(12px, 1.7vw, 20px)", color: "#E8D5B0" }}
                  >
                    ₹1.49 Lakhs
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Hover bottom shimmer */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #C9A84C 35%, #E8C96A 65%, transparent)" }}
          />
        </a>

        {/* Disclaimer */}
        <p className="mt-3 text-center" style={{ fontSize: "10px", color: "rgba(168,151,138,0.6)", fontWeight: 500 }}>
          Sponsored · Prices are indicative and subject to change. Please verify directly with Elegant Stories.
        </p>

      </div>
    </section>
  );
}