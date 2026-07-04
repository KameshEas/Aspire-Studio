/**
 * Template API - Functions to interact with template endpoints
 */

import { apiGet, apiPost, apiPatch, apiDelete } from './client';

// ─── Types ──────────────────────────────────────────────────

export interface VariableDefinition {
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date';
  label?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  options?: string[];
  default?: unknown;
}

export interface VariablesSchema {
  [key: string]: VariableDefinition;
}

export interface TemplateVersion {
  id: string;
  version: number;
  prompt: string;
  systemPrompt?: string;
  variablesSchema?: VariablesSchema;
  testData?: Record<string, unknown>;
  isActive: boolean;
  generationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  currentVersionId?: string;
  isArchived: boolean;
  versions?: TemplateVersion[];
  currentVersion?: TemplateVersion;
  generationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListTemplatesResponse {
  templates: Template[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListVersionsResponse {
  templateId: string;
  versions: TemplateVersion[];
  currentVersionId?: string;
}

export interface TestTemplateRequest {
  variables: Record<string, unknown>;
}

export interface TestTemplateResponse {
  interpolatedPrompt: string;
  systemPrompt?: string;
  tokenEstimate: number;
  validation: {
    isValid: boolean;
    errors: string[];
  };
  warnings: Array<{
    type: 'unused_variable' | 'missing_variable' | 'invalid_type';
    variable: string;
    message: string;
  }>;
}

// ─── Template CRUD ──────────────────────────────────────────

export async function listTemplates(
  orgId: string,
  projectId: string,
  options?: { tags?: string[]; archived?: boolean; limit?: number; offset?: number },
  token?: string
) {
  const params = new URLSearchParams();
  if (options?.tags?.length) params.append('tags', options.tags.join(','));
  if (options?.archived !== undefined) params.append('archived', String(options.archived));
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.offset) params.append('offset', String(options.offset));

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiGet<ListTemplatesResponse>(
    `/orgs/${orgId}/projects/${projectId}/templates${queryString}`,
    token
  );
}

export async function getTemplate(templateId: string, token?: string) {
  return apiGet<Template>(`/templates/${templateId}`, token);
}

export async function createTemplate(
  orgId: string,
  projectId: string,
  data: {
    name: string;
    description?: string;
    tags?: string[];
    prompt: string;
    systemPrompt?: string;
    variablesSchema?: VariablesSchema;
  },
  token?: string
) {
  return apiPost<Template>(
    `/orgs/${orgId}/projects/${projectId}/templates`,
    data,
    token
  );
}

export async function updateTemplate(
  templateId: string,
  data: {
    name?: string;
    description?: string;
    tags?: string[];
  },
  token?: string
) {
  return apiPatch<Template>(`/templates/${templateId}`, data, token);
}

export async function deleteTemplate(templateId: string, token?: string) {
  return apiDelete(`/templates/${templateId}`, token);
}

// ─── Version Management ─────────────────────────────────────

export async function listVersions(
  templateId: string,
  token?: string
) {
  return apiGet<ListVersionsResponse>(`/templates/${templateId}/versions`, token);
}

export async function createVersion(
  templateId: string,
  data: {
    prompt: string;
    systemPrompt?: string;
    variablesSchema?: VariablesSchema;
    testData?: Record<string, unknown>;
  },
  token?: string
) {
  return apiPost<TemplateVersion>(
    `/templates/${templateId}/versions`,
    data,
    token
  );
}

export async function updateVersion(
  templateId: string,
  versionId: string,
  data: {
    prompt?: string;
    systemPrompt?: string;
    variablesSchema?: VariablesSchema;
    testData?: Record<string, unknown>;
  },
  token?: string
) {
  return apiPatch<TemplateVersion>(
    `/templates/${templateId}/versions/${versionId}`,
    data,
    token
  );
}

export async function deleteVersion(
  templateId: string,
  versionId: string,
  token?: string
) {
  return apiDelete(
    `/templates/${templateId}/versions/${versionId}`,
    token
  );
}

export async function activateVersion(
  templateId: string,
  versionId: string,
  token?: string
) {
  return apiPost<TemplateVersion>(
    `/templates/${templateId}/versions/${versionId}/activate`,
    {},
    token
  );
}

// ─── Template Testing ───────────────────────────────────────

export async function testTemplate(
  templateId: string,
  variables: Record<string, unknown>,
  token?: string
) {
  return apiPost<TestTemplateResponse>(
    `/templates/${templateId}/test`,
    { variables },
    token
  );
}
