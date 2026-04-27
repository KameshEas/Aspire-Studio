"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const TABS = [
  { href: "", label: "Overview" },
  { href: "/templates", label: "Templates" },
  { href: "/studio", label: "Studio" },
  { href: "/artifacts", label: "Artifacts" },
  { href: "/generations", label: "History" },
];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const base = `/projects/${params.projectId}`;

  return (
    <div>
      <nav className="project-tabs">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`;
          const isActive =
            tab.href === ""
              ? pathname === base
              : pathname.startsWith(href);
          return (
            <Link
              key={tab.href}
              href={href}
              className={`project-tabs__tab${isActive ? " project-tabs__tab--active" : ""}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
