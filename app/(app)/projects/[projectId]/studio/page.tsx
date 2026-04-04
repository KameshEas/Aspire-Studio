"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useModels, useGenerate, useGenerateAsync } from "../../../../../lib/hooks";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Textarea from "../../../../../components/Textarea";

export default function StudioPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const router = useRouter();

  const projectId = params.projectId;
  const orgId = activeOrgId ?? "";

  const { data: models } = useModels();
  const generate = useGenerate(orgId, projectId);
  const generateAsync = useGenerateAsync(orgId, projectId);

  const [model, setModel] = useState<string>(models?.[0]?.id ?? "");
  const [prompt, setPrompt] = useState("");

  React.useEffect(() => {
    if (!model && models?.length) setModel(models[0].id);
  }, [models, model]);

  const onGenerate = async () => {
    try {
      const res = await generate.mutateAsync({ model, prompt });
      // Navigate to generations list or detail when available
      router.push(`/projects/${projectId}/generations`);
    } catch (err) {
      console.error(err);
    }
  };

  const onQueue = async () => {
    try {
      await generateAsync.mutateAsync({ model, prompt });
      router.push(`/projects/${projectId}/generations`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Generate Studio</h1>
        <p style={{ color: "var(--color-muted)", marginTop: 6 }}>Create generations using models and templates.</p>
      </div>

      <Card style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: 8 }}>
            {models?.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Prompt</label>
          <Textarea value={prompt} onChange={(e) => setPrompt(e.currentTarget.value)} style={{ marginTop: 8 }} rows={8} />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Button variant="primary" onClick={onGenerate} disabled={!prompt || !model}>
            Generate (sync)
          </Button>
          <Button variant="secondary" onClick={onQueue} disabled={!prompt || !model}>
            Queue (async)
          </Button>
        </div>
      </Card>
    </div>
  );
}
