"use client";

import React from "react";
import { useOrg, useOrgMembers } from "../../../lib/hooks";
import { useActiveOrg } from "../../../lib/org-context";
import Skeleton from "../../../components/Skeleton";

const styles = {
  page: `max-w-2xl mx-auto`,
  title: `
    text-3xl font-bold mb-8
    text-[color:var(--color-text)]
  `,
  section: `
    mb-8
    bg-[color:var(--color-surface-1)]
    border border-[color:var(--color-border)]
    rounded-lg
    p-6
    transition-all duration-200
  `,
  sectionTitle: `
    text-xl font-semibold mb-6
    text-[color:var(--color-text)]
    pb-4
    border-b border-[color:var(--color-border)]
  `,
  fieldLabel: `
    block text-xs font-semibold uppercase tracking-wider
    text-[color:var(--color-text-muted)]
    mb-2
  `,
  fieldValue: `
    text-sm font-medium
    text-[color:var(--color-text)]
    py-2
  `,
  fieldGroup: `
    mb-4 pb-4 border-b border-[color:var(--color-border)] last:mb-0 last:pb-0 last:border-0
  `,
  membersList: `
    space-y-3
  `,
  memberItem: `
    flex items-center gap-3 p-3
    bg-[color:var(--color-surface-2)]
    border border-[color:var(--color-border)]
    rounded-md
    transition-colors duration-200
  `,
  memberAvatar: `
    w-10 h-10 rounded-full
    bg-[color:var(--color-primary-600)]
    text-white
    flex items-center justify-center
    flex-shrink-0
    font-semibold text-sm
  `,
  memberInfo: `flex-1`,
  memberName: `
    text-sm font-medium
    text-[color:var(--color-text)]
  `,
  memberEmail: `
    text-xs
    text-[color:var(--color-text-muted)]
  `,
  memberRole: `
    text-xs font-semibold uppercase
    px-2.5 py-1
    bg-[color:var(--color-surface-3)]
    text-[color:var(--color-text-muted)]
    rounded
  `,
  emptyState: `
    text-center py-8
    text-[color:var(--color-text-muted)]
  `,
};

export default function SettingsPage() {
  const { activeOrgId } = useActiveOrg();
  const { data: org, isLoading: orgLoading } = useOrg(activeOrgId ?? "");
  const { data: members, isLoading: membersLoading } = useOrgMembers(activeOrgId ?? "");

  if (!activeOrgId) {
    return (
      <div className="text-center py-16">
        <p className="text-[color:var(--color-text-muted)]">Select an organization to view settings.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      {/* Organization Settings */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Organization</h2>

        {orgLoading ? (
          <div className="space-y-4">
            <div>
              <Skeleton height={16} width={160} />
              <div className="mt-2">
                <Skeleton height={16} width={120} />
              </div>
            </div>
            <div>
              <Skeleton height={16} width={160} />
              <div className="mt-2">
                <Skeleton height={16} width={120} />
              </div>
            </div>
          </div>
        ) : org ? (
          <div className="space-y-4">
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Name</label>
              <div className={styles.fieldValue}>{org.name}</div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Slug</label>
              <div className={styles.fieldValue}>
                <code className="bg-[color:var(--color-surface-2)] px-2 py-1 rounded text-xs">
                  {org.slug}
                </code>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Plan</label>
              <div className={styles.fieldValue}>{org.plan?.name ?? "Free"}</div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Created</label>
              <div className={styles.fieldValue}>
                {new Date(org.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Members Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Members</h2>

        {membersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="rounded-full">
                  <Skeleton height={40} width={40} />
                </div>
                <div className="flex-1">
                  <Skeleton height={16} width={120} />
                  <div className="mt-1">
                    <Skeleton height={12} width={180} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className={styles.membersList}>
            {members.map((m) => (
              <div key={m.userId} className={styles.memberItem}>
                <div className={styles.memberAvatar}>
                  {(m.name ?? m.email)?.[0]?.toUpperCase() ?? "?"}
                </div>

                <div className={styles.memberInfo}>
                  <div className={styles.memberName}>{m.name ?? "—"}</div>
                  <div className={styles.memberEmail}>{m.email}</div>
                </div>

                <span className={styles.memberRole}>{m.role}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No members found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
