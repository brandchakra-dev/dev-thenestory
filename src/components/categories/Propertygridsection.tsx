"use client";

import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";

// ─── Types ───────────────────────────────────────────────
interface PropertyCard {
  type: "property";
  count: string;
  label: string;
  sublabel?: string;
  image: string;
  href: string;
  tag?: string;
}

interface SponsoredCard {
  type: "sponsored";
  brand: string;
  hashtag?: string;
  headline: string;
  boldWord?: string;
  subline: string;
  cta: string;
  href: string;
  image: string;
  accent: string;
}

type Card = PropertyCard | SponsoredCard;

// ─── Data with Unsplash Images ────────────────────────────
const cards: Card[] = [
  {
    type: "property",
    count: "3,167",
    label: "Owner Properties",
    sublabel: "Direct from owners · Zero brokerage",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/properties?type=owner",
    tag: "No Brokerage",
  },
  {
    type: "property",
    count: "181",
    label: "New Projects",
    sublabel: "Launches, under-construction & ready",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/properties?type=new-projects",
    tag: "New Launch",
  },
  {
    type: "sponsored",
    brand: "Elegant Stories",
    hashtag: "#TransformYourSpace",
    headline: "story and",
    boldWord: "WIN",
    subline: "Free interior consultation worth ₹5,000",
    cta: "Claim Now",
    href: "/sponsored/elegant-stories",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    accent: "#C9A84C",
  },
  {
    type: "property",
    count: "481",
    label: "Budget Homes",
    sublabel: "Under ₹50L · Affordable & verified",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/properties?type=budget",
    tag: "Under ₹50L",
  },
];

// ─── Tag config ───────────────────────────────────────────
const tagConfig: Record<string, { bg: string; color: string }> = {
  "No Brokerage": { bg: "rgba(16,185,129,0.18)", color: "#059669"  },
  "New Launch":   { bg: "rgba(201,168,76,0.20)",  color: "#8B6914" },
  "Under ₹50L":  { bg: "rgba(107,58,31,0.18)",  color: "#6B3A1F"  },
};

// ─── PropertyCard Component ───────────────────────────────
function PropCard({ card }: { card: PropertyCard }) {
  const tag = card.tag ? tagConfig[card.tag] : null;

  return (
    <a
      href={card.href}
      className="group relative overflow-hidden rounded-2xl cursor-pointer block"
      style={{
        aspectRatio: "3/2.2",
        boxShadow: "0 4px 24px rgba(107,58,31,0.14)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={card.image}
          alt={card.label}
          className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
        />
      </div>

      {/* Dark gradient overlay — bottom heavy */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(175deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.20) 35%, rgba(0,0,0,0.72) 75%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Hover: warm brown tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(175deg, rgba(107,58,31,0.10) 0%, rgba(107,58,31,0.25) 100%)" }}
      />

      {/* Tag — top left */}
      {tag && card.tag && (
        <div
          className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[9px] tracking-wide"
          style={{
            background: tag.bg,
            color: tag.color,
            backdropFilter: "blur(10px)",
            border: `1px solid ${tag.color}30`,
          }}
        >
          {card.tag}
        </div>
      )}

      {/* Content — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        {/* Count */}
        <p
          className="font-display font-black leading-none tracking-tight transition-colors duration-300"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            color: "#fff",
          }}
        >
          {card.count}
        </p>

        {/* Label */}
        <p
          className="font-display font-bold mt-0.5 transition-colors duration-300"
          style={{
            fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
            color: "rgba(255,255,255,0.90)",
          }}
        >
          {card.label}
        </p>

        {/* Sublabel */}
        {card.sublabel && (
          <p
            className="mt-1 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0"
            style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
          >
            {card.sublabel}
          </p>
        )}

        {/* Explore CTA */}
        <div
          className="inline-flex items-center gap-1.5 mt-3 font-black text-xs transition-all duration-300 group-hover:gap-2.5"
          style={{ color: "#E8D5B0" }}
        >
          Explore
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Gold shimmer line — bottom, reveal on hover */}
      <div
        className="absolute bottom-0 left-0 h-[2.5px] rounded-full transition-all duration-600 ease-out"
        style={{
          width: "0%",
          background: "linear-gradient(90deg, #6B3A1F, #C9A84C, rgba(201,168,76,0.4))",
        }}
        // CSS trick: use group-hover via inline style won't work — use Tailwind group
      />
    </a>
  );
}

