"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, History, Play, Save } from "lucide-react";
import { useActiveOrg } from "../../../../../../lib/org-context";
import {
  useActivateTemplateVersion,
  useCreateTemplateVersion,
  useTemplate,
  useTestTemplate,
  useUpdateTemplate,
} from "../../../../../../lib/hooks";
import { useToast } from "../../../../../../lib/hooks/useToast";
import type { TemplateVersion, VariableDefinition, VariablesSchema, VariableType } from "../../../../../../lib/api";
import {
  defaultValues,
  estimateTokens,
  renderPrompt,
  stableStringify,
  syncSchemaWithPrompt,
  timeAgo,
  validateValues,
} from "../../../../../../lib/variables";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  Input,
  LoadingState,
  Textarea,
} from "../../../../../../components/system";
import { VariableForm } from "../../../../../../components/features/VariableForm";

const VARIABLE_TYPES: VariableType[] = ["text", "textarea", "number", "select", "checkbox", "date"];

const smallInput =
  "rounded-md border border-[color:var(--border)] bg-[color:var(--surface-input)] px-2 py-1.5 text-sm text-[color:var(--text)]";

export default function TemplateEditorPage() {
  const { projectId, templateId } = useParams<{ projectId: string; templateId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const { success, error: showError } = useToast();

  const { data: template, isLoading, error, refetch } = useTemplate(orgId, projectId, templateId);
  const updateTemplate = useUpdateTemplate(orgId, projectId, templateId);
  const createVersion = useCreateTemplateVersion(orgId, projectId, templateId);
  const activateVersion = useActivateTemplateVersion(orgId, projectId, templateId);
  const testTemplate = useTestTemplate(orgId, projectId, templateId);

  const activeVersion = template?.versions.find((v) => v.isActive) ?? template?.versions[0];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [schemaOverrides, setSchemaOverrides] = useState<VariablesSchema>({});
  const [loadedVersionId, setLoadedVersionId] = useState<string | null>(null);
  const [testValues, setTestValues] = useState<Record<string, string>>({});

  const loadVersion = (version: TemplateVersion) => {
    setPrompt(version.prompt);
    setSystemPrompt(version.systemPrompt ?? "");
    setSchemaOverrides(version.variablesSchema ?? {});
    setLoadedVersionId(version.id);
  };

  useEffect(() => {
    if (!template) return;
    setName(template.name);
    setDescription(template.description ?? "");
    if (activeVersion && loadedVersionId === null) loadVersion(activeVersion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const schema = useMemo(() => syncSchemaWithPrompt(prompt, schemaOverrides), [prompt, schemaOverrides]);
  const schemaKey = JSON.stringify(schema);

  useEffect(() => {
    setTestValues((current) => {
      const defaults = defaultValues(schema);
      return Object.fromEntries(Object.keys(schema).map((n) => [n, current[n] ?? defaults[n]]));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaKey]);

  const updateVariable = (variable: string, patch: Partial<VariableDefinition>) =>
    setSchemaOverrides({ ...schema, [variable]: { ...schema[variable], ...patch } });

  const dirty =
    !!activeVersion &&
    (prompt !== activeVersion.prompt ||
      systemPrompt !== (activeVersion.systemPrompt ?? "") ||
      stableStringify(schema) !== stableStringify(activeVersion.variablesSchema ?? {}));
  const metaDirty = !!template && (name !== template.name || description !== (template.description ?? ""));

  const saveMeta = async () => {
    try {
      await updateTemplate.mutateAsync({ name: name.trim(), description });
      success({ title: "Details saved" });
    } catch (err) {
      showError({ title: "Could not save details", description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const saveVersion = async () => {
    try {
      const version = await createVersion.mutateAsync({
        prompt,
        systemPrompt: systemPrompt.trim() || undefined,
        variablesSchema: schema,
      });
      setLoadedVersionId(version.id);
      success({ title: `Saved as version ${version.version}`, description: "It is now the active version." });
    } catch (err) {
      showError({ title: "Could not save version", description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const activate = async (version: TemplateVersion) => {
    try {
      await activateVersion.mutateAsync(version.id);
      loadVersion(version);
      success({ title: `Version ${version.version} is now active` });
    } catch (err) {
      showError({ title: "Could not activate version", description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const testErrors = validateValues(schema, testValues);

  if (isLoading) return <LoadingState message="Loading template…" />;
  if (error || !template) {
    return (
      <ErrorState
        fullHeight={false}
        title="Could not load template"
        message={error instanceof Error ? error.message : "Template not found"}
        action={{ label: "Try again", onClick: () => refetch() }}
        secondaryAction={{ label: "Back to templates", onClick: () => (window.location.href = `/projects/${projectId}/templates`) }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/projects/${projectId}/templates`}
          className="inline-flex items-center gap-1 text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text)]"
        >
          <ArrowLeft size={14} /> Templates
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="grid min-w-[280px] flex-1 gap-3 md:grid-cols-2">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!metaDirty || !name.trim()} loading={updateTemplate.isPending} onClick={saveMeta}>
              Save details
            </Button>
            <Link
              href={`/projects/${projectId}/studio?templateId=${templateId}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--primary-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--primary-700)]"
            >
              <Play size={14} /> Use in Studio
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                aria-label="Prompt"
                rows={9}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                helperText="Placeholders like {{topic}} become fields automatically."
              />
              <Textarea label="System prompt (optional)" rows={2} value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[color:var(--text-muted)]">
                  {dirty ? "Unsaved changes — saving creates a new version." : "Matches the active version."}
                </span>
                <Button
                  icon={<Save size={16} />}
                  disabled={!dirty || prompt.trim().length < 10}
                  loading={createVersion.isPending}
                  onClick={saveVersion}
                >
                  Save as new version
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Variables</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(schema).length === 0 ? (
                <p className="text-sm text-[color:var(--text-muted)]">No variables yet. Add {"{{name}}"} to the prompt.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(schema).map(([variable, def]) => (
                    <div
                      key={variable}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-[color:var(--border)] p-3"
                    >
                      <code className="min-w-[110px] text-sm font-semibold text-[color:var(--primary-600)]">{variable}</code>
                      <select
                        aria-label={`${variable} type`}
                        className={smallInput}
                        value={def.type}
                        onChange={(e) => updateVariable(variable, { type: e.target.value as VariableType })}
                      >
                        {VARIABLE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        aria-label={`${variable} label`}
                        className={`${smallInput} min-w-[140px] flex-1`}
                        placeholder="Label (optional)"
                        value={def.label ?? ""}
                        onChange={(e) => updateVariable(variable, { label: e.target.value || undefined })}
                      />
                      {def.type === "select" && (
                        <input
                          aria-label={`${variable} options`}
                          className={`${smallInput} min-w-[160px] flex-1`}
                          placeholder="Options, comma separated"
                          value={(def.options ?? []).join(", ")}
                          onChange={(e) =>
                            updateVariable(variable, {
                              options: e.target.value.split(",").map((o) => o.trim()).filter(Boolean),
                            })
                          }
                        />
                      )}
                      <label className="flex items-center gap-1.5 text-sm text-[color:var(--text-secondary)]">
                        <input
                          type="checkbox"
                          checked={!!def.required}
                          onChange={(e) => updateVariable(variable, { required: e.target.checked })}
                          className="accent-[color:var(--primary-600)]"
                        />
                        Required
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VariableForm
                schema={schema}
                values={testValues}
                errors={testErrors}
                onChange={(n, v) => setTestValues((c) => ({ ...c, [n]: v }))}
              />
              <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-[color:var(--surface-2)] p-3 text-sm text-[color:var(--text)]">
                {renderPrompt(prompt, testValues)}
              </pre>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--text-muted)]">
                ~{estimateTokens(renderPrompt(prompt, testValues))} tokens
                <Button
                  size="sm"
                  variant="outline"
                  loading={testTemplate.isPending}
                  disabled={dirty}
                  tooltip={dirty ? "Save a version first to test it on the server" : undefined}
                  onClick={() => testTemplate.mutate(testValues)}
                >
                  Validate on server
                </Button>
                {testTemplate.data && (
                  <span className={testTemplate.data.validation.isValid ? "text-[color:var(--success-dark)]" : "text-[color:var(--danger)]"}>
                    {testTemplate.data.validation.isValid
                      ? "Valid"
                      : testTemplate.data.validation.errors.join("; ") || "Invalid"}
                  </span>
                )}
                {testTemplate.error && (
                  <span className="text-[color:var(--danger)]">
                    {testTemplate.error instanceof Error ? testTemplate.error.message : "Validation failed"}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card padding="lg" className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History size={16} /> Versions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {template.versions.map((version) => (
              <div
                key={version.id}
                className={`rounded-lg border p-3 ${
                  version.isActive ? "border-[color:var(--primary-500)]" : "border-[color:var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[color:var(--text)]">Version {version.version}</span>
                  {version.isActive && (
                    <Badge size="sm" variant="success" icon={<CheckCircle2 size={12} />}>
                      Active
                    </Badge>
                  )}
                </div>
                <div className="mt-1 text-xs text-[color:var(--text-muted)]">
                  {timeAgo(version.createdAt)} · {version.generationCount} generation{version.generationCount === 1 ? "" : "s"}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-[color:var(--text-secondary)]">{version.prompt}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => loadVersion(version)}>
                    Load
                  </Button>
                  {!version.isActive && (
                    <Button size="sm" variant="outline" loading={activateVersion.isPending} onClick={() => activate(version)}>
                      Make active
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
