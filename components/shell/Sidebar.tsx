"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useOrgs, useProjects } from "../../lib/hooks";
import { useActiveOrg } from "../../lib/org-context";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: orgs } = useOrgs();
  const { activeOrgId, setActiveOrgId } = useActiveOrg();
  const { data: projects } = useProjects(activeOrgId ?? "");

  // Auto-select first org if none selected
  React.useEffect(() => {
    if (!activeOrgId && orgs && orgs.length > 0) {
      setActiveOrgId(orgs[0].id);
    }
  }, [activeOrgId, orgs, setActiveOrgId]);

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: dashboardIcon },
    { href: "/settings", label: "Settings", icon: settingsIcon },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="var(--color-primary-600)" />
          <text x="7" y="20" fill="#fff" fontSize="14" fontWeight="700">A</text>
        </svg>
        <span className="sidebar__brand-text">Aspire Studio</span>
      </div>

      {/* Org Switcher */}
      <div className="sidebar__section">
        <select
          className="sidebar__org-select"
          value={activeOrgId ?? ""}
          onChange={(e) => setActiveOrgId(e.target.value || null)}
        >
          <option value="">Select workspace…</option>
          {orgs?.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar__link ${pathname === item.href ? "sidebar__link--active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Projects */}
      {activeOrgId && (
        <div className="sidebar__section">
          <div className="sidebar__section-header">
            <span>Projects</span>
            <Link href="/projects/new" className="sidebar__add-btn" title="New project">
              +
            </Link>
          </div>
          <div className="sidebar__project-list">
            {projects?.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`sidebar__link sidebar__link--sub ${pathname === `/projects/${p.id}` ? "sidebar__link--active" : ""}`}
              >
                <span className="sidebar__project-dot" />
                {p.name}
              </Link>
            ))}
            {projects?.length === 0 && (
              <p className="sidebar__empty">No projects yet</p>
            )}
          </div>
        </div>
      )}

      {/* User */}
      <div className="sidebar__footer">
        <UserButton />
      </div>
    </aside>
  );
}

/* Inline SVG icons */
const dashboardIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const settingsIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
