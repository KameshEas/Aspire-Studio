/**
 * useGeneration - React Query hooks for generation operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import * as generations from '@/lib/api/generations';
import type { Generation, GenerateRequest, GenerateResponse } from '@/lib/api/generations';

const GENERATIONS_QUERY_KEY = 'generations';

// ─── Custom Hooks ────────────────────────────────────────

export function useGenerations(
  orgId: string,
  projectId: string,
  options?: {
    status?: generations.GenerationStatus;
    templateVersionId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [GENERATIONS_QUERY_KEY, orgId, projectId, options],
    queryFn: async () => {
      const token = await getToken();
      return generations.listGenerations(orgId, projectId, options, token);
    },
    enabled: !!orgId && !!projectId,
  });
}

export function useGeneration(
  orgId: string,
  projectId: string,
  generationId: string
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [GENERATIONS_QUERY_KEY, orgId, projectId, generationId],
    queryFn: async () => {
      const token = await getToken();
      return generations.getGeneration(orgId, projectId, generationId, token);
    },
    enabled: !!orgId && !!projectId && !!generationId,
  });
}

export function useGenerate(orgId: string, projectId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: GenerateRequest) => {
      const token = await getToken();
      return generations.generate(orgId, projectId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GENERATIONS_QUERY_KEY, orgId, projectId] });
    },
  });
}
