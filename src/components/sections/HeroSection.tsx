"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, ChevronDown, Sparkles,
  Building2, Home, Loader2, ArrowRight, Store,
  AlertCircle, Info, CheckCircle2,
} from "lucide-react";

const cities = ["Noida", "Gurugram", "Delhi", "Greater Noida", "Faridabad", "Ghaziabad"];

const tabs = [
  { id: "buy", label: "Buy", icon: <Home size={12} />, type: "property", listingType: "Sale" as const, propertyType: null },
  { id: "rent", label: "Rent", icon: <Building2 size={12} />, type: "property", listingType: "Rent" as const, propertyType: null },
  { id: "projects", label: "Projects", icon: <Sparkles size={12} />, type: "project", listingType: null, propertyType: null },
  { id: "villas", label: "Villas", icon: <Home size={12} />, type: "property", listingType: null, propertyType: "Villa" },
  { id: "commercial", label: "Commercial", icon: <Store size={12} />, type: "property", listingType: null, propertyType: "Commercial" },
];

interface SearchItem {
  id: string; type: "project" | "property"; name: string; location: string;
  city: string; slug: string; image: string; price: string;
  propertyType: string; listingType: string;
}

const searchData: SearchItem[] = [
  { id: "project-1", type: "project", name: "Godrej Palm Retreat", location: "Sector 150, Noida", city: "Noida", slug: "godrej-palm-retreat", image: "/property/godrej.jpg", price: "₹1.34 Cr onwards", propertyType: "Apartment", listingType: "Sale" },
  { id: "project-2", type: "project", name: "ACE Golfshire", location: "Sector 150, Noida", city: "Noida", slug: "ace-golfshire", image: "/property/m3m.webp", price: "₹1.31 Cr onwards", propertyType: "Apartment", listingType: "Sale" },
  { id: "project-3", type: "project", name: "Dasnac Jewel of Noida", location: "Sector 75, Noida", city: "Noida", slug: "dasnac-jewel-of-noida", image: "/property/sobha.webp", price: "₹1.89 Cr onwards", propertyType: "Apartment", listingType: "Sale" },
  { id: "project-4", type: "project", name: "M3M Golf Estate", location: "Sector 65, Gurugram", city: "Gurugram", slug: "m3m-golf-estate", image: "/property/m3m.webp", price: "₹2.5 Cr onwards", propertyType: "Villa", listingType: "Sale" },
  { id: "project-5", type: "project", name: "Sobha City", location: "Sector 108, Gurugram", city: "Gurugram", slug: "sobha-city", image: "/property/sobha.webp", price: "₹1.8 Cr onwards", propertyType: "Apartment", listingType: "Sale" },
  { id: "property-1", type: "property", name: "3 BHK Luxury Apartment", location: "Sector 150, Noida", city: "Noida", slug: "3bhk-godrej-palm-retreat-sector150", image: "/property/godrej.jpg", price: "₹1.2 Cr", propertyType: "Apartment", listingType: "Sale" },
  { id: "property-2", type: "property", name: "4 BHK Luxury Villa with Pool", location: "Sector 75, Noida", city: "Noida", slug: "4bhk-villa-sector-75", image: "/property/sobha.webp", price: "₹3.5 Cr", propertyType: "Villa", listingType: "Sale" },
  { id: "property-3", type: "property", name: "2 BHK Ready to Move", location: "Sector 65, Gurugram", city: "Gurugram", slug: "2bhk-ready-to-move-sector-65", image: "/property/m3m.webp", price: "₹85 L", propertyType: "Apartment", listingType: "Sale" },
  { id: "property-4", type: "property", name: "2 BHK for Rent", location: "Sector 62, Noida", city: "Noida", slug: "2bhk-rent-sector-62", image: "/property/godrej.jpg", price: "₹28,000/mo", propertyType: "Apartment", listingType: "Rent" },
  { id: "property-5", type: "property", name: "3 BHK Luxury Apartment for Rent", location: "DLF Phase 4, Gurugram", city: "Gurugram", slug: "3bhk-rent-dlf-phase-4", image: "/property/sobha.webp", price: "₹65,000/mo", propertyType: "Apartment", listingType: "Rent" },
  { id: "plot-1", type: "property", name: "200 Sq.Yd Plot - YEIDA Scheme", location: "Sector 22D, Yamuna Expressway", city: "Greater Noida", slug: "plot-yamuna-expressway-200sqyd", image: "/property/m3m.webp", price: "₹95 L", propertyType: "Plot", listingType: "Sale" },
  { id: "commercial-1", type: "property", name: "Commercial Office Space", location: "Sector 62, Noida", city: "Noida", slug: "commercial-office-sector-62", image: "/property/godrej.jpg", price: "₹2.5 Cr", propertyType: "Commercial", listingType: "Sale" },
  { id: "studio-1", type: "property", name: "Studio Apartment for Rent", location: "Sector 76, Noida", city: "Noida", slug: "studio-apartment-sector-76", image: "/property/sobha.webp", price: "₹15,000/mo", propertyType: "Studio", listingType: "Rent" },
  { id: "luxury-1", type: "property", name: "Luxury Penthouse with Sky Lounge", location: "Sector 124, Noida", city: "Noida", slug: "luxury-penthouse-sector-124", image: "/property/m3m.webp", price: "₹9 Cr", propertyType: "Penthouse", listingType: "Sale" },
  { id: "furnished-1", type: "property", name: "Fully Furnished 3 BHK", location: "Sector 150, Noida", city: "Noida", slug: "fully-furnished-3bhk-sector-150", image: "/property/godrej.jpg", price: "₹2.2 Cr", propertyType: "Apartment", listingType: "Sale" },
];

