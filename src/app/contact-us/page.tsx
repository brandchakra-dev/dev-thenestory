"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  ArrowUpRight, Sparkles, Building2, Navigation,
  MessageCircle, Facebook, Instagram, Youtube,
  ChevronRight, Star
} from "lucide-react";

// ─── Contact Information ──────────────────────────────────────
const contactInfo = [
  {
    icon: <Phone size={18} />,
    title: "Call Us",
    details: ["+91 9540 3113 11"],
    href: "tel:+919540311311",
    description: "Mon-Sat, 10 AM to 7 PM"
  },
  {
    icon: <Mail size={18} />,
    title: "Email Us",
    details: ["info@thenestory.in", "support@thenestory.in"],
    href: "mailto:info@thenestory.in",
    description: "Response within 24 hours"
  },
  {
    icon: <MapPin size={18} />,
    title: "Head Office",
    details: ["Office No. 106 Tower D&E, Golden I,", "Techzone 4, Amrapali Leisure Valley,", "Greater Noida, UP 201009"],
    href: "#",
    description: "Visit us by appointment"
  }
];

const socialLinks = [
  { icon: <Facebook size={18} />, label: "Facebook", href: "https://www.facebook.com/thenestoryllp/", color: "#1877F2" },
  { icon: <Instagram size={18} />, label: "Instagram", href: "https://www.instagram.com/the_nestory_official/", color: "#E1306C" },
  { icon: <Youtube size={18} />, label: "YouTube", href: "https://www.youtube.com/@the_nestory", color: "#FF0000" },
  { icon: <MessageCircle size={18} />, label: "WhatsApp", href: "https://wa.me/919540311311", color: "#25D366" }
];

const faqs = [
  {
    question: "What areas do you serve?",
    answer: "We primarily serve NCR including Noida, Greater Noida, Gurugram, Ghaziabad, Faridabad, and Delhi. We also assist clients in Yamuna Expressway and Dwarka regions."
  },
  {
    question: "Is your consultation free?",
    answer: "Yes, your first consultation with our experts is completely free. We believe in building trust before any commitment."
  },
  {
    question: "How do you verify properties?",
    answer: "We conduct thorough due diligence including legal verification, title checks, RERA validation, and physical site inspection before recommending any property."
  },
  {
    question: "What is your service charge?",
    answer: "Our charges are completely transparent with no hidden fees. We share the complete fee structure during the first consultation based on your requirements."
  }
];

// ─── Form State ──────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// ─── FAQ Accordion Component ─────────────────────────────────
function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#EDE5DD] last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 text-left flex items-center justify-between group"
      >
        <span className="font-display font-semibold text-[#1C0F05] group-hover:text-[#6B3A1F] transition-colors">
          {question}
        </span>
        <ChevronRight
          size={16}
          className={`text-[#C9A84C] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-32 pb-4' : 'max-h-0'}`}>
        <p className="text-[#7A6858] text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ─── Main Contact Page ───────────────────────────────────────
