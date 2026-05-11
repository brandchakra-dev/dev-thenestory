"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight, Shield, Heart, Award, Clock,
  Users, TrendingUp, Home, CheckCircle, Target,
  Sparkles, Quote, ChevronRight, Star, Phone,
  Mail, MapPin, Instagram, Youtube, Facebook,
  Twitter, ArrowUp
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────
interface Chapter {
  id: string;
  title: string;
  content: string;
}

const chapters: Chapter[] = [
  {
    id: "founding",
    title: "Founding Story",
    content: "The Nestory was born from a simple belief — that finding a home should be a journey of joy, not anxiety. Founded in 2018 by real estate veterans who saw firsthand how fragmented, opaque, and exhausting the home-buying process had become, we set out to build something different.\n\nWhat started as a small advisory firm in Noida has grown into NCR's most trusted real estate partner, serving over 1,800 families and facilitating transactions worth ₹2400+ crores. But our north star remains unchanged: every client deserves honest advice, complete transparency, and a partner who truly cares."
  },
  {
    id: "mission",
    title: "Our Mission",
    content: "To democratize real estate advisory by making it transparent, unbiased, and genuinely helpful. We believe that the right home changes lives — and the right guidance makes that possible.\n\nWe're on a mission to eliminate the guesswork, the hidden agendas, and the high-pressure tactics that plague the industry. Instead, we offer clarity, expertise, and a relentless commitment to our clients' best interests."
  },
  {
    id: "approach",
    title: "Our Approach",
    content: "We don't just show you properties — we become your strategic partner. Our approach combines deep market intelligence, rigorous verification of every listing, and personalized guidance tailored to your unique needs.\n\nFrom understanding your lifestyle preferences to negotiating the best deal and handholding through legal formalities, we're with you at every step. No pushy sales pitches. No hidden fees. Just honest advice that puts you first."
  },
  {
    id: "vision",
    title: "Our Vision",
    content: "To become India's most loved real estate advisory platform — one where every homebuyer feels empowered, every seller finds fair value, and every transaction is built on trust.\n\nWe envision a future where real estate is transparent, accessible, and joyful. And we're building The Nestory to lead that transformation, one home at a time."
  }
];

const corePillars = [
  {
    icon: <Shield size={24} />,
    title: "Verified Integrity",
    description: "Every property, developer, and document undergoes rigorous verification before it reaches you."
  },
  {
    icon: <Heart size={24} />,
    title: "Client First",
    description: "Your dream home is our mission. No conflicts of interest, ever."
  },
  {
    icon: <Award size={24} />,
    title: "Market Expertise",
    description: "6+ years of deep NCR real estate knowledge at your disposal."
  },
  {
    icon: <Clock size={24} />,
    title: "End-to-End Support",
    description: "From site visits to legal closure, we're with you at every milestone."
  },
  {
    icon: <Users size={24} />,
    title: "Trusted Network",
    description: "1800+ families have found their homes through us."
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Value Creation",
    description: "We help you make informed decisions that maximize long-term value."
  }
];

const leadershipTeam = [
  {
    name: "Prashant Sidhu",
    role: "Founder & CEO",
    bio: "15+ years in real estate, former VP at leading developer. IIT Delhi alumnus.",
    initials: "PS"
  },
  {
    name: "Bhuvnendra Sidhu",
    role: "Co-Founder & COO",
    bio: "Real estate strategist with expertise in operations and client experience.",
    initials: "BS"
  },
  {
    name: "Prashant Sidhu",
    role: "Head of Advisory",
    bio: "Trusted advisor to 200+ families, known for his transparent, client-first approach.",
    initials: "PS"
  }
];

const coreValues = [
  { title: "Transparency", description: "No hidden fees, no misleading promises — just honest advice." },
  { title: "Excellence", description: "We hold ourselves to the highest standards in everything we do." },
  { title: "Empathy", description: "We listen, understand, and genuinely care about your journey." },
  { title: "Integrity", description: "Our reputation is built on doing the right thing, always." }
];

// ─── Scroll Indicator ─────────────────────────────────────
function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-90 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
        boxShadow: "0 4px 16px rgba(107,58,31,0.40)",
        color: "#E8D5B0",
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} />
    </button>
  );
}

// ─── Main About Page Component ────────────────────────────
export default function Page() {
  const [activeChapter, setActiveChapter] = useState("founding");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    Object.keys(sectionRefs.current).forEach((key) => {
      const section = sectionRefs.current[key];
      if (section) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveChapter(key);
              }
            });
          },
          { threshold: 0.5, rootMargin: "-20% 0px -50% 0px" }
        );
        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <>
      <main className="bg-[hsl(40,40%,97%)]">
        
