"use client";

import Link from "next/link";
import { Calculator, Scale, ArrowRightLeft, Ruler } from "lucide-react";

interface ToolCardProps {
  title: string;
  desc: string;
  href: string;
  icon: string;
}

export default function ToolCard({ title, desc, href, icon }: ToolCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "budget":
        return <Calculator size={32} />;
      case "emi":
        return <Calculator size={32} />;
      case "compare":
        return <Scale size={32} />;
      case "area":
        return <Ruler size={32} />;
      default:
        return <Calculator size={32} />;
    }
  };

  return (
    <Link href={href}>
     <div
      
      className="group relative bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-8 overflow-hidden flex flex-col items-center text-center"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition">
        {getIcon()}
      </div>

      <h3 className="text-lg font-semibold text-secondary group-hover:text-primary transition">
        {title}
      </h3>

      <p className="text-muted-foreground text-sm mt-2">
        {desc}
      </p>
    </div>
    </Link>
  
  );
}
