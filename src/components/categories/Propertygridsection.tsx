"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles, Home, Building2, Wallet, Star } from "lucide-react";

// ─── API Import ────────────────────────────────────────────────
import { propertiesApi, projectsApi } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────
interface PropertyCard {
  type: "property";
  count: number;
  label: string;
  sublabel: string;
  image: string;
  href: string;
  tag: string;
  filterType: "all" | "new-projects" | "budget";
  description: string;
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

// ─── Static Images ────────────────────────────
const STATIC_IMAGES = {
  allProperties: "./home-category/all_properties.jpg",
  newProjects: "./home-category/all_projects.jpg",
  budget: "./home-category/home.jpg",
  sponsored: "./home-category/spon.jpg",
};

// ─── Tag Config ───────────────────────────────────────────
const tagConfig: Record<string, { bg: string; color: string; icon: any }> = {
  "All Properties": { 
    bg: "#fff", 
    color: "#6b3a1f",
    icon: Home
  },
  "New Launch": { 
    bg: "rgba(201,168,76,0.20)",  
    color: "#fff",
    icon: Building2
  },
  "Under ₹50L": { 
    bg: "rgba(16,185,129,0.18)",  
    color: "#fff",
    icon: Wallet
  },
};

// ─── PropertyCard Component ───────────────────────────────
function PropCard({ card }: { card: PropertyCard }) {
  const tag = tagConfig[card.tag];
  const Icon = tag?.icon || Home;

  return (
    <Link
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

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(175deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.20) 35%, rgba(0,0,0,0.72) 75%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Hover warm brown tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(175deg, rgba(107,58,31,0.10) 0%, rgba(107,58,31,0.25) 100%)" }}
      />

      {/* Tag */}
      {tag && (
        <div
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-[9px] tracking-wide z-10"
          style={{
            background: tag.bg,
            color: tag.color,
            backdropFilter: "blur(10px)",
            border: `1px solid ${tag.color}30`,
          }}
        >
          <Icon size={10} />
          {card.tag}
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <p
          className="font-display font-black leading-none tracking-tight"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            color: "#fff",
          }}
        >
          {card.count.toLocaleString()}+
        </p>

        <p
          className="font-display font-bold mt-0.5 hidden sm:block"
          style={{
            fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
            color: "rgba(255,255,255,0.90)",
          }}
        >
          {card.label}
        </p>

        <p
          className="hidden sm:block mt-1 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0"
          style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
        >
          {card.sublabel}
        </p>

        <div
          className="inline-flex items-center gap-1.5 mt-3 font-black text-xs transition-all duration-300 group-hover:gap-2.5"
          style={{ color: "#E8D5B0" }}
        >
          Explore
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

// ─── SponsoredCard Component (No Changes) ──────────────────────────────
function SponsCard({ card }: { card: SponsoredCard }) {
  return (
    <Link
      href={card.href}
      className="group relative overflow-hidden rounded-2xl cursor-pointer block"
      style={{
        aspectRatio: "3/2.2",
        background: "linear-gradient(145deg, #FAF3E8, #F0E4C8)",
        boxShadow: "0 4px 24px rgba(107,58,31,0.14)",
        border: "1px solid rgba(201,168,76,0.25)",
      }}
    >
      <img
        src={card.image}
        alt={card.brand}
        className="absolute right-0 bottom-0 h-full w-[55%] object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
      />

      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(100deg, #FAF3E8 35%, rgba(250,243,232,0.85) 52%, rgba(250,243,232,0.30) 68%, transparent 85%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 60%, rgba(201,168,76,0.12), transparent 65%)" }}
      />

      <div
        className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[8px] tracking-wider z-10"
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

      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5" style={{ maxWidth: "62%" }}>
        <p
          className="font-black tracking-[0.14em] uppercase mb-2"
          style={{ fontSize: "9px", color: "rgba(107,58,31,0.55)" }}
        >
          {card.brand}
        </p>

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

        <p className="font-medium leading-snug mb-4" style={{ fontSize: "11px", color: "#7A6858" }}>
          {card.subline}
        </p>

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
    </Link>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl animate-pulse" style={{ aspectRatio: "3/2.2" }}>
          <div className="w-full h-full bg-gray-200 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────
export default function PropertyGridSection() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. ALL PROPERTIES (No filter - sab kuch)
        const allPropertiesRes = await propertiesApi.getAll({ limit: 1 });
        const allPropertiesCount = allPropertiesRes.total || allPropertiesRes.properties?.length || 0;
        
        // 2. NEW PROJECTS (Projects with status "New Launch")
        const newProjectsRes = await projectsApi.getAll({ status: "New Launch", limit: 1 });
        const newProjectsCount = newProjectsRes.total || newProjectsRes.projects?.length || 0;
        
        // 3. BUDGET HOMES (Properties under ₹50 Lakhs)
        const budgetRes = await propertiesApi.getAll({ maxPrice: 5000000, limit: 1 });
        const budgetCount = budgetRes.total || budgetRes.properties?.length || 0;

        // Create dynamic cards
        const dynamicCards: Card[] = [
          {
            type: "property",
            count: allPropertiesCount,
            label: "All Properties",
            sublabel: "Sale · Rent · Lease · Verified Listings",
            image: STATIC_IMAGES.allProperties,
            href: "/properties",
            tag: "All Properties",
            filterType: "all",
            description: "Complete collection of residential & commercial properties"
          },
          {
            type: "property",
            count: newProjectsCount,
            label: "New Projects",
            sublabel: "Fresh launches · Under construction · Ready to move",
            image: STATIC_IMAGES.newProjects,
            href: "/projects?status=New Launch",
            tag: "New Launch",
            filterType: "new-projects",
            description: "Brand new residential projects from top builders"
          },
          {
            type: "sponsored",
            brand: "Elegant Stories",
            hashtag: "Each design has its story",
            headline: "story and",
            boldWord: "WIN",
            subline: "Free interior consultation worth ₹5,000",
            cta: "Claim Now",
            href: "https://elegantstories.in",
            image: STATIC_IMAGES.sponsored,
            accent: "#C9A84C",
          },
          {
            type: "property",
            count: budgetCount,
            label: "Budget Homes",
            sublabel: "Under ₹50 Lakhs · Affordable & EMI friendly",
            image: STATIC_IMAGES.budget,
            href: "/properties?budget=Under ₹50 L",
            tag: "Under ₹50L",
            filterType: "budget",
            description: "Quality homes that fit your budget"
          },
        ];

        setCards(dynamicCards);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        
        // Fallback static data
        setCards([
          {
            type: "property",
            count: 5000,
            label: "All Properties",
            sublabel: "Sale · Rent · Lease · Verified Listings",
            image: STATIC_IMAGES.allProperties,
            href: "/properties",
            tag: "All Properties",
            filterType: "all",
            description: "Complete collection of residential & commercial properties"
          },
          {
            type: "property",
            count: 181,
            label: "New Projects",
            sublabel: "Fresh launches · Under construction · Ready to move",
            image: STATIC_IMAGES.newProjects,
            href: "/projects?status=New Launch",
            tag: "New Launch",
            filterType: "new-projects",
            description: "Brand new residential projects from top builders"
          },
          {
            type: "sponsored",
            brand: "Elegant Stories",
            hashtag: "Each design has its story",
            headline: "story and",
            boldWord: "WIN",
            subline: "Free interior consultation worth ₹5,000",
            cta: "Claim Now",
            href: "/sponsored/elegant-stories",
            image: STATIC_IMAGES.sponsored,
            accent: "#C9A84C",
          },
          {
            type: "property",
            count: 481,
            label: "Budget Homes",
            sublabel: "Under ₹50 Lakhs · Affordable & EMI friendly",
            image: STATIC_IMAGES.budget,
            href: "/properties?maxPrice=5000000",
            tag: "Under ₹50L",
            filterType: "budget",
            description: "Quality homes that fit your budget"
          },
        ]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-10 xs:pt-12 xs:pb-8 sm:py-12 lg:py-14" style={{ background: "hsl(40,40%,97%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#C9A84C]" />
            <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wider">
              Find Your Perfect Home
            </span>
          </div>
          <h2
            className="font-display font-black text-[#1C0F05]"
            style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.6rem)" }}
          >
            Where your dream home awaits{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #6B3A1F, #C9A84C)" }}
            >
              awaits
            </span>
           
          </h2>
        </div>

        {/* 4-card grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card, i) =>
              card.type === "property" ? (
                <PropCard key={i} card={card as PropertyCard} />
              ) : (
                <SponsCard key={i} card={card as SponsoredCard} />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}