{/* ══ HERO SECTION ══ */}
<section className="relative overflow-hidden min-h-[70vh] flex items-center"
  style={{ background: "linear-gradient(135deg, #FAF7F4 0%, #EDE5DD 100%)" }}>
  
  {/* Grain texture */}
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
  
  {/* Elliptical decorative rings - slightly darker for contrast */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#6B3A1F]/8" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[#6B3A1F]/12" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#C9A84C]/15" />
  </div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={14} className="text-[#C9A84C]" />
        <span className="text-[11px] font-bold text-[#6B3A1F] uppercase tracking-[0.2em]">
          About The Nestory
        </span>
      </div>
      <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight"
        style={{ color: "#1C0F05" }}>
        Building Dreams,
        <span className="italic block text-[#6B3A1F] mt-2">One Home at a Time</span>
      </h1>
      <p className="text-[#5A4A3A] text-lg sm:text-xl leading-relaxed mt-6 max-w-2xl">
        NCR's most trusted real estate advisory. We've helped 1,800+ families find their perfect home with transparency, expertise, and genuine care.
      </p>
      <div className="flex flex-wrap items-center gap-4 mt-8">
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
            transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
            color: "#E8D5B0",
          }}
        >
          Start Your Journey <ArrowUpRight size={14} />
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border
            transition-all duration-300 hover:-translate-y-0.5"
          style={{
            border: "1px solid #6B3A1F",
            color: "#6B3A1F",
            background: "rgba(255,255,255,0.8)",
          }}
        >
          Explore Properties
        </Link>
      </div>
    </div>
  </div>

  {/* Bottom champagne accent */}
  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
