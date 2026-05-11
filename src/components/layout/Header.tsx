"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight, Phone, Bell, Calendar, Clock, CheckCircle, User, MessageCircle, ArrowRight } from "lucide-react";
import logoLight from "../../../public/logo/logo.webp";
import logoDark from "../../../public/logo/logo-black.webp";
import logo from "../../../public/logo/logo.webp";

const navLinks = [
  { label: "Explore Projects",   href: "/projects" },
  { label: "Compare Projects",    href: "/compare-projects" },
  { label: "Properties", href: "/properties" },
  { label: "Insights",   href: "/blog" },
];

// ─── Consultation Modal Component ──────────────────────────────
function ConsultationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", mobile: "", message: "" });
    
    // Close modal after 2.5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl w-full rounded-xl overflow-hidden bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all"
        >
          <X size={14} className="text-white" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side - Image Only */}
          <div className="relative h-56 md:h-auto overflow-hidden">
            <img 
              src="./modal/thenestory-consultation.png" 
              alt="Expert Consultation"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Right Side - Form */}
          <div className="p-5 md:p-6 bg-white">
            <div className="mb-4">
              <h2 className="font-display font-bold text-xl text-[#1C0F05]">Get Expert Advice</h2>
              <p className="text-[#7A6858] text-xs mt-1">Fill details and get expert advice</p>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1C0F05] mb-1">Thank You!</h3>
                <p className="text-[#7A6858] text-xs">Our expert will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[#1C0F05] text-xs font-semibold mb-1">Full Name *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A]" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border outline-none transition-all focus:border-[#C9A84C] text-sm"
                      style={{ borderColor: "#EDE5DD", background: "#FAF7F4" }}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1C0F05] text-xs font-semibold mb-1">Mobile Number *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8978A]" />
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border outline-none transition-all focus:border-[#C9A84C] text-sm"
                      style={{ borderColor: "#EDE5DD", background: "#FAF7F4" }}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1C0F05] text-xs font-semibold mb-1">Message (Optional)</label>
                  <div className="relative">
                    <MessageCircle size={14} className="absolute left-3 top-3 text-[#A8978A]" />
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border outline-none transition-all focus:border-[#C9A84C] resize-none text-sm"
                      style={{ borderColor: "#EDE5DD", background: "#FAF7F4" }}
                      placeholder="Tell us about your requirements..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
                    color: "#E8D5B0",
                  }}
                >
                  {isSubmitting ? "Sending..." : "Get Expert Advice"}
                  {!isSubmitting && <ArrowRight size={12} />}
                </button>

                <p className="text-[#A8978A] text-[9px] text-center">
                  By submitting, you agree to our Terms & Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu open or modal open
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || modalOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, modalOpen]);

  // Dynamic header styles
  const isTransparent = isHome && !scrolled && !mobileOpen;

  const headerBase = `
    fixed top-0 left-0 w-full z-50
    transition-all duration-500 ease-in-out
  `;

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-white/98 backdrop-blur-xl border-b border-champ-200/60";

  const headerShadow = !isTransparent ? "shadow-[0_2px_24px_hsl(20_50%_15%/0.08)]" : "";

  const textColor = isTransparent ? "text-white" : "text-warm-900";
  const textHover = isTransparent ? "hover:text-champ-300" : "hover:text-primary";

  return (
    <>
      <header className={`${headerBase} ${headerBg} ${headerShadow}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative z-10">
              <div className="relative w-36 h-10">
                <Image
                  src={logoLight}
                  alt="The Nestory"
                  fill
                  className={`
                    object-contain transition-opacity duration-300
                    ${isTransparent ? "opacity-100" : "opacity-0"}
                  `}
                />
                <Image
                  src={logoDark}
                  alt="The Nestory"
                  fill
                  className={`
                    object-contain transition-opacity duration-300
                    ${isTransparent ? "opacity-0" : "opacity-100"}
                  `}
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 text-sm font-semibold tracking-wide
                    transition-all duration-200 rounded-lg group
                    ${textColor} ${textHover}
                  `}
                >
                  {link.label}
                  <span className={`
                    absolute bottom-1 left-4 right-4 h-0.5 rounded-full
                    scale-x-0 group-hover:scale-x-100
                    transition-transform duration-300 origin-left
                    ${isTransparent ? "bg-champ-300" : "bg-primary"}
                  `} />
                </Link>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2">

              {/* Saved Searches / Alerts - Bell Icon */}
              <button
                aria-label="Saved Searches"
                className={`
                  p-2.5 rounded-xl transition-all duration-200
                  ${isTransparent
                    ? "text-white hover:bg-white/15"
                    : "text-warm-600 hover:bg-champ-100 hover:text-primary"
                  }
                `}
              >
                <Bell size={17} />
              </button>

              {/* Phone CTA */}
              <a
                href="tel:+919540311311"
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                  transition-all duration-200
                  ${isTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-warm-600 hover:text-primary hover:bg-champ-100"
                  }
                `}
              >
                <Phone size={14} />
                <span>+91 9540 311 311</span>
              </a>

              {/* Divider */}
              <div className={`w-px h-6 mx-1 ${isTransparent ? "bg-white/20" : "bg-champ-200"}`} />

              {/* Get Expert Advice CTA - Primary Action */}
              <button
                onClick={() => setModalOpen(true)}
                className={`
                  relative ml-1 px-5 py-2.5 rounded-xl text-sm font-bold
                  overflow-hidden transition-all duration-300 flex items-center gap-2
                  ${isTransparent
                    ? "bg-white text-warm-900 hover:bg-champ-100 shadow-md"
                    : "bg-primary text-white hover:bg-brand-700 shadow-[0_4px_14px_hsl(20_60%_27%/0.35)]"
                  }
                  active:scale-95
                `}
              >
                <Calendar size={16} />
                Get Expert Advice
              </button>
            </div>

            {/* Tablet/Mobile: Show icons + hamburger */}
            <div className="flex lg:hidden items-center gap-1.5">

              {/* Bell icon for saved searches (mobile) */}
              <button
                aria-label="Saved Searches"
                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isTransparent
                    ? "text-white hover:bg-white/15"
                    : "text-warm-600 hover:bg-champ-100"
                  }
                `}
              >
                <Bell size={17} />
              </button>

              {/* Get Expert Advice button (mobile - compact) */}
              <button
                onClick={() => setModalOpen(true)}
                className={`
                  hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-bold gap-1.5
                  transition-all duration-200 active:scale-95 items-center
                  ${isTransparent
                    ? "bg-white text-warm-900"
                    : "bg-primary text-white shadow-[0_4px_14px_hsl(20_60%_27%/0.30)]"
                  }
                `}
              >
                <Calendar size={12} />
                <span>Consult</span>
              </button>

              {/* Hamburger */}
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isTransparent
                    ? "text-white hover:bg-white/15"
                    : "text-warm-800 hover:bg-champ-100"
                  }
                `}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Champagne bottom border accent on scroll */}
        {!isTransparent && (
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-champ-300/60 to-transparent" />
        )}
      </header>

      {/* Mobile Drawer */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMobileOpen(false)}
      />

      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-[min(320px,85vw)] z-50
          bg-white flex flex-col
          shadow-[−8px_0_40px_hsl(20_50%_15%/0.15)]
          transition-transform duration-400 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-champ-200">
          <Image src={logo} alt="The Nestory" width={120} height={44} className="w-28 h-auto" />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-warm-600 hover:bg-champ-100 hover:text-primary transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-between
                px-4 py-3.5 rounded-xl
                text-warm-800 font-semibold text-sm
                hover:bg-champ-100 hover:text-primary
                transition-all duration-200 group
              "
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
              <ChevronRight
                size={15}
                className="text-warm-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 py-5 border-t border-champ-200 space-y-3">

          {/* Phone */}
          <a
            href="tel:+919540311311"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-champ-100 text-warm-700 text-sm font-medium hover:bg-champ-200 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone size={14} className="text-primary" />
            </div>
            +91 95403 11311
          </a>

          {/* Schedule Consultation - Primary Button */}
          <button
            onClick={() => {
              setModalOpen(true);
              setMobileOpen(false);
            }}
            className="
              w-full py-3.5 rounded-xl bg-primary text-white
              font-bold text-sm tracking-wide flex items-center justify-center gap-2
              shadow-[0_4px_16px_hsl(20_60%_27%/0.35)]
              hover:bg-brand-700 active:scale-[0.98]
              transition-all duration-200
            "
          >
            <Calendar size={16} />
            Schedule Consultation
          </button>

          {/* Saved Searches Link */}
          <button
            className="
              w-full py-3 rounded-xl bg-champ-50 text-warm-700
              font-medium text-sm flex items-center justify-center gap-2
              hover:bg-champ-100 transition-all duration-200
            "
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            <Bell size={14} />
            Saved Searches
          </button>

          {/* Brand tagline */}
          <p className="text-center text-xs text-warm-400 font-medium pt-1">
            © 2026 The Nestory. Premium Real Estate.
          </p>
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}