// ─── SponsoredCard Component ──────────────────────────────
function SponsCard({ card }: { card: SponsoredCard }) {
  return (
    <a
      href={card.href}
      className="group relative overflow-hidden rounded-2xl cursor-pointer block"
      style={{
        aspectRatio: "3/2.2",
        background: "linear-gradient(145deg, #FAF3E8, #F0E4C8)",
        boxShadow: "0 4px 24px rgba(107,58,31,0.14)",
        border: "1px solid rgba(201,168,76,0.25)",
      }}
    >
      {/* Background person image — right side */}
      <img
        src={card.image}
        alt={card.brand}
        className="absolute right-0 bottom-0 h-full w-[55%] object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
      />

      {/* Left fade */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(100deg, #FAF3E8 35%, rgba(250,243,232,0.85) 52%, rgba(250,243,232,0.30) 68%, transparent 85%)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 60%, rgba(201,168,76,0.12), transparent 65%)" }}
      />

      {/* Sponsored badge — top left */}
      <div
        className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[8px] tracking-wider"
        style={{
          background: "rgba(107,58,31,0.10)",
          border: "1px solid rgba(107,58,31,0.14)",
          color: "#6B3A1F",
          backdropFilter: "blur(8px)",
        }}
      >
        <BadgeCheck size={8} style={{ color: "#C9A84C" }} />
        Sponsored
      </div>

      {/* Content — left side */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5" style={{ maxWidth: "62%" }}>

        {/* Brand */}
        <p
          className="font-black tracking-[0.14em] uppercase mb-2"
          style={{ fontSize: "9px", color: "rgba(107,58,31,0.55)" }}
        >
          {card.brand}
        </p>

        {/* Hashtag — gold bold */}
        {card.hashtag && (
          <p
            className="font-display font-black leading-tight mb-1"
            style={{
              fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)",
              backgroundImage: "linear-gradient(135deg, #6B3A1F, #C9A84C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {card.hashtag}
          </p>
        )}

        {/* Sub text */}
        <p className="font-medium leading-snug mb-4" style={{ fontSize: "11px", color: "#7A6858" }}>
          {card.subline}
        </p>

        {/* CTA button */}
        <div
          className="inline-flex items-center gap-1.5 self-start px-4 py-2 rounded-xl font-black text-xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:gap-2"
          style={{
            background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
            color: "#E8D5B0",
            boxShadow: "0 4px 14px rgba(107,58,31,0.35)",
          }}
        >
          {card.cta}
          <ArrowRight size={11} />
        </div>
      </div>
    </a>
  );
}

// ─── Main Section ─────────────────────────────────────────
export default function PropertyGridSection() {
  return (
    <section className="py-10 xs:pt-24 xs:pb-8 sm:py-24 lg:py-14" style={{ background: "hsl(40,40%,97%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-3 mb-1">
            {/* Red accent rule — exact reference match */}
            <div className="w-8 h-[3px] rounded-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #6B3A1F, #C9A84C)" }} />
          </div>
          <h2
            className="font-display font-black text-[#1C0F05]"
            style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.6rem)" }}
          >
            We've got properties in{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #6B3A1F, #C9A84C)" }}
            >
              NCR
            </span>{" "}
            for everyone
          </h2>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, i) =>
            card.type === "property" ? (
              <PropCard key={i} card={card} />
            ) : (
              <SponsCard key={i} card={card} />
            )
          )}
        </div>

      </div>
    </section>
  );
}