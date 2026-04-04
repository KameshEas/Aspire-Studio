"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveOrg } from "../../../../../../lib/org-context";
import {
  useTemplate,
  useCreateTemplateVersion,
  useGenerate,
  useModels,
} from "../../../../../../lib/hooks";
import type { GenerateCandidate } from "../../../../../../lib/api";
import Card from "../../../../../../components/Card";
import Button from "../../../../../../components/Button";
import Skeleton from "../../../../../../components/Skeleton";

// Extract {{variable}} slots from a prompt string
function extractVariables(prompt: string): string[] {
  const matches = prompt.match(/\{\{(\w+)\}\}/g) ?? [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

export default function TemplatePage() {
  const params = useParams<{ projectId: string; templateId: string }>();
  const router = useRouter();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const { projectId, templateId } = params;

  const { data: template, isLoading } = useTemplate(orgId, projectId, templateId);
  const { data: modelsData } = useModels();
  const createVersion = useCreateTemplateVersion(orgId, projectId, templateId);
  const generate = useGenerate(orgId, projectId);

  // Editor state
  const [editingPrompt, setEditingPrompt] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);

  // Generate state
  const [selectedModel, setSelectedModel] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [result, setResult] = useState<{ candidates: GenerateCandidate[]; usage: { tokensIn: number; tokensOut: number; costUsd: number } } | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Seed editor when template loads (only once per version id change)
  const latestVersionId = template?.latestVersion?.id;
  const latestVersionPrompt = template?.latestVersion?.prompt ?? "";
  const seededVersionRef = React.useRef<string | null>(null);
  if (latestVersionId && seededVersionRef.current !== latestVersionId && !isDirty) {
    seededVersionRef.current = latestVersionId;
    // will be applied in layout effect
  }
  React.useLayoutEffect(() => {
    if (latestVersionId && seededVersionRef.current !== latestVersionId && !isDirty) {
      seededVersionRef.current = latestVersionId;
      setEditingPrompt(latestVersionPrompt);
      setActiveVersionId(latestVersionId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-run when version id changes
  }, [latestVersionId]);

  // Seed default model
  const seededModelRef = React.useRef(false);
  React.useLayoutEffect(() => {
    if (modelsData && !seededModelRef.current) {
      const textModel = modelsData.find((m) => m.capabilities?.includes("text"));
      if (textModel) { seededModelRef.current = true; setSelectedModel(textModel.id); }
    }
  }, [modelsData]);

  // Derive variables from current prompt
  const slots = extractVariables(editingPrompt);

  function handleSaveVersion(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPrompt.trim()) return;
    createVersion.mutate(
      { prompt: editingPrompt.trim() },
      {
        onSuccess: (v) => {
          setIsDirty(false);
          setActiveVersionId(v.id);
        },
      }
    );
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerateError(null);
    setResult(null);
    generate.mutate(
      {
        model: selectedModel,
        templateId,
        templateVersionId: activeVersionId ?? undefined,
        variables,
        systemPrompt: systemPrompt.trim() || undefined,
        temperature,
        maxTokens,
      },
      {
        onSuccess: (res) => setResult(res),
        onError: (err: Error) => setGenerateError(err.message),
      }
    );
  }

  if (isLoading || !template) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Skeleton height={28} width={240} />
        <Skeleton height={200} />
      </div>
    );
  }

  const textModels = modelsData?.filter((m) => m.capabilities?.includes("text")) ?? [];
  const imageModels = modelsData?.filter((m) => m.capabilities?.includes("image")) ?? [];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.push(`/projects/${projectId}/templates`)}
          style={{ background: "none", border: "none", color: "var(--color-muted)", cursor: "pointer", fontSize: 20, padding: 0 }}
        >
          ←
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{template.name}</h1>
          {template.description && (
            <p style={{ color: "var(--color-muted)", fontSize: 13, margin: "2px 0 0" }}>{template.description}</p>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "flex-start" }}>
        {/* Left: Prompt Editor + Generate Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Prompt Editor */}
          <Card style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Prompt Editor</h2>
              {isDirty && (
                <span style={{ fontSize: 12, color: "var(--color-warning, orange)" }}>Unsaved changes</span>
              )}
            </div>
            <textarea
              rows={10}
              value={editingPrompt}
              onChange={(e) => { setEditingPrompt(e.target.value); setIsDirty(true); }}
              placeholder={"Write your prompt here.\nUse {{variable_name}} for dynamic slots."}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 6,
                border: "1px solid var(--color-border)", background: "var(--color-surface)",
                fontSize: 14, color: "var(--color-text)", resize: "vertical",
                boxSizing: "border-box", fontFamily: "monospace",
              }}
            />
            {slots.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 6 }}>
                  Detected variables: {slots.map((s) => (
                    <code key={s} style={{ background: "var(--color-border)", borderRadius: 3, padding: "1px 5px", marginRight: 4 }}>{`{{${s}}}`}</code>
                  ))}
                </p>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              {isDirty && (
                <Button
                  variant="secondary"
                  onClick={() => { setEditingPrompt(template.latestVersion?.prompt ?? ""); setIsDirty(false); }}
                >
                  Discard
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSaveVersion}
                disabled={!isDirty || createVersion.isPending}
              >
                {createVersion.isPending ? "Saving…" : "Save as New Version"}
              </Button>
            </div>
          </Card>

          {/* Generate Panel */}
          <Card style={{ padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>Generate</h2>
            <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Model selector */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px", borderRadius: 6,
                    border: "1px solid var(--color-border)", background: "var(--color-surface)",
                    fontSize: 14, color: "var(--color-text)",
                  }}
                >
                  {textModels.length > 0 && <optgroup label="Text Models">{textModels.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>}
                  {imageModels.length > 0 && <optgroup label="Image Models">{imageModels.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>}
                </select>
              </div>

              {/* Variable inputs */}
              {slots.length > 0 && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Variables</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {slots.map((slot) => (
                      <div key={slot} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <code style={{ fontSize: 12, minWidth: 120, color: "var(--color-muted)" }}>{`{{${slot}}}`}</code>
                        <input
                          value={variables[slot] ?? ""}
                          onChange={(e) => setVariables((v: Record<string, string>) => ({ ...v, [slot]: e.target.value }))}
                          placeholder={slot}
                          style={{
                            flex: 1, padding: "6px 10px", borderRadius: 6,
                            border: "1px solid var(--color-border)", background: "var(--color-surface)",
                            fontSize: 13, color: "var(--color-text)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System prompt */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>System Prompt (optional)</label>
                <textarea
                  rows={2}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are a helpful assistant…"
                  style={{
                    width: "100%", padding: "8px 12px", borderRadius: 6,
                    border: "1px solid var(--color-border)", background: "var(--color-surface)",
                    fontSize: 13, color: "var(--color-text)", resize: "none", boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Params row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>Temperature: {temperature}</label>
                  <input
                    type="range" min={0} max={2} step={0.05}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>Max Tokens</label>
                  <input
                    type="number" min={64} max={8192} step={64}
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    style={{
                      width: "100%", padding: "6px 10px", borderRadius: 6,
                      border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      fontSize: 13, color: "var(--color-text)", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <Button variant="primary" type="submit" disabled={generate.isPending || !selectedModel}>
                {generate.isPending ? "Generating…" : "Run Generation"}
              </Button>
            </form>

            {/* Error */}
            {generateError && (
              <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: "var(--color-error-bg, #fef2f2)", color: "var(--color-error, #dc2626)", fontSize: 13 }}>
                {generateError}
              </div>
            )}

            {/* Result */}
            {result && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 10 }}>
                  Tokens: {result.usage.tokensIn} in / {result.usage.tokensOut} out · ${result.usage.costUsd.toFixed(6)} cost
                </div>
                {(result.candidates as GenerateCandidate[]).map((c: GenerateCandidate, i: number) => (
                  <div key={c.id} style={{ marginTop: i > 0 ? 12 : 0 }}>
                    <ResultCard candidate={c} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Version History */}
        <Card style={{ padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>Versions ({template.versions.length})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...template.versions].reverse().map((v) => (
              <div
                key={v.id}
                onClick={() => { setEditingPrompt(v.prompt); setActiveVersionId(v.id); setIsDirty(false); }}
                style={{
                  padding: "10px 12px", borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${activeVersionId === v.id ? "var(--color-primary-600)" : "var(--color-border)"}`,
                  background: activeVersionId === v.id ? "var(--color-primary-50, rgba(99,102,241,0.05))" : "transparent",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>v{v.version}</div>
                <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
                  {new Date(v.createdAt).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v.prompt.slice(0, 60)}{v.prompt.length > 60 ? "…" : ""}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ResultCard({ candidate }: { candidate: GenerateCandidate }) {
  const isImage = candidate.type === "image";
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--color-muted)" }}>
          {candidate.type} · {candidate.metadata.model} · {candidate.metadata.latencyMs}ms
        </span>
        {candidate.downloadUrl && (
          <a
            href={`${backendBase}${candidate.downloadUrl}`}
            download
            style={{ fontSize: 12, color: "var(--color-primary-600)", textDecoration: "none" }}
          >
            Download
          </a>
        )}
      </div>
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${backendBase}${candidate.downloadUrl}`}
          alt="Generated image"
          style={{ maxWidth: "100%", borderRadius: 6 }}
        />
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          {candidate.text}
        </pre>
      )}
    </Card>
  );
}
