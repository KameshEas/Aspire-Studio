"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useArtifacts, useDeleteArtifact } from "../../../../../lib/hooks";
import { useToast } from "../../../../../lib/hooks/useToast";
import type { Artifact } from "../../../../../lib/api";

import {
  Container,
  Stack,
  Flex,
  Grid,
  Button,
  Dialog,
  DialogContent,
  useDialog,
  LoadingState,
  EmptyState,
  ErrorState,
} from "../../../../../components/system";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

const TYPE_FILTERS = [
  { label: "All", value: "" },
  { label: "Text", value: "text" },
  { label: "Image", value: "image" },
];

export default function ArtifactsPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const { success } = useToast();
  const { isOpen: previewOpen, open: openPreview, close: closePreview } = useDialog();
  const { isOpen: deleteOpen, open: openDelete, close: closeDelete } = useDialog();

  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const [typeFilter, setTypeFilter] = useState("");
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);
  const [deleteArtifactId, setDeleteArtifactId] = useState<string | null>(null);

  const { data, isLoading, error: fetchError } = useArtifacts(orgId, projectId, {
    type: typeFilter || undefined,
  });
  const deleteArtifact = useDeleteArtifact(orgId, projectId);

  const handlePreview = (artifact: Artifact) => {
    setPreviewArtifact(artifact);
    openPreview();
  };

  const handleDeleteClick = (artifactId: string) => {
    setDeleteArtifactId(artifactId);
    openDelete();
  };

  const handleDelete = () => {
    if (!deleteArtifactId) return;

    deleteArtifact.mutate(deleteArtifactId, {
      onSuccess: () => {
        success({
          title: "Artifact deleted",
          description: "The artifact has been removed",
        });
        closeDelete();
        setDeleteArtifactId(null);
      },
    });
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState message="Loading artifacts..." />;
  }

  // Show error state
  if (fetchError) {
    return (
      <Container>
        <ErrorState
          title="Failed to load artifacts"
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
          icon={<div className="text-6xl">📦</div>}
          title="No artifacts yet"
          description="Generate content using templates or the generation studio to create your first artifact."
          example="Example: Generate product descriptions, social media posts, or marketing copy"
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
          <h1 className="text-3xl font-bold text-gray-900">Artifacts</h1>
          <p className="text-gray-600 mt-2">
            {data.items.length} artifact{data.items.length !== 1 ? "s" : ""} · All generated outputs
          </p>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  typeFilter === filter.value
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Artifacts Grid */}
        <Grid columns={4} gap="lg" responsive autoFit minWidth="220px">
          {data.items.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              onPreview={() => handlePreview(artifact)}
              onDelete={() => handleDeleteClick(artifact.id)}
            />
          ))}
        </Grid>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={closePreview}>
          {previewArtifact && (
            <ArtifactPreviewDialog
              artifact={previewArtifact}
              onClose={closePreview}
            />
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onOpenChange={closeDelete}>
          <DialogContent title="Delete Artifact?" closeButton>
            <Stack spacing="md">
              <p className="text-gray-700">
                This will permanently delete the artifact. This action cannot be undone.
              </p>
              <Flex gap="sm" justify="end">
                <Button
                  variant="secondary"
                  onClick={closeDelete}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleteArtifact.isPending}
                >
                  Delete Artifact
                </Button>
              </Flex>
            </Stack>
          </DialogContent>
        </Dialog>
      </Stack>
    </Container>
  );
}

interface ArtifactCardProps {
  artifact: Artifact;
  onPreview: () => void;
  onDelete: () => void;
}

function ArtifactCard({ artifact, onPreview, onDelete }: ArtifactCardProps) {
  const isImage = artifact.type === "image";

  return (
    <button
      onClick={onPreview}
      className="
        border border-gray-200 rounded-lg overflow-hidden
        hover:border-indigo-300 hover:shadow-lg
        transition-all duration-200 focus:outline-none
        focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        group
      "
    >
      {/* Thumbnail */}
      <div className="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
        {isImage ? (
          <img
            src={`${BACKEND_URL}${artifact.downloadUrl}`}
            alt="artifact"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="text-5xl">📄</div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-white">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className={`
                text-xs font-bold uppercase tracking-wide
                ${isImage ? "text-indigo-600" : "text-gray-600"}
              `}
            >
              {artifact.type}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(artifact.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div
            className="flex gap-1 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={`${BACKEND_URL}${artifact.downloadUrl}`}
              download
              className="text-gray-600 hover:text-indigo-600 transition-colors"
              title="Download"
            >
              <Button size="xs" variant="secondary" aria-label="Download artifact">
                📥
              </Button>
            </a>
            <Button
              size="xs"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete artifact"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>
    </button>
  );
}

interface ArtifactPreviewDialogProps {
  artifact: Artifact;
  onClose: () => void;
}

function ArtifactPreviewDialog({
  artifact,
  onClose,
}: ArtifactPreviewDialogProps) {
  const isImage = artifact.type === "image";
  const { success } = useToast();

  const copyDownloadLink = async () => {
    try {
      const link = `${BACKEND_URL}${artifact.downloadUrl}`;
      await navigator.clipboard.writeText(link);
      success({
        title: "Copied!",
        description: "Download link copied to clipboard",
      });
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <DialogContent title="Artifact Preview" closeButton>
      <Stack spacing="md">
        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          {isImage ? (
            <img
              src={`${BACKEND_URL}${artifact.downloadUrl}`}
              alt="artifact preview"
              className="w-full rounded-lg"
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-700 font-medium">Text Artifact</p>
              <p className="text-sm text-gray-600 mt-1">
                {artifact.fileName || "Unnamed file"}
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Type
            </p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {artifact.type}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Created
            </p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(artifact.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <Flex gap="sm">
          <a
            href={`${BACKEND_URL}${artifact.downloadUrl}`}
            download
            className="flex-1"
          >
            <Button fullWidth>📥 Download</Button>
          </a>
          <Button
            variant="secondary"
            onClick={copyDownloadLink}
            aria-label="Copy download link"
          >
            📋
          </Button>
        </Flex>
      </Stack>
    </DialogContent>
  );
}
