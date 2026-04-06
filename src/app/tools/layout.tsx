import Breadcrumb from "@/components/tools/Breadcrumb";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Breadcrumb />
        {children}
      </div>
    </div>
  );
}
