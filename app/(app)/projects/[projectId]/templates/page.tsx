"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Archive, FileText, Pencil, Play, Plus, Search } from "lucide-react";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useCreateTemplate, useDeleteTemplate, useTemplates } from "../../../../../lib/hooks";
import { useToast } from "../../../../../lib/hooks/useToast";
import { extractVariables, timeAgo } from "../../../../../lib/variables";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  EmptyState,
  ErrorState,
  Input,
  SkeletonGrid,
  Textarea,
  useDialog,
} from "../../../../../components/system";

const MIN_PROMPT_LENGTH = 10;

export default function TemplatesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const { success, error: showError } = useToast();

  const { data, isLoading, error, refetch } = useTemplates(orgId, projectId);
  const createTemplate = useCreateTemplate(orgId, projectId);
  const deleteTemplate = useDeleteTemplate(orgId, projectId);
  const dialog = useDialog();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", description: "", prompt: "", systemPrompt: "" });

  const templates = (data?.templates ?? []).filter((t) =>
    `${t.name} ${t.description ?? ""} ${t.tags.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase())
  );
  const detected = extractVariables(form.prompt);
  const formValid = form.name.trim().length > 0 && form.prompt.trim().length >= MIN_PROMPT_LENGTH;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    try {
      await createTemplate.mutateAsync({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        prompt: form.prompt,
        systemPrompt: form.systemPrompt.trim() || undefined,
      });
      success({ title: "Template created", description: `"${form.name.trim()}" is ready to use in the Studio.` });
      setForm({ name: "", description: "", prompt: "", systemPrompt: "" });
      dialog.close();
    } catch (err) {
      showError({ title: "Could not create template", description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const handleArchive = async (id: string, name: string) => {
    if (!window.confirm(`Archive "${name}"? It will no longer appear in the Studio.`)) return;
    try {
      await deleteTemplate.mutateAsync(id);
      success({ title: "Template archived" });
    } catch (err) {
      showError({ title: "Could not archive template", description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--text)]">Templates</h1>
          <p className="mt-1 text-[color:var(--text-secondary)]">Reusable prompts with fill-in-the-blank variables.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={dialog.open}>
          New template
        </Button>
      </div>

      <Input
        aria-label="Search templates"
        placeholder="Search templates…"
        icon={<Search size={16} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <SkeletonGrid count={6} columns={3} />
      ) : error ? (
        <ErrorState
          fullHeight={false}
          title="Could not load templates"
          message={error instanceof Error ? error.message : "Unknown error"}
          action={{ label: "Try again", onClick: () => refetch() }}
        />
      ) : templates.length === 0 ? (
        <EmptyState
          fullHeight={false}
          icon={<FileText size={40} className="text-[color:var(--text-muted)]" />}
          title={search ? "No templates match your search" : "No templates yet"}
          description={
            search
              ? "Try a different search term."
              : "Create a template once, then generate on-brand content from a simple form."
          }
          example={search ? undefined : "Write a {{tone}} product description for {{product}}."}
          action={search ? undefined : { label: "Create your first template", onClick: dialog.open }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => {
            const variables = Object.keys(template.currentVersion?.variablesSchema ?? {});
            return (
              <Card key={template.id} variant="elevated" padding="lg" className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="truncate">{template.name}</CardTitle>
                    {template.currentVersion && <Badge size="sm" variant="primary">v{template.currentVersion.version}</Badge>}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {template.description || template.currentVersion?.prompt || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {variables.slice(0, 5).map((name) => (
                      <Badge key={name} size="sm" variant="default">
                        {`{{${name}}}`}
                      </Badge>
                    ))}
                    {variables.length > 5 && <Badge size="sm" variant="default">+{variables.length - 5}</Badge>}
                    {variables.length === 0 && <span className="text-xs text-[color:var(--text-muted)]">No variables</span>}
                  </div>
                  <div className="text-xs text-[color:var(--text-muted)]">
                    {template.generationCount} generation{template.generationCount === 1 ? "" : "s"} · updated {timeAgo(template.updatedAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${projectId}/studio?templateId=${template.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--primary-600)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[color:var(--primary-700)]"
                    >
                      <Play size={14} /> Use
                    </Link>
                    <Link
                      href={`/projects/${projectId}/templates/${template.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-sm font-medium text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]"
                    >
                      <Pencil size={14} /> Edit
                    </Link>
                    <button
                      type="button"
                      aria-label={`Archive ${template.name}`}
                      onClick={() => handleArchive(template.id, template.name)}
                      className="ml-auto rounded-lg p-2 text-[color:var(--text-muted)] hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--danger)]"
                    >
                      <Archive size={16} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialog.isOpen} onOpenChange={(open) => (open ? dialog.open() : dialog.close())}>
        <DialogContent title="New template" description="Use {{variable}} placeholders to create fields you can fill in later." size="lg">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={255} autoFocus />
            <Input label="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea
              label="Prompt"
              rows={6}
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              placeholder="Write a {{tone}} product description for {{product}}."
              helperText={`At least ${MIN_PROMPT_LENGTH} characters.`}
            />
            {detected.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
                Variables detected:
                {detected.map((name) => (
                  <Badge key={name} size="sm" variant="primary">
                    {name}
                  </Badge>
                ))}
              </div>
            )}
            <Textarea
              label="System prompt (optional)"
              rows={2}
              value={form.systemPrompt}
              onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={dialog.close}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formValid} loading={createTemplate.isPending}>
                Create template
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
