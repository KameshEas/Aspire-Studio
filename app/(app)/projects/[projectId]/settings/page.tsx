"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "../../../../../../components/Card";
import Button from "../../../../../../components/Button";

export default function SettingsIndex() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = params.projectId;

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Project Settings</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        <Card style={{ padding: 12, cursor: "pointer" }} onClick={() => router.push(`/projects/${projectId}/settings/members`)}>
          <div style={{ fontWeight: 600 }}>Members</div>
          <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Invite team members and manage roles</div>
        </Card>

        <Card style={{ padding: 12, cursor: "pointer" }} onClick={() => router.push(`/projects/${projectId}/settings/api-keys`)}>
          <div style={{ fontWeight: 600 }}>API Keys</div>
          <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Create and manage project API keys</div>
        </Card>
      </div>
    </div>
  );
}
