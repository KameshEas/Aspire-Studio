"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AlertTriangle, FileText, PenLine, Sparkles } from "lucide-react";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useGenerate, useModels, useTemplates } from "../../../../../lib/hooks";
import { ApiError, type GenerateResponse, type VariablesSchema } from "../../../../../lib/api";
import {
  defaultValues,
  estimateCostUsd,
  estimateTokens,
  formatUsd,
  renderPrompt,
  syncSchemaWithPrompt,
  validateValues,
} from "../../../../../lib/variables";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, LoadingState, Textarea } from "../../../../../components/system";
import { VariableForm } from "../../../../../components/features/VariableForm";
import { ResultPanel } from "../../../../../components/features/ResultPanel";

type Source = "prompt" | "template";

const fieldLabel = "mb-1.5 block text-sm font-semibold text-[color:var(--text)]";

function StudioContent() {
  const { projectId } = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";

  const { data: models, isLoading: modelsLoading } = useModels();
  const { data: templateData, isLoading: templatesLoading } = useTemplates(orgId, projectId);
  const generate = useGenerate(orgId, projectId);

  const [source, setSource] = useState<Source>(searchParams.get("templateId") ? "template" : "prompt");
  const [modelId, setModelId] = useState("");
  const [templateId, setTemplateId] = useState(searchParams.get("templateId") ?? "");
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const templates = templateData?.templates ?? [];
  const template = templates.find((t) => t.id === templateId);
  const version = template?.currentVersion ?? null;

  useEffect(() => {
    if (!modelId && models?.length) setModelId(models[0].id);
  }, [models, modelId]);

  const sourcePrompt = source === "template" ? version?.prompt ?? "" : prompt;
  const schema: VariablesSchema = useMemo(
    () => (source === "template" ? version?.variablesSchema ?? {} : syncSchemaWithPrompt(prompt)),
    [source, version, prompt]
  );

  // Reset form values when the set of variables changes (switching template or editing placeholders)
  const schemaKey = Object.keys(schema).join("|");
  useEffect(() => {
    setValues((current) => {
      const defaults = defaultValues(schema);
      return Object.fromEntries(Object.keys(schema).map((name) => [name, current[name] ?? defaults[name]]));
    });
    setShowErrors(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaKey, templateId, source]);

  const errors = validateValues(schema, values);
  const model = models?.find((m) => m.id === modelId);
  const rendered = renderPrompt(sourcePrompt, values);
  const tokensIn = estimateTokens(rendered) + estimateTokens(systemPrompt);
  const maxCost = model ? estimateCostUsd(tokensIn, maxTokens, model.costInputPer1M, model.costOutputPer1M) : 0;
  const canGenerate = !!modelId && sourcePrompt.trim().length > 0 && !(source === "template" && !version);

  const handleGenerate = async () => {
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }
    setError(null);
    setResult(null);
    try {
      const response = await generate.mutateAsync({
        model: modelId,
        ...(source === "template" && version
          ? { templateId, templateVersionId: version.id }
          : { prompt }),
        variables: values,
        systemPrompt: systemPrompt.trim() || undefined,
        maxTokens,
        temperature,
      });
      setResult(response);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError(`Usage limit reached. ${err.message}`);
      } else {
        setError(err instanceof Error ? err.message : "Generation failed");
      }
    }
  };

  if (modelsLoading || templatesLoading) return <LoadingState message="Loading studio…" />;

  if (!models?.length) {
    return (
      <EmptyState
        fullHeight={false}
        icon={<AlertTriangle size={40} className="text-[color:var(--warning)]" />}
        title="No AI models are configured"
        description="Set GROQ_API_KEY on the backend, restart it, and reload this page."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[color:var(--text)]">Generation Studio</h1>
        <p className="mt-1 text-[color:var(--text-secondary)]">Write a prompt or run a template, then review the result.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelId(m.id)}
                  aria-pressed={modelId === m.id}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${
                    modelId === m.id
                      ? "border-[color:var(--primary-600)] bg-[color:var(--primary-50)] dark:bg-[color:var(--primary-950)]"
                      : "border-[color:var(--border)] hover:border-[color:var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[color:var(--text)]">{m.name}</span>
                    <Badge size="sm" variant={m.capabilities.includes("image") ? "info" : "default"}>
                      {m.capabilities.includes("image") ? "image" : "text"}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-[color:var(--text-muted)]">
                    {m.provider}
                    {m.capabilities.includes("text") && ` · $${m.costInputPer1M}/$${m.costOutputPer1M} per 1M tokens`}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className={fieldLabel} htmlFor="temperature">
                  Creativity <span className="font-normal text-[color:var(--text-muted)]">({temperature.toFixed(1)})</span>
                </label>
                <input
                  id="temperature"
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-[color:var(--primary-600)]"
                />
              </div>
              <div>
                <label className={fieldLabel} htmlFor="max-tokens">
                  Max output tokens
                </label>
                <input
                  id="max-tokens"
                  type="number"
                  min={64}
                  max={8192}
                  step={64}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Math.min(8192, Math.max(64, Number(e.target.value) || 64)))}
                  className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-input)] px-3 py-2 text-sm text-[color:var(--text)]"
                />
              </div>
              <Textarea
                label="System prompt (optional)"
                rows={3}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a concise marketing copywriter."
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card padding="lg">
            <CardContent className="space-y-5">
              <div className="inline-flex rounded-lg border border-[color:var(--border)] p-1" role="tablist" aria-label="Prompt source">
                {(
                  [
                    ["prompt", "Write a prompt", PenLine],
                    ["template", "Use a template", FileText],
                  ] as const
                ).map(([value, label, Icon]) => (
                  <button
                    key={value}
                    role="tab"
                    aria-selected={source === value}
                    type="button"
                    onClick={() => setSource(value)}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      source === value
                        ? "bg-[color:var(--primary-600)] text-white"
                        : "text-[color:var(--text-secondary)] hover:text-[color:var(--text)]"
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              {source === "template" ? (
                templates.length === 0 ? (
                  <EmptyState
                    fullHeight={false}
                    icon={<FileText size={36} className="text-[color:var(--text-muted)]" />}
                    title="No templates yet"
                    description="Templates turn a prompt with {{variables}} into a reusable form."
                    action={{ label: "Create a template", onClick: () => (window.location.href = `/projects/${projectId}/templates`) }}
                  />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className={fieldLabel} htmlFor="template">
                        Template
                      </label>
                      <select
                        id="template"
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-input)] px-3 py-2 text-sm text-[color:var(--text)]"
                      >
                        <option value="">Choose a template…</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                            {t.currentVersion ? ` (v${t.currentVersion.version})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    {template && !version && (
                      <p className="text-sm text-[color:var(--danger)]">This template has no active version.</p>
                    )}
                    {version && (
                      <>
                        {template?.description && (
                          <p className="text-sm text-[color:var(--text-secondary)]">{template.description}</p>
                        )}
                        <VariableForm
                          schema={schema}
                          values={values}
                          errors={showErrors ? errors : {}}
                          onChange={(name, value) => setValues((c) => ({ ...c, [name]: value }))}
                        />
                      </>
                    )}
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <Textarea
                    label="Prompt"
                    rows={8}
                    maxLength={8000}
                    showCharCount
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={"Write a {{tone}} product description for {{product}}."}
                    helperText="Wrap placeholders in {{double braces}} and fill them in below."
                  />
                  {Object.keys(schema).length > 0 && (
                    <VariableForm
                      schema={schema}
                      values={values}
                      errors={showErrors ? errors : {}}
                      onChange={(name, value) => setValues((c) => ({ ...c, [name]: value }))}
                    />
                  )}
                </div>
              )}

              {canGenerate && Object.keys(schema).length > 0 && (
                <div>
                  <div className={fieldLabel}>Final prompt</div>
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-[color:var(--surface-2)] p-3 text-sm text-[color:var(--text-secondary)]">
                    {rendered}
                  </pre>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  loading={generate.isPending}
                  icon={<Sparkles size={16} />}
                >
                  {generate.isPending ? "Generating…" : "Generate"}
                </Button>
                {canGenerate && model && model.capabilities.includes("text") && (
                  <span className="text-xs text-[color:var(--text-muted)]">
                    ~{tokensIn} input tokens · up to {formatUsd(maxCost)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-[color:var(--danger)] bg-[color:var(--danger-light)] p-4 text-sm text-[color:var(--danger-dark)]"
            >
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">Generation failed</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {result && <ResultPanel result={result} artifactsHref={`/projects/${projectId}/artifacts`} />}
          {result && (
            <p className="text-xs text-[color:var(--text-muted)]">
              Saved to <Link className="underline" href={`/projects/${projectId}/generations`}>History</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading studio…" />}>
      <StudioContent />
    </Suspense>
  );
}
