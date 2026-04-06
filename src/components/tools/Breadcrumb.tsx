"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-primary">Home</Link>

      {segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        return (
          <span key={index}>
            {" / "}
            <Link href={path} className="capitalize hover:text-primary">
              {segment.replace("-", " ")}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
