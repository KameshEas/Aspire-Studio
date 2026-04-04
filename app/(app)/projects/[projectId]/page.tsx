"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "../../../../lib/hooks";
import { useActiveOrg } from "../../../../lib/org-context";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import Skeleton from "../../../../components/Skeleton";

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const { activeOrgId } = useActiveOrg();
  const { data: project, isLoading } = useProject(activeOrgId ?? "", params.projectId);

  if (isLoading || !project) {
    return (
      <div>
        <Skeleton height={28} width={200} />
        <div style={{ marginTop: 16 }}><Skeleton height={16} width={300} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} style={{ padding: 20 }}><Skeleton height={40} /></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{project.name}</h1>
          {project.description && (
            <p style={{ color: "var(--color-muted)", fontSize: 14, margin: "4px 0 0" }}>
              {project.description}
            </p>
          )}
        </div>
        <Button variant="secondary">Settings</Button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Generations" value={project.generationCount ?? 0} />
        <StatCard label="Assets" value={project.assetCount ?? 0} />
        <StatCard label="Deployments" value={project.deploymentCount ?? 0} />
        <StatCard label="Members" value={project.members?.length ?? 0} />
      </div>

      {/* Phase 2 Navigation */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Studio</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        <NavCard
          icon="📝"
          label="Templates"
          description="Manage prompt templates"
          onClick={() => router.push(`/projects/${params.projectId}/templates`)}
        />
        <NavCard
          icon="🖼️"
          label="Artifacts"
          description="Browse generated outputs"
          onClick={() => router.push(`/projects/${params.projectId}/artifacts`)}
        />
        <NavCard
          icon="🕒"
          label="History"
          description="View all generations"
          onClick={() => router.push(`/projects/${params.projectId}/generations`)}
        />
      </div>

      {/* Members */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Team</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {project.members?.map((m) => (
          <Card key={m.userId} style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
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
              }}
            >
              {(m.name ?? m.email)?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{m.name ?? m.email}</div>
              <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{m.email}</div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              {m.role}
            </span>
          </Card>
        ))}
      </div>

      {/* Coming Soon Placeholder */}
      <div style={{ marginTop: 40, textAlign: "center", color: "var(--color-muted)" }}>
        <p style={{ fontSize: 14 }}>
          Deployment panels and advanced analytics are coming in Phase 3+.
        </p>
      </div>
    </div>
  );
}

function NavCard({ icon, label, description, onClick }: { icon: string; label: string; description: string; onClick: () => void }) {
  return (
    <Card
      style={{ padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}
      onClick={onClick}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2 }}>{description}</div>
      </div>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card style={{ padding: "16px 20px" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text)" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2 }}>{label}</div>
    </Card>
  );
}
