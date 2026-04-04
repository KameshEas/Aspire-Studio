"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../../lib/org-context";
import { useProjectApiKeys, useCreateProjectApiKey, useRevokeProjectApiKey } from "../../../../../../lib/hooks";
import Card from "../../../../../../components/Card";
import Button from "../../../../../../components/Button";

export default function ApiKeysPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const { data: keys, isLoading } = useProjectApiKeys(orgId, projectId);
  const createKey = useCreateProjectApiKey(orgId, projectId);
  const revokeKey = useRevokeProjectApiKey(orgId, projectId);

  const [description, setDescription] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const onCreate = async () => {
    try {
      const res = await createKey.mutateAsync({ description, scopes: ["project:read"] });
      setCreatedKey(res.key);
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>API Keys</h1>

      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={description} onChange={(e) => setDescription(e.currentTarget.value)} placeholder="Key description" style={{ flex: 1, padding: 8 }} />
          <Button variant="primary" onClick={onCreate} disabled={!description || createKey.isLoading}>Create Key</Button>
        </div>
        {createdKey && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Copy this key now — it will not be shown again.</div>
            <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 8, borderRadius: 6, marginTop: 6 }}>{createdKey}</pre>
          </div>
        )}
      </Card>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Existing Keys</h2>
      {isLoading ? (
        <div>Loading…</div>
      ) : !keys?.length ? (
        <Card style={{ padding: 16 }}>No keys yet.</Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {keys.map((k) => (
            <Card key={k.id} style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{k.description ?? "(no description)"}</div>
                <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Scopes: {k.scopes.join(", ")}</div>
              </div>
              <div>
                <Button variant="danger" onClick={() => revokeKey.mutate(k.id)}>Revoke</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
