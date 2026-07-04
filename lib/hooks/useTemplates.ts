/**
 * useTemplates - React Query hooks for template operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import * as templates from '@/lib/api/templates';
import type { Template, TemplateVersion, TestTemplateResponse } from '@/lib/api/templates';

const TEMPLATES_QUERY_KEY = 'templates';

// ─── Custom Hooks ──────────────────────────────────────────

export function useTemplates(
  orgId: string,
  projectId: string,
  options?: { tags?: string[]; archived?: boolean; limit?: number; offset?: number }
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, orgId, projectId, options],
    queryFn: async () => {
      const token = await getToken();
      return templates.listTemplates(orgId, projectId, options, token);
    },
    enabled: !!orgId && !!projectId,
  });
}

export function useTemplate(templateId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, templateId],
    queryFn: async () => {
      const token = await getToken();
      return templates.getTemplate(templateId, token);
    },
    enabled: !!templateId,
  });
}

export function useCreateTemplate(orgId: string, projectId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: Parameters<typeof templates.createTemplate>[2]) => {
      const token = await getToken();
      return templates.createTemplate(orgId, projectId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, orgId, projectId] });
    },
  });
}

export function useUpdateTemplate(templateId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: Parameters<typeof templates.updateTemplate>[1]) => {
      const token = await getToken();
      return templates.updateTemplate(templateId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, templateId] });
    },
  });
}

export function useDeleteTemplate(templateId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return templates.deleteTemplate(templateId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
    },
  });
}

export function useTestTemplate(templateId: string) {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: Record<string, unknown>) => {
      const token = await getToken();
      return templates.testTemplate(templateId, variables, token);
    },
  });
}

// ─── Version Hooks ────────────────────────────────────────

export function useVersions(templateId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, templateId, 'versions'],
    queryFn: async () => {
      const token = await getToken();
      return templates.listVersions(templateId, token);
    },
    enabled: !!templateId,
  });
}

export function useCreateVersion(templateId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: Parameters<typeof templates.createVersion>[1]) => {
      const token = await getToken();
      return templates.createVersion(templateId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, templateId, 'versions'] });
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, templateId] });
    },
  });
}

export function useUpdateVersion(templateId: string, versionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: Parameters<typeof templates.updateVersion>[2]) => {
      const token = await getToken();
      return templates.updateVersion(templateId, versionId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, templateId, 'versions'] });
    },
  });
}

export function useDeleteVersion(templateId: string, versionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return templates.deleteVersion(templateId, versionId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, templateId, 'versions'] });
    },
  });
}

export function useActivateVersion(templateId: string, versionId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return templates.activateVersion(templateId, versionId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, templateId, 'versions'] });
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY, templateId] });
    },
  });
}
