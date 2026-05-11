"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Building2, Sparkles } from "lucide-react";

// ─── API Import ────────────────────────────────────────────────
import { citiesApi } from "@/lib/api";
import { getImageUrl } from "@/lib/url";

// ─── Types ────────────────────────────────────────────────
interface City {
  _id: string;
  name: string;
  slug: string;
  state: string;
  description?: string;
  url?: string;
  isActive: boolean;
  sortOrder: number;
  propertyCount?: number;
}

// ─── Large Featured Card ───────────────────────────────────
function FeaturedCityCard({ city, propertyCount }: { city: City; propertyCount: number }) {
  const url = city.url || "/cities/fallback.jpg";
  
  return (
    <Link href={`/projects?city=${encodeURIComponent(city.name)}`} className="block group">
      <div className="relative rounded-3xl overflow-hidden cursor-pointer
        aspect-[4/5] sm:aspect-[3/4]
        shadow-[0_8px_32px_rgba(107,58,31,0.18)]
        hover:shadow-[0_20px_60px_rgba(107,58,31,0.28)]
        hover:-translate-y-1 transition-all duration-500">

        <Image 
          src={getImageUrl(url)} 
          alt={city.name} 
          fill
          className="object-cover group-hover:scale-108 transition-transform duration-700"
          unoptimized={true}
        />

        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-[#1C0F05]/90 via-[#1C0F05]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br
          from-[#6B3A1F]/10 via-transparent to-transparent" />

        {/* Top badge - Show for first 2 cities only */}
        <div className="absolute top-4 left-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
            bg-white/15 backdrop-blur-md border border-white/20
            text-white text-[10px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            Featured
          </div>
        </div>

        {/* Arrow */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full
          bg-white/15 backdrop-blur-md border border-white/20
          flex items-center justify-center
          opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
          transition-all duration-300">
          <ArrowUpRight size={14} className="text-white" />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[#C9A84C] text-[10px] font-bold tracking-widest uppercase mb-1">
            {propertyCount.toLocaleString()}+ Properties
          </p>
          <h3 className="font-display font-bold text-white text-xl sm:text-2xl leading-tight">
            {city.name}
          </h3>
          {/* Explore line */}
          <div className="flex items-center gap-2 mt-3 overflow-hidden">
            <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/60 to-transparent" />
            <span className="text-[#C9A84C] text-[10px] font-bold tracking-widest uppercase
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explore
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Small City Row ────────────────────────────────────────
function SmallCityCard({ city, propertyCount }: { city: City; propertyCount: number }) {
  const url = city.url || "/cities/fallback.jpg";
  
  return (
    <Link href={`/projects?city=${encodeURIComponent(city.name)}`} className="block group">
      <div className="flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer
        border border-transparent
        hover:border-[#EDE5DD] hover:bg-white
        hover:shadow-[0_4px_20px_rgba(107,58,31,0.09)]
        transition-all duration-300">

        {/* Image */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0
          shadow-[0_2px_8px_rgba(107,58,31,0.12)]">
          <Image 
            src={getImageUrl(url)} 
            alt={city.name} 
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-[#1C0F05] text-sm truncate
            group-hover:text-[#6B3A1F] transition-colors duration-200">
            {city.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <Building2 size={10} className="text-[#6B3A1F]/40" />
            <p className="text-[#A8978A] text-[11px] font-medium">
              {propertyCount.toLocaleString()}+ Properties
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
      <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-3xl aspect-[4/5] bg-gray-200 animate-pulse" />
        ))}
      </div>
      
      <div className="lg:col-span-7">
        <div className="bg-white rounded-3xl border border-[#EDE5DD] p-2 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3.5 p-3">
                <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main CitiesSection Component ─────────────────────────
export default function CitiesSection() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await citiesApi.getAll();
        
        let citiesData = [];
        if (response.cities) {
          citiesData = response.cities;
        } else if (response.data) {
          citiesData = response.data;
        } else if (Array.isArray(response)) {
          citiesData = response;
        }

        // Sort by sortOrder (ascending) or property count
        const sortedCities = [...citiesData].sort((a, b) => {
          // First by sortOrder if available
          if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
            return a.sortOrder - b.sortOrder;
          }
          // Then by property count (descending)
          if (a.propertyCount !== b.propertyCount) {
            return (b.propertyCount || 0) - (a.propertyCount || 0);
          }
          // Finally by name
          return a.name.localeCompare(b.name);
        });

        setCities(sortedCities);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setError("Failed to load cities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (error) {
    return (
      <section className="py-8 sm:py-6 lg:py-8 bg-[hsl(38,45%,97%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-red-50 rounded-2xl">
            <p className="text-red-600">{error}</p>
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

  // ✅ First 2 cities as featured, rest as normal
  const featuredCities = cities.slice(0, 2);
  const otherCities = cities.slice(2);

  return (
    <section className="py-8 sm:py-6 lg:py-8 relative overflow-hidden bg-[hsl(38,45%,97%)]">

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px
        bg-gradient-to-r from-transparent via-[#D4C4B0]/60 to-transparent" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full
        bg-[#6B3A1F]/4 blur-3xl pointer-events-none" />
      <div className="absolute top-20 -left-20 w-56 h-56 rounded-full
        bg-[#C9A84C]/5 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#C9A84C]" />
            <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wider">
              Popular Destinations
            </span>
          </div>
          
          <h2 className="font-display font-bold text-[#1C0F05]
            text-2xl sm:text-3xl lg:text-4xl leading-tight">
            Cities Where{" "}     
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#6B3A1F,#C9A84C)" }}>
              We Excel
            </span>
          </h2>
        </div>
        
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">

            {/* LEFT — First 2 cities as featured cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-5">
              {featuredCities.map((city) => (
                <FeaturedCityCard 
                  key={city._id} 
                  city={city} 
                  propertyCount={city.propertyCount || 0} 
                />
              ))}
              {/* If less than 2 cities total */}
              {featuredCities.length === 1 && cities.length === 1 && (
                <div className="rounded-3xl aspect-[4/5] bg-gradient-to-br from-[#FAF7F4] to-[#EDE5DD] 
                  flex items-center justify-center border-2 border-dashed border-[#D4C4B0]">
                  <p className="text-[#A8978A] text-sm text-center px-4">
                    More cities<br />coming soon
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT — Remaining cities list */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
              <div className="bg-white rounded-3xl border border-[#EDE5DD]
                shadow-[0_2px_16px_rgba(107,58,31,0.06)] p-2 sm:p-3 flex-1">

                <div className="flex items-center justify-between px-3 py-2 mb-1">
                  <span className="text-[11px] font-bold text-[#A8978A] uppercase tracking-widest">
                    All Locations
                  </span>
                  <Link 
                    href="/projects"
                    className="inline-flex items-center gap-1
                      text-[11px] font-bold text-[#6B3A1F]
                      hover:gap-1.5 transition-all duration-200">
                    View All <ArrowUpRight size={11} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {otherCities.map((city) => (
                    <SmallCityCard 
                      key={city._id} 
                      city={city} 
                      propertyCount={city.propertyCount || 0} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}