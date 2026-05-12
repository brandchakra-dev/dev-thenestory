"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, ChevronDown, Sparkles,
  Building2, Home, Loader2, ArrowRight, Store,
  AlertCircle, Info, CheckCircle2,
  Factory
} from "lucide-react";
import { citiesApi, searchApi } from "@/lib/api";

// ─── Tabs Configuration ────────────────
const tabs = [
  { id: "buy", label: "Buy", icon: <Home size={14} />, type: "property", listingType: "sale", category: null, placeholder: "Search properties for sale..." },
  { id: "projects", label: "Projects", icon: <Sparkles size={14} />, type: "project", listingType: null, category: null, placeholder: "Search new projects..." },
  { id: "residential", label: "Residential", icon: <Home size={14} />, type: "property", listingType: null, category: "residential", placeholder: "Search residential properties..." },
  { id: "commercial", label: "Commercial", icon: <Store size={14} />, type: "property", listingType: null, category: "commercial", placeholder: "Search commercial spaces..." },
  { id: "industrial", label: "Industrial", icon: <Factory size={14} />, type: "property", listingType: null, category: "industrial", placeholder: "Search industrial properties..." },
];

const normalizeQuery = (q: string): string => {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
};

interface SearchItem {
  id: string;
  type: "project" | "property";
  name: string;
  location: string;
  city: string;
  slug: string;
  image: string | null;
  price: string;
  propertyType: string;
  category?: string;
  subCategory?: string;
  listingType?: string;
  bhk?: string;
  bedrooms?: number;
  area?: number;
  furnished?: string;
}

const heroImages = [
  { url: "./hero/nestory-hero_1st_slider.webp", alt: "Luxury modern home" },
  { url: "./hero/thenestory-hero1.jpg", alt: "Elegant living room" },
];

type ValidationState = { type: string; message: string; hint?: string } | null;

function ValidationBanner({ state, onDismiss }: { state: ValidationState; onDismiss: () => void }) {
  if (!state) return null;
  const configs: Record<string, any> = {
    "empty-search": { icon: <AlertCircle size={13} />, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", iconColor: "text-amber-500" },
    "no-results": { icon: <AlertCircle size={13} />, bg: "bg-red-50", border: "border-red-200", text: "text-red-800", iconColor: "text-red-400" },
    "min-chars": { icon: <Info size={13} />, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", iconColor: "text-blue-400" },
    "city-suggestion": { icon: <Info size={13} />, bg: "bg-[#6B3A1F]/5", border: "border-[#D4C4B0]", text: "text-[#6B3A1F]", iconColor: "text-[#C9A84C]" },
    "success": { icon: <CheckCircle2 size={13} />, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", iconColor: "text-emerald-500" },
  };
  const cfg = configs[state.type];
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border mt-2.5 ${cfg.bg} ${cfg.border}`}>
      <span className={`flex-shrink-0 mt-0.5 ${cfg.iconColor}`}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-snug ${cfg.text}`}>{state.message}</p>
        {state.hint && <p className={`text-[10px] mt-0.5 font-medium opacity-75 ${cfg.text}`}>{state.hint}</p>}
      </div>
      <button onClick={onDismiss} className={`flex-shrink-0 text-[10px] font-bold opacity-50 hover:opacity-100 ${cfg.text}`}>✕</button>
    </div>
  );
}

function NearMeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
    </svg>
  );
}

function MicIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0014 0M12 19v3M8 23h8" />
    </svg>
  );
}

function WaveIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="8" width="3" height="8" rx="1" /><rect x="7" y="4" width="3" height="16" rx="1" />
      <rect x="12" y="6" width="3" height="12" rx="1" /><rect x="17" y="9" width="3" height="6" rx="1" />
    </svg>
  );
}

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
  const [inputShake, setInputShake] = useState(false);
  const [cities, setCities] = useState<Array<{ _id: string; name: string }>>([]);
  const [searchData, setSearchData] = useState<SearchItem[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-scroll logic for mobile city chips
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const startAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;

    autoScrollInterval.current = setInterval(() => {
      if (!container || !isAutoScrolling) return;
      let newScrollLeft = container.scrollLeft + 1;
      if (newScrollLeft >= maxScroll) {
        newScrollLeft = 0;
      }
      container.scrollLeft = newScrollLeft;
    }, 30);
  }, [isAutoScrolling]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  const pauseAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
    stopAutoScroll();
  }, [stopAutoScroll]);

  const resumeAutoScroll = useCallback(() => {
    setIsAutoScrolling(true);
    stopAutoScroll();
    startAutoScroll();
  }, [stopAutoScroll, startAutoScroll]);

  // Start/stop auto-scroll when cities load or component mounts
  useEffect(() => {
    if (!isMobile) return;
    startAutoScroll();
    return () => stopAutoScroll();
  }, [isMobile, startAutoScroll, stopAutoScroll, cities]);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch cities
  useEffect(() => {
    citiesApi.getAll({ isActive: 'true' })
      .then(res => { setCities(res.cities || []); setLoadingCities(false); })
      .catch(err => { console.error(err); setLoadingCities(false); });
  }, []);

  // Auto-slide background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch suggestions (with conditional filtering for mobile)
  const fetchSuggestions = useCallback(async (searchQuery: string, city?: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 1) {
      setSearchData([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    try {
      const category = isMobile ? undefined : activeTab.category || undefined;
      const res = await searchApi.search(searchQuery, city, undefined, category);
      let results = res.results || [];
      
      if (!isMobile) {
        if (activeTab.type === "project") {
          results = results.filter((item: SearchItem) => item.type === "project");
        } else if (activeTab.type === "property") {
          results = results.filter((item: SearchItem) => item.type === "property");
        }
        if (activeTab.listingType) {
          results = results.filter((item: SearchItem) => 
            item.listingType?.toLowerCase() === activeTab.listingType?.toLowerCase()
          );
        }
      }
      
      setSearchData(results.slice(0, 10));
    } catch (err) {
      console.error("Search failed:", err);
      setSearchData([]);
    } finally {
      setIsSearching(false);
    }
  }, [activeTab, isMobile]);

  useEffect(() => {
    const delay = 200;
    const timer = setTimeout(() => {
      if (query.trim().length >= 1) {
        fetchSuggestions(query, selectedCity);
      } else {
        setSearchData([]);
        setIsSearching(false);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [query, selectedCity, fetchSuggestions]);

  // Clear suggestions when tab changes on desktop
  useEffect(() => {
    if (!isMobile) {
      setSearchData([]);
      setSelectedSuggIdx(-1);
      setShowSuggestions(false);
      setIsSearching(false);
      setHasSearched(false);
    }
  }, [activeTab, isMobile]);

  useEffect(() => { if (query.length > 0) setValidation(null); }, [query]);
  useEffect(() => { if (validation?.type === "city-suggestion") setValidation(null); }, [selectedCity]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    let filtered = [...searchData];
    if (selectedCity) filtered = filtered.filter(item => item.city === selectedCity);
    return filtered.slice(0, 8);
  }, [searchData, selectedCity, query]);

  const suggestionsAllCities = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    return searchData.slice(0, 4);
  }, [searchData, query]);

  const validate = useCallback((): boolean => {
    if (!query.trim() && !selectedCity) {
      setValidation({ type: "empty-search", message: "Please select a city or enter a search keyword.", hint: "Example: 'Noida', '3 BHK', or 'Godrej Palm Retreat'" });
      return false;
    }
    if (!query.trim() && selectedCity) {
      setValidation({ type: "success", message: `Showing properties in ${selectedCity}.`, hint: "Click search to explore all listings." });
      return true;
    }
    if (query.trim().length === 1 && !selectedCity) {
      setValidation({ type: "min-chars", message: "Please type at least 2 characters or select a city.", hint: "Select a city for direct results 👍" });
      return false;
    }
    if (query.trim() && selectedCity && suggestions.length === 0 && suggestionsAllCities.length > 0) {
      const foundCities = [...new Set(suggestionsAllCities.map(s => s.city))];
      setValidation({ type: "city-suggestion", message: `No results in ${selectedCity} for "${query}".`, hint: `Found in ${foundCities.join(", ")} — try changing city.` });
      return false;
    }
    if (query.trim().length >= 1 && suggestions.length === 0 && suggestionsAllCities.length === 0 && hasSearched && !isSearching) {
      setValidation({ type: "no-results", message: `No results found.`, hint: "Try different keywords or browse all listings." });
      setInputShake(true);
      setTimeout(() => setInputShake(false), 500);
      return false;
    }
    return true;
  }, [query, selectedCity, suggestions, suggestionsAllCities, hasSearched, isSearching]);

  const getRedirectPath = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCity) params.set("city", selectedCity);
    if (query.trim()) params.set("q", normalizeQuery(query.trim()));

    if (isMobile) {
      return `/properties${params.toString() ? `?${params}` : ''}`;
    }

    const tab = activeTab;
    if (tab.id === "buy") return `/properties?listing=sale${params.toString() ? `&${params}` : ''}`;
    if (tab.id === "rent") return `/properties?listing=rent${params.toString() ? `&${params}` : ''}`;
    if (tab.id === "projects") return `/projects${params.toString() ? `?${params}` : ''}`;
    if (tab.id === "residential") return `/properties?category=residential${params.toString() ? `&${params}` : ''}`;
    if (tab.id === "commercial") return `/properties?category=commercial${params.toString() ? `&${params}` : ''}`;
    if (tab.id === "industrial") return `/properties?category=industrial${params.toString() ? `&${params}` : ''}`;
    return `/properties${params.toString() ? `?${params}` : ''}`;
  }, [activeTab, selectedCity, query, isMobile]);

  const handleSearch = useCallback(() => {
    setValidation(null);
    if (!validate()) {
      inputRef.current?.focus();
      return;
    }
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
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedSuggIdx(p => Math.min(p + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedSuggIdx(p => p - 1); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggIdx >= 0 && suggestions[selectedSuggIdx]) handleSuggestionClick(suggestions[selectedSuggIdx]);
      else handleSearch();
    } else if (e.key === "Escape") { setShowSuggestions(false); setSelectedSuggIdx(-1); }
  }, [suggestions, selectedSuggIdx, handleSuggestionClick, handleSearch]);

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setValidation({ type: "no-results", message: "Geolocation not supported.", hint: "Please search by typing a city." });
      return;
    }
    setIsNearMe(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.suburb || "Near Me";
          setQuery(city);
          router.push(`/properties?nearme=true&lat=${pos.coords.latitude.toFixed(6)}&lon=${pos.coords.longitude.toFixed(6)}&radius=3`);
        } catch { router.push(`/properties?nearme=true&lat=${pos.coords.latitude.toFixed(6)}&lon=${pos.coords.longitude.toFixed(6)}&radius=3`); }
        finally { setIsNearMe(false); }
      },
      () => { setIsNearMe(false); setValidation({ type: "no-results", message: "Location permission denied.", hint: "Please allow location access." }); },
      { timeout: 8000 }
    );
  }, [router]);

  const handleVoiceSearch = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setValidation({ type: "min-chars", message: "Voice search not supported.", hint: "Try Chrome or Edge." });
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.onstart = () => { setIsListening(true); setValidation(null); };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => { setIsListening(false); setValidation({ type: "no-results", message: "Voice search failed.", hint: "Please try typing." }); };
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setShowSuggestions(true);
    };
    recognition.start();
  }, []);

  const getPlaceholder = () => {
    if (isListening) return "Listening...";
    if (isNearMe) return "Finding properties near you...";
    return "Search properties, projects or builders...";
  };

  const inputBorderClass = validation?.type === "empty-search" || validation?.type === "no-results" || validation?.type === "min-chars"
    ? "border-red-300 focus:border-red-400 focus:ring-red-200/40"
    : validation?.type === "success"
      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200/40"
      : "border-[#EDE5DD] hover:border-[#6B3A1F]/40 focus:border-[#6B3A1F] focus:ring-[#6B3A1F]/20";

  // Shared suggestion dropdown component (used both in mobile and desktop)
  const SuggestionDropdown = () => {
    if (!showSuggestions) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
        {isSearching && query.trim().length >= 1 && (
          <div className="px-4 py-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#6B3A1F]" />
              <span className="text-xs text-[#A8978A]">Searching...</span>
            </div>
          </div>
        )}
        {!isSearching && suggestions.length > 0 && (
          <>
            <div className="px-3 py-2 border-b border-[#F5EFE8]">
              <p className="text-[9px] font-bold text-[#A8978A] uppercase tracking-wider">
                {suggestions.length} suggestion{suggestions.length > 1 ? "s" : ""} found
              </p>
            </div>
            {suggestions.map((item, i) => (
              <button
                key={item.id}
                onMouseDown={() => handleSuggestionClick(item)}
                onMouseEnter={() => setSelectedSuggIdx(i)}
                className={`w-full flex items-start gap-3 p-3 text-left transition-all duration-150 border-b border-[#F5EFE8] last:border-0
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
                      ${item.type === "project"
                        ? "bg-[#6B3A1F]/10 text-[#6B3A1F]"
                        : "bg-[#C9A84C]/10 text-[#C9A84C]"}`}>
                      {item.type === "project" ? "Project" : 
                       item.listingType === "sale" ? "For Sale" :
                       item.listingType === "rent" ? "For Rent" : "Property"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} className="text-[#A8978A] flex-shrink-0" />
                    <p className="text-[11px] text-[#7A6858] truncate">{item.location}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] font-semibold text-[#6B3A1F]">{item.price}</p>
                    {item.bhk && (
                      <span className="text-[9px] text-[#A8978A]">• {item.bhk}</span>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#C9A84C] flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
            <button
              onMouseDown={handleSearch}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#6B3A1F] hover:bg-[#FAF7F2] transition-colors border-t border-[#EDE5DD]">
              View all results for "<span className="max-w-[150px] truncate">{query}</span>"
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}
        {!isSearching && hasSearched && query.trim().length >= 1 && suggestions.length === 0 && !validation && (
          <div className="px-4 py-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD] flex items-center justify-center mx-auto mb-3">
              <Search size={18} className="text-[#A8978A]" />
            </div>
            <p className="text-sm font-semibold text-[#1C0F05] mb-1">No results found</p>
            <p className="text-[11px] text-[#A8978A] max-w-[220px] mx-auto">
              {selectedCity
                ? `No results in ${selectedCity}`
                : "Try different keywords or browse all listings"}
            </p>
            <button
              onClick={() => {
                setSelectedCity("");
                setQuery("");
                inputRef.current?.focus();
              }}
              className="mt-3 text-xs text-[#6B3A1F] hover:underline">
              Clear search
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="relative overflow-visible" style={{ height: isMobile ? "clamp(240px, 35vh, 320px)" : "clamp(320px, 44vh, 480px)"}}>
        {/* Background Images */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((img, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentImageIndex ? "opacity-100" : "opacity-0"}`}>
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover object-center" />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.30)_100%)]" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentImageIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "w-4 bg-[#C9A84C]" : "w-1.5 bg-white/50 hover:bg-white/80"}`} />
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <h1 className="font-display font-bold text-white leading-[1.08] tracking-tight text-4xl lg:text-5xl max-w-3xl">
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

        {/* Search Card */}
        <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-1/2 px-3 sm:px-6 lg:px-8">
          <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.16)] p-3 sm:p-4 lg:p-5">

              {/* ========== MOBILE / TABLET ( < 768px ) ========== */}
              <div className="block sm:hidden">
                {/* Row 1: Input with voice icon + Search button */}
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <button
                      onClick={handleVoiceSearch}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A] hover:text-[#6B3A1F] transition-colors"
                    >
                      {isListening ? <WaveIcon size={16} /> : <MicIcon size={16} />}
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setSelectedSuggIdx(-1); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      onKeyDown={handleKeyDown}
                      placeholder={getPlaceholder()}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border bg-[#FAF7F2] text-sm ${inputBorderClass} ${inputShake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
                    />
                    <SuggestionDropdown />
                  </div>
                  <button onClick={handleSearch} disabled={isLoading}
                    className="px-4 py-2.5 rounded-xl bg-[#6B3A1F] text-white font-bold text-sm shadow-md active:scale-95 disabled:opacity-70">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  </button>
                </div>

                {/* Row 2: Auto‑slider location chips + Near Me icon */}
                <div className="mt-3 flex items-center gap-2">
                  <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-x-auto scrollbar-hide"
                    onMouseEnter={pauseAutoScroll}
                    onMouseLeave={resumeAutoScroll}
                    onTouchStart={pauseAutoScroll}
                    onTouchEnd={resumeAutoScroll}
                  >
                    <div className="flex gap-2 pb-1">
                      {/* <button
                        onClick={() => setSelectedCity("")}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                          ${!selectedCity ? "bg-[#6B3A1F] text-white shadow-sm" : "bg-[#F5EFE8] text-[#6B5C4E] hover:bg-[#EDE5DD]"}
                        `}>
                        Popular Cities
                      </button> */}
                      {cities.map(city => (
                        <button
                          key={city._id}
                          onClick={() => { setSelectedCity(city.name); setShowSuggestions(false); inputRef.current?.focus(); }}
                          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                            ${selectedCity === city.name ? "bg-[#6B3A1F] text-white shadow-sm" : "bg-[#F5EFE8] text-[#6B5C4E] hover:bg-[#EDE5DD]"}
                          `}>
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Near Me icon button */}
                  <button
                    onClick={handleNearMe}
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all
                      ${isNearMe ? "border-[#6B3A1F] bg-[#F0E8DF] text-[#6B3A1F]" : "border-[#EDE5DD] bg-[#FAF7F2] text-[#7A6858] hover:border-[#6B3A1F]"}`}
                    aria-label="Near Me"
                  >
                    {isNearMe ? <Loader2 size={14} className="animate-spin" /> : <NearMeIcon size={14} />}
                  </button>
                </div>

                <ValidationBanner state={validation} onDismiss={() => setValidation(null)} />
              </div>

              {/* ========== DESKTOP ( ≥768px ) – FULLY WORKING ========== */}
              <div className="hidden sm:block">
                {/* Desktop tabs row */}
                <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2 mb-3 border-b border-[#EDE5DD]">
                  {tabs.map(tab => (
                    <button key={tab.id}
                      onClick={() => { setActiveTab(tab); setShowSuggestions(false); setValidation(null); }}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-shrink-0
                        ${activeTab.id === tab.id ? "bg-[#6B3A1F] text-white" : "text-[#7A6858] hover:bg-[#F0E8DF] hover:text-[#6B3A1F]"}`}>
                      {tab.icon}{tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* City Selector Dropdown */}
                  <div className="relative w-full sm:w-32 lg:w-36 flex-shrink-0">
                    <button onClick={() => setCityOpen(v => !v)}
                      className="w-full flex items-center justify-between gap-2 border border-[#EDE5DD] rounded-xl px-3 py-2.5 text-xs font-medium text-left bg-[#FAF7F2] hover:border-[#6B3A1F]/40">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin size={13} className="text-[#6B3A1F]" />
                        <span className={`truncate text-xs ${selectedCity ? "text-[#1C0F05]" : "text-[#A8978A]"}`}>
                          {selectedCity || "Select City"}
                        </span>
                      </div>
                      <ChevronDown size={12} className={`text-[#A8978A] transition-transform ${cityOpen ? "rotate-180" : ""}`} />
                    </button>
                    {cityOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border rounded-xl z-50 shadow-lg py-1 max-h-48 overflow-y-auto">
                        <button onClick={() => { setSelectedCity(""); setCityOpen(false); }}
                          className="w-full text-left px-3 py-2 text-xs text-[#A8978A] hover:bg-[#FAF7F2]">All Cities</button>
                        {cities.map(city => (
                          <button key={city._id} onClick={() => { setSelectedCity(city.name); setCityOpen(false); }}
                            className="w-full text-left px-3 py-2 text-xs text-[#7A6858] hover:bg-[#FAF7F2] flex items-center gap-1.5">
                            <MapPin size={11} className="text-[#C9A84C]" />{city.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:block w-px h-8 bg-[#EDE5DD]" />

                  {/* Search Input with Suggestions (desktop retains search icon) */}
                  <div className="flex-1 relative min-w-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A]" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setSelectedSuggIdx(-1); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      onKeyDown={handleKeyDown}
                      placeholder={getPlaceholder()}
                      className={`w-full pl-8 pr-3 py-2.5 rounded-xl border bg-[#FAF7F2] text-sm ${inputBorderClass} ${inputShake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
                    />
                    <SuggestionDropdown />
                  </div>

                  {/* Near Me & Voice (Desktop) */}
                  <div className="relative group flex-shrink-0">
                    <button onClick={handleNearMe}
                      className={`flex items-center justify-center w-[38px] h-[38px] rounded-xl border transition-all
                        ${isNearMe ? "border-[#6B3A1F] bg-[#F0E8DF] text-[#6B3A1F]" : "border-[#EDE5DD] bg-[#FAF7F2] text-[#6B3A1F] hover:border-[#6B3A1F]"}`}>
                      {isNearMe ? <Loader2 size={16} className="animate-spin" /> : <NearMeIcon size={16} />}
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-[#1C0F05] text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Search near me
                    </span>
                  </div>

                  <div className="relative group flex-shrink-0">
                    <button onClick={handleVoiceSearch}
                      className={`flex items-center justify-center w-[38px] h-[38px] rounded-xl border transition-all
                        ${isListening ? "border-[#C9A84C] bg-[#FFF8EC] text-[#C9A84C]" : "border-[#EDE5DD] bg-[#FAF7F2] text-[#6B3A1F] hover:border-[#6B3A1F]"}`}>
                      {isListening ? <WaveIcon size={16} /> : <MicIcon size={16} />}
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-[#1C0F05] text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100">
                      {isListening ? "Listening..." : "Voice search"}
                    </span>
                  </div>

                  {/* Search Button */}
                  <button onClick={handleSearch} disabled={isLoading}
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6B3A1F] text-white font-bold text-sm shadow-md hover:bg-[#8B5A3F] active:scale-95 disabled:opacity-70">
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    <span>Search</span>
                  </button>
                </div>

                <ValidationBanner state={validation} onDismiss={() => setValidation(null)} />
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}