const heroImages = [
  { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", alt: "Luxury modern home" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", alt: "Elegant living room" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", alt: "Modern apartment" },
  { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", alt: "Luxury villa" },
];

// ─── Validation types ──────────────────────────────────────
type ValidationState =
  | { type: "empty-search"; message: string; hint?: string }
  | { type: "no-results"; message: string; hint?: string }
  | { type: "min-chars"; message: string; hint?: string }
  | { type: "city-suggestion"; message: string; hint?: string }
  | { type: "success"; message: string; hint?: string }
  | null;

// ─── Inline toast banner ───────────────────────────────────
function ValidationBanner({ state, onDismiss }: { state: ValidationState; onDismiss: () => void }) {
  if (!state) return null;

  const config = {
    "empty-search": { icon: <AlertCircle size={13} />, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", iconColor: "text-amber-500" },
    "no-results": { icon: <AlertCircle size={13} />, bg: "bg-red-50", border: "border-red-200", text: "text-red-800", iconColor: "text-red-400" },
    "min-chars": { icon: <Info size={13} />, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", iconColor: "text-blue-400" },
    "city-suggestion": { icon: <Info size={13} />, bg: "bg-[#6B3A1F]/5", border: "border-[#D4C4B0]", text: "text-[#6B3A1F]", iconColor: "text-[#C9A84C]" },
    "success": { icon: <CheckCircle2 size={13} />, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", iconColor: "text-emerald-500" },
  }[state.type];

  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border mt-2.5
      ${config.bg} ${config.border} transition-all duration-200`}>
      <span className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-snug ${config.text}`}>{state.message}</p>
        {state.hint && (
          <p className={`text-[10px] mt-0.5 font-medium opacity-75 ${config.text}`}>{state.hint}</p>
        )}
      </div>
      <button onClick={onDismiss}
        className={`flex-shrink-0 text-[10px] font-bold opacity-50 hover:opacity-100 transition-opacity ${config.text}`}>
        ✕
      </button>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────
function NearMeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
    </svg>
  );
}

function MicIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0014 0M12 19v3M8 23h8" />
    </svg>
  );
}

function WaveIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="8" width="3" height="8" rx="1" />
      <rect x="7" y="4" width="3" height="16" rx="1" />
      <rect x="12" y="6" width="3" height="12" rx="1" />
      <rect x="17" y="9" width="3" height="6" rx="1" />
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function HeroSection() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedCity, setSelectedCity] = useState("");
  const [query, setQuery] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggIdx, setSelectedSuggIdx] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [isNearMe, setIsNearMe] = useState(false);
  const [validation, setValidation] = useState<ValidationState>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [inputShake, setInputShake] = useState(false);

  // Hero image rotation
  useEffect(() => {
    const t = setInterval(() => setCurrentImageIndex(p => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Clear validation when user starts typing
  useEffect(() => {
    if (query.length > 0) {
      setValidation(null);
      setSearchAttempted(false);
    }
  }, [query]);

  // Clear validation when city changes
  useEffect(() => {
    if (validation?.type === "city-suggestion") setValidation(null);
  }, [selectedCity]);

  // Suggestions
  const suggestions = useMemo<SearchItem[]>(() => {
    if (!query.trim() || query.trim().length < 1) return [];
    return searchData.filter(item => {
      if (activeTab.type === "project" && item.type !== "project") return false;
      if (activeTab.type === "property" && item.type !== "property") return false;
      if (activeTab.listingType && item.listingType !== activeTab.listingType) return false;
      if (activeTab.propertyType && item.propertyType !== activeTab.propertyType) return false;
      const matchQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase());
      const matchCity = !selectedCity || item.city === selectedCity;
      return matchQuery && matchCity;
    }).slice(0, 8);
  }, [query, selectedCity, activeTab]);

  // Suggestions WITHOUT city filter — to detect city-mismatch
  const suggestionsAllCities = useMemo<SearchItem[]>(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    return searchData.filter(item => {
      if (activeTab.type === "project" && item.type !== "project") return false;
      if (activeTab.type === "property" && item.type !== "property") return false;
      if (activeTab.listingType && item.listingType !== activeTab.listingType) return false;
      if (activeTab.propertyType && item.propertyType !== activeTab.propertyType) return false;
      return item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase());
    }).slice(0, 4);
  }, [query, activeTab]);

  // Validate before redirect
  const validate = useCallback((): boolean => {
    // 1. Both fields empty
    // if (!query.trim() && !selectedCity) {
    //   setValidation({
    //     type:"empty-search",
    //     message:"Please enter a location, project or property name to search.",
    //     hint:`Example: "3 BHK Noida" or "Godrej Palm Retreat"`,
    //   });
    //   setInputShake(true);
    //   setTimeout(() => setInputShake(false), 500);
    //   return false;
    // }

    // 1. Nothing selected
    if (!query.trim() && !selectedCity) {
      setValidation({
        type: "empty-search",
        message: "Please select a city or enter a search keyword.",
        hint: "Example: 'Noida', '3 BHK', or 'Godrej Palm Retreat'",
      });
      return false;
    }

    // 2. Only city selected (no query)
    if (!query.trim() && selectedCity) {
      setValidation({
        type: "success",
        message: `Showing properties in ${selectedCity}.`,
        hint: "Click search to explore all listings in this city.",
      });
      return true; // allow search
    }

    // 3. Only 1 character (no city)
    if (query.trim().length === 1 && !selectedCity) {
      setValidation({
        type: "min-chars",
        message: "Please type at least 2 characters or select a city.",
        hint: "City select karoge to direct results mil jayenge 👍",
      });
      return false;
    }

    // 2. Query too short (< 2 chars) and no city
    if (query.trim().length === 1 && !selectedCity) {
      setValidation({
        type: "min-chars",
        message: "Please enter at least 2 characters to search.",
        hint: "Try typing a project name, location or builder.",
      });
      return false;
    }

    // 3. Results with current city filter = 0, but exist in other cities
    if (query.trim() && selectedCity && suggestions.length === 0 && suggestionsAllCities.length > 0) {
      const foundCities = [...new Set(suggestionsAllCities.map(s => s.city))];
      setValidation({
        type: "city-suggestion",
        message: `No results found in ${selectedCity} for "${query}".`,
        hint: `We found ${suggestionsAllCities.length} result${suggestionsAllCities.length > 1 ? "s" : ""} in ${foundCities.join(", ")} — try changing the city.`,
      });
      return false;
    }

    // 4. No results at all
    if (query.trim().length >= 2 && suggestions.length === 0 && suggestionsAllCities.length === 0) {
      setValidation({
        type: "no-results",
        message: `No ${activeTab.type === "project" ? "projects" : "properties"} found for "${query}".`,
        hint: "Try a different name, locality or builder. Or browse all listings.",
      });
      setInputShake(true);
      setTimeout(() => setInputShake(false), 500);
      return false;
    }

    return true;
  }, [query, selectedCity, suggestions, suggestionsAllCities, activeTab]);

  const getRedirectPath = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCity) params.set("city", selectedCity);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    if (activeTab.listingType === "Sale" || activeTab.listingType === "Rent") {
      return `/properties?listing=${activeTab.listingType === "Sale" ? "sale" : "rent"}${qs ? `&${qs}` : ""}`;
    }
    if (activeTab.propertyType && activeTab.propertyType !== "Apartment") {
      return `/properties?type=${activeTab.propertyType.toLowerCase()}${qs ? `&${qs}` : ""}`;
    }
    if (activeTab.type === "project") return `/projects${qs ? `?${qs}` : ""}`;
    return `/properties${qs ? `?${qs}` : ""}`;
  }, [activeTab, selectedCity, query]);

  const handleSearch = useCallback(() => {
    setSearchAttempted(true);
    setValidation(null);

    if (!validate()) return;

    setIsLoading(true);
    router.push(getRedirectPath());
    setTimeout(() => setIsLoading(false), 500);
  }, [validate, getRedirectPath, router]);

  const handleSuggestionClick = useCallback((item: SearchItem) => {
    setValidation(null);
    setIsLoading(true);
    router.push(item.type === "project" ? `/projects/${item.slug}` : `/properties/${item.slug}`);
    setTimeout(() => setIsLoading(false), 500);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggIdx(p => p < suggestions.length - 1 ? p + 1 : p);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggIdx(p => p > 0 ? p - 1 : -1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggIdx >= 0 && suggestions[selectedSuggIdx]) {
        handleSuggestionClick(suggestions[selectedSuggIdx]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggIdx(-1);
    }
  }, [suggestions, selectedSuggIdx, handleSuggestionClick, handleSearch]);

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setValidation({ type: "no-results", message: "Geolocation is not supported by your browser.", hint: "Please search by typing a city or locality." });
      return;
    }
    setIsNearMe(true);
    setValidation(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`);
          const data = await res.json();
          const addr = data.address ?? {};
          const city = addr.suburb || addr.city_district || addr.neighbourhood || addr.city || addr.town || "Near Me";
          setQuery(city);
          router.push(`/properties?nearme=true&lat=${latitude.toFixed(6)}&lon=${longitude.toFixed(6)}&radius=3&q=${encodeURIComponent(city)}`);
        } catch {
          router.push(`/properties?nearme=true&lat=${latitude.toFixed(6)}&lon=${longitude.toFixed(6)}&radius=3`);
        } finally { setIsNearMe(false); }
      },
      (err) => {
        setIsNearMe(false);
        if (err.code === 1) {
          setValidation({ type: "no-results", message: "Location permission denied.", hint: "Please allow location access in your browser settings and try again." });
        } else {
          setValidation({ type: "no-results", message: "Could not determine your location.", hint: "Please try again or search by typing a city name." });
        }
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [router]);

  const handleVoiceSearch = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setValidation({ type: "min-chars", message: "Voice search is not supported in this browser.", hint: "Try Chrome or Edge for voice search." });
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => { setIsListening(true); setValidation(null); };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setValidation({ type: "no-results", message: "Voice search failed. Please try again.", hint: "Make sure your microphone is connected and permitted." });
    };
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setShowSuggestions(true);
      setValidation({ type: "success", message: `Heard: "${transcript}"`, hint: "Press Search or select a suggestion below." });
    };
    recognition.start();
  }, []);

  const getPlaceholder = () => {
    if (isListening) return "Listening...";
    if (isNearMe) return "Finding properties near you...";
    if (activeTab.listingType === "Sale") return "Search properties for sale...";
    if (activeTab.listingType === "Rent") return "Search properties for rent...";
    if (activeTab.propertyType === "Villa") return "Search luxury villas...";
    if (activeTab.propertyType === "Commercial") return "Search commercial spaces...";
    if (activeTab.type === "project") return "Search projects...";
    return "Search properties, projects or builders...";
  };

  // Input border state
  const inputBorderClass = validation?.type === "empty-search" || validation?.type === "no-results" || validation?.type === "min-chars"
    ? "border-red-300 focus:border-red-400 focus:ring-red-200/40"
    : validation?.type === "success"
      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200/40"
      : "border-[#EDE5DD] hover:border-[#6B3A1F]/40 focus:border-[#6B3A1F] focus:ring-[#6B3A1F]/20";

  return (
    <>
      <section className="relative overflow-visible" style={{ height: "clamp(320px, 44vh, 480px)" }}>

        {/* BG images */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((img, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentImageIndex ? "opacity-100" : "opacity-0"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover object-center"
                style={{ transform: i === currentImageIndex ? "scale(1)" : "scale(1.05)", transition: "transform 8000ms ease-out" }} />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.30)_100%)]" />
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentImageIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "w-4 bg-[#C9A84C]" : "w-1.5 bg-white/50 hover:bg-white/80"}`} />
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <h1 className="font-display font-bold text-white leading-[1.08] tracking-tight text-2xl sm:text-4xl lg:text-5xl max-w-3xl">
            Find Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#E8D5B0,#C9A84C,#E8D5B0)" }}>
                Dream
              </span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
            </span>{" "}Property
          </h1>
        </div>

        {/* Search card */}
        <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-1/2 px-3 sm:px-6 lg:px-8">
          <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.16)] p-3 sm:p-4 lg:p-5">

              {/* Tabs */}
              <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2 mb-3 border-b border-[#EDE5DD]"
                style={{ scrollbarWidth: "none" }}>
                {tabs.map(tab => (
                  <button key={tab.id}
                    onClick={() => { setActiveTab(tab); setShowSuggestions(false); setValidation(null); }}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0
                      ${activeTab.id === tab.id ? "bg-[#6B3A1F] text-white" : "text-[#7A6858] hover:bg-[#F0E8DF] hover:text-[#6B3A1F]"}`}>
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </div>

              {/* Search row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

                {/* City */}
                <div className="relative w-full sm:w-32 lg:w-36 flex-shrink-0">
                  <button onClick={() => setCityOpen(v => !v)}
                    className="w-full flex items-center justify-between gap-2 border border-[#EDE5DD] rounded-xl px-3 py-2.5 text-xs font-medium text-left bg-[#FAF7F2] hover:border-[#6B3A1F]/40 focus:outline-none transition-all">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={13} className="text-[#6B3A1F] flex-shrink-0" />
                      <span className={`truncate text-xs ${selectedCity ? "text-[#1C0F05]" : "text-[#A8978A]"}`}>
                        {selectedCity || "Select City"}
                      </span>
                    </div>
                    <ChevronDown size={12} className={`text-[#A8978A] flex-shrink-0 transition-transform duration-200 ${cityOpen ? "rotate-180" : ""}`} />
                  </button>

                  {cityOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#EDE5DD]
                      rounded-xl z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1 max-h-48 overflow-y-auto">
                      {selectedCity && (
                        <button onClick={() => { setSelectedCity(""); setCityOpen(false); }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-[#A8978A] hover:bg-[#FAF7F2] hover:text-[#6B3A1F] transition-colors flex items-center gap-1.5">
                          All Cities
                        </button>
                      )}
                      {cities.map(city => (
                        <button key={city} onClick={() => { setSelectedCity(city); setCityOpen(false); setValidation(null); }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-[#7A6858] hover:bg-[#FAF7F2] hover:text-[#6B3A1F] transition-colors flex items-center gap-1.5">
                          <MapPin size={11} className="text-[#C9A84C]" />{city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden sm:block w-px h-8 bg-[#EDE5DD] flex-shrink-0" />

                {/* Input */}
                <div className="flex-1 relative min-w-0">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A] pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setSelectedSuggIdx(-1); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholder()}
                    className={`w-full pl-8 pr-3 py-2.5 rounded-xl border bg-[#FAF7F2] text-xs sm:text-sm
                      text-[#1C0F05] placeholder:text-[#A8978A] font-medium
                      focus:outline-none focus:ring-2 transition-all duration-200
                      ${inputBorderClass}
                      ${inputShake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
                  />

                  {/* Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDE5DD]
                      rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {/* Header */}
                      <div className="px-3 py-2 border-b border-[#F5EFE8]">
                        <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-widest">
                          {suggestions.length} suggestion{suggestions.length > 1 ? "s" : ""} — {activeTab.type === "project" ? "Projects" : "Properties"}
                        </p>
                      </div>
                      {suggestions.map((item, i) => (
                        <button key={item.id} onMouseDown={() => handleSuggestionClick(item)}
                          onMouseEnter={() => setSelectedSuggIdx(i)}
                          className={`w-full flex items-start gap-3 p-3 text-left transition-colors
                            border-b border-[#EDE5DD] last:border-0
                            ${selectedSuggIdx === i ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]"}`}>
                          <div className="flex-shrink-0 mt-0.5">
                            {item.type === "project"
                              ? <Building2 size={16} className="text-[#6B3A1F]" />
                              : <Home size={16} className="text-[#C9A84C]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-[#1C0F05] text-sm truncate">{item.name}</p>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0
                                ${item.type === "project" ? "bg-[#6B3A1F]/10 text-[#6B3A1F]" : "bg-[#C9A84C]/10 text-[#C9A84C]"}`}>
                                {item.type === "project" ? "Project" : "Property"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <MapPin size={10} className="text-[#A8978A] flex-shrink-0" />
                              <p className="text-[11px] text-[#7A6858] truncate">{item.location}</p>
                            </div>
                            <p className="text-[11px] font-semibold text-[#6B3A1F] mt-0.5">{item.price}</p>
                          </div>
                          <ArrowRight size={14} className="text-[#C9A84C] flex-shrink-0 mt-1" />
                        </button>
                      ))}
                      {/* View all link */}
                      <button onMouseDown={handleSearch}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold
                          text-[#6B3A1F] hover:bg-[#FAF7F2] transition-colors border-t border-[#EDE5DD]">
                        View all results for "{query}"
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  )}

                  {/* No suggestions state — only shown after typing 2+ chars with no matches */}
                  {showSuggestions && query.trim().length >= 2 && suggestions.length === 0 && !validation && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDE5DD]
                      rounded-xl shadow-xl z-50 px-4 py-5 text-center">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD]
                        flex items-center justify-center mx-auto mb-2">
                        <Search size={14} className="text-[#A8978A]" />
                      </div>
                      <p className="text-xs font-semibold text-[#1C0F05] mb-0.5">No suggestions found</p>
                      <p className="text-[10px] text-[#A8978A]">
                        {selectedCity
                          ? suggestionsAllCities.length > 0
                            ? `Try removing the "${selectedCity}" filter to see results.`
                            : "Try a different keyword or browse all listings."
                          : "Try a different keyword or browse all listings."
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Near Me */}
                <div className="relative group flex-shrink-0 hidden sm:block">
                  <button onClick={handleNearMe} aria-label="Search near me"
                    className={`flex items-center justify-center w-[38px] h-[38px] rounded-xl border transition-all
                      ${isNearMe ? "border-[#6B3A1F] bg-[#F0E8DF] text-[#6B3A1F]"
                        : "border-[#EDE5DD] bg-[#FAF7F2] text-[#6B3A1F] hover:border-[#6B3A1F] hover:bg-[#F0E8DF]"}`}>
                    {isNearMe ? <Loader2 size={16} className="animate-spin" /> : <NearMeIcon size={16} />}
                  </button>
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    px-2 py-1 rounded-md bg-[#1C0F05] text-white text-[10px] whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Search near me
                  </span>
                </div>

                {/* Voice */}
                <div className="relative group flex-shrink-0 hidden sm:block">
                  <button onClick={handleVoiceSearch} aria-label="Voice search"
                    className={`flex items-center justify-center w-[38px] h-[38px] rounded-xl border transition-all
                      ${isListening ? "border-[#C9A84C] bg-[#FFF8EC] text-[#C9A84C]"
                        : "border-[#EDE5DD] bg-[#FAF7F2] text-[#6B3A1F] hover:border-[#6B3A1F] hover:bg-[#F0E8DF]"}`}>
                    {isListening ? <WaveIcon size={16} /> : <MicIcon size={16} />}
                  </button>
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    px-2 py-1 rounded-md bg-[#1C0F05] text-white text-[10px] whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {isListening ? "Listening..." : "Voice search"}
                  </span>
                </div>

                {/* Search button */}
                <button onClick={handleSearch} disabled={isLoading}
                  className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5
                    rounded-xl bg-[#6B3A1F] text-white font-bold text-xs sm:text-sm
                    shadow-[0_4px_14px_rgba(107,58,31,0.38)] hover:bg-[#8B5A3F]
                    active:scale-[0.97] transition-all w-full sm:w-auto
                    disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  <span>Search</span>
                </button>
              </div>

              {/* Mobile near me + voice */}
              <div className="flex sm:hidden gap-2 mt-2">
                <button onClick={handleNearMe}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-all
                    ${isNearMe ? "border-[#6B3A1F] bg-[#F0E8DF] text-[#6B3A1F]"
                      : "border-[#EDE5DD] bg-[#FAF7F2] text-[#7A6858] hover:border-[#6B3A1F] hover:text-[#6B3A1F]"}`}>
                  {isNearMe ? <Loader2 size={13} className="animate-spin" /> : <NearMeIcon size={13} />}
                  Near Me
                </button>
                <button onClick={handleVoiceSearch}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-all
                    ${isListening ? "border-[#C9A84C] bg-[#FFF8EC] text-[#C9A84C]"
                      : "border-[#EDE5DD] bg-[#FAF7F2] text-[#7A6858] hover:border-[#6B3A1F] hover:text-[#6B3A1F]"}`}>
                  {isListening ? <WaveIcon size={13} /> : <MicIcon size={13} />}
                  {isListening ? "Listening..." : "Voice Search"}
                </button>
              </div>

              {/* ── Validation Banner ── */}
              <ValidationBanner state={validation} onDismiss={() => setValidation(null)} />

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[#EDE5DD] hidden">
                <span className="text-[10px] text-[#A8978A] font-bold uppercase tracking-wider">Popular:</span>
                {["2 BHK Noida", "Villa Gurugram", "Godrej", "Ready to Move", "Sector 150"].map(tag => (
                  <button key={tag} onClick={() => { setQuery(tag); setShowSuggestions(true); setValidation(null); }}
                    className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#FAF7F2]
                      text-[#7A6858] hover:bg-[#6B3A1F] hover:text-white border border-[#EDE5DD]
                      hover:border-[#6B3A1F] transition-all whitespace-nowrap">
                    {tag}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      <div className="bg-[hsl(40,40%,97%)] pt-12 sm:pt-12 lg:pt-16" />

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
      `}</style>
    </>
  );
}