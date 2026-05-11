
"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Cookie,
    Settings,
    Shield,
    Globe,
    Mail,
    Phone,
    MapPin,
    CheckCircle,
    XCircle,
    Info,
    RefreshCw,
    Database,
    ShoppingCart,
    BarChart3,
    Target,
    Users,
    Clock,
    Sparkles,
    ChevronRight,
    ExternalLink,
    AlertCircle,
    Sliders,
    Activity,
    FileText,
    Smartphone,
} from "lucide-react";

export default function CookiesPolicyPage() {
    const [activeTab, setActiveTab] = useState<"essential" | "analytics" | "marketing" | "preferences">("essential");

    const cookieCategories = [
        {
            id: "essential",
            name: "Strictly Necessary Cookies",
            icon: <Shield size={16} />,
            color: "brand",
            description: "These cookies are essential for the website to function properly. They enable basic features like page navigation, security, and accessibility.",
            examples: ["Authentication", "Security tokens", "Session management", "Load balancing"],
            duration: "Session - 1 year",
            required: true,
        },
        {
            id: "analytics",
            name: "Performance & Analytics Cookies",
            icon: <BarChart3 size={16} />,
            color: "champ",
            description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
            examples: ["Page views", "Bounce rate", "Time on site", "User flow tracking"],
            duration: "Up to 2 years",
            required: false,
        },
        {
            id: "marketing",
            name: "Functional & Marketing Cookies",
            icon: <Target size={16} />,
            color: "brand",
            description: "These cookies enable personalized advertisements and marketing campaigns based on your browsing behavior.",
            examples: ["Ad retargeting", "Social media integration", "Email campaign tracking", "Personalized offers"],
            duration: "Up to 2 years",
            required: false,
        },
        {
            id: "preferences",
            name: "Preference Cookies",
            icon: <Sliders size={16} />,
            color: "champ",
            description: "These cookies remember your preferences and settings to provide a personalized experience.",
            examples: ["Language preference", "Currency selection", "Saved filters", "Theme settings"],
            duration: "Up to 1 year",
            required: false,
        },
    ];

    const thirdPartyCookies = [
        { name: "Google Analytics", purpose: "Website analytics and behavior tracking", provider: "Google", policy: "https://policies.google.com/privacy" },
        { name: "Firebase", purpose: "Authentication and real-time database", provider: "Google", policy: "https://firebase.google.com/support/privacy" },
        { name: "Facebook Pixel", purpose: "Ad targeting and conversion tracking", provider: "Meta", policy: "https://www.facebook.com/privacy/policy" },
        { name: "Google Ads", purpose: "Personalized advertising campaigns", provider: "Google", policy: "https://ads.google.com/privacy" },
    ];

    return (
        <main className="min-h-screen bg-[hsl(40,40%,97%)]">
            {/* Hero Section */}
            <section
                className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
                style={{ background: "linear-gradient(135deg, #FAF7F4 0%, #EDE5DD 100%)" }}
            >
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-champ-300 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-champ-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-brand-50 border border-brand-100">
                        <Cookie size={12} className="text-brand-600" />
                        <span className="text-brand-700 text-[10px] font-bold tracking-widest uppercase">
                            Your Privacy Matters
                        </span>
                    </div>
                    <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4 tracking-tight text-[#1C0F05]">
                        Cookies{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800">
                            Policy
                        </span>
                    </h1>
                    <p className="text-[#7A6858] text-base sm:text-lg max-w-2xl mx-auto">
                        We use cookies to enhance your browsing experience, analyze site traffic,
                        and personalize content. Learn how we use cookies and your choices.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100">
                            <RefreshCw size={12} className="text-brand-600" />
                            <span className="text-brand-700 text-xs">Last updated: July 12, 2024</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100">
                            <Globe size={12} className="text-brand-600" />
                            <span className="text-brand-700 text-xs">Global Compliance</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

                {/* What are Cookies? Card */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] p-6 sm:p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Cookie size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0F05] mb-3">
                                What Are Cookies?
                            </h2>
                            <p className="text-[#7A6858] leading-relaxed mb-4">
                                Cookies are small text files that websites place on your device (computer, tablet, or mobile)
                                as you browse. They are widely used to make websites work more efficiently,
                                provide a better user experience, and give website owners valuable information.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100">
                                    <Info size={12} className="text-brand-600" />
                                    <span className="text-xs font-medium text-brand-700">First-party cookies</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-champ-50 border border-champ-100">
                                    <Globe size={12} className="text-champ-600" />
                                    <span className="text-xs font-medium text-champ-700">Third-party cookies</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-100 border border-warm-200">
                                    <Database size={12} className="text-warm-600" />
                                    <span className="text-xs font-medium text-warm-700">Session vs Persistent</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cookie Categories with Tabs */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden mb-8 shadow-lg">
                    <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                        <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                            <Settings size={18} /> Manage Cookie Preferences
                        </h3>
                        <p className="text-champ-200/80 text-sm mt-1">
                            You can control and manage cookies in various ways. Please note that removing or blocking
                            cookies may impact your user experience.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-[#EDE5DD] overflow-x-auto bg-[#FAF7F4]">
                        {cookieCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id as any)}
                                className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all relative
                  ${activeTab === cat.id
                                        ? `text-${cat.color === 'brand' ? 'brand' : 'champ'}-600 border-b-2 border-${cat.color === 'brand' ? 'brand' : 'champ'}-500`
                                        : 'text-[#A8978A] hover:text-[#6B5C4E]'
                                    }`}
                            >
                                {cat.icon}
                                {cat.name}
                                {cat.required && (
                                    <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                                        Required
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 sm:p-8">
                        {cookieCategories.map((cat) => (
                            <div key={cat.id} className={activeTab === cat.id ? "block" : "hidden"}>
                                <div className="mb-4">
                                    <h4 className={`font-bold text-lg text-[#1C0F05] mb-2 flex items-center gap-2`}>
                                        {cat.icon}
                                        {cat.name}
                                    </h4>
                                    <p className="text-[#7A6858] text-sm leading-relaxed">{cat.description}</p>
                                </div>

                                <div className="bg-[#FAF7F4] rounded-xl p-4 mb-4">
                                    <p className="text-xs font-semibold text-[#A8978A] uppercase mb-2">Examples:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.examples.map((ex, i) => (
                                            <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#EDE5DD] text-[#5C4A3A]">
                                                {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                    <div className="flex items-center gap-2 text-xs text-[#A8978A]">
                                        <Clock size={12} />
                                        <span>Duration: {cat.duration}</span>
                                    </div>
                                    {!cat.required && (
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <span className="text-xs text-[#7A6858]">Enable/Disable</span>
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-10 h-5 bg-[#EDE5DD] rounded-full peer peer-checked:bg-brand-600 transition-all"></div>
                                                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Third-Party Cookies */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] p-6 sm:p-8 mb-8 shadow-lg">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-champ-100 flex items-center justify-center flex-shrink-0">
                            <Users size={18} className="text-champ-700" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-xl text-[#1C0F05]">Third-Party Cookies</h3>
                            <p className="text-[#7A6858] text-sm mt-1">
                                We use trusted third-party services that may place cookies on your device.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAF7F4] border-b border-[#EDE5DD]">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-bold text-[#A8978A] uppercase">Service</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#A8978A] uppercase">Purpose</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#A8978A] uppercase">Provider</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#A8978A] uppercase">Privacy Policy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5EFE8]">
                                {thirdPartyCookies.map((cookie, idx) => (
                                    <tr key={idx} className="hover:bg-[#FAF7F4] transition-colors">
                                        <td className="px-4 py-3 text-sm font-semibold text-[#1C0F05]">{cookie.name}</td>
                                        <td className="px-4 py-3 text-sm text-[#7A6858]">{cookie.purpose}</td>
                                        <td className="px-4 py-3 text-sm text-[#7A6858]">{cookie.provider}</td>
                                        <td className="px-4 py-3">
                                            <a href={cookie.policy} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                                                View Policy <ExternalLink size={10} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* How to Control Cookies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-brand-50 to-transparent rounded-2xl border border-[#EDE5DD] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                                <Settings size={18} className="text-brand-700" />
                            </div>
                            <h3 className="font-display font-bold text-[#1C0F05] text-lg">Browser Settings</h3>
                        </div>
                        <p className="text-[#7A6858] text-sm mb-4">
                            Most web browsers allow you to control cookies through their settings. You can:
                        </p>
                        <ul className="space-y-2">
                            {[
                                "View cookies stored on your device",
                                "Block all or third-party cookies",
                                "Delete specific or all cookies",
                                "Set preferences for specific websites",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[#5C4A3A]">
                                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-[#EDE5DD]">
                            <p className="text-xs text-[#A8978A]">
                                <strong>Popular browsers:</strong> Chrome, Firefox, Safari, Edge, Opera
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-champ-50 to-transparent rounded-2xl border border-[#EDE5DD] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-champ-100 flex items-center justify-center">
                                <Smartphone size={18} className="text-champ-700" />
                            </div>
                            <h3 className="font-display font-bold text-[#1C0F05] text-lg">Mobile Devices</h3>
                        </div>
                        <p className="text-[#7A6858] text-sm mb-4">
                            On mobile devices, you can control cookies through:
                        </p>
                        <ul className="space-y-2">
                            {[
                                "Device settings → Privacy → Tracking",
                                "Browser app settings → Privacy",
                                "Limit Ad Tracking (iOS) / Opt out of Ads Personalization (Android)",
                                "Reset Advertising ID",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[#5C4A3A]">
                                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Consent Banner Info */}
                <div className="bg-gradient-to-r from-amber-50 to-warm-50 rounded-2xl border border-amber-200 p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={18} className="text-amber-700" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-[#1C0F05] text-lg mb-2">Cookie Consent Banner</h3>
                            <p className="text-[#7A6858] text-sm leading-relaxed mb-3">
                                When you first visit our website, you will see a cookie banner that allows you to:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EDE5DD] text-xs text-[#6B5C4E]">
                                    Accept all cookies
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EDE5DD] text-xs text-[#6B5C4E]">
                                    Reject non-essential cookies
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EDE5DD] text-xs text-[#6B5C4E]">
                                    Customize preferences
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                        <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                            <Mail size={18} /> Have Questions About Cookies?
                        </h3>
                    </div>
                    <div className="p-6 sm:p-8">
                        <p className="text-[#7A6858] mb-6">
                            If you have any questions about our use of cookies or need help managing your preferences,
                            please don't hesitate to contact us:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <a href="mailto:info@thenestory.in"
                                className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD] hover:border-brand-300 transition-all group">
                                <Mail size={16} className="text-brand-600 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-[10px] text-[#A8978A] uppercase">Email</p>
                                    <p className="text-sm font-medium text-[#1C0F05]">info@thenestory.in</p>
                                </div>
                            </a>
                            <a href="tel:+919540311311"
                                className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD] hover:border-brand-300 transition-all group">
                                <Phone size={16} className="text-brand-600 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-[10px] text-[#A8978A] uppercase">Phone</p>
                                    <p className="text-sm font-medium text-[#1C0F05]">+91 95403 11311</p>
                                </div>
                            </a>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD]">
                                <MapPin size={16} className="text-brand-600" />
                                <div>
                                    <p className="text-[10px] text-[#A8978A] uppercase">Address</p>
                                    <p className="text-sm text-[#1C0F05]">Office No. 106 Tower D&E, Golden I, Techzone 4, Amrapali Leisure Valley, Greater Noida, Uttar Pradesh 201009</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disclosure Note */}
                <div className="mt-8 text-center">
                    <p className="text-[#A8978A] text-xs flex items-center justify-center gap-1.5">
                        <FileText size={11} />
                        This Cookies Policy is part of our broader Privacy Policy
                    </p>
                </div>
            </section>

            <style jsx>{`
        .animation-delay-100 {
          animation-delay: 100ms;
        }
      `}</style>
        </main>
    );
}