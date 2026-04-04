const BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3002";

class ApiClient {
  private token: string | null = null;
  private orgId: string | null = null;
  private tokenGetter: (() => Promise<string | null>) | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  /** Provide a live token getter so each request fetches a fresh token. */
  setTokenGetter(getter: () => Promise<string | null>) {
    this.tokenGetter = getter;
  }

  setOrgId(orgId: string | null) {
    this.orgId = orgId;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    // Always get a fresh token if a getter is registered
    const token = this.tokenGetter ? await this.tokenGetter() : this.token;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (this.orgId) {
      headers["X-Org-Id"] = this.orgId;
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new ApiError(res.status, body.error ?? "Request failed");
    }

    return res.json();
  }

  // ── Me ─────────────────────────────────────────
  getMe() {
    return this.request<MeResponse>("/api/v1/me");
  }
  updateMe(data: { name?: string; avatarUrl?: string }) {
    return this.request<MeResponse>("/api/v1/me", { method: "PATCH", body: JSON.stringify(data) });
  }

  // ── Orgs ───────────────────────────────────────
  listOrgs() {
    return this.request<OrgSummary[]>("/api/v1/orgs");
  }
  createOrg(data: { name: string; slug: string }) {
    return this.request<OrgSummary>("/api/v1/orgs", { method: "POST", body: JSON.stringify(data) });
  }
  getOrg(orgId: string) {
    return this.request<OrgDetail>(`/api/v1/orgs/${encodeURIComponent(orgId)}`);
  }
  updateOrg(orgId: string, data: { name?: string }) {
    return this.request<OrgSummary>(`/api/v1/orgs/${encodeURIComponent(orgId)}`, { method: "PATCH", body: JSON.stringify(data) });
  }
  deleteOrg(orgId: string) {
    return this.request<{ deleted: boolean }>(`/api/v1/orgs/${encodeURIComponent(orgId)}`, { method: "DELETE" });
  }

  // ── Org Members ────────────────────────────────
  listOrgMembers(orgId: string) {
    return this.request<OrgMember[]>(`/api/v1/orgs/${encodeURIComponent(orgId)}/members`);
  }
  addOrgMember(orgId: string, data: { email: string; role?: string }) {
    return this.request<{ added: boolean }>(`/api/v1/orgs/${encodeURIComponent(orgId)}/members`, { method: "POST", body: JSON.stringify(data) });
  }

  // ── Projects ───────────────────────────────────
  listProjects(orgId: string) {
    return this.request<ProjectSummary[]>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects`);
  }
  createProject(orgId: string, data: { name: string; slug: string; description?: string }) {
    return this.request<ProjectSummary>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects`, { method: "POST", body: JSON.stringify(data) });
  }
  getProject(orgId: string, projectId: string) {
    return this.request<ProjectDetail>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}`);
  }
  updateProject(orgId: string, projectId: string, data: { name?: string; description?: string }) {
    return this.request<ProjectSummary>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}`, { method: "PATCH", body: JSON.stringify(data) });
  }
  deleteProject(orgId: string, projectId: string) {
    return this.request<{ deleted: boolean }>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}`, { method: "DELETE" });
  }

  // ── Project Members ────────────────────────────
  listProjectMembers(orgId: string, projectId: string) {
    return this.request<ProjectMember[]>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/members`);
  }
  addProjectMember(orgId: string, projectId: string, data: { userId: string; role?: string }) {
    return this.request<{ added: boolean }>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/members`, { method: "POST", body: JSON.stringify(data) });
  }
  // ── Models ─────────────────────────────────────────
  listModels() {
    return this.request<ModelInfo[]>("/api/v1/models");
  }

  // ── Templates ──────────────────────────────────────
  listTemplates(orgId: string, projectId: string) {
    return this.request<TemplateSummary[]>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/templates`);
  }
  createTemplate(orgId: string, projectId: string, data: CreateTemplateInput) {
    return this.request<TemplateSummary>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/templates`, { method: "POST", body: JSON.stringify(data) });
  }
  getTemplate(orgId: string, projectId: string, templateId: string) {
    return this.request<TemplateDetail>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/templates/${encodeURIComponent(templateId)}`);
  }
  updateTemplate(orgId: string, projectId: string, templateId: string, data: { name?: string; description?: string }) {
    return this.request<{ id: string; name: string; description: string | null }>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/templates/${encodeURIComponent(templateId)}`, { method: "PATCH", body: JSON.stringify(data) });
  }
  deleteTemplate(orgId: string, projectId: string, templateId: string) {
    return this.request<{ deleted: boolean }>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/templates/${encodeURIComponent(templateId)}`, { method: "DELETE" });
  }
  createTemplateVersion(orgId: string, projectId: string, templateId: string, data: { prompt: string; variablesSchema?: Record<string, unknown> }) {
    return this.request<TemplateVersion>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/templates/${encodeURIComponent(templateId)}/versions`, { method: "POST", body: JSON.stringify(data) });
  }

  // ── Generate ───────────────────────────────────────
  generate(orgId: string, projectId: string, data: GenerateRequest) {
    return this.request<GenerateResponse>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/generate`, { method: "POST", body: JSON.stringify(data) });
  }

  // ── Artifacts ──────────────────────────────────────
  listArtifacts(orgId: string, projectId: string, opts?: { type?: string; limit?: number; cursor?: string }) {
    const params = new URLSearchParams();
    if (opts?.type) params.set("type", opts.type);
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.cursor) params.set("cursor", opts.cursor);
    const qs = params.toString();
    return this.request<ArtifactListResponse>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/artifacts${qs ? `?${qs}` : ""}`);
  }
  getArtifact(orgId: string, projectId: string, artifactId: string) {
    return this.request<Artifact>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/artifacts/${encodeURIComponent(artifactId)}`);
  }
  deleteArtifact(orgId: string, projectId: string, artifactId: string) {
    return this.request<{ deleted: boolean }>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/artifacts/${encodeURIComponent(artifactId)}`, { method: "DELETE" });
  }

  // ── Generations History ────────────────────────────
  listGenerations(orgId: string, projectId: string, opts?: { status?: string; jobType?: string; limit?: number; cursor?: string }) {
    const params = new URLSearchParams();
    if (opts?.status) params.set("status", opts.status);
    if (opts?.jobType) params.set("jobType", opts.jobType);
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.cursor) params.set("cursor", opts.cursor);
    const qs = params.toString();
    return this.request<GenerationListResponse>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/generations${qs ? `?${qs}` : ""}`);
  }
  getGeneration(orgId: string, projectId: string, generationId: string) {
    return this.request<GenerationDetail>(`/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/generations/${encodeURIComponent(generationId)}`);
  }}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ── Types ─────────────────────────────────────────

