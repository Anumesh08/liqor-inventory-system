"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "@mui/icons-material";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumbs based on pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/dashboard" },
    ];

    if (paths.length === 0) return breadcrumbs;

    // Handle admin routes
    if (paths[0] === "dashboard") {
      breadcrumbs.push({ label: "Dashboard" });
    } else if (paths[0] === "products") {
      breadcrumbs.push({ label: "Product Management" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
          {crumb.href && index < breadcrumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="hover:text-blue-600 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
