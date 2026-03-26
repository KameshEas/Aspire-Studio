"use client";

import React from "react";
import ThemeToggle from "../ThemeToggle";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__left">
        {/* Breadcrumb/page title can be injected via context later */}
      </div>
      <div className="app-header__right">
        <ThemeToggle />
      </div>
    </header>
  );
}
