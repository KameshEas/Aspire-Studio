"use client";

import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <UserButton afterSignOutUrl="/login" />
      </div>
      <p>Signed in as: {user?.primaryEmailAddress?.emailAddress ?? "unknown"}</p>
    </main>
  );
}
