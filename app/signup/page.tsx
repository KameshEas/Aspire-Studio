"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import "../login/login.css";

export default function SignupPage() {
  return (
    <div className="login-layout">
      <aside className="login-brand" aria-hidden="true">
        <div className="login-brand__inner">
          <div className="login-brand__logo">Aspire Studio</div>
          <div className="login-brand__body">
            <h2 className="login-brand__headline">Create beautiful brands with AI</h2>
            <p className="login-brand__sub">Get started by creating your account.</p>
          </div>
        </div>
        <div className="login-brand__orb login-brand__orb--1" />
        <div className="login-brand__orb login-brand__orb--2" />
      </aside>
      <main className="login-auth">
        <p className="login-auth__mobile-logo">Aspire Studio</p>
        <SignUp
          routing="hash"
          forceRedirectUrl="/dashboard"
          signInUrl="/login"
        />
      </main>
    </div>
  );
}
