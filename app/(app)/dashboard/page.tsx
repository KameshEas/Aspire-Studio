"use client";

import React from "react";
import Link from "next/link";
import { useProjects, useCreateProject } from "../../../lib/hooks";
import { useOrgs } from "../../../lib/hooks";
import { useActiveOrg } from "../../../lib/org-context";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Skeleton from "../../../components/Skeleton";
import Modal from "../../../components/Modal";

export default function DashboardPage() {
  const { activeOrgId } = useActiveOrg();
  const { data: orgs, isLoading: orgsLoading } = useOrgs();
  const { data: projects, isLoading } = useProjects(activeOrgId ?? "");
  const createProject = useCreateProject(activeOrgId ?? "");
  const [showNew, setShowNew] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newSlug, setNewSlug] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");

  if (!activeOrgId) {
    if (orgsLoading) return <DashboardSkeleton />;
    return <NoOrgState />;
  }

  const activeOrg = orgs?.find((o) => o.id === activeOrgId);

  const handleCreate = async () => {
    if (!newName || !newSlug) return;
    await createProject.mutateAsync({ name: newName, slug: newSlug, description: newDesc || undefined });
    setShowNew(false);
    setNewName("");
    setNewSlug("");
    setNewDesc("");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            {activeOrg?.name ?? "Dashboard"}
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: 14, margin: "4px 0 0" }}>
            {projects?.length ?? 0} project{projects?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>+ New Project</Button>
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} style={{ padding: 20 }}>
              <Skeleton height={20} width="60%" />
              <div style={{ marginTop: 8 }}><Skeleton height={14} /></div>
              <div style={{ marginTop: 12 }}><Skeleton height={14} width="40%" /></div>
            </Card>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card
                style={{
                  padding: 20,
                  cursor: "pointer",
                  transition: "border-color var(--motion-durationShort)",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{p.name}</h3>
                {p.description && (
                  <p style={{ color: "var(--color-muted)", fontSize: 13, margin: "6px 0 0", lineHeight: 1.4 }}>
                    {p.description}
                  </p>
                )}
                <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 12, color: "var(--color-muted)" }}>
                  <span>{p.generationCount ?? 0} generations</span>
                  <span>{p.assetCount ?? 0} assets</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState onNew={() => setShowNew(true)} />
      )}

      {/* New Project Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="New Project">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 340 }}>
          <label>
            <span className="label">Name</span>
            <input
              className="input"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
              }}
              placeholder="My Project"
            />
          </label>
          <label>
            <span className="label">Slug</span>
            <input className="input" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="my-project" />
          </label>
          <label>
            <span className="label">Description (optional)</span>
            <textarea
              className="input"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              placeholder="What is this project about?"
            />
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setShowNew(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={createProject.isPending} disabled={!newName || !newSlug}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <Skeleton height={28} width={200} />
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <Card key={i} style={{ padding: 20 }}>
            <Skeleton height={20} width="60%" />
            <div style={{ marginTop: 8 }}><Skeleton height={14} /></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NoOrgState() {
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Welcome to Aspire Studio</h2>
      <p style={{ color: "var(--color-muted)", marginTop: 8 }}>
        Create or join an organization to get started.
      </p>
      <div style={{ marginTop: 20 }}>
        <Link href="/onboarding">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div style={{ textAlign: "center", marginTop: 60, color: "var(--color-muted)" }}>
      <p style={{ fontSize: 16 }}>No projects yet</p>
      <p style={{ fontSize: 13, marginTop: 4 }}>Create your first project to start generating.</p>
      <div style={{ marginTop: 16 }}>
        <Button onClick={onNew}>+ New Project</Button>
      </div>
    </div>
  );
}