export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', city: '', message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const [openFAQ, setOpenFAQ] = useState<number | null>(0);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };



  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      e.name = "Enter your full name.";
    }

    if (!formData.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = "Enter a valid email address.";
    }

    const digits = formData.phone.replace(/\D/g, "");
    if (!digits) {
      e.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(digits)) {
      e.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.message.trim()) {
      e.message = "Please enter your message.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/consultations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            mobile: formData.phone.replace(/\D/g, ""),
            email: formData.email.trim(),
            city: formData.city.trim(),
            message: formData.message.trim(),
            source: "contact-form",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Backend field-level errors
        if (data.errors) setErrors(data.errors);
        setServerError(data.message || "Something went wrong.");
        return;
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", city: "", message: "" });
      setErrors({});
      setTimeout(() => setIsSubmitted(false), 5000);

    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="bg-[hsl(40,40%,97%)]">

      {/* ══ HERO SECTION ══ */}
      <section
        className="relative overflow-hidden min-h-[40vh] flex items-center"
        style={{ background: "linear-gradient(135deg, #FAF7F4 0%, #EDE5DD 100%)" }}
      >
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#6B3A1F]/[0.03] blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#C9A84C]/[0.03] blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl text-center mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles size={14} className="text-[#C9A84C]" />
              <span className="text-[11px] font-bold text-[#6B3A1F] uppercase tracking-[0.2em]">
                Get In Touch
              </span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
              style={{ color: "#1C0F05" }}>
              Let's Start a
              <span className="italic block text-[#6B3A1F] mt-2">Conversation</span>
            </h1>
            <p className="text-[#5A4A3A] text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
              Have questions about buying a home? Need expert advice? Our team is here to help. Reach out to us anytime.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      </section>

      {/* ══ CONTACT GRID SECTION ══ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Cards */}
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #EDE5DD",
                  boxShadow: "0 4px 12px rgba(107,58,31,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-[#6B3A1F]"
                  style={{ background: "rgba(107,58,31,0.08)", color: "#6B3A1F" }}
                >
                  {info.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-[#1C0F05] mb-2">{info.title}</h3>
                {info.details.map((line, i) => (
                  <p key={i} className="text-[#5A4A3A] text-sm">{line}</p>
                ))}
                <p className="text-[#A8978A] text-xs mt-3">{info.description}</p>
                <a
                  href={info.href}
                  className="inline-flex items-center gap-1 mt-4 text-[#C9A84C] text-xs font-semibold hover:gap-2 transition-all"
                >
                  Get in touch <ArrowUpRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FORM + MAP SECTION ══ */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left - Contact Form */}
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EDE5DD",
                boxShadow: "0 4px 20px rgba(107,58,31,0.08)",
              }}
            >
              <div className="mb-6">
                <h2 className="font-display font-bold text-2xl text-[#1C0F05]">Send us a Message</h2>
                <p className="text-[#7A6858] text-sm mt-1">We'll get back to you within 24 hours</p>
              </div>

              {serverError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {serverError}
                  </div>
                )}

                {isSubmitted && (
                  <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-700 text-sm">Thank you! We'll contact you soon.</span>
                  </div>
                )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-[#1C0F05] text-sm font-semibold mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:border-[#C9A84C] ${errors.name ? "border-red-400 bg-red-50" : ""
                        }`}
                      style={!errors.name ? { borderColor: "#EDE5DD", background: "#FAF7F4" } : {}}
                      placeholder="Please Enter Your Name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-[#1C0F05] text-sm font-semibold mb-1.5">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:border-[#C9A84C] ${errors.email ? "border-red-400 bg-red-50" : ""
                        }`}
                      style={!errors.email ? { borderColor: "#EDE5DD", background: "#FAF7F4" } : {}}
                      placeholder="Please Enter Your Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone field */}
                  <div>
                    <label className="block text-[#1C0F05] text-sm font-semibold mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:border-[#C9A84C] ${errors.phone ? "border-red-400 bg-red-50" : ""
                        }`}
                      style={!errors.phone ? { borderColor: "#EDE5DD", background: "#FAF7F4" } : {}}
                      placeholder="+91 9540 311 311"
                      maxLength={15}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* City — no validation required */}
                  <div>
                    <label className="block text-[#1C0F05] text-sm font-semibold mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:border-[#C9A84C]"
                      style={{ borderColor: "#EDE5DD", background: "#FAF7F4" }}
                      placeholder="Enter City"
                    />
                  </div>
                </div>

               {/* Message field */}
                <div>
                  <label className="block text-[#1C0F05] text-sm font-semibold mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:border-[#C9A84C] resize-none ${
                      errors.message ? "border-red-400 bg-red-50" : ""
                    }`}
                    style={!errors.message ? { borderColor: "#EDE5DD", background: "#FAF7F4" } : {}}
                    placeholder="Tell us about your requirements..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
                    transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  style={{
                    background: "linear-gradient(135deg, #6B3A1F, #3B1D0D)",
                    color: "#E8D5B0",
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={14} />
                </button>
              </form>
            </div>

            {/* Right - Map & Social */}
            <div className="space-y-6">
              {/* Map Embed */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid #EDE5DD",
                  boxShadow: "0 4px 12px rgba(107,58,31,0.06)",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.29456238505!2d77.43268307458656!3d28.590938785969993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef1152dc4ccd%3A0x794c8cd1e56b078c!2sBrand%20Chakra%20LLP!5e0!3m2!1sen!2sin!4v1778053402865!5m2!1sen!2sin"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nestory Office Location"
                />
              </div>

              {/* Branch Office */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #EDE5DD",
                  boxShadow: "0 4px 12px rgba(107,58,31,0.06)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(107,58,31,0.08)", color: "#6B3A1F" }}>
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#1C0F05]">Head Office</h3>
                    <p className="text-[#5A4A3A] text-sm mt-1">
                      Office No. 106 Tower D&E, Golden I, Techzone 4, Amrapali Leisure Valley, Greater Noida, Uttar Pradesh 201009
                    </p>
                    <a
                      href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.29456238505!2d77.43268307458656!3d28.590938785969993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef1152dc4ccd%3A0x794c8cd1e56b078c!2sBrand%20Chakra%20LLP!5e0!3m2!1sen!2sin!4v1778053402865!5m2!1sen!2sin"
                      className="inline-flex items-center gap-1 mt-3 text-[#C9A84C] text-xs font-semibold hover:gap-2 transition-all"
                    >
                      Get Directions <Navigation size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Connect */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #FAF7F4 0%, #EDE5DD 100%)",
                  border: "1px solid #EDE5DD",
                }}
              >
                <h3 className="font-display font-bold text-lg text-[#1C0F05] mb-4">Connect With Us</h3>
                <div className="flex items-center justify-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        background: "#FFFFFF",
                        color: social.color,
                        border: "1px solid #EDE5DD",
                      }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ SECTION ══ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star size={14} className="text-[#C9A84C]" />
              <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">FAQs</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-[#1C0F05]">Frequently Asked Questions</h2>
            <p className="text-[#7A6858] mt-3">Find quick answers to common questions</p>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EDE5DD",
              boxShadow: "0 4px 20px rgba(107,58,31,0.06)",
            }}
          >
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === idx}
                onToggle={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section className="py-16 lg:py-20"
        style={{ background: "linear-gradient(135deg, #1C0F05 0%, #3B1D0D 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-[#D4C4B0] text-lg mb-8">
            Call us directly for urgent inquiries or to schedule a site visit.
          </p>
          <a
            href="tel:+919540311311"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm
              transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
              color: "#1C0F05",
            }}
          >
            <Phone size={14} /> Call +91 9540 311 311
          </a>
        </div>
      </section>

    </main>
  );
}