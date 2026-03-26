"use client";

import React from "react";
import { useOrg, useOrgMembers } from "../../../lib/hooks";
import { useActiveOrg } from "../../../lib/org-context";
import Card from "../../../components/Card";
import Skeleton from "../../../components/Skeleton";

export default function SettingsPage() {
  const { activeOrgId } = useActiveOrg();
  const { data: org, isLoading: orgLoading } = useOrg(activeOrgId ?? "");
  const { data: members, isLoading: membersLoading } = useOrgMembers(activeOrgId ?? "");

  if (!activeOrgId) {
    return (
      <div style={{ textAlign: "center", marginTop: 60, color: "var(--color-muted)" }}>
        <p>Select an organization to view settings.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

      {/* Org Info */}
      <Card style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Organization</h2>
        {orgLoading ? (
          <>
            <Skeleton height={16} width={160} />
            <div style={{ marginTop: 8 }}><Skeleton height={16} width={120} /></div>
          </>
        ) : org ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Name</span>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{org.name}</div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Slug</span>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{org.slug}</div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Plan</span>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{org.plan?.name ?? "Free"}</div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Created</span>
              <div style={{ fontSize: 14 }}>{new Date(org.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ) : null}
      </Card>

      {/* Members */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Members</h2>
        {membersLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2].map((i) => <Skeleton key={i} height={40} />)}
          </div>
        ) : members && members.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {members.map((m) => (
              <div
                key={m.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--color-primary-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {(m.name ?? m.email)?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{m.name ?? "—"}</div>
                  <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{m.email}</div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: "var(--color-surface-2)",
                    color: "var(--color-muted)",
                  }}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--color-muted)", fontSize: 13 }}>No members found.</p>
        )}
      </Card>
    </div>
  );
}
