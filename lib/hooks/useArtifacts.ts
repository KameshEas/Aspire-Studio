/**
 * useArtifacts - React Query hooks for artifact operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import * as artifacts from '@/lib/api/artifacts';
import type { Artifact, ArtifactDetail, UpdateArtifactRequest } from '@/lib/api/artifacts';

const ARTIFACTS_QUERY_KEY = 'artifacts';

// ─── Custom Hooks ──────────────────────────────────────────

export function useArtifacts(
  orgId: string,
  projectId: string,
  options?: {
    type?: artifacts.ArtifactType;
    status?: artifacts.ArtifactStatus;
    jobType?: string;
    limit?: number;
    offset?: number;
  }
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [ARTIFACTS_QUERY_KEY, orgId, projectId, options],
    queryFn: async () => {
      const token = await getToken();
      return artifacts.listArtifacts(orgId, projectId, options, token);
    },
    enabled: !!orgId && !!projectId,
  });
}

export function useArtifact(
  orgId: string,
  projectId: string,
  artifactId: string
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [ARTIFACTS_QUERY_KEY, orgId, projectId, artifactId],
    queryFn: async () => {
      const token = await getToken();
      return artifacts.getArtifact(orgId, projectId, artifactId, token);
    },
    enabled: !!orgId && !!projectId && !!artifactId,
  });
}

export function useUpdateArtifact(
  orgId: string,
  projectId: string,
  artifactId: string
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateArtifactRequest) => {
      const token = await getToken();
      return artifacts.updateArtifact(orgId, projectId, artifactId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTIFACTS_QUERY_KEY, orgId, projectId, artifactId] });
      queryClient.invalidateQueries({ queryKey: [ARTIFACTS_QUERY_KEY, orgId, projectId] });
    },
  });
}

export function useDeleteArtifact(
  orgId: string,
  projectId: string,
  artifactId: string
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return artifacts.deleteArtifact(orgId, projectId, artifactId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTIFACTS_QUERY_KEY, orgId, projectId] });
    },
  });
}

export function useDuplicateArtifact(
  orgId: string,
  projectId: string,
  artifactId: string
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return artifacts.duplicateArtifact(orgId, projectId, artifactId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTIFACTS_QUERY_KEY, orgId, projectId] });
    },
  });
}
