"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useGenerations, useGeneration } from "../../../../../lib/hooks";
import { useToast } from "../../../../../lib/hooks/useToast";
import type { GenerationSummary, Artifact } from "../../../../../lib/api";

import {
  Container,
  Stack,
  Flex,
  Button,
  Dialog,
  DialogContent,
  useDialog,
  LoadingState,
  EmptyState,
  ErrorState,
  StatusIndicator,
  statusConfig,
} from "../../../../../components/system";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

export default function GenerationsPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const { isOpen, open, close } = useDialog();
  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error: fetchError } = useGenerations(
    orgId,
    projectId,
    { status: statusFilter || undefined }
  );

  // Handle opening detail modal
  const handleOpenDetail = (generationId: string) => {
    setSelectedId(generationId);
    open();
  };

  // Show loading state
  if (isLoading) {
    return (
      <LoadingState message="Loading generations..." subtext="This might take a moment" />
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <Container>
        <ErrorState
          title="Failed to load generations"
          message={fetchError instanceof Error ? fetchError.message : "Unknown error"}
          action={{
            label: "Try Again",
            onClick: () => window.location.reload(),
          }}
        />
      </Container>
    );
  }

  // Show empty state
  if (!data?.items?.length) {
    return (
      <Container size="xl">
        <EmptyState
          icon={<div className="text-6xl">⚡</div>}
          title="No generations yet"
          description="Start by creating a template or using the generation studio to create your first AI-generated content."
          example="Example: Use Studio to generate brand names, product descriptions, or marketing copy"
          action={{
            label: "Go to Studio",
            onClick: () => (window.location.href = `/projects/${projectId}/studio`),
          }}
        />
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack spacing="lg">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generation History</h1>
          <p className="text-gray-600 mt-2">
            {data.items.length} generation{data.items.length !== 1 ? "s" : ""} · Track all AI generations
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "" },
            { label: "Completed", value: "completed" },
            { label: "Failed", value: "failed" },
            { label: "Pending", value: "pending" },
            { label: "Running", value: "running" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  statusFilter === filter.value
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Generations List */}
        <div className="space-y-3">
          {data.items.map((generation) => (
            <GenerationCard
              key={generation.id}
              generation={generation}
              onViewDetail={() => handleOpenDetail(generation.id)}
            />
          ))}
        </div>

        {/* Detail Modal */}
        <Dialog open={isOpen} onOpenChange={close}>
          {selectedId && (
            <GenerationDetailModal
              orgId={orgId}
              projectId={projectId}
              generationId={selectedId}
            />
          )}
        </Dialog>
      </Stack>
    </Container>
  );
}

interface GenerationCardProps {
  generation: GenerationSummary;
  onViewDetail: () => void;
}

function GenerationCard({ generation, onViewDetail }: GenerationCardProps) {
  const duration =
    generation.startedAt && generation.finishedAt
      ? ((new Date(generation.finishedAt).getTime() -
          new Date(generation.startedAt).getTime()) /
          1000).toFixed(1) + "s"
      : null;

  const statusConfig_ = statusConfig[
    generation.status as keyof typeof statusConfig
  ];

  return (
    <button
      onClick={onViewDetail}
      className="
        w-full text-left border border-gray-200 rounded-lg p-4
        hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        group
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {/* Status + Type */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusConfig_?.color?.main }}
              title={statusConfig_?.label}
            />
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
              {generation.jobType || "Generation"}
            </h3>
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor: statusConfig_?.color?.light,
                color: statusConfig_?.color?.dark,
              }}
            >
              {statusConfig_?.label}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span>📅 {new Date(generation.createdAt).toLocaleDateString()}</span>
            <span>
              🕐 {new Date(generation.createdAt).toLocaleTimeString()}
            </span>
            {duration && <span>⏱️ {duration}</span>}
            <span>
              📦 {generation.artifactCount} artifact
              {generation.artifactCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Error message if present */}
          {generation.error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
              ⚠️ {generation.error}
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        <span className="text-xl text-gray-400 ml-4 group-hover:text-indigo-600 transition-colors">
          →
        </span>
      </div>
    </button>
  );
}

