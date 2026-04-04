"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useGenerations, useGeneration } from "../../../../../lib/hooks";
import type { GenerationSummary, Artifact } from "../../../../../lib/api";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";
import Skeleton from "../../../../../components/Skeleton";
import Modal from "../../../../../components/Modal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

const STATUS_COLORS: Record<string, string> = {
  completed: "#16a34a",
  failed: "#dc2626",
  pending: "#d97706",
  running: "#2563eb",
};

export default function GenerationsPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useGenerations(orgId, projectId, { status: statusFilter || undefined });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Generation History</h1>
        <p style={{ color: "var(--color-muted)", fontSize: 14, margin: "4px 0 0" }}>
          All AI generations run in this project.
        </p>
      </div>

      {/* Status Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["", "completed", "failed", "pending"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              border: `1px solid ${statusFilter === s ? "var(--color-primary-600)" : "var(--color-border)"}`,
              background: statusFilter === s ? "var(--color-primary-600)" : "transparent",
              color: statusFilter === s ? "#fff" : "var(--color-text)",
              fontWeight: statusFilter === s ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {s === "" ? "All" : s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => <Card key={i} style={{ padding: 20 }}><Skeleton height={48} /></Card>)}
        </div>
      ) : !data?.items.length ? (
        <Card style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "var(--color-muted)" }}>No generations yet.</p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.items.map((g) => (
            <GenerationRow key={g.id} generation={g} onClick={() => setSelectedId(g.id)} />
          ))}
        </div>
      )}

      {/* Detail Drawer/Modal */}
      {selectedId && (
        <GenerationDetailModal
          orgId={orgId}
          projectId={projectId}
          generationId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function GenerationRow({ generation, onClick }: { generation: GenerationSummary; onClick: () => void }) {
  const statusColor = STATUS_COLORS[generation.status] ?? "var(--color-muted)";
  const duration =
    generation.startedAt && generation.finishedAt
      ? ((new Date(generation.finishedAt).getTime() - new Date(generation.startedAt).getTime()) / 1000).toFixed(1) + "s"
      : null;

  return (
    <Card
      style={{ padding: "14px 18px", cursor: "pointer" }}
      onClick={onClick}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8, height: 8, borderRadius: "50%", background: statusColor,
                display: "inline-block", flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              {generation.jobType || "generation"}
            </span>
            <span style={{ fontSize: 12, color: "var(--color-muted)", textTransform: "capitalize" }}>
              {generation.status}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4, paddingLeft: 18 }}>
            {new Date(generation.createdAt).toLocaleString()}
            {duration && ` · ${duration}`}
            {` · ${generation.artifactCount} artifact${generation.artifactCount !== 1 ? "s" : ""}`}
          </div>
          {generation.error && (
            <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4, paddingLeft: 18 }}>
              {generation.error}
            </div>
          )}
        </div>
        <span style={{ fontSize: 18, color: "var(--color-muted)" }}>›</span>
      </div>
    </Card>
  );
}

function GenerationDetailModal({
  orgId,
  projectId,
  generationId,
  onClose,
}: {
  orgId: string;
  projectId: string;
  generationId: string;
  onClose: () => void;
}) {
  const { data, isLoading } = useGeneration(orgId, projectId, generationId);

  return (
    <Modal open onClose={onClose} title="Generation Detail">
      {isLoading || !data ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton height={20} width={200} />
          <Skeleton height={120} />
        </div>
      ) : (
        <div>
          {/* Status + meta */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <MetaPill label="Status" value={data.status} color={STATUS_COLORS[data.status]} />
            <MetaPill label="Job Type" value={data.jobType || "—"} />
            {data.startedAt && data.finishedAt && (
              <MetaPill
                label="Duration"
                value={
                  ((new Date(data.finishedAt).getTime() - new Date(data.startedAt).getTime()) / 1000).toFixed(1) + "s"
                }
              />
            )}
          </div>

          {/* Template info */}
          {data.templateVersion && (
            <div style={{ padding: 12, borderRadius: 6, border: "1px solid var(--color-border)", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>Template</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{data.templateVersion.template.name}</div>
              <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Version {data.templateVersion.version}</div>
            </div>
          )}

          {/* Error */}
          {data.error && (
            <div style={{ padding: 12, borderRadius: 6, background: "#fef2f2", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
              {data.error}
            </div>
          )}

          {/* Artifacts */}
          {data.artifacts.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                Artifacts ({data.artifacts.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.artifacts.map((a) => (
                  <ArtifactRow key={a.id} artifact={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function MetaPill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 11, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: color ?? "var(--color-text)" }}>{value}</span>
    </div>
  );
}

function ArtifactRow({ artifact }: { artifact: Artifact }) {
  const isImage = artifact.type === "image";
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
        borderRadius: 6, border: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: 4, overflow: "hidden",
          background: "var(--color-surface-alt, #f3f4f6)", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${BACKEND_URL}${artifact.downloadUrl}`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 20 }}>📄</span>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>{artifact.type}</div>
        <div style={{ fontSize: 11, color: "var(--color-muted)" }}>
          v{artifact.version} · {new Date(artifact.createdAt).toLocaleString()}
        </div>
      </div>
      <a
        href={`${BACKEND_URL}${artifact.downloadUrl}`}
        download
        style={{ textDecoration: "none" }}
      >
        <Button variant="secondary" style={{ padding: "4px 10px", fontSize: 12 }}>Download</Button>
      </a>
    </div>
  );
}
