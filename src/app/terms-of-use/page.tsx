// app/terms-of-use/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
    FileText,
    Shield,
    Scale,
    AlertCircle,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    MapPin,
    Globe,
    Clock,
    Building2,
    Users,
    Lock,
    Smartphone,
    Eye,
    Edit3,
    DollarSign,
    HeartHandshake,
    Gift,
    Zap,
    AlertTriangle,
    BookOpen,
    Briefcase,
    Home,
    Search,
    MessageCircle,
    ThumbsUp,
    Flag,
    Trash2,
    RefreshCw,
    ChevronRight,
    ExternalLink,
    Info,
    Sparkles,
} from "lucide-react";

export default function TermsOfUsePage() {
    const [activeSection, setActiveSection] = useState("acceptance");

    const sections = [
        { id: "acceptance", title: "Acceptance of Terms", icon: <CheckCircle size={16} /> },
        { id: "services", title: "Our Services", icon: <Building2 size={16} /> },
        { id: "user-responsibilities", title: "User Responsibilities", icon: <Users size={16} /> },
        { id: "listings", title: "Property Listings", icon: <Home size={16} /> },
        { id: "transactions", title: "Transactions & Payments", icon: <DollarSign size={16} /> },
        { id: "intellectual-property", title: "Intellectual Property", icon: <Lock size={16} /> },
        { id: "prohibited-conduct", title: "Prohibited Conduct", icon: <AlertTriangle size={16} /> },
        { id: "third-party", title: "Third-Party Links", icon: <ExternalLink size={16} /> },
        { id: "disclaimers", title: "Disclaimers", icon: <AlertCircle size={16} /> },
        { id: "liability", title: "Limitation of Liability", icon: <Shield size={16} /> },
        { id: "indemnification", title: "Indemnification", icon: <HeartHandshake size={16} /> },
        { id: "termination", title: "Termination", icon: <Trash2 size={16} /> },
        { id: "governing-law", title: "Governing Law", icon: <Scale size={16} /> },
        { id: "changes", title: "Changes to Terms", icon: <Edit3 size={16} /> },
        { id: "contact", title: "Contact Us", icon: <MessageCircle size={16} /> },
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
                        <FileText size={12} className="text-brand-600" />
                        <span className="text-brand-700 text-[10px] font-bold tracking-widest uppercase">
                            Legal Agreement
                        </span>
                    </div>
                    <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4 tracking-tight text-[#1C0F05]">
                        Terms of{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800">
                            Use
                        </span>
                    </h1>
                    <p className="text-[#7A6858] text-base sm:text-lg max-w-2xl mx-auto">
                        Please read these terms carefully before using The Nestory platform.
                        By accessing our services, you agree to be bound by these terms.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100">
                            <RefreshCw size={12} className="text-brand-600" />
                            <span className="text-brand-700 text-xs">Last updated: July 12, 2024</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100">
                            <Globe size={12} className="text-brand-600" />
                            <span className="text-brand-700 text-xs">Effective immediately</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-4">
                                <p className="font-display font-bold text-white text-sm flex items-center gap-2">
                                    <BookOpen size={14} /> On this page
                                </p>
                            </div>
                            <nav className="p-3 max-h-[70vh] overflow-y-auto">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all mb-1 group
                      ${activeSection === section.id
                                                ? "bg-brand-50 text-brand-700 border-l-2 border-brand-600"
                                                : "text-[#7A6858] hover:bg-[#FAF7F4] hover:text-brand-600"
                                            }`}
                                    >
                                        <span className={`text-xs ${activeSection === section.id ? "text-brand-600" : "text-[#A8978A] group-hover:text-brand-500"}`}>
                                            {section.icon}
                                        </span>
                                        <span className="text-xs font-medium flex-1">{section.title}</span>
                                        <ChevronRight size={12} className={`transition-all ${activeSection === section.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0"}`} />
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Section 1: Acceptance of Terms */}
                        <div id="acceptance" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <CheckCircle size={18} /> 1. Acceptance of Terms
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-[#7A6858] leading-relaxed">
                                    By accessing or using The Nestory website, mobile application, or any of our services
                                    (collectively, the "Platform"), you acknowledge that you have read, understood,
                                    and agree to be bound by these Terms of Use ("Terms").
                                </p>
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-amber-800 mb-1">Important Notice</p>
                                            <p className="text-xs text-amber-700">
                                                If you do not agree to these Terms, please do not use our Platform.
                                                These Terms apply to all users, including visitors, property seekers,
                                                property owners, builders, and agents.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Our Services */}
                        <div id="services" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-champ-500 to-champ-600 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Building2 size={18} /> 2. Our Services
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed mb-4">
                                    The Nestory provides a platform that connects property seekers with property owners,
                                    builders, and real estate agents. Our services include:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        "Property listings and discovery",
                                        "Project showcase and comparisons",
                                        "Lead generation and management",
                                        "Virtual property tours",
                                        "Verified property information",
                                        "Expert real estate advice",
                                    ].map((service, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-[#5C4A3A]">
                                            <Sparkles size={12} className="text-champ-600" />
                                            {service}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: User Responsibilities */}
                        <div id="user-responsibilities" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Users size={18} /> 3. User Responsibilities
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed mb-4">As a user of our Platform, you agree to:</p>
                                <ul className="space-y-3">
                                    {[
                                        "Provide accurate, complete, and current information when creating an account or listing a property",
                                        "Maintain the confidentiality of your account credentials",
                                        "Accept responsibility for all activities that occur under your account",
                                        "Notify us immediately of any unauthorized use of your account",
                                        "Comply with all applicable laws and regulations",
                                        "Use the Platform only for legitimate real estate purposes",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-[#5C4A3A]">
                                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Section 4: Property Listings */}
                        <div id="listings" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-champ-500 to-champ-600 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Home size={18} /> 4. Property Listings
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-[#7A6858] leading-relaxed">
                                    Property owners, builders, and agents who list properties on our Platform
                                    ("Listers") agree to the following:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#FAF7F4] rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={14} className="text-brand-600" />
                                            <span className="font-semibold text-[#1C0F05] text-sm">Accuracy of Information</span>
                                        </div>
                                        <p className="text-xs text-[#7A6858]">Provide true, accurate, and complete information about properties</p>
                                    </div>
                                    <div className="bg-[#FAF7F4] rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={14} className="text-brand-600" />
                                            <span className="font-semibold text-[#1C0F05] text-sm">Legal Compliance</span>
                                        </div>
                                        <p className="text-xs text-[#7A6858]">Ensure properties comply with all applicable laws and regulations</p>
                                    </div>
                                    <div className="bg-[#FAF7F4] rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={14} className="text-brand-600" />
                                            <span className="font-semibold text-[#1C0F05] text-sm">No Duplicate Listings</span>
                                        </div>
                                        <p className="text-xs text-[#7A6858]">Avoid posting duplicate or misleading property listings</p>
                                    </div>
                                    <div className="bg-[#FAF7F4] rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={14} className="text-brand-600" />
                                            <span className="font-semibold text-[#1C0F05] text-sm">Authorization</span>
                                        </div>
                                        <p className="text-xs text-[#7A6858]">Have legal authority to list and sell/lease the property</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Transactions & Payments */}
                        <div id="transactions" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <DollarSign size={18} /> 5. Transactions & Payments
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed mb-4">
                                    The Nestory facilitates connections between property seekers and listers. Please note:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                        <Info size={14} className="text-blue-600 mt-0.5" />
                                        <p className="text-xs text-blue-800">
                                            <strong className="font-semibold">No Direct Transactions:</strong> The Nestory does not
                                            process property transactions directly. All agreements and payments are between the
                                            property seeker and the lister.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                        <Shield size={14} className="text-emerald-600 mt-0.5" />
                                        <p className="text-xs text-emerald-800">
                                            <strong className="font-semibold">Verification:</strong> We strive to verify listings but
                                            recommend users conduct their own due diligence before any transaction.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Intellectual Property */}
                        <div id="intellectual-property" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-champ-500 to-champ-600 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Lock size={18} /> 6. Intellectual Property
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed mb-4">
                                    All content on The Nestory Platform, including but not limited to text, graphics, logos,
                                    images, software, and code, is the property of The Nestory or its licensors and is
                                    protected by intellectual property laws.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="border border-[#EDE5DD] rounded-xl p-3">
                                        <p className="text-xs font-semibold text-[#1C0F05] mb-1">✅ Permitted</p>
                                        <p className="text-xs text-[#7A6858]">View, share, and use Platform for personal, non-commercial purposes</p>
                                    </div>
                                    <div className="border border-red-100 bg-red-50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-red-700 mb-1">❌ Prohibited</p>
                                        <p className="text-xs text-red-600">Copy, modify, distribute, or create derivative works without permission</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 7: Prohibited Conduct */}
                        <div id="prohibited-conduct" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <AlertTriangle size={18} /> 7. Prohibited Conduct
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed mb-4">You agree NOT to:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        "Post false or misleading information",
                                        "Harass, abuse, or harm other users",
                                        "Impersonate any person or entity",
                                        "Use the Platform for any illegal activity",
                                        "Attempt to hack or disrupt our services",
                                        "Scrape or copy content without permission",
                                        "Post spam or unauthorized advertisements",
                                        "Share inappropriate or offensive content",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                                            <XCircle size={12} className="flex-shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 8: Third-Party Links */}
                        <div id="third-party" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-champ-500 to-champ-600 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <ExternalLink size={18} /> 8. Third-Party Links
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed">
                                    Our Platform may contain links to third-party websites or services that are not owned
                                    or controlled by The Nestory. We have no control over, and assume no responsibility for,
                                    the content, privacy policies, or practices of any third-party websites. You acknowledge
                                    and agree that The Nestory shall not be responsible or liable for any damage or loss
                                    caused by or in connection with the use of such third-party websites.
                                </p>
                            </div>
                        </div>

                        {/* Section 9: Disclaimers */}
                        <div id="disclaimers" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <AlertCircle size={18} /> 9. Disclaimers
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-[#1C0F05] mb-2">"AS IS" and "AS AVAILABLE"</p>
                                        <p className="text-sm text-[#7A6858]">
                                            The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. The Nestory makes
                                            no representations or warranties of any kind, express or implied.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-[#1C0F05] mb-2">No Guarantee of Results</p>
                                        <p className="text-sm text-[#7A6858]">
                                            We do not guarantee that you will find a property or successfully sell/lease your
                                            property through our Platform.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-[#1C0F05] mb-2">Information Accuracy</p>
                                        <p className="text-sm text-[#7A6858]">
                                            While we strive for accuracy, we do not warrant that property information is
                                            complete, reliable, or error-free.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 10: Limitation of Liability */}
                        <div id="liability" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-champ-500 to-champ-600 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Shield size={18} /> 10. Limitation of Liability
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                    <p className="text-sm text-red-800 leading-relaxed">
                                        To the maximum extent permitted by law, The Nestory and its affiliates, officers,
                                        employees, and agents shall not be liable for any indirect, incidental, special,
                                        consequential, or punitive damages, including without limitation, loss of profits,
                                        data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 11: Indemnification */}
                        <div id="indemnification" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <HeartHandshake size={18} /> 11. Indemnification
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed">
                                    You agree to indemnify, defend, and hold harmless The Nestory and its affiliates,
                                    officers, employees, and agents from and against any and all claims, damages, obligations,
                                    losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees)
                                    arising from your use of the Platform or your violation of these Terms.
                                </p>
                            </div>
                        </div>

                        {/* Section 12: Termination */}
                        <div id="termination" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-champ-500 to-champ-600 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Trash2 size={18} /> 12. Termination
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed mb-4">
                                    We may terminate or suspend your account and bar access to the Platform immediately,
                                    without prior notice or liability, under our sole discretion, for any reason whatsoever,
                                    including without limitation a breach of the Terms.
                                </p>
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                                    <Info size={14} className="text-amber-600 mt-0.5" />
                                    <p className="text-xs text-amber-800">
                                        Upon termination, your right to use the Platform will cease immediately.
                                        Sections that by their nature should survive termination shall survive.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 13: Governing Law */}
                        <div id="governing-law" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Scale size={18} /> 13. Governing Law
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed">
                                    These Terms shall be governed and construed in accordance with the laws of India,
                                    without regard to its conflict of law provisions. Any dispute arising under these Terms
                                    shall be subject to the exclusive jurisdiction of the courts located in Greater Noida,
                                    Uttar Pradesh, India.
                                </p>
                            </div>
                        </div>

                        {/* Section 14: Changes to Terms */}
                        <div id="changes" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-champ-500 to-champ-600 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <Edit3 size={18} /> 14. Changes to Terms
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] leading-relaxed mb-4">
                                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                                    If a revision is material, we will try to provide at least 30 days' notice prior to any
                                    new terms taking effect.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-[#A8978A]">
                                    <RefreshCw size={12} />
                                    <span>By continuing to access or use our Platform after those revisions become effective, you agree to be bound by the revised terms.</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 15: Contact Us */}
                        <div id="contact" className="bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg scroll-mt-24">
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                                <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                    <MessageCircle size={18} /> 15. Contact Us
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-[#7A6858] mb-6">
                                    If you have any questions about these Terms, please contact us:
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

                        {/* Last Updated Footer */}
                        <div className="text-center pt-4">
                            <p className="text-[#A8978A] text-xs flex items-center justify-center gap-1.5">
                                <Clock size={11} />
                                Effective Date: July 12, 2024 | Last Updated: July 12, 2024
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .scroll-mt-24 {
          scroll-margin-top: 6rem;
        }
      `}</style>
        </main>
    );
}