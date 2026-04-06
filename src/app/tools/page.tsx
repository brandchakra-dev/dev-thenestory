import Link from "next/link";

export const metadata = {
  title: "Real Estate Tools | TheNestory",
  description: "Use smart tools like EMI calculator, budget calculator and more.",
};

const tools = [
  {
    title: "EMI Calculator",
    desc: "Calculate your monthly home loan EMI instantly.",
    href: "/tools/emi-calculator",
  },
  {
    title: "Budget Calculator",
    desc: "Check how much property you can afford.",
    href: "/tools/budget-calculator",
  },
  {
    title: "Area Converter",
    desc: "Convert square feet, yards and meters easily.",
    href: "/tools/area-converter",
  },
  {
    title: "Compare Projects",
    desc: "Compare property price, features and location.",
    href: "/tools/compare-projects",
  },
];

export default function ToolsDashboard() {
  return (
    <>
      {/* Heading */}
      <div className="py-20">
        <h1 className="text-4xl font-bold text-secondary">
          TheNestory <span className="text-primary">Tools</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Smart calculators and comparison tools to help you make confident
          real estate decisions.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {tools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
          >
            {/* Accent Top Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

            {/* Background Hover Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-primary/5" />

            <h3 className="text-lg font-semibold text-secondary group-hover:text-primary transition">
              {tool.title}
            </h3>

            <p className="text-muted-foreground text-sm mt-3">
              {tool.desc}
            </p>

            <div className="mt-6 text-primary text-sm font-medium group-hover:translate-x-1 transition">
              Explore →
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