</section>

        {/* ══ INTRO SPLIT SECTION ══ */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left — Tagline */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <div className="w-12 h-px bg-[#C9A84C] mb-6" />
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0F05] leading-tight">
                    More than just a real estate advisory
                  </h2>
                </div>
              </div>

              {/* Right — 3 paragraphs */}
              <div className="lg:col-span-7 lg:col-start-6">
                <div className="space-y-6">
                  <p className="text-[#5A4A3A] text-base leading-relaxed font-body">
                    The Nestory was founded on a simple belief — that finding a home should be a journey of joy, not anxiety. In an industry riddled with opacity and conflicting interests, we set out to build something radically different: a real estate advisory that puts clients first, always.
                  </p>
                  <p className="text-[#5A4A3A] text-base leading-relaxed font-body">
                    What started as a small team of passionate real estate professionals in Noida has grown into NCR's most trusted name in home buying. We've facilitated transactions worth over ₹2400 crores and helped 1,800+ families write their next chapter — but our approach remains refreshingly personal.
                  </p>
                  <p className="text-[#5A4A3A] text-base leading-relaxed font-body">
                    We don't have sales targets. We don't push properties that don't fit. We simply listen, understand, and guide you to the home that's truly right for you. Because your dream home isn't just a transaction — it's the backdrop to your life's most beautiful moments.
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-[#6B3A1F] font-semibold text-sm">
                      <span className="w-8 h-px bg-[#C9A84C]" />
                      <span>Trusted by families across NCR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ NUMBERS BAR ══ */}
        <section className="bg-[#6e371c] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: "₹100 Cr+", label: "Transaction Value" },
                { value: "200+", label: "Happy Families" },
                { value: "4+", label: "Years of Excellence" },
                { value: "100%", label: "Client Satisfaction" }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="font-display font-black text-4xl sm:text-5xl text-[#C9A84C]">{stat.value}</p>
                  <p className="text-[#D4C4B0] text-sm font-medium tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STORY / CHAPTERS SECTION ══ */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left — Sticky Navigation */}
              <div className="lg:col-span-3">
                <div className="sticky top-24 space-y-4">
                  <div className="w-12 h-px bg-[#C9A84C] mb-6" />
                  <h3 className="font-display font-bold text-2xl text-[#1C0F05] mb-6">Our Story</h3>
                  <nav className="flex flex-col gap-2">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          sectionRefs.current[chapter.id]?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`text-left px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium
                          ${activeChapter === chapter.id 
                            ? "bg-[#6B3A1F] text-white shadow-md" 
                            : "text-[#7A6858] hover:bg-[#6B3A1F]/5 hover:text-[#6B3A1F]"}`}
                      >
                        {chapter.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Right — Chapter Content */}
              <div className="lg:col-span-8 lg:col-start-5 space-y-20">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    ref={(el) => { sectionRefs.current[chapter.id] = el; }}
                    className="scroll-mt-24"
                  >
                    <h2 className="font-display font-bold text-3xl text-[#1C0F05] mb-6">{chapter.title}</h2>
                    <div className="space-y-4 text-[#5A4A3A] leading-relaxed font-body">
                      {chapter.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-6 w-16 h-px bg-[#C9A84C]/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 6 CORE PILLARS ══ */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={14} className="text-[#C9A84C]" />
                <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">What We Stand For</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0F05]">The Pillars That Define Us</h2>
              <p className="text-[#7A6858] mt-4">Six principles that guide everything we do, from first consultation to final handover.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {corePillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-xl border"
                  style={{
                    background: "#FAF7F4",
                    borderColor: "#EDE5DD",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-[#6B3A1F]"
                    style={{ background: "rgba(107,58,31,0.1)", color: "#6B3A1F" }}
                  >
                    {pillar.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#1C0F05] mb-2">{pillar.title}</h3>
                  <p className="text-[#7A6858] text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ LEADERSHIP TEAM ══ */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users size={14} className="text-[#C9A84C]" />
                <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">Leadership</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0F05]">The Minds Behind The Nestory</h2>
              <p className="text-[#7A6858] mt-4">A team driven by passion, expertise, and an unwavering commitment to our clients.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadershipTeam.map((member, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: "#FAF7F4", border: "1px solid #EDE5DD" }}
                >
                  <div className="p-6 text-center">
                    <div
                      className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 text-2xl font-display font-bold"
                      style={{ background: "linear-gradient(135deg, #6B3A1F, #C9A84C)", color: "white" }}
                    >
                      {member.initials}
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#1C0F05]">{member.name}</h3>
                    <p className="text-[#C9A84C] text-sm font-semibold mt-1">{member.role}</p>
                    <div className="w-12 h-px bg-[#C9A84C]/40 mx-auto my-3" />
                    <p className="text-[#7A6858] text-sm leading-relaxed">{member.bio}</p>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-[#6B3A1F] to-[#C9A84C] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROMISE + VALUES SECTION (Light) ══ */}
        <section className="py-20 lg:py-28"
        style={{ background: "linear-gradient(135deg, #FAF7F4 0%, #EDE5DD 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — Our Promise */}
            <div>
                <div className="w-12 h-px bg-[#C9A84C] mb-6" />
                <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6" style={{ color: "#1C0F05" }}>Our Promise to You</h2>
                <p className="text-[#5A4A3A] leading-relaxed mb-6">
                We don't just sell homes — we build lifelong relationships. Every client who walks through our doors receives the same unwavering commitment: honest advice, complete transparency, and genuine care.
                </p>
                <div className="space-y-3">
                {[
                    "100% verified properties — no surprises",
                    "Zero hidden fees — complete cost clarity",
                    "End-to-end support — from search to possession",
                    "Unbiased advice — we work for you, not developers"
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#C9A84C] flex-shrink-0" />
                    <span className="text-[#5A4A3A] text-sm font-medium">{item}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* Right — Core Values with hover animation */}
            <div>
                <div className="w-12 h-px bg-[#C9A84C] mb-6" />
                <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6" style={{ color: "#1C0F05" }}>Our Core Values</h2>
                <div className="space-y-4">
                {coreValues.map((value, idx) => (
                    <div
                    key={idx}
                    className="group p-4 rounded-xl transition-all duration-300 cursor-pointer"
                    style={{ background: "rgba(107,58,31,0.04)", border: "1px solid rgba(107,58,31,0.08)" }}
                    >
                    <div className="flex items-start gap-4">
                        <div className="w-1 h-12 bg-[#C9A84C] rounded-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                        <div>
                        <h3 className="font-display font-bold text-lg mb-1" style={{ color: "#1C0F05" }}>{value.title}</h3>
                        <p className="text-[#7A6858] text-sm">{value.description}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        </section>

        {/* ══ FOOTER CTA ══ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Quote size={20} className="text-[#C9A84C]" />
              <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">Start Your Journey</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C0F05] mb-6">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-[#7A6858] text-lg max-w-2xl mx-auto mb-8">
              Let's turn your vision into reality. Book a free consultation with our experts today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm
                  transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
                  color: "#E8D5B0",
                }}
              >
                Get Free Consultation <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border
                  transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  border: "1px solid #6B3A1F",
                  color: "#6B3A1F",
                  background: "white",
                }}
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </section>

      </main>

      <ScrollToTop />
    </>
  );
}