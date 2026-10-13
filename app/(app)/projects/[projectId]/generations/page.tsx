"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download, History as HistoryIcon, Sparkles } from "lucide-react";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useGeneration, useInfiniteGenerations } from "../../../../../lib/hooks";
import type { GenerationSummary } from "../../../../../lib/api";
import { formatUsd, timeAgo } from "../../../../../lib/variables";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  EmptyState,
  ErrorState,
  LoadingState,
  SkeletonTable,
  StatusBadge,
} from "../../../../../components/system";
import { ArtifactPreview } from "../../../../../components/features/ArtifactPreview";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "succeeded", label: "Succeeded" },
  { value: "failed", label: "Failed" },
  { value: "running", label: "Running" },
];

type StatusKey = React.ComponentProps<typeof StatusBadge>["status"];

function toStatus(status: string): StatusKey {
  if (status === "running") return "processing";
  if (status === "cancelled") return "archived";
  return status as StatusKey;
}

function usageLabel(g: GenerationSummary): string | null {
  if (g.tokensIn === null && g.tokensOut === null) return null;
  return `${(g.tokensIn ?? 0) + (g.tokensOut ?? 0)} tokens · ${formatUsd((g.costCents ?? 0) / 100)}`;
}

function GenerationDetail({ id, orgId, projectId }: { id: string; orgId: string; projectId: string }) {
  const { data, isLoading, error } = useGeneration(orgId, projectId, id);

  if (isLoading) return <LoadingState message="Loading generation…" />;
  if (error || !data) return <p className="text-sm text-[color:var(--danger)]">Could not load this generation.</p>;

  const prompt = data.input?.prompt;
  const variables = Object.entries(data.input?.variables ?? {});

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <StatusBadge status={toStatus(data.status)} />
        {data.options?.model && <Badge variant="default">{data.options.model}</Badge>}
        {data.templateVersion && (
          <Link
            href={`/projects/${projectId}/templates/${data.templateVersion.template.id}`}
            className="text-[color:var(--primary-600)] hover:underline"
          >
            {data.templateVersion.template.name} v{data.templateVersion.version}
          </Link>
        )}
        <span className="text-[color:var(--text-muted)]">{timeAgo(data.createdAt)}</span>
      </div>

      {data.error && (
        <div role="alert" className="rounded-lg border border-[color:var(--danger)] bg-[color:var(--danger-light)] p-3 text-sm text-[color:var(--danger-dark)]">
          {data.error}
        </div>
      )}

      {prompt && (
        <section>
          <h3 className="mb-1.5 text-sm font-semibold text-[color:var(--text)]">Prompt</h3>
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-[color:var(--surface-2)] p-3 text-sm text-[color:var(--text-secondary)]">{prompt}</pre>
        </section>
      )}

      {variables.length > 0 && (
        <section>
          <h3 className="mb-1.5 text-sm font-semibold text-[color:var(--text)]">Variables</h3>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
            {variables.map(([key, value]) => (
              <React.Fragment key={key}>
                <dt className="text-[color:var(--text-muted)]">{key}</dt>
                <dd className="text-[color:var(--text)]">{String(value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      )}

      {data.artifacts.map((artifact) => (
        <section key={artifact.id}>
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[color:var(--text)]">Output</h3>
            <a
              href={`${artifact.downloadUrl}&dl=1`}
              className="inline-flex items-center gap-1 text-sm text-[color:var(--primary-600)] hover:underline"
            >
              <Download size={14} /> Download
            </a>
          </div>
          <ArtifactPreview type={artifact.type} downloadUrl={artifact.downloadUrl} className="max-h-72" />
        </section>
      ))}
    </div>
  );
}

export default function GenerationsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";

  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteGenerations(
    orgId,
    projectId,
    status ? { status } : undefined
  );
  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[color:var(--text)]">History</h1>
        <p className="mt-1 text-[color:var(--text-secondary)]">Everything generated in this project.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={status === filter.value}
            onClick={() => setStatus(filter.value)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              status === filter.value
                ? "border-[color:var(--primary-600)] bg-[color:var(--primary-600)] text-white"
                : "border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonTable rows={6} columns={4} />
      ) : error ? (
        <ErrorState
          fullHeight={false}
          title="Could not load history"
          message={error instanceof Error ? error.message : "Unknown error"}
          action={{ label: "Try again", onClick: () => refetch() }}
        />
      ) : items.length === 0 ? (
        <EmptyState
          fullHeight={false}
          icon={<HistoryIcon size={40} className="text-[color:var(--text-muted)]" />}
          title={status ? "No generations with this status" : "Nothing generated yet"}
          description="Run a prompt in the Studio and it will show up here."
          action={status ? undefined : { label: "Open the Studio", onClick: () => (window.location.href = `/projects/${projectId}/studio`) }}
        />
      ) : (
        <>
          <ul className="divide-y divide-[color:var(--border)] rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
            {items.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(g.id)}
                  className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-[color:var(--surface-hover)]"
                >
                  <Sparkles size={18} className="mt-1 shrink-0 text-[color:var(--primary-500)]" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm text-[color:var(--text)]">{g.promptPreview ?? `${g.jobType} generation`}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--text-muted)]">
                      {g.model && <span>{g.model}</span>}
                      {g.template && <span>{g.template.name} v{g.template.version}</span>}
                      {usageLabel(g) && <span>{usageLabel(g)}</span>}
                      <span>{timeAgo(g.createdAt)}</span>
                    </div>
                    {g.error && <p className="mt-1 line-clamp-1 text-xs text-[color:var(--danger)]">{g.error}</p>}
                  </div>
                  <StatusBadge status={toStatus(g.status)} />
                </button>
              </li>
            ))}
          </ul>
          {hasNextPage && (
            <div className="flex justify-center">
              <Button variant="outline" loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent title="Generation" size="lg">
          {selectedId && <GenerationDetail id={selectedId} orgId={orgId} projectId={projectId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
