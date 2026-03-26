"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateOrg } from "../../../lib/hooks";
import { useActiveOrg } from "../../../lib/org-context";
import Button from "../../../components/Button";
import Card from "../../../components/Card";

export default function OnboardingPage() {
  const router = useRouter();
  const createOrg = useCreateOrg();
  const { setActiveOrgId } = useActiveOrg();
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");

  const handleCreateOrg = async () => {
    if (!orgName || !orgSlug) return;
    const org = await createOrg.mutateAsync({ name: orgName, slug: orgSlug });
    setActiveOrgId(org.id);
    setStep(2);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--color-bg)" }}>
      <Card style={{ maxWidth: 480, width: "100%", padding: 32 }}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Welcome to Aspire Studio
            </h2>
            <p style={{ color: "var(--color-muted)", fontSize: 14, marginBottom: 24 }}>
              Create your workspace to get started.
            </p>
            <label>
              <span className="label">Organization name</span>
              <input
                className="input"
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }}
                placeholder="Acme Studios"
              />
            </label>
            <label style={{ marginTop: 12, display: "block" }}>
              <span className="label">Workspace URL</span>
              <input
                className="input"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                placeholder="acme-studios"
              />
              <span className="help">aspire.studio/{orgSlug || "…"}</span>
            </label>
            <div style={{ marginTop: 24 }}>
              <Button
                onClick={handleCreateOrg}
                loading={createOrg.isPending}
                disabled={!orgName || !orgSlug}
                style={{ width: "100%" }}
              >
                Create Workspace
              </Button>
            </div>
            {createOrg.isError && (
              <p className="error" style={{ marginTop: 8 }}>
                {createOrg.error?.message ?? "Something went wrong"}
              </p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>&#10003;</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                You&apos;re all set!
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: 14, marginBottom: 24 }}>
                Your workspace <strong>{orgName}</strong> is ready.
              </p>
              <Button onClick={() => router.push("/dashboard")} style={{ width: "100%" }}>
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