export interface MeResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  organizations: { id: string; slug: string; name: string; role: string }[];
}

export interface OrgSummary {
  id: string;
  slug: string;
  name: string;
  role?: string;
  projectCount?: number;
  memberCount?: number;
}

export interface OrgDetail extends OrgSummary {
  billingInfo: unknown;
  plan: { key: string; name: string } | null;
  createdAt: string;
}

export interface OrgMember {
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  joinedAt: string;
}

export interface ProjectSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  generationCount?: number;
  assetCount?: number;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends ProjectSummary {
  settings: Record<string, unknown>;
  deploymentCount: number;
  members: ProjectMember[];
}

export interface ProjectMember {
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
}

// ── Phase 2 Types ─────────────────────────────────────

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
  costInputPer1M: number;
  costOutputPer1M: number;
  description?: string;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  createdBy: { id: string; name: string | null; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVersion {
  id: string;
  version: number;
  prompt: string;
  variablesSchema: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface TemplateDetail extends TemplateSummary {
  versions: TemplateVersion[];
  latestVersion: TemplateVersion | null;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  prompt: string;
  variablesSchema?: Record<string, unknown>;
}

export interface GenerateRequest {
  model: string;
  templateId?: string;
  templateVersionId?: string;
  prompt?: string;
  variables?: Record<string, string>;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  jobType?: string;
}

export interface GenerateCandidate {
  id: string;
  type: string;
  text: string | null;
  downloadUrl: string;
  metadata: {
    model: string;
    provider: string;
    latencyMs: number;
  };
}

export interface GenerateResponse {
  generationId: string;
  status: string;
  jobType: string;
  candidates: GenerateCandidate[];
  usage: { tokensIn: number; tokensOut: number; costUsd: number };
}

export interface Artifact {
  id: string;
  type: string;
  fileName: string | null;
  sizeBytes: string | null;
  metadata: Record<string, unknown> | null;
  downloadUrl: string;
  generationId: string;
  version: number;
  createdAt: string;
}

export interface ArtifactListResponse {
  items: Artifact[];
  nextCursor: string | null;
}

export interface GenerationSummary {
  id: string;
  jobType: string;
  status: string;
  artifactCount: number;
  error: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface GenerationDetail extends GenerationSummary {
  input: Record<string, unknown> | null;
  options: Record<string, unknown> | null;
  templateVersion: {
    id: string;
    version: number;
    prompt: string;
    template: { id: string; name: string };
  } | null;
  artifacts: Artifact[];
}

export interface GenerationListResponse {
  items: GenerationSummary[];
  nextCursor: string | null;
}

export const api = new ApiClient();
export default api;