interface GenerationDetailModalProps {
  orgId: string;
  projectId: string;
  generationId: string;
}

function GenerationDetailModal({
  orgId,
  projectId,
  generationId,
}: GenerationDetailModalProps) {
  const { success } = useToast();
  const { data, isLoading, error: detailError } = useGeneration(
    orgId,
    projectId,
    generationId
  );

  if (isLoading) {
    return (
      <DialogContent title="Loading..." closeButton>
        <LoadingState message="Loading generation details..." />
      </DialogContent>
    );
  }

  if (detailError || !data) {
    return (
      <DialogContent title="Error" closeButton>
        <ErrorState
          title="Failed to load generation"
          message={
            detailError instanceof Error
              ? detailError.message
              : "Unknown error occurred"
          }
        />
      </DialogContent>
    );
  }

  const statusCfg = statusConfig[data.status as keyof typeof statusConfig];
  const duration =
    data.startedAt && data.finishedAt
      ? ((new Date(data.finishedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000).toFixed(2) + "s"
      : null;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <DialogContent title="Generation Details" closeButton>
      <div className="space-y-6">
        {/* Status & Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Status
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: statusCfg?.color?.light,
                color: statusCfg?.color?.dark,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusCfg?.color?.main }}
              />
              {statusCfg?.label}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Type
            </p>
            <p className="text-sm font-medium text-gray-900">
              {data.jobType || "—"}
            </p>
          </div>

          {duration && (
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                Duration
              </p>
              <p className="text-sm font-medium text-gray-900">{duration}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Created
            </p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Template Info */}
        {data.templateVersion && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Template Used
            </h3>
            <p className="text-lg font-bold text-indigo-600">
              {data.templateVersion.template.name}
            </p>
            <p className="text-sm text-gray-600">
              Version {data.templateVersion.version}
            </p>
          </div>
        )}

        {/* Error State */}
        {data.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-900 mb-1">
              Error Details
            </h3>
            <p className="text-sm text-red-800">{data.error}</p>
            <p className="text-xs text-red-700 mt-2">
              Try adjusting your prompt or model settings and generate again.
            </p>
          </div>
        )}

        {/* Artifacts */}
        {data.artifacts && data.artifacts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Outputs ({data.artifacts.length})
            </h3>
            <div className="space-y-2">
              {data.artifacts.map((artifact) => (
                <ArtifactPreview key={artifact.id} artifact={artifact} />
              ))}
            </div>
          </div>
        )}

        {/* Empty Artifacts State */}
        {(!data.artifacts || data.artifacts.length === 0) && !data.error && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No artifacts generated yet</p>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

interface ArtifactPreviewProps {
  artifact: Artifact;
}

function ArtifactPreview({ artifact }: ArtifactPreviewProps) {
  const isImage = artifact.type === "image";

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {isImage ? (
            <img
              src={`${BACKEND_URL}${artifact.downloadUrl}`}
              alt="artifact preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-lg">📄</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 capitalize">
            {artifact.type}
          </h4>
          <p className="text-xs text-gray-600">
            {new Date(artifact.createdAt).toLocaleString()}
          </p>
          {artifact.fileName && (
            <p className="text-xs text-gray-500 truncate mt-1">
              {artifact.fileName}
            </p>
          )}
        </div>

        {/* Actions */}
        <Flex gap="sm" className="flex-shrink-0">
          <Button
            size="xs"
            variant="secondary"
            onClick={() => {
              const downloadLink = document.createElement("a");
              downloadLink.href = `${BACKEND_URL}${artifact.downloadUrl}`;
              downloadLink.download = artifact.fileName || "artifact";
              downloadLink.click();
            }}
            title="Download artifact"
          >
            📥
          </Button>
          <Button
            size="xs"
            variant="secondary"
            onClick={() => {
              const link = `${BACKEND_URL}${artifact.downloadUrl}`;
              navigator.clipboard.writeText(link);
            }}
            title="Copy download link"
          >
            📋
          </Button>
        </Flex>
      </div>
    </div>
  );
}
