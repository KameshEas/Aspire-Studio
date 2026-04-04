"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useArtifacts, useDeleteArtifact } from "../../../../../lib/hooks";
import type { Artifact } from "../../../../../lib/api";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";
import Skeleton from "../../../../../components/Skeleton";
import Modal from "../../../../../components/Modal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

const TYPE_FILTERS = [
  { label: "All", value: "" },
  { label: "Text", value: "text" },
  { label: "Image", value: "image" },
];

export default function ArtifactsPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const [typeFilter, setTypeFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Artifact | null>(null);

  const { data, isLoading } = useArtifacts(orgId, projectId, { type: typeFilter || undefined });
  const deleteArtifact = useDeleteArtifact(orgId, projectId);

  function handleDelete() {
    if (!deleteId) return;
    deleteArtifact.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Artifacts</h1>
        <p style={{ color: "var(--color-muted)", fontSize: 14, margin: "4px 0 0" }}>
          All generated outputs from this project.
        </p>
      </div>

      {/* Type Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              border: `1px solid ${typeFilter === f.value ? "var(--color-primary-600)" : "var(--color-border)"}`,
              background: typeFilter === f.value ? "var(--color-primary-600)" : "transparent",
              color: typeFilter === f.value ? "#fff" : "var(--color-text)",
              fontWeight: typeFilter === f.value ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <Card key={i} style={{ padding: 16 }}><Skeleton height={140} /></Card>)}
        </div>
      ) : !data?.items.length ? (
        <Card style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "var(--color-muted)" }}>No artifacts yet. Run a generation to create output.</p>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {data.items.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              onPreview={() => setPreview(artifact)}
              onDelete={() => setDeleteId(artifact.id)}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Artifact Preview">
        {preview && (
          <div>
            {preview.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${BACKEND_URL}${preview.downloadUrl}`}
                alt="Artifact"
                style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 16 }}
              />
            ) : (
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6, maxHeight: 400, overflow: "auto", marginBottom: 16 }}>
                {/* Text artifacts: load content here */}
                {preview.fileName ?? preview.id}
              </pre>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <a
                href={`${BACKEND_URL}${preview.downloadUrl}`}
                download
                style={{ textDecoration: "none" }}
              >
                <Button variant="primary">Download</Button>
              </a>
              <Button variant="secondary" onClick={() => setPreview(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Artifact">
        <p style={{ color: "var(--color-muted)", marginBottom: 24 }}>This will permanently delete the artifact.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteArtifact.isPending}>
            {deleteArtifact.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ArtifactCard({
  artifact,
  onPreview,
  onDelete,
}: {
  artifact: Artifact;
  onPreview: () => void;
  onDelete: () => void;
}) {
  const isImage = artifact.type === "image";

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      {/* Thumbnail */}
      <div
        onClick={onPreview}
        style={{
          height: 140, cursor: "pointer", background: "var(--color-surface-alt, #f8f8f8)",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${BACKEND_URL}${artifact.downloadUrl}`}
            alt="Artifact"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ fontSize: 36, color: "var(--color-muted)" }}>📄</div>
        )}
      </div>

      {/* Meta */}
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span
              style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                color: isImage ? "var(--color-primary-600)" : "var(--color-muted)",
                letterSpacing: 0.5,
              }}
            >
              {artifact.type}
            </span>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2 }}>
              {new Date(artifact.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <a
              href={`${BACKEND_URL}${artifact.downloadUrl}`}
              download
              style={{ textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="secondary" style={{ padding: "3px 8px", fontSize: 11 }}>↓</Button>
            </a>
            <Button variant="danger" style={{ padding: "3px 8px", fontSize: 11 }} onClick={onDelete}>✕</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
