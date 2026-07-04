/**
 * Generations API - Functions to interact with generation endpoints
 */

import { apiGet, apiPost } from './client';
import type { TemplateVersion } from './templates';

// ─── Types ──────────────────────────────────────────────────

export type GenerationJobType =
  | 'brand-generate'
  | 'content-generate'
  | 'image-generate'
  | 'embedding-generate'
  | 'custom';

export type GenerationStatus = 'pending' | 'processing' | 'succeeded' | 'failed';

export interface Artifact {
  id: string;
  type: string;
  fileName?: string;
  sizeBytes?: number;
  storageUrl?: string;
  downloadUrl?: string;
}

export interface GenerationCost {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
}

export interface GenerationMetadata {
  model: string;
  provider: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  finishReason?: string;
  latencyMs?: number;
  [key: string]: unknown;
}

export interface Generation {
  id: string;
  projectId: string;
  orgId: string;
  status: GenerationStatus;
  jobType: GenerationJobType;
  model: string;
  prompt: string;
  systemPrompt?: string;
  variables?: Record<string, unknown>;
  templateVersionId?: string;
  text?: string;
  artifacts: Artifact[];
  metadata: GenerationMetadata;
  cost: GenerationCost;
  error?: {
    code: string;
    message: string;
  };
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListGenerationsResponse {
  generations: Generation[];
  total: number;
  limit: number;
  offset: number;
}

export interface GenerateRequest {
  prompt?: string;
  templateVersionId?: string;
  variables?: Record<string, unknown>;
  model: string;
  jobType?: GenerationJobType;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  systemPrompt?: string;
}

export interface GenerateResponse {
  generationId: string;
  status: GenerationStatus;
  text?: string;
  artifacts: Artifact[];
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  cost: GenerationCost;
  model: string;
  latencyMs: number;
}

// ─── Generation API Functions ───────────────────────────────

export async function generate(
  orgId: string,
  projectId: string,
  data: GenerateRequest,
  token?: string
) {
  return apiPost<GenerateResponse>(
    `/orgs/${orgId}/projects/${projectId}/generations`,
    data,
    token
  );
}

export async function listGenerations(
  orgId: string,
  projectId: string,
  options?: {
    status?: GenerationStatus;
    templateVersionId?: string;
    limit?: number;
    offset?: number;
  },
  token?: string
) {
  const params = new URLSearchParams();
  if (options?.status) params.append('status', options.status);
  if (options?.templateVersionId) params.append('templateVersionId', options.templateVersionId);
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.offset) params.append('offset', String(options.offset));

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiGet<ListGenerationsResponse>(
    `/orgs/${orgId}/projects/${projectId}/generations${queryString}`,
    token
  );
}

export async function getGeneration(
  orgId: string,
  projectId: string,
  generationId: string,
  token?: string
) {
  return apiGet<Generation>(
    `/orgs/${orgId}/projects/${projectId}/generations/${generationId}`,
    token
  );
}
