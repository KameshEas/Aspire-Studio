const BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3002";

class ApiClient {
  private token: string | null = null;
  private orgId: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  setOrgId(orgId: string | null) {
    this.orgId = orgId;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
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
}

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

export const api = new ApiClient();
export default api;
