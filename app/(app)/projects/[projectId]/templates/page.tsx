"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useTemplates, useCreateTemplate, useDeleteTemplate } from "../../../../../lib/hooks";
import type { CreateTemplateInput } from "../../../../../lib/api";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";
import Skeleton from "../../../../../components/Skeleton";
import Modal from "../../../../../components/Modal";

export default function TemplatesPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const { data: templates, isLoading } = useTemplates(orgId, projectId);
  const createTemplate = useCreateTemplate(orgId, projectId);
  const deleteTemplate = useDeleteTemplate(orgId, projectId);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateTemplateInput>({ name: "", prompt: "", description: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.prompt.trim()) return;
    createTemplate.mutate(
      { name: form.name.trim(), description: form.description?.trim() || undefined, prompt: form.prompt.trim() },
      {
        onSuccess: (t) => {
          setShowCreate(false);
          setForm({ name: "", prompt: "", description: "" });
          router.push(`/projects/${projectId}/templates/${t.id}`);
        },
      }
    );
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteTemplate.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Prompt Templates</h1>
          <p style={{ color: "var(--color-muted)", fontSize: 14, margin: "4px 0 0" }}>
            Reusable prompts with variable slots for consistent generation.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>+ New Template</Button>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => <Card key={i} style={{ padding: 20 }}><Skeleton height={40} /></Card>)}
        </div>
      ) : !templates?.length ? (
        <Card style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "var(--color-muted)", marginBottom: 16 }}>No templates yet. Create your first prompt template.</p>
          <Button variant="primary" onClick={() => setShowCreate(true)}>Create Template</Button>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {templates.map((t) => (
            <Card
              key={t.id}
              style={{ padding: "16px 20px", cursor: "pointer" }}
              onClick={() => router.push(`/projects/${projectId}/templates/${t.id}`)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                  {t.description && (
                    <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 2 }}>{t.description}</div>
                  )}
                  <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 6, display: "flex", gap: 12 }}>
                    <span>{t.versionCount} version{t.versionCount !== 1 ? "s" : ""}</span>
                    <span>Updated {new Date(t.updatedAt).toLocaleDateString()}</span>
                    {t.createdBy && <span>by {t.createdBy.name ?? t.createdBy.email}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/projects/${projectId}/templates/${t.id}`)}
                  >
                    Generate
                  </Button>
                  <Button variant="danger" onClick={() => setDeleteId(t.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Prompt Template">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Product Description"
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 6,
                border: "1px solid var(--color-border)", background: "var(--color-surface)",
                fontSize: 14, color: "var(--color-text)", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>Description</label>
            <input
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 6,
                border: "1px solid var(--color-border)", background: "var(--color-surface)",
                fontSize: 14, color: "var(--color-text)", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>
              Prompt * <span style={{ fontWeight: 400, color: "var(--color-muted)" }}>(use {"{{variable}}"} for slots)</span>
            </label>
            <textarea
              required
              rows={6}
              value={form.prompt}
              onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
              placeholder={"Write a product description for {{product_name}} targeting {{audience}}."}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 6,
                border: "1px solid var(--color-border)", background: "var(--color-surface)",
                fontSize: 14, color: "var(--color-text)", resize: "vertical", boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => setShowCreate(false)} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={createTemplate.isPending}>
              {createTemplate.isPending ? "Creating…" : "Create Template"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Template">
        <p style={{ marginBottom: 24, color: "var(--color-muted)" }}>
          This will permanently delete the template and all its versions.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteTemplate.isPending}>
            {deleteTemplate.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
