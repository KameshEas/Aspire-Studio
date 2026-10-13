"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Archive, Check, Download, FileText, Image as ImageIcon, Package, Star } from "lucide-react";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useArtifacts, useUpdateArtifact } from "../../../../../lib/hooks";
import { useToast } from "../../../../../lib/hooks/useToast";
import type { Artifact, ArtifactStatus } from "../../../../../lib/api";
import { formatBytes, timeAgo } from "../../../../../lib/variables";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  EmptyState,
  ErrorState,
  SkeletonGrid,
} from "../../../../../components/system";
import { ArtifactPreview } from "../../../../../components/features/ArtifactPreview";

const PAGE_SIZE = 24;

const STATUS_TABS: { value: ArtifactStatus | "active"; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "approved", label: "Approved" },
  { value: "draft", label: "Drafts" },
  { value: "archived", label: "Archived" },
];

const TYPE_TABS = [
  { value: "", label: "All types" },
  { value: "text", label: "Text" },
  { value: "image", label: "Images" },
];

const statusVariant: Record<ArtifactStatus, "success" | "default" | "warning"> = {
  approved: "success",
  draft: "default",
  archived: "warning",
};

function Rating({ value, onChange }: { value: number | null; onChange?: (rating: number) => void }) {
  return (
    <div className="flex items-center gap-0.5" role={onChange ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (value ?? 0) >= n;
        const star = <Star size={onChange ? 20 : 14} className={filled ? "fill-[color:var(--warning)] text-[color:var(--warning)]" : "text-[color:var(--border-strong)]"} />;
        return onChange ? (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n === 1 ? "" : "s"}`} onClick={() => onChange(n)}>
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}

function ArtifactCard({ artifact, onOpen }: { artifact: Artifact; onOpen: () => void }) {
  const model = artifact.metadata?.model as string | undefined;
  return (
    <Card variant="interactive" padding="none" onClick={onOpen} className="overflow-hidden">
      <div className="flex h-36 items-center justify-center overflow-hidden bg-[color:var(--surface-2)]">
        {artifact.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artifact.downloadUrl} alt={artifact.fileName ?? "Generated image"} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <FileText size={36} className="text-[color:var(--text-muted)]" />
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-[color:var(--text)]">{artifact.fileName ?? artifact.id}</span>
          <Badge size="sm" variant={statusVariant[artifact.status]}>
            {artifact.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-[color:var(--text-muted)]">
          <span>{[model, formatBytes(artifact.sizeBytes)].filter((v) => v && v !== "—").join(" · ")}</span>
          <span>{timeAgo(artifact.createdAt)}</span>
        </div>
        <Rating value={artifact.rating} />
      </div>
    </Card>
  );
}

export default function ArtifactsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const { success, error: showError } = useToast();

  const [statusTab, setStatusTab] = useState<ArtifactStatus | "active">("active");
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useArtifacts(orgId, projectId, {
    type: type || undefined,
    status: statusTab === "active" ? undefined : statusTab,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });
  const updateArtifact = useUpdateArtifact(orgId, projectId);

  const artifacts = (data?.artifacts ?? []).filter((a) => statusTab !== "active" || a.status !== "archived");
  const selected = data?.artifacts.find((a) => a.id === selectedId) ?? null;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const patch = async (artifact: Artifact, changes: { status?: ArtifactStatus; rating?: number }, message: string) => {
    try {
      await updateArtifact.mutateAsync({ artifactId: artifact.id, ...changes });
      success({ title: message });
    } catch (err) {
      showError({ title: "Update failed", description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const tabClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active
        ? "border-[color:var(--primary-600)] bg-[color:var(--primary-600)] text-white"
        : "border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)]"
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[color:var(--text)]">Artifacts</h1>
        <p className="mt-1 text-[color:var(--text-secondary)]">Review, rate and approve what you have generated.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={statusTab === tab.value}
              className={tabClass(statusTab === tab.value)}
              onClick={() => {
                setStatusTab(tab.value);
                setPage(0);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={type === tab.value}
              className={tabClass(type === tab.value)}
              onClick={() => {
                setType(tab.value);
                setPage(0);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid count={8} columns={4} />
      ) : error ? (
        <ErrorState
          fullHeight={false}
          title="Could not load artifacts"
          message={error instanceof Error ? error.message : "Unknown error"}
          action={{ label: "Try again", onClick: () => refetch() }}
        />
      ) : artifacts.length === 0 ? (
        <EmptyState
          fullHeight={false}
          icon={<Package size={40} className="text-[color:var(--text-muted)]" />}
          title="No artifacts here"
          description="Everything you generate is saved as a draft artifact. Approve the ones you want to keep."
          action={{ label: "Open the Studio", onClick: () => (window.location.href = `/projects/${projectId}/studio`) }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artifacts.map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} onOpen={() => setSelectedId(artifact.id)} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-[color:var(--text-muted)]">
                Page {page + 1} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent title={selected?.fileName ?? "Artifact"} size="lg">
          {selected && (
            <div className="space-y-5">
              <ArtifactPreview type={selected.type} downloadUrl={selected.downloadUrl} className="max-h-96 w-full" />
              <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-muted)]">
                <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
                {selected.type === "image" ? <ImageIcon size={14} /> : <FileText size={14} />}
                <span>{formatBytes(selected.sizeBytes)}</span>
                <span>{timeAgo(selected.createdAt)}</span>
              </div>
              <div>
                <div className="mb-1 text-sm font-semibold text-[color:var(--text)]">Rating</div>
                <Rating value={selected.rating} onChange={(rating) => patch(selected, { rating }, "Rating saved")} />
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.status !== "approved" && (
                  <Button icon={<Check size={16} />} loading={updateArtifact.isPending} onClick={() => patch(selected, { status: "approved" }, "Artifact approved")}>
                    Approve
                  </Button>
                )}
                {selected.status === "approved" && (
                  <Button variant="outline" onClick={() => patch(selected, { status: "draft" }, "Moved back to drafts")}>
                    Unapprove
                  </Button>
                )}
                {selected.status !== "archived" ? (
                  <Button variant="outline" icon={<Archive size={16} />} onClick={() => patch(selected, { status: "archived" }, "Artifact archived")}>
                    Archive
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => patch(selected, { status: "draft" }, "Artifact restored")}>
                    Restore
                  </Button>
                )}
                <a
                  href={`${selected.downloadUrl}&dl=1`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-4 py-2 text-sm font-medium text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]"
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
