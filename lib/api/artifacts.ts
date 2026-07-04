/**
 * Artifacts API - Functions to interact with artifact endpoints
 */

import { apiGet, apiPost, apiPatch, apiDelete } from './client';

// ─── Types ──────────────────────────────────────────────────

export type ArtifactType = 'text' | 'image' | 'html' | 'zip' | 'embedding';
export type ArtifactStatus = 'draft' | 'approved' | 'archived';

export interface ArtifactGeneration {
  id: string;
  jobType: string;
  status: string;
  createdAt: string;
}

export interface ArtifactDetail {
  id: string;
  type: ArtifactType;
  fileName?: string;
  sizeBytes?: number;
  status: ArtifactStatus;
  rating?: number;
  tags: string[];
  metadata?: Record<string, unknown>;
  generation: ArtifactGeneration;
  parent?: {
    id: string;
    fileName?: string;
  };
  derivatives: Array<{
    id: string;
    fileName?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  fileName?: string;
  sizeBytes?: number;
  status: ArtifactStatus;
  rating?: number;
  tags: string[];
  generation: {
    id: string;
    jobType: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
}

export interface ListArtifactsResponse {
  artifacts: Artifact[];
  total: number;
  limit: number;
  offset: number;
}

export interface UpdateArtifactRequest {
  status?: ArtifactStatus;
  rating?: number;
  tags?: string[];
}

export interface DuplicateArtifactResponse {
  id: string;
  type: ArtifactType;
  fileName?: string;
  status: ArtifactStatus;
  parentArtifactId: string;
  tags: string[];
  createdAt: string;
  message?: string;
}

// ─── Artifact API Functions ─────────────────────────────────

export async function listArtifacts(
  orgId: string,
  projectId: string,
  options?: {
    type?: ArtifactType;
    status?: ArtifactStatus;
    jobType?: string;
    limit?: number;
    offset?: number;
  },
  token?: string
) {
  const params = new URLSearchParams();
  if (options?.type) params.append('type', options.type);
  if (options?.status) params.append('status', options.status);
  if (options?.jobType) params.append('jobType', options.jobType);
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.offset) params.append('offset', String(options.offset));

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiGet<ListArtifactsResponse>(
    `/orgs/${orgId}/projects/${projectId}/artifacts${queryString}`,
    token
  );
}

export async function getArtifact(
  orgId: string,
  projectId: string,
  artifactId: string,
  token?: string
) {
  return apiGet<ArtifactDetail>(
    `/orgs/${orgId}/projects/${projectId}/artifacts/${artifactId}`,
    token
  );
}

export async function updateArtifact(
  orgId: string,
  projectId: string,
  artifactId: string,
  data: UpdateArtifactRequest,
  token?: string
) {
  return apiPatch<Artifact>(
    `/orgs/${orgId}/projects/${projectId}/artifacts/${artifactId}`,
    data,
    token
  );
}

export async function deleteArtifact(
  orgId: string,
  projectId: string,
  artifactId: string,
  token?: string
) {
  return apiDelete(
    `/orgs/${orgId}/projects/${projectId}/artifacts/${artifactId}`,
    token
  );
}

export async function duplicateArtifact(
  orgId: string,
  projectId: string,
  artifactId: string,
  token?: string
) {
  return apiPost<DuplicateArtifactResponse>(
    `/orgs/${orgId}/projects/${projectId}/artifacts/${artifactId}/duplicate`,
    {},
    token
  );
}
