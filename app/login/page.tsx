"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import "./login.css";

export default function LoginPage() {
  return (
    <div className="login-layout">
      {/* Brand hero panel */}
      <aside className="login-brand" aria-hidden="true">
        <div className="login-brand__inner">
          <div className="login-brand__logo">
            <AspireLogoIcon />
            <span>Aspire Studio</span>
          </div>
          <div className="login-brand__body">
            <h2 className="login-brand__headline">
              Transform your idea into a digital empire.
            </h2>
            <p className="login-brand__sub">
              Brand identity, UI designs, landing pages, and deployable code —
              all from a single prompt.
            </p>
            <ul className="login-brand__features">
              <li><CheckIcon /> AI Brand Identity &amp; Logo</li>
              <li><CheckIcon /> UI Designs &amp; Landing Pages</li>
              <li><CheckIcon /> Website Code &amp; Content Engine</li>
            </ul>
          </div>
          {/* Ambient orbs */}
          <div className="login-brand__orb login-brand__orb--1" />
          <div className="login-brand__orb login-brand__orb--2" />
        </div>
      </aside>

      {/* Auth panel */}
      <main className="login-auth">
        <p className="login-auth__mobile-logo">Aspire Studio</p>
        <SignIn
          routing="hash"
          forceRedirectUrl="/dashboard"
          signUpUrl="/signup"
        />
      </main>
    </div>
  );
}

function AspireLogoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="white" fillOpacity="0.12" />
      <path d="M10 26L18 10L26 26" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M13 21h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.15)" />
      <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
