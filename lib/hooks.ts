"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type { OrgSummary, ProjectSummary } from "./api";

// ── Keys ───────────────────────────────────────────
export const queryKeys = {
  me: ["me"] as const,
  orgs: ["orgs"] as const,
  org: (id: string) => ["orgs", id] as const,
  orgMembers: (id: string) => ["orgs", id, "members"] as const,
  projects: (orgId: string) => ["orgs", orgId, "projects"] as const,
  project: (orgId: string, id: string) => ["orgs", orgId, "projects", id] as const,
  projectMembers: (orgId: string, id: string) => ["orgs", orgId, "projects", id, "members"] as const,
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
