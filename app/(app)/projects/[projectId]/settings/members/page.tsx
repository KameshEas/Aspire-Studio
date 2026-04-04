"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../../lib/org-context";
import { useProjectMembers, useAddProjectMember } from "../../../../../../lib/hooks";
import Card from "../../../../../../components/Card";
import Button from "../../../../../../components/Button";

export default function MembersPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const { data: members, isLoading } = useProjectMembers(orgId, projectId);
  const addMember = useAddProjectMember(orgId, projectId);

  const [emailOrId, setEmailOrId] = useState("");
  const [role, setRole] = useState("developer");

  const onInvite = async () => {
    try {
      await addMember.mutateAsync({ userId: emailOrId, role });
      setEmailOrId("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Project Members</h1>

      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={emailOrId} onChange={(e) => setEmailOrId(e.currentTarget.value)} placeholder="User email or id" style={{ flex: 1, padding: 8 }} />
          <select value={role} onChange={(e) => setRole(e.currentTarget.value)} style={{ padding: 8 }}>
            <option value="viewer">Viewer</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={onInvite} variant="primary">Invite</Button>
        </div>
      </Card>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Members</h2>
      {isLoading ? (
        <div>Loading…</div>
      ) : !members?.length ? (
        <Card style={{ padding: 16 }}>No members yet.</Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.map((m) => (
            <Card key={m.userId} style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.name ?? m.email}</div>
                <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{m.email}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{m.role}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
