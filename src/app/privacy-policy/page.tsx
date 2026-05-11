// app/privacy-policy/page.tsx
"use client";

import Link from "next/link";
import {
  Shield,
  Lock,
  Bell,
  Database,
  Share2,
  Cookie,
  FileText,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Eye,
  Trash2,
  Users,
  Server,
  Building2,
  Globe,
  Scale,
  Clock,
  Sparkles,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "info",
      title: "Information We Collect",
      icon: <Database size={18} />,
      gradient: "from-brand-600 to-brand-700",
      items: [
        { label: "Personal Information", desc: "Name, email, phone number" },
        { label: "Account Data", desc: "Login and authentication data" },
        { label: "Lead Data", desc: "Lead activity, follow-ups, interactions" },
        { label: "Technical Data", desc: "Device, IP, logs" },
        { label: "Push Token", desc: "For notifications" },
      ],
    },
    {
      id: "use",
      title: "How We Use Your Information",
      icon: <Eye size={18} />,
      gradient: "from-champ-500 to-champ-600",
      items: [
        "Account management",
        "Lead tracking",
        "Notifications & alerts",
        "App improvement",
        "Security & fraud prevention",
      ],
    },
    {
      id: "push",
      title: "Push Notifications",
      icon: <Bell size={18} />,
      gradient: "from-brand-600 to-brand-700",
      desc: "We send notifications for updates, leads, and alerts. You can disable notifications anytime from device settings.",
    },
    {
      id: "security",
      title: "Authentication & Security",
      icon: <Lock size={18} />,
      gradient: "from-champ-500 to-champ-600",
      desc: "We use your email/phone to securely authenticate your account. All communication is encrypted.",
    },
    {
      id: "storage",
      title: "Data Storage",
      icon: <Server size={18} />,
      gradient: "from-brand-600 to-brand-700",
      desc: "Your data is stored securely on our servers and used only for app functionality. We do not sell your data.",
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      icon: <Share2 size={18} />,
      gradient: "from-champ-500 to-champ-600",
      items: ["Firebase Cloud Messaging (Push notifications)", "Cloud hosting services"],
    },
    {
      id: "sharing",
      title: "Data Sharing",
      icon: <Users size={18} />,
      gradient: "from-brand-600 to-brand-700",
      desc: "We only share data with authorized users or when required by law.",
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: <Clock size={18} />,
      gradient: "from-champ-500 to-champ-600",
      desc: "Data is retained only as long as necessary for operations and compliance.",
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <CheckCircle size={18} />,
      gradient: "from-brand-600 to-brand-700",
      items: ["Access your data", "Correct data", "Delete data", "Withdraw consent"],
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Shield size={18} />,
      gradient: "from-champ-500 to-champ-600",
      desc: "We use secure servers, encryption, and access control systems.",
    },
    {
      id: "cookies",
      title: "Cookies",
      icon: <Cookie size={18} />,
      gradient: "from-brand-600 to-brand-700",
      desc: "Our website may use cookies for analytics and performance.",
    },
    {
      id: "changes",
      title: "Changes to Policy",
      icon: <FileText size={18} />,
      gradient: "from-champ-500 to-champ-600",
      desc: "We may update this policy anytime. Changes will be posted here.",
    },
  ];

  return (
    <main className="min-h-screen bg-[hsl(40,40%,97%)]">
      {/* Hero Section */}
      <section 
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(135deg, #FAF7F4 0%, #EDE5DD 100%)" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-champ-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-champ-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-brand-600 text-[10px] font-bold tracking-widest uppercase">
            Legal & Compliance
            </span>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4 tracking-tight text-[#1C0F05]">
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800">
                Policy
            </span>
            </h1>

            <p className="text-[#7A6858] text-base sm:text-lg max-w-2xl mx-auto">
            Your trust is our priority. Learn how we protect and manage your data.
            </p>

            <div className="flex items-center justify-center gap-2 mt-6 text-[#A8978A] text-sm">
            <FileText size={14} />
            <span>Effective Date: July 12, 2024</span>
            </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Introduction Card */}
        <div className="bg-white rounded-2xl border border-[#EDE5DD] p-6 sm:p-8 mb-10 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-md">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0F05] mb-2">
                The Nestory – Commitment to Privacy
              </h2>
              <p className="text-[#7A6858] leading-relaxed">
                At The Nestory, we are committed to protecting your privacy. 
                This Privacy Policy applies to both our website and our mobile application. 
                We believe in transparency, and we want you to understand how we collect, 
                use, and safeguard your information.
              </p>
            </div>
          </div>
        </div>

        {/* Grid of Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="group bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.gradient} px-5 py-3 flex items-center gap-2.5`}>
                <div className="text-white/90">{section.icon}</div>
                <h3 className="font-display font-bold text-white text-sm tracking-wide">
                  {section.title}
                </h3>
              </div>

              {/* Section Content */}
              <div className="p-5">
                {section.desc && (
                  <p className="text-[#5C4A3A] text-sm leading-relaxed">{section.desc}</p>
                )}

                {section.items && Array.isArray(section.items) && (
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Sparkles size={12} className="text-champ-600 mt-0.5 flex-shrink-0" />
                        {typeof item === "string" ? (
                          <span className="text-[#5C4A3A] text-sm">{item}</span>
                        ) : (
                          <div>
                            <span className="font-semibold text-[#1C0F05] text-sm">{item.label}:</span>{" "}
                            <span className="text-[#5C4A3A] text-sm">{item.desc}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legal Compliance Section */}
        <div className="mt-10 bg-gradient-to-r from-brand-50 to-champ-50 rounded-2xl border border-[#EDE5DD] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                <Scale size={20} className="text-brand-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#1C0F05] text-lg">Legal Compliance</h3>
                <p className="text-[#7A6858] text-sm">
                  This policy complies with Indian IT Act, 2000
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EDE5DD]">
              <Globe size={14} className="text-brand-600" />
              <span className="text-xs font-medium text-[#6B5C4E]">India Jurisdiction</span>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-10 bg-white rounded-2xl border border-[#EDE5DD] overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
            <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
              <Mail size={18} /> Contact Us
            </h3>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-[#7A6858] mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please reach out to us:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD]">
                <Mail size={16} className="text-brand-600" />
                <div>
                  <p className="text-[10px] text-[#A8978A] uppercase">Email</p>
                  <a href="mailto:info@thenestory.in" className="text-sm font-medium text-[#1C0F05] hover:text-brand-600 transition-colors">
                    info@thenestory.in
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F4] border border-[#EDE5DD]">
                <Phone size={16} className="text-brand-600" />
                <div>
                  <p className="text-[10px] text-[#A8978A] uppercase">Phone</p>
                  <a href="tel:+919540311311" className="text-sm font-medium text-[#1C0F05] hover:text-brand-600 transition-colors">
                    +91 95403 11311
                  </a>
                </div>
              </div>
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

        {/* Last Updated Note */}
        <div className="mt-8 text-center">
          <p className="text-[#A8978A] text-xs flex items-center justify-center gap-1.5">
            <Clock size={11} />
            Last updated: July 12, 2024
          </p>
        </div>
      </section>
    </main>
  );
}