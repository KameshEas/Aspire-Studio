"use client";

import React from "react";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";
import "./shell.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <AppHeader />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
