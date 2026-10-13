function projectPath(orgId: string, projectId: string): string {
  return `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}`;
}

/** Local models on CPU can take minutes, especially on first load. */
export const GENERATE_TIMEOUT_MS = 180_000;
const DEFAULT_TIMEOUT_MS = 30_000;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3002";

class ApiClient {
  private token: string | null = null;
  private orgId: string | null = null;
  private tokenGetter?: () => Promise<string | null>;

  setToken(token: string | null) {
    this.token = token;
  }

  setOrgId(orgId: string | null) {
    this.orgId = orgId;
  }

  setTokenGetter(getter: () => Promise<string | null>) {
    this.tokenGetter = getter;
  }

  private async request<T>(path: string, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string>),
    };

    let tokenToUse: string | null = this.token;
    if (this.tokenGetter) {
      try {
        const t = await this.tokenGetter();
        if (t) tokenToUse = t;
      } catch (e) {
        // ignore getter errors and fall back to stored token
      }
    }

    if (tokenToUse) {
      headers["Authorization"] = `Bearer ${tokenToUse}`;
    }
    if (this.orgId) {
      headers["X-Org-Id"] = this.orgId;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers,
        signal: init?.signal ?? controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new ApiError(408, `Request timed out after ${Math.round(timeoutMs / 1000)}s`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));

      if (res.status === 401) {
        this.token = null;
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      throw new ApiError(res.status, body.error ?? "Request failed", body.details);
    }

    if (res.status === 204) return null as T;
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
  listTemplates(orgId: string, projectId: string, opts?: { archived?: boolean; tags?: string[]; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (opts?.archived) params.set("archived", "true");
    if (opts?.tags?.length) params.set("tags", opts.tags.join(","));
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.offset) params.set("offset", String(opts.offset));
    const qs = params.toString();
    return this.request<TemplateListResponse>(`${projectPath(orgId, projectId)}/templates${qs ? `?${qs}` : ""}`);
  }
  createTemplate(orgId: string, projectId: string, data: CreateTemplateInput) {
    return this.request<TemplateDetail>(`${projectPath(orgId, projectId)}/templates`, { method: "POST", body: JSON.stringify(data) });
  }
  getTemplate(orgId: string, projectId: string, templateId: string) {
    return this.request<TemplateDetail>(`${projectPath(orgId, projectId)}/templates/${encodeURIComponent(templateId)}`);
  }
  updateTemplate(orgId: string, projectId: string, templateId: string, data: { name?: string; description?: string; tags?: string[] }) {
    return this.request<TemplateSummary>(`${projectPath(orgId, projectId)}/templates/${encodeURIComponent(templateId)}`, { method: "PATCH", body: JSON.stringify(data) });
  }
  deleteTemplate(orgId: string, projectId: string, templateId: string) {
    return this.request<null>(`${projectPath(orgId, projectId)}/templates/${encodeURIComponent(templateId)}`, { method: "DELETE" });
  }
  createTemplateVersion(orgId: string, projectId: string, templateId: string, data: CreateVersionInput) {
    return this.request<TemplateVersion>(`${projectPath(orgId, projectId)}/templates/${encodeURIComponent(templateId)}/versions`, { method: "POST", body: JSON.stringify(data) });
  }
  activateTemplateVersion(orgId: string, projectId: string, templateId: string, versionId: string) {
    return this.request<TemplateVersion>(`${projectPath(orgId, projectId)}/templates/${encodeURIComponent(templateId)}/versions/${encodeURIComponent(versionId)}/activate`, { method: "POST" });
  }
  testTemplate(orgId: string, projectId: string, templateId: string, variables: Record<string, unknown>) {
    return this.request<TemplateTestResult>(`${projectPath(orgId, projectId)}/templates/${encodeURIComponent(templateId)}/test`, { method: "POST", body: JSON.stringify({ variables }) });
  }

  // ── Generate ───────────────────────────────────────
  generate(orgId: string, projectId: string, data: GenerateRequest) {
    return this.request<GenerateResponse>(`${projectPath(orgId, projectId)}/generate`, { method: "POST", body: JSON.stringify(data) }, GENERATE_TIMEOUT_MS);
  }

  // ── Artifacts ──────────────────────────────────────
  listArtifacts(orgId: string, projectId: string, opts?: { type?: string; status?: ArtifactStatus; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (opts?.type) params.set("type", opts.type);
    if (opts?.status) params.set("status", opts.status);
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.offset) params.set("offset", String(opts.offset));
    const qs = params.toString();
    return this.request<ArtifactListResponse>(`${projectPath(orgId, projectId)}/artifacts${qs ? `?${qs}` : ""}`);
  }
  getArtifact(orgId: string, projectId: string, artifactId: string) {
    return this.request<Artifact>(`${projectPath(orgId, projectId)}/artifacts/${encodeURIComponent(artifactId)}`);
  }
  updateArtifact(orgId: string, projectId: string, artifactId: string, data: { status?: ArtifactStatus; rating?: number; tags?: string[] }) {
    return this.request<Pick<Artifact, "id" | "status" | "rating" | "tags" | "updatedAt">>(
      `${projectPath(orgId, projectId)}/artifacts/${encodeURIComponent(artifactId)}`,
      { method: "PATCH", body: JSON.stringify(data) }
    );
  }
  /** Archives the artifact (soft delete). */
  deleteArtifact(orgId: string, projectId: string, artifactId: string) {
    return this.request<null>(`${projectPath(orgId, projectId)}/artifacts/${encodeURIComponent(artifactId)}`, { method: "DELETE" });
  }

  // ── API Keys (project) ─────────────────────────────────
  listProjectApiKeys(orgId: string, projectId: string) {
    return this.request<{ id: string; description?: string; scopes: string[]; createdAt: string; revoked: boolean }[]>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/api-keys`
    );
  }

  createProjectApiKey(orgId: string, projectId: string, data: { description?: string; scopes?: string[] }) {
    return this.request<{ id: string; key: string; description?: string; scopes: string[] }>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/api-keys`,
      { method: "POST", body: JSON.stringify(data) }
    );
  }

  revokeProjectApiKey(orgId: string, projectId: string, keyId: string) {
    return this.request<{ revoked: boolean }>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/api-keys/${encodeURIComponent(keyId)}`,
      { method: "DELETE" }
    );
  }

  // ── Generations History ────────────────────────────
  listGenerations(orgId: string, projectId: string, opts?: { status?: string; jobType?: string; limit?: number; cursor?: string }) {
    const params = new URLSearchParams();
    if (opts?.status) params.set("status", opts.status);
    if (opts?.jobType) params.set("jobType", opts.jobType);
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.cursor) params.set("cursor", opts.cursor);
    const qs = params.toString();
    return this.request<GenerationListResponse>(`${projectPath(orgId, projectId)}/generations${qs ? `?${qs}` : ""}`);
  }
  getGeneration(orgId: string, projectId: string, generationId: string) {
    return this.request<GenerationDetail>(`${projectPath(orgId, projectId)}/generations/${encodeURIComponent(generationId)}`);
  }

  // ── Workflows (Agent Orchestration) ────────────────
  listWorkflows(opts?: { executionId?: string; status?: string }) {
    const params = new URLSearchParams();
    if (opts?.executionId) params.set("executionId", opts.executionId);
    if (opts?.status) params.set("status", opts.status);
    const qs = params.toString();
    return this.request<WorkflowListResponse>(`/api/v1/workflows${qs ? `?${qs}` : ""}`);
  }
  getWorkflowStatus(executionId: string) {
    return this.request<WorkflowExecution>(`/api/v1/workflows?executionId=${encodeURIComponent(executionId)}`);
  }
  executeWorkflow(data: WorkflowExecutionRequest) {
    return this.request<WorkflowExecutionResponse>("/api/v1/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  getAvailableAgents() {
    return this.request<AvailableAgentsResponse>("/api/v1/workflows/agents");
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
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


export type ModelCapability = "text" | "image" | "embeddings";

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: ModelCapability[];
  contextWindow: number;
  costInputPer1M: number;
  costOutputPer1M: number;
  costPerImage?: number;
  description?: string;
}

export type VariableType = "text" | "textarea" | "number" | "select" | "checkbox" | "date";

export interface VariableDefinition {
  type: VariableType;
  label?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  options?: string[];
  default?: unknown;
}

export type VariablesSchema = Record<string, VariableDefinition>;

export interface TemplateVersion {
  id: string;
  version: number;
  prompt: string;
  systemPrompt: string | null;
  variablesSchema: VariablesSchema | null;
  testData: Record<string, unknown> | null;
  isActive: boolean;
  generationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  currentVersion: TemplateVersion | null;
  generationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListResponse {
  templates: TemplateSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface TemplateDetail {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  isArchived: boolean;
  currentVersionId: string | null;
  versions: TemplateVersion[];
  generationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  tags?: string[];
  prompt: string;
  systemPrompt?: string;
  variablesSchema?: VariablesSchema;
}

export interface CreateVersionInput {
  prompt: string;
  systemPrompt?: string;
  variablesSchema?: VariablesSchema;
  testData?: Record<string, unknown>;
}

export interface TemplateTestResult {
  interpolatedPrompt: string;
  systemPrompt: string | null;
  tokenEstimate: number;
  validation: { isValid: boolean; errors: string[] };
  warnings: { type: string; variable: string; message: string }[];
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

export type ArtifactStatus = "draft" | "approved" | "archived";

export interface Artifact {
  id: string;
  type: string;
  fileName: string | null;
  sizeBytes?: string | null;
  status: ArtifactStatus;
  rating: number | null;
  tags: string[];
  metadata?: Record<string, unknown> | null;
  generation?: { id: string; jobType: string; createdAt: string } | null;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtifactListResponse {
  artifacts: Artifact[];
  total: number;
  limit: number;
  offset: number;
}

export interface GenerationSummary {
  id: string;
  jobType: string;
  status: string;
  model: string | null;
  provider: string | null;
  promptPreview: string | null;
  template: { id: string; name: string; version: number } | null;
  tokensIn: number | null;
  tokensOut: number | null;
  costCents: number | null;
  artifactCount: number;
  error: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface GenerationArtifact {
  id: string;
  type: string;
  fileName: string | null;
  sizeBytes: string | null;
  metadata: Record<string, unknown> | null;
  downloadUrl: string;
  version: number;
  createdAt: string;
}

export interface GenerationDetail {
  id: string;
  jobType: string;
  status: string;
  input: { prompt?: string; variables?: Record<string, unknown> } | null;
  options: { model?: string; maxTokens?: number; temperature?: number } | null;
  error: string | null;
  templateVersion: {
    id: string;
    version: number;
    prompt: string;
    template: { id: string; name: string };
  } | null;
  artifacts: GenerationArtifact[];
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface GenerationListResponse {
  items: GenerationSummary[];
  nextCursor: string | null;
}

// ── Workflow Types (Agent Orchestration) ─────────────

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "completed" | "failed";
  input: WorkflowExecutionRequest;
  result?: {
    success: boolean;
    taskType: string;
    results?: Record<string, unknown>;
    aggregatedCost?: {
      agentName: string;
      totalTokensUsed: number;
      totalInvocations: number;
      averageTokensPerInvocation: number;
      estimatedCostUSD?: number;
    };
    executionOrder?: string[];
    error?: string;
  };
  error?: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
}

export interface WorkflowExecutionRequest {
  taskType: "brand" | "ui" | "content" | "code" | "seo" | "deployment" | "multi-step";
  agentInputs: Record<string, unknown>;
  dependencies?: ("brand" | "ui" | "content" | "code" | "seo" | "deployment")[];
}

export interface WorkflowExecutionResponse {
  executionId: string;
  status: "pending";
  message: string;
}

export interface WorkflowListResponse {
  executions?: WorkflowExecution[];
  total?: number;
}

export interface AvailableAgentsResponse {
  agents: string[];
  count?: number;
  description?: string;
}

export const api = new ApiClient();
export default api;
