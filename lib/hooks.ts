"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type {
  OrgSummary, ProjectSummary,
  CreateTemplateInput, GenerateRequest,
} from "./api";

// ── Keys ───────────────────────────────────────────
export const queryKeys = {
  me: ["me"] as const,
  orgs: ["orgs"] as const,
  org: (id: string) => ["orgs", id] as const,
  orgMembers: (id: string) => ["orgs", id, "members"] as const,
  projects: (orgId: string) => ["orgs", orgId, "projects"] as const,
  project: (orgId: string, id: string) => ["orgs", orgId, "projects", id] as const,
  projectMembers: (orgId: string, id: string) => ["orgs", orgId, "projects", id, "members"] as const,
  // Phase 2
  models: ["models"] as const,
  templates: (orgId: string, projectId: string) => ["orgs", orgId, "projects", projectId, "templates"] as const,
  template: (orgId: string, projectId: string, id: string) => ["orgs", orgId, "projects", projectId, "templates", id] as const,
  artifacts: (orgId: string, projectId: string) => ["orgs", orgId, "projects", projectId, "artifacts"] as const,
  artifact: (orgId: string, projectId: string, id: string) => ["orgs", orgId, "projects", projectId, "artifacts", id] as const,
  generations: (orgId: string, projectId: string) => ["orgs", orgId, "projects", projectId, "generations"] as const,
  generation: (orgId: string, projectId: string, id: string) => ["orgs", orgId, "projects", projectId, "generations", id] as const,
};

// ── Me ─────────────────────────────────────────────
export function useMe() {
  return useQuery({ queryKey: queryKeys.me, queryFn: () => api.getMe() });
}

// ── Orgs ───────────────────────────────────────────
export function useOrgs() {
  return useQuery({ queryKey: queryKeys.orgs, queryFn: () => api.listOrgs() });
}

export function useOrg(orgId: string) {
  return useQuery({
    queryKey: queryKeys.org(orgId),
    queryFn: () => api.getOrg(orgId),
    enabled: !!orgId,
  });
}

export function useCreateOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string }) => api.createOrg(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orgs });
      qc.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

// ── Org Members ────────────────────────────────────
export function useOrgMembers(orgId: string) {
  return useQuery({
    queryKey: queryKeys.orgMembers(orgId),
    queryFn: () => api.listOrgMembers(orgId),
    enabled: !!orgId,
  });
}

// ── Projects ───────────────────────────────────────
export function useProjects(orgId: string) {
  return useQuery({
    queryKey: queryKeys.projects(orgId),
    queryFn: () => api.listProjects(orgId),
    enabled: !!orgId,
  });
}

export function useProject(orgId: string, projectId: string) {
  return useQuery({
    queryKey: queryKeys.project(orgId, projectId),
    queryFn: () => api.getProject(orgId, projectId),
    enabled: !!orgId && !!projectId,
  });
}

export function useCreateProject(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string; description?: string }) =>
      api.createProject(orgId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects(orgId) });
    },
  });
}

export function useUpdateProject(orgId: string, projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; description?: string }) =>
      api.updateProject(orgId, projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.project(orgId, projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.projects(orgId) });
    },
  });
}

export function useDeleteProject(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => api.deleteProject(orgId, projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects(orgId) });
    },
  });
}

// ── Phase 2: Models ────────────────────────────────
export function useModels() {
  return useQuery({ queryKey: queryKeys.models, queryFn: () => api.listModels(), staleTime: 60_000 });
}

// ── Phase 2: Templates ─────────────────────────────
export function useTemplates(orgId: string, projectId: string) {
  return useQuery({
    queryKey: queryKeys.templates(orgId, projectId),
    queryFn: () => api.listTemplates(orgId, projectId),
    enabled: !!orgId && !!projectId,
  });
}

export function useTemplate(orgId: string, projectId: string, templateId: string) {
  return useQuery({
    queryKey: queryKeys.template(orgId, projectId, templateId),
    queryFn: () => api.getTemplate(orgId, projectId, templateId),
    enabled: !!orgId && !!projectId && !!templateId,
  });
}

export function useCreateTemplate(orgId: string, projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTemplateInput) => api.createTemplate(orgId, projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templates(orgId, projectId) });
    },
  });
}

export function useUpdateTemplate(orgId: string, projectId: string, templateId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; description?: string }) =>
      api.updateTemplate(orgId, projectId, templateId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.template(orgId, projectId, templateId) });
      qc.invalidateQueries({ queryKey: queryKeys.templates(orgId, projectId) });
    },
  });
}

export function useDeleteTemplate(orgId: string, projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => api.deleteTemplate(orgId, projectId, templateId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templates(orgId, projectId) });
    },
  });
}

export function useCreateTemplateVersion(orgId: string, projectId: string, templateId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { prompt: string; variablesSchema?: Record<string, unknown>; metadata?: Record<string, unknown> }) =>
      api.createTemplateVersion(orgId, projectId, templateId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.template(orgId, projectId, templateId) });
    },
  });
}

// ── Phase 2: Generate ──────────────────────────────
export function useGenerate(orgId: string, projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateRequest) => api.generate(orgId, projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.generations(orgId, projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.artifacts(orgId, projectId) });
    },
  });
}

// ── Phase 2: Artifacts ─────────────────────────────
export function useArtifacts(orgId: string, projectId: string, opts?: { type?: string; cursor?: string }) {
  return useQuery({
    queryKey: [...queryKeys.artifacts(orgId, projectId), opts],
    queryFn: () => api.listArtifacts(orgId, projectId, opts),
    enabled: !!orgId && !!projectId,
  });
}

export function useArtifact(orgId: string, projectId: string, artifactId: string) {
  return useQuery({
    queryKey: queryKeys.artifact(orgId, projectId, artifactId),
    queryFn: () => api.getArtifact(orgId, projectId, artifactId),
    enabled: !!orgId && !!projectId && !!artifactId,
  });
}

export function useDeleteArtifact(orgId: string, projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (artifactId: string) => api.deleteArtifact(orgId, projectId, artifactId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.artifacts(orgId, projectId) });
    },
  });
}

// ── Phase 2: Generations ───────────────────────────
export function useGenerations(orgId: string, projectId: string, opts?: { status?: string; jobType?: string; cursor?: string }) {
  return useQuery({
    queryKey: [...queryKeys.generations(orgId, projectId), opts],
    queryFn: () => api.listGenerations(orgId, projectId, opts),
    enabled: !!orgId && !!projectId,
  });
}

export function useGeneration(orgId: string, projectId: string, generationId: string) {
  return useQuery({
    queryKey: queryKeys.generation(orgId, projectId, generationId),
    queryFn: () => api.getGeneration(orgId, projectId, generationId),
    enabled: !!orgId && !!projectId && !!generationId,
  });